import type { SupabaseClient } from "@supabase/supabase-js";

// Backs the "re-download without paying again" flow (see
// supabase/migrations/0006_paid_downloads.sql) — a PDF re-render costs us
// nothing (react-pdf, no Claude call), so once a (profile, template) pair
// has been paid for once, every later request for it is free.

export async function hasPaidDownload(
  supabase: SupabaseClient,
  profileId: string,
  template: string
): Promise<boolean> {
  const { data } = await supabase
    .from("paid_downloads")
    .select("id")
    .eq("profile_id", profileId)
    .eq("template", template)
    .maybeSingle();
  return data != null;
}

export async function recordPaidDownload(
  supabase: SupabaseClient,
  userId: string,
  profileId: string,
  template: string
): Promise<void> {
  // onConflict ignore: a race between two near-simultaneous first downloads
  // of the same (profile, template) should never surface a duplicate-key
  // error to the user — the unique index already guarantees only one row.
  await supabase
    .from("paid_downloads")
    .upsert(
      { user_id: userId, profile_id: profileId, template },
      { onConflict: "profile_id,template", ignoreDuplicates: true }
    );
}

export interface PaidDownloadEntry {
  id: string;
  profile_id: string;
  template: string;
  created_at: string;
}

// Every PDF a user has ever generated, newest first — shown on the account
// dashboard's Download tab alongside a free re-download link.
export async function getPaidDownloads(
  supabase: SupabaseClient,
  userId: string
): Promise<PaidDownloadEntry[]> {
  const { data } = await supabase
    .from("paid_downloads")
    .select("id, profile_id, template, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data ?? []) as PaidDownloadEntry[];
}
