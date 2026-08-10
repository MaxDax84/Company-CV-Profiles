import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

// Permanently deletes the caller's own Supabase Auth user. All of their
// `profiles` and `account_credits` rows cascade-delete automatically (see
// the `on delete cascade` foreign keys in supabase/migrations/0001_init.sql)
// — nothing else needs cleaning up here. Deleting an auth user requires the
// Admin API, which only works with the service-role key.
export async function DELETE() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const service = createServiceSupabaseClient();
    const { error } = await service.auth.admin.deleteUser(user.id);
    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[account/delete]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
