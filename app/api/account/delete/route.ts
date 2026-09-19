import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { forgetRememberedProfiles } from "@/lib/cv-score-memory";

export const runtime = "nodejs";

// Permanently deletes the caller's own Supabase Auth user. All of their
// `profiles` and `account_credits` rows cascade-delete automatically (see
// the `on delete cascade` foreign keys in supabase/migrations/0001_init.sql).
// Deleting an auth user requires the Admin API, which only works with the
// service-role key.
//
// The one thing that does NOT live in Postgres and so can't cascade is the
// KV copy of each uploaded CV's extraction (lib/cv-score-memory.ts, keyed by
// the PDF's content hash). Those hashes are read off the user's saved CVs
// here, BEFORE the cascade wipes the rows, and purged explicitly. Best
// effort by design: a KV hiccup must not leave someone unable to delete
// their account, and the entries carry a 30-day TTL as the backstop anyway.
// Known limitation: only hashes recorded on `profiles.pdf_hash` can be
// found this way — CVs saved before that column existed (null hash) and the
// hashes of PDFs we exported for the user (remembered at export time in
// app/api/pdf/[slug]/route.tsx, never linked to a DB row) are left to the
// TTL.
export async function DELETE() {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const service = createServiceSupabaseClient();

    try {
      const { data: rows } = await service
        .from("profiles")
        .select("pdf_hash")
        .eq("user_id", user.id)
        .not("pdf_hash", "is", null);
      await forgetRememberedProfiles((rows ?? []).map((r) => r.pdf_hash as string));
    } catch (err) {
      console.error("[account/delete] KV purge of remembered CV extractions failed", err);
    }

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
