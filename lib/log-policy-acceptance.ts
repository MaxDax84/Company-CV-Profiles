import { createServiceSupabaseClient, isSupabaseConfigured } from "./supabase/service";
import { anonymizeIp } from "./log-consent";

// Server-side, insert-only proof that a policy-acceptance checkbox was
// ticked before a data-sharing action — see
// supabase/migrations/0033_policy_acceptance_log.sql. Called only from
// app/api/policy-acceptance-log/route.ts (never directly from the browser,
// since writing needs the service-role client).

export type PolicyAcceptanceContext = "signup" | "cv_upload" | "tailor_resume" | "contact_form" | "support_form";

// Bumped alongside the September 2026 GDPR audit pass on /privacy and
// /terms — update this whenever either page's substance changes, same
// idea as lib/consent.ts's COOKIE_POLICY_VERSION.
export const POLICY_VERSION = "2026-09";

// What every account-creation path declares, whichever way the account is
// created (password form, Google from the signup page, Google from the
// login page via the /auth/confirm-policies interstitial): the two policy
// documents plus the explicit "I am at least 14" declaration Terms §2
// requires (Art. 2-quinquies, D.Lgs. 196/2003 — the minimum age for a minor
// to consent to online data processing alone in Italy).
export const SIGNUP_POLICIES = ["privacy", "terms", "age_14_plus"] as const;

export interface PolicyAcceptanceEntry {
  context: PolicyAcceptanceContext;
  policies: string[];
  policyVersion: string;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

// Fire-and-forget by design, same as logConsent: a logging failure must
// never block the actual action (CV upload, signup, etc.) the checkbox
// was gating.
export function logPolicyAcceptance(entry: PolicyAcceptanceEntry): void {
  if (!isSupabaseConfigured()) return;
  const supabase = createServiceSupabaseClient();
  supabase
    .from("policy_acceptance_log")
    .insert({
      user_id: entry.userId ?? null,
      context: entry.context,
      policies: entry.policies,
      policy_version: entry.policyVersion,
      ip_address: anonymizeIp(entry.ipAddress),
      user_agent: entry.userAgent ?? null,
    })
    .then(({ error }) => {
      if (error) console.error("[policy-acceptance-log] failed to persist:", error);
    });
}
