import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { hasPaidDownload, recordPaidDownload } from "@/lib/paid-downloads";
import { hashPdf, rememberProfile } from "@/lib/cv-score-memory";
import { computeCvScore, floorScoreAgainst } from "@/lib/cv-score";
import { AtsResumeDocument, PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import { buildCvFilename } from "@/lib/download-filename";

// react-pdf needs Node APIs (fontkit etc.), so this stays off the edge runtime.
export const maxDuration = 15;

function parseTemplate(value: string | null): PdfTemplate {
  return PDF_TEMPLATES.some(t => t.id === value) ? (value as PdfTemplate) : "ats-core";
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const template = parseTemplate(req.nextUrl.searchParams.get("template"));

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

  const buffer = await renderToBuffer(<AtsResumeDocument profile={row.data} template={template} />);

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

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${buildCvFilename(row.data, templateLabel, row.slug)}"`,
    },
  });
}
