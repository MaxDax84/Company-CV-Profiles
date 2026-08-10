import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileRow } from "@/lib/profile-store";

export const runtime = "nodejs";

// Owner edits a handful of personal_info fields directly (name, title,
// location) on their primary profile — the manual counterpart to the
// AI-driven values that come from uploading/improving a CV. Everything else
// in the profile (experience, skills, etc.) still only changes via
// re-uploading or tailoring, not through this endpoint.
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const full_name = typeof body?.full_name === "string" ? body.full_name.trim() : undefined;
    const title = typeof body?.title === "string" ? body.title.trim() : undefined;
    const location = typeof body?.location === "string" ? body.location.trim() : undefined;

    if (full_name === undefined && title === undefined && location === undefined) {
      return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
    }
    if (full_name === "") {
      return NextResponse.json({ error: "Il nome non può essere vuoto." }, { status: 400 });
    }

    const row = await getOwnedProfileRow(supabase, user.id, "primary");
    if (!row) {
      return NextResponse.json({ error: "No primary profile." }, { status: 404 });
    }

    const updatedData = {
      ...row.data,
      personal_info: {
        ...row.data.personal_info,
        ...(full_name !== undefined ? { full_name } : {}),
        ...(title !== undefined ? { title } : {}),
        ...(location !== undefined ? { location: location || undefined } : {}),
      },
    };

    const { error } = await supabase
      .from("profiles")
      .update({ data: updatedData })
      .eq("id", row.id)
      .eq("user_id", user.id);
    if (error) throw error;

    return NextResponse.json({ success: true, profile: updatedData });
  } catch (err) {
    console.error("[account/update-profile]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
