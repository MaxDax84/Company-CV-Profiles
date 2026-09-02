import { createServiceSupabaseClient, isSupabaseConfigured } from "./supabase/service";
import { anonymizeIp } from "./log-consent";

// Server-side, insert-only proof that a policy-acceptance checkbox was
// ticked before a data-sharing action — see
// supabase/migrations/0033_policy_acceptance_log.sql. Called only from
// app/api/policy-acceptance-log/route.ts (never directly from the browser,
// since writing needs the service-role client).

export type PolicyAcceptanceContext = "signup" | "cv_upload" | "tailor_resume" | "contact_form" | "support_form";

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
