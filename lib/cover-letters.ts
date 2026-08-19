import type { SupabaseClient } from "@supabase/supabase-js";

// Backs "pay once, re-download free" for cover letters (see
// supabase/migrations/0008_cover_letters.sql / 0011_cover_letter_language.sql)
// — unlike the PDF version of this (lib/paid-downloads.ts), this caches the
// actual generated TEXT, not just a payment record: re-rendering a PDF from
// cached text is free, but asking Claude to write (or translate) the letter
// again on every repeat request would mean paying for it again ourselves
// without charging for it. One row per (profile, language) — a translation
// is a distinct cached row, not an overwrite of the original.

export async function getRememberedCoverLetter(
  supabase: SupabaseClient,
  profileId: string,
  language: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from("cover_letters")
    .select("letter_text")
    .eq("profile_id", profileId)
    .eq("language", language)
    .maybeSingle();
  if (error) console.error("[getRememberedCoverLetter]", error);
  return (data?.letter_text as string | undefined) ?? null;
}

export async function rememberCoverLetter(
  supabase: SupabaseClient,
  userId: string,
  profileId: string,
  language: string,
  letterText: string
): Promise<void> {
  // ignoreDuplicates: a race between two near-simultaneous first requests
  // for the same (profile, language) should never surface a duplicate-key
  // error — the unique (profile_id, language) constraint already guarantees
  // only one row survives.
  const { error } = await supabase
    .from("cover_letters")
    .upsert(
      { user_id: userId, profile_id: profileId, language, letter_text: letterText },
      { onConflict: "profile_id,language", ignoreDuplicates: true }
    );
  if (error) console.error("[rememberCoverLetter]", error);
}

export interface GeneratedCoverLetterEntry {
  id: string;
  profile_id: string;
  language: string;
  created_at: string;
}

// Every cover letter a user has ever generated, newest first — shown on
// the account's dedicated "Lettere" tab alongside a free re-download link.
// A profile with both an original and a translated letter appears twice
// here, same as a CV's original vs. translated PDF both showing up in
// paid_downloads.
export async function getGeneratedCoverLetters(
  supabase: SupabaseClient,
  userId: string
): Promise<GeneratedCoverLetterEntry[]> {
  const { data, error } = await supabase
    .from("cover_letters")
    .select("id, profile_id, language, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("[getGeneratedCoverLetters]", error);
  return (data ?? []) as GeneratedCoverLetterEntry[];
}
