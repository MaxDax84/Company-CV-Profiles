import type { SupabaseClient } from "@supabase/supabase-js";

// Backs "pay once, re-download free" for cover letters (see
// supabase/migrations/0008_cover_letters.sql) — unlike the PDF version of
// this (lib/paid-downloads.ts), this caches the actual generated TEXT, not
// just a payment record: re-rendering a PDF from cached text is free, but
// asking Claude to write the letter again on every repeat request would
// mean paying for it again ourselves without charging for it.

export async function getRememberedCoverLetter(
  supabase: SupabaseClient,
  profileId: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("cover_letters")
    .select("letter_text")
    .eq("profile_id", profileId)
    .maybeSingle();
  if (error) console.error("[getRememberedCoverLetter]", error);
  return (data?.letter_text as string | undefined) ?? null;
}

export async function rememberCoverLetter(
  supabase: SupabaseClient,
  userId: string,
  profileId: string,
  letterText: string
): Promise<void> {
  // ignoreDuplicates: a race between two near-simultaneous first requests
  // for the same profile should never surface a duplicate-key error — the
  // unique profile_id column already guarantees only one row survives.
  const { error } = await supabase
    .from("cover_letters")
    .upsert(
      { user_id: userId, profile_id: profileId, letter_text: letterText },
      { onConflict: "profile_id", ignoreDuplicates: true }
    );
  if (error) console.error("[rememberCoverLetter]", error);
}
