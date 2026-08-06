import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

// Owner deletes their own claimed (primary) profile — the accounts-era
// replacement for the old anonymous manage-token delete.
export async function DELETE() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("user_id", user.id)
      .eq("kind", "primary");

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
