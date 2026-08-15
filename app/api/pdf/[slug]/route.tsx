import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { hasPaidDownload, recordPaidDownload } from "@/lib/paid-downloads";
import { computeCvScore } from "@/lib/cv-score";
import { hashPdf, rememberScore } from "@/lib/cv-score-memory";
import { AtsResumeDocument, PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";

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
    await recordPaidDownload(supabase, user.id, row.id, template);
  }

  const buffer = await renderToBuffer(<AtsResumeDocument profile={row.data} template={template} />);

  // Remember this exact exported file's score by its content hash — if the
  // user later re-uploads this very PDF (e.g. to tailor it or re-check the
  // score), they get the same number back instead of a fresh, and likely
  // lower under our strict rubric, AI judgment of an already-optimized CV.
  const pdfHash = await hashPdf(buffer);
  await rememberScore(pdfHash, computeCvScore(row.data));

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="JOBLI CV - ${slug}.pdf"`,
    },
  });
}
