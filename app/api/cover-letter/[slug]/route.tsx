import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { generateCoverLetter } from "@/lib/cover-letter";
import { CoverLetterDocument } from "@/components/pdf/CoverLetterDocument";

// Calls Claude to write the letter, then renders the PDF — same headroom as
// the tailor-resume route for the model call.
export const maxDuration = 60;

export async function GET(
  req: NextRequest,
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

  const { target_company, target_role } = row.data.metadata;
  const detail = target_role || target_company
    ? `${row.data.personal_info.full_name} · ${[target_role, target_company].filter(Boolean).join(" — ")}`
    : `${row.data.personal_info.full_name} · lettera generica`;

  try {
    await spendCredits(supabase, CREDIT_COSTS.coverLetter, "cover_letter", detail);
  } catch (err) {
    if (err instanceof InsufficientCreditsError) {
      return NextResponse.json(
        { error: "Not enough credits to generate a cover letter.", code: "INSUFFICIENT_CREDITS" },
        { status: 402 }
      );
    }
    throw err;
  }

  const letterText = await generateCoverLetter(row.data);
  const buffer = await renderToBuffer(<CoverLetterDocument profile={row.data} letterText={letterText} />);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="JOBLI Lettera - ${slug}.pdf"`,
    },
  });
}
