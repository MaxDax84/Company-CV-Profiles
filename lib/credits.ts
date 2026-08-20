import type { SupabaseClient } from "@supabase/supabase-js";

// Centralized so a pricing tweak is a one-line change, not a hunt through routes.
export const CREDIT_COSTS = {
  pdfDownload: 1,
  wordDownload: 1,
  tailor: 1,
  coverLetter: 1,
  translate: 1,
} as const;

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits.");
    this.name = "InsufficientCreditsError";
  }
}

// Calls the spend_credits RPC (see supabase/migrations/0001_init.sql +
// 0002_credit_ledger.sql) — the only way a balance ever decreases. Throws
// InsufficientCreditsError on a 0-credit account instead of returning a
// sentinel, so callers can't accidentally ignore the failure. `reason` is
// just a ledger label (e.g. "pdf_download", "tailor") — it doesn't affect
// the spend logic itself.
export async function spendCredits(
  supabase: SupabaseClient,
  amount: number,
  reason: string = "usage",
  detail?: string
): Promise<number> {
  const { data, error } = await supabase.rpc("spend_credits", { p_amount: amount, p_reason: reason, p_detail: detail ?? null });
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

// The account's permanent 7-digit code (see supabase/migrations/0004_profile_code.sql)
// — one per account, assigned at signup, shared by every CV the user
// claims. It's the real lookup key in a claimed profile's public URL
// (/<code>/<slug>), so a rename of the slug never breaks an already-shared
// link.
export async function getAccountCode(supabase: SupabaseClient, userId: string): Promise<string> {
  const { data, error } = await supabase
    .from("account_credits")
    .select("code")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data.code as string;
}

export interface CreditLedgerEntry {
  id: string;
  amount: number;
  reason: string;
  detail: string | null;
  created_at: string;
}

// Tolerant of the 0002_credit_ledger.sql migration not having been run yet
// (e.g. right after this feature ships, before the user applies it) — the
// account dashboard's history section just renders empty rather than
// crashing the whole page over a missing table.
export async function getCreditLedger(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 20
): Promise<CreditLedgerEntry[]> {
  try {
    const { data, error } = await supabase
      .from("credit_ledger")
      .select("id, amount, reason, detail, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []) as CreditLedgerEntry[];
  } catch (err) {
    console.error("[getCreditLedger]", err);
    return [];
  }
}
