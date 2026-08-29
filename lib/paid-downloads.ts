import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceSupabaseClient } from "./supabase/service";

// Backs the "re-download without paying again" flow (see
// supabase/migrations/0006_paid_downloads.sql) — a PDF re-render costs us
// nothing (react-pdf, no Claude call), so once a (profile, template) pair
// has been paid for once, every later request for it is free.
//
// Every query here logs its error instead of swallowing it silently — the
// migration creating this table went unapplied on the live project for a
// while without anyone noticing, because a missing table just made these
// functions degrade to "nothing is ever remembered" (hasPaidDownload always
// false, so every download kept getting charged) with no visible signal
// anywhere that something was wrong.

export async function hasPaidDownload(
  supabase: SupabaseClient,
  profileId: string,
  template: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("paid_downloads")
    .select("id")
    .eq("profile_id", profileId)
    .eq("template", template)
    .maybeSingle();
  if (error) console.error("[hasPaidDownload]", error);
  return data != null;
}

// Service-role only (see supabase/migrations/0021_lock_down_payment_writes.sql):
// the RLS insert-own policy on this table was removed because it let any
// authenticated user pre-insert a fake "already paid" row for themselves via
// the browser's own Supabase client, skipping the credit charge entirely in
// the PDF/Word download routes. This must never take a user-scoped client.
export async function recordPaidDownload(
  userId: string,
  profileId: string,
  template: string
): Promise<void> {
  const supabase = createServiceSupabaseClient();
  // onConflict ignore: a race between two near-simultaneous first downloads
  // of the same (profile, template) should never surface a duplicate-key
  // error to the user — the unique index already guarantees only one row.
  const { error } = await supabase
    .from("paid_downloads")
    .upsert(
      { user_id: userId, profile_id: profileId, template },
      { onConflict: "profile_id,template", ignoreDuplicates: true }
    );
  if (error) console.error("[recordPaidDownload]", error);
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
  const { data, error } = await supabase
    .from("paid_downloads")
    .select("id, profile_id, template, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error("[getPaidDownloads]", error);
  return (data ?? []) as PaidDownloadEntry[];
}
