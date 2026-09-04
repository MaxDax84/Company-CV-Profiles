import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const MAX_LENGTH = 80;

// Owner renames one of their own profile rows' display name — free text,
// deliberately NOT slugified or checked for uniqueness (display_name isn't
// part of any URL, unlike the technical slug it used to double as — see
// supabase/migrations/0035_profile_display_name.sql).
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = body?.id;
    const rawName = body?.displayName;
    if (typeof id !== "string" || typeof rawName !== "string") {
      return NextResponse.json({ error: "Missing id or displayName." }, { status: 400 });
    }

    const displayName = rawName.trim().replace(/\s+/g, " ").slice(0, MAX_LENGTH);
    if (!displayName) {
      return NextResponse.json({ error: "Il nome non può essere vuoto." }, { status: 400 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName })
      .eq("id", id)
      .eq("user_id", user.id);
    if (error) throw error;

    return NextResponse.json({ success: true, displayName });
  } catch (err) {
    console.error("[account/rename-profile]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
