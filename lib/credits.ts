import type { SupabaseClient } from "@supabase/supabase-js";

// Centralized so a pricing tweak is a one-line change, not a hunt through routes.
export const CREDIT_COSTS = {
  pdfDownload: 1,
  tailor: 1,
} as const;

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits.");
    this.name = "InsufficientCreditsError";
  }
}

// Calls the spend_credits RPC (see supabase/migrations/0001_init.sql) — the
// only way a balance ever decreases. Throws InsufficientCreditsError on a
// 0-credit account instead of returning a sentinel, so callers can't
// accidentally ignore the failure.
export async function spendCredits(
  supabase: SupabaseClient,
  amount: number
): Promise<number> {
  const { data, error } = await supabase.rpc("spend_credits", { p_amount: amount });
  if (error) {
    if (error.message.includes("insufficient_credits")) {
      throw new InsufficientCreditsError();
    }
    throw error;
  }
  return data as number;
}

export async function getCreditBalance(supabase: SupabaseClient, userId: string): Promise<number> {
  const { data, error } = await supabase
    .from("account_credits")
    .select("credits")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data.credits as number;
}
