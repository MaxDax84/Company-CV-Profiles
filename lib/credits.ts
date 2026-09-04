import type { SupabaseClient } from "@supabase/supabase-js";

// Client-safe: types, constants, and read-only queries only. spendCredits
// and claimWelcomeEmailSlot live in lib/credits-server.ts instead, because
// they pull in nodemailer (via lib/email.ts) — a Node-only dependency that
// broke the client bundle the moment this file, imported for its types by
// components/account-tabs.tsx (a "use client" component), tried to include
// them here too. Keep it that way: nothing in this file should import
// lib/email.ts or lib/supabase/service.ts.

// Centralized so a pricing tweak is a one-line change, not a hunt through routes.
export const CREDIT_COSTS = {
  pdfDownload: 1,
  wordDownload: 1,
  coverLetter: 1,
  translate: 1,
  chat: 1,
  interviewPrep: 2,
  pdfCompact: 0.5,
} as const;

export class InsufficientCreditsError extends Error {
  constructor() {
    super("Insufficient credits.");
    this.name = "InsufficientCreditsError";
  }
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

// How long a "request 10 more credits" ask stays pending before the button
// unlocks again — long enough to discourage repeat asks while a human
// review is pending, short enough that a genuinely missed request isn't
// stuck for good. See app/api/account/request-credits/route.ts.
export const CREDITS_REQUEST_COOLDOWN_HOURS = 24;

export async function getCreditsLastRequestedAt(supabase: SupabaseClient, userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("account_credits")
    .select("credits_last_requested_at")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return (data.credits_last_requested_at as string | null) ?? null;
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
