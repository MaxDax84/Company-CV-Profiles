import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Owner deletes one of their own profile rows — the primary CV, or a
// specific tailored (job-adapted) one. Body: { id: string } (the profiles
// row id) — falls back to deleting the primary row for backward
// compatibility with older clients that call this with no body at all.
export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = body?.id;

    let query = supabase.from("profiles").delete().eq("user_id", user.id);
    query = typeof id === "string" ? query.eq("id", id) : query.eq("kind", "primary");

    const { error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[account/profile delete]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
