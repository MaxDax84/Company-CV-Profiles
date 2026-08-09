import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { computeCvScore } from "@/lib/cv-score";
import { hashPdf, rememberScore } from "@/lib/cv-score-memory";
import { AtsResumeDocument } from "@/components/pdf/AtsResumeDocument";

// react-pdf needs Node APIs (fontkit etc.), so this stays off the edge runtime.
export const maxDuration = 15;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

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

  try {
    await spendCredits(supabase, CREDIT_COSTS.pdfDownload);
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { error: "Not enough credits to download a PDF.", code: "INSUFFICIENT_CREDITS" },
        { status: 402 }
      );
    }
    throw err;
  }

  const buffer = await renderToBuffer(<AtsResumeDocument profile={row.data} />);

  // Remember this exact exported file's score by its content hash — if the
  // user later re-uploads this very PDF (e.g. to tailor it or re-check the
  // score), they get the same number back instead of a fresh, and likely
  // lower under our strict rubric, AI judgment of an already-optimized CV.
  const pdfHash = await hashPdf(buffer);
  await rememberScore(pdfHash, computeCvScore(row.data));

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
    },
  });
}
