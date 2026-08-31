import type { SupabaseClient } from "@supabase/supabase-js";
import { InsufficientCreditsError } from "./credits";
import { createServiceSupabaseClient } from "./supabase/service";
import { sendZeroBalanceEmail, SITE_URL } from "./email";

// Server-only half of lib/credits.ts — split out because both functions
// here pull in nodemailer (via lib/email.ts), which breaks the client
// bundle if it's ever reachable from a "use client" component. Import this
// only from API routes / server-only code, never from anything that could
// end up in components/account-tabs.tsx's module graph.

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
  const newBalance = data as number;

  // Fires once per exhaustion event — spend_credits itself throws
  // InsufficientCreditsError on every attempt after this, so the balance
  // can only transition from >0 to exactly 0 once per grant cycle. No
  // dedup tracking needed (see 0026_lifecycle_email_tracking.sql).
  if (newBalance === 0) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      await sendZeroBalanceEmail(user.email, SITE_URL);
    }
  }

  return newBalance;
}

// Atomic "claim the right to send this account's welcome email" — the
// update only succeeds (and returns a row) if welcome_email_sent_at is
// still null, so two concurrent callers (or a retried request) can't both
// win and send it twice. Needs the service-role client: account_credits has
// no update policy for `authenticated` at all (see 0001_init.sql), same
// reasoning as every other write to this table from server code.
export async function claimWelcomeEmailSlot(userId: string): Promise<boolean> {
  const service = createServiceSupabaseClient();
  const { data, error } = await service
    .from("account_credits")
    .update({ welcome_email_sent_at: new Date().toISOString() })
    .eq("user_id", userId)
    .is("welcome_email_sent_at", null)
    .select("user_id");
  if (error) throw error;
  return (data?.length ?? 0) > 0;
}
