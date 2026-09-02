import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedInterviewPrepBySlug } from "@/lib/interview-prep-store";
import { InterviewPrepDocument } from "@/components/pdf/InterviewPrepDocument";
import { buildInterviewPrepFilename } from "@/lib/download-filename";

// react-pdf needs Node APIs, same as /api/pdf/[slug].
export const maxDuration = 15;

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
  // else — same reasoning as /api/pdf/[slug].
  const row = await getOwnedInterviewPrepBySlug(supabase, user.id, slug);
  if (!row) {
    return NextResponse.json({ error: "Report not found." }, { status: 404 });
  }

  // Re-rendering an already-researched report costs nothing (react-pdf, no
  // Claude call) — the 2 credits were already spent when it was generated
  // in POST /api/interview-prep, so this is always a free re-download.
  const buffer = await renderToBuffer(<InterviewPrepDocument content={row.content} />);

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${buildInterviewPrepFilename(row.company_name, row.language)}"`,
    },
  });
}
