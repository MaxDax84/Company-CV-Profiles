import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Owner takes their own primary CV's public web page offline (or back
// online) without deleting the CV itself — see
// supabase/migrations/0018_profile_visibility.sql. Only ever touches
// kind='primary' rows: tailored/translated profiles never had a public
// page to begin with (see getProfileByAccountCode).
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const id = body?.id;
    const isPublic = body?.isPublic;
    if (typeof id !== "string" || typeof isPublic !== "boolean") {
      return NextResponse.json({ error: "Missing id or isPublic." }, { status: 400 });
    }

    const { error } = await supabase
      .from("profiles")
      .update({ is_public: isPublic })
      .eq("id", id)
      .eq("user_id", user.id)
      .eq("kind", "primary");

    if (error) throw error;

    return NextResponse.json({ success: true, isPublic });
  } catch (err) {
    console.error("[account/set-profile-visibility]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
