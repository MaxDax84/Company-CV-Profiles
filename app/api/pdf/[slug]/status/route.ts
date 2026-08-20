import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";

// Lets the download buttons (PdfExportButton, WordExportButton) know which
// (template | "docx") variants of this CV have already been paid for, so
// the "this costs 1 credit" confirmation can be skipped for a genuinely
// free re-download instead of asking again every time.
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

  const row = await getOwnedProfileBySlug(supabase, user.id, slug);
  if (!row) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const { data } = await supabase
    .from("paid_downloads")
    .select("template")
    .eq("profile_id", row.id);

  return NextResponse.json({ paidTemplates: (data ?? []).map((d) => d.template as string) });
}
