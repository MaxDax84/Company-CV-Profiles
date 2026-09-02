import type { SupabaseClient } from "@supabase/supabase-js";
import { InsufficientCreditsError } from "./credits";
import { createServiceSupabaseClient } from "./supabase/service";
import { sendZeroBalanceEmail, SITE_URL } from "./email";
import { isOptedOutOfLifecycleEmails } from "./account-settings";

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
    if (user?.email && !(await isOptedOutOfLifecycleEmails(supabase, user.id))) {
      await sendZeroBalanceEmail(user.email, SITE_URL, user.id);
    }
  }

  return newBalance;
}

// Symmetric to spendCredits, for when a charge already went through but the
// action it paid for then failed to deliver (e.g. interview-prep's Claude
// call throwing after the credit charge succeeded) — without this, a
// failed generation silently costs the user real credits for nothing.
// Calls refund_credits (0031_refund_credits_function.sql), which is
// deliberately NOT grantable to `authenticated` — only reachable through
// the service-role client, so this can never be triggered by the client
// directly. Logs and swallows its own failure rather than throwing: this
// runs from an error-handling path, and a refund that fails shouldn't mask
// or replace the original error already being returned to the caller.
export async function refundCredits(userId: string, amount: number, reason: string, detail?: string): Promise<void> {
  const service = createServiceSupabaseClient();
  const { error } = await service.rpc("refund_credits", {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_detail: detail ?? null,
  });
  if (error) console.error("[refundCredits]", error);
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
