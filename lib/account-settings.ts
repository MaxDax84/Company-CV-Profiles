import type { SupabaseClient } from "@supabase/supabase-js";

// Tolerant of migration 0007 not having been run yet, same pattern as
// getCreditLedger in lib/credits.ts — the avatar just doesn't render instead
// of crashing the whole account page.
export async function getAvatarUrl(supabase: SupabaseClient, userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from("account_settings")
      .select("avatar_url")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data?.avatar_url as string | undefined) ?? null;
  } catch (err) {
    console.error("[getAvatarUrl]", err);
    return null;
  }
}

// Checked before every lifecycle email send (welcome, zero-balance,
// inactivity reminder — see lib/email.ts). Defaults to false (not opted
// out) if the row doesn't exist yet, same as the column's own DB default —
// a brand-new account that hasn't touched account_settings at all should
// still receive its welcome email.
export async function isOptedOutOfLifecycleEmails(supabase: SupabaseClient, userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from("account_settings")
      .select("lifecycle_emails_opt_out")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return (data?.lifecycle_emails_opt_out as boolean | undefined) ?? false;
  } catch (err) {
    console.error("[isOptedOutOfLifecycleEmails]", err);
    return false;
  }
}
