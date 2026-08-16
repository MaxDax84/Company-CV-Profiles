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
