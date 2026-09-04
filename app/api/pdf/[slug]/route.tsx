import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { PDFDocument } from "pdf-lib";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { spendCredits, refundCredits } from "@/lib/credits-server";
import { hasPaidDownload, recordPaidDownload } from "@/lib/paid-downloads";
import { hashPdf, rememberProfile } from "@/lib/cv-score-memory";
import { computeCvScore, floorScoreAgainst } from "@/lib/cv-score";
import { AtsResumeDocument, PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import { buildCvFilename } from "@/lib/download-filename";
import { getCreditBalance } from "@/lib/credits";
import { trackServer } from "@/lib/analytics-server";

// react-pdf needs Node APIs (fontkit etc.), so this stays off the edge runtime.
export const maxDuration = 15;

function parseTemplate(value: string | null): PdfTemplate {
  return PDF_TEMPLATES.some(t => t.id === value) ? (value as PdfTemplate) : "ats-core";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const template = parseTemplate(req.nextUrl.searchParams.get("template"));
    const compactRequested = req.nextUrl.searchParams.get("compact") === "1";

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    // 404 (not 403) whether the slug doesn't exist or belongs to someone
    // else — don't let the response distinguish the two.
    const row = await getOwnedProfileBySlug(supabase, user.id, slug);
    if (!row) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const templateLabel = PDF_TEMPLATES.find(t => t.id === template)?.name ?? template;
    const detail = `${row.data.personal_info.full_name} · ${templateLabel}${row.kind === "tailored" ? " · versione adattata" : ""}`;

    // Re-rendering this exact (profile, template) PDF costs nothing — no
    // Claude call, just react-pdf — so only the first download of a given
    // pair is ever billed. Later ones (e.g. from the account's Download list)
    // are a free re-render.
    const alreadyPaid = await hasPaidDownload(supabase, row.id, template);
    if (!alreadyPaid) {
      try {
        await spendCredits(supabase, CREDIT_COSTS.pdfDownload, "pdf_download", detail);
      } catch (err) {
        if (err instanceof InsufficientCreditsError) {
          return NextResponse.json(
            { error: "Not enough credits to download a PDF.", code: "INSUFFICIENT_CREDITS" },
            { status: 402 }
          );
        }
        throw err;
      }
      await recordPaidDownload(user.id, row.id, template);
    }

    // The compact add-on is billed every single time it's requested — unlike
    // the base download above, it's never cached against a prior download of
    // the same (profile, template). Best-effort: if the user can't afford it,
    // just deliver the normal file instead of failing a download they can
    // already pay for.
    let compactApplied = false;
    if (compactRequested) {
      try {
        await spendCredits(supabase, CREDIT_COSTS.pdfCompact, "pdf_compact", detail);
        compactApplied = true;
      } catch (err) {
        if (!(err instanceof InsufficientCreditsError)) throw err;
      }
    }

    // The credit (if any was spent above) must be refunded if rendering
    // itself fails — vanishingly rare (no external API, just react-pdf),
    // but the same principle as every other credit-spending route: never
    // let a failure downstream of the charge go unrefunded.
    let buffer: Buffer;
    try {
      buffer = await renderToBuffer(<AtsResumeDocument profile={row.data} template={template} compact={compactApplied} />);
    } catch (err) {
      if (!alreadyPaid) await refundCredits(user.id, CREDIT_COSTS.pdfDownload, "pdf_download_refund", "Rendering fallito");
      if (compactApplied) await refundCredits(user.id, CREDIT_COSTS.pdfCompact, "pdf_compact_refund", "Rendering fallito");
      throw err;
    }

    // Compaction tightens spacing and shrinks type size modestly (see
    // AtsResumeDocument's buildStyles) but never removes content, so a
    // genuinely content-heavy CV can still land on 2+ pages even compacted.
    // In that case, refund the add-on and fall back to the normal-density
    // file rather than charging for a compaction that didn't actually happen.
    if (compactApplied) {
      const compactDoc = await PDFDocument.load(buffer);
      if (compactDoc.getPageCount() > 1) {
        await refundCredits(user.id, CREDIT_COSTS.pdfCompact, "pdf_compact_refund", "Non è stato possibile comprimere in una pagina");
        compactApplied = false;
        buffer = await renderToBuffer(<AtsResumeDocument profile={row.data} template={template} compact={false} />);
      }
    }

    // Remember this exact exported file's profile by its content hash — if
    // the user later re-uploads this very PDF (e.g. to tailor it or re-check
    // the score), it resolves straight to this same data (same score,
    // instantly, no extraction call) instead of a fresh, possibly slightly
    // different re-reading of an already-optimized CV.
    //
    // The remembered copy's score_before is overwritten with THIS export's
    // actual current score — not left as row.data's own score_before, which
    // is the CV's original pre-optimization judgment from months ago. Without
    // this, re-uploading your own already-improved PDF would show that old,
    // lower starting score again instead of the real quality of the document
    // you're holding, which reads as a false regression.
    const currentScore = floorScoreAgainst(computeCvScore(row.data), row.data.metadata.score_before);
    const exportedProfile = { ...row.data, metadata: { ...row.data.metadata, score_before: currentScore } };
    const pdfHash = await hashPdf(buffer);
    await rememberProfile(pdfHash, exportedProfile);

    // Balance re-read fresh (rather than threading spendCredits' own return
    // value through the alreadyPaid/compact-refund branches above) so this
    // always reflects the true final state no matter which path was taken.
    await trackServer(user.id, "download_completed", {
      format: "pdf",
      template,
      credits_left: await getCreditBalance(supabase, user.id),
    });

    return new NextResponse(buffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${buildCvFilename(row.data, row.display_name)}"`,
        // Read by the client only when it itself requested compact=1, to
        // tell "compacted as asked" apart from "couldn't fit, refunded".
        "X-Compact-Applied": String(compactApplied),
      },
    });
  } catch (err) {
    console.error("[pdf/[slug]]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
