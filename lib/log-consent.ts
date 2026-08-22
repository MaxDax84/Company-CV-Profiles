import { createServiceSupabaseClient, isSupabaseConfigured } from "./supabase/service";

// Server-side, insert-only record of a cookie-consent choice — see
// supabase/migrations/0019_cookie_consent_log.sql for why this exists.
// Called only from app/api/consent-log/route.ts (never directly from the
// browser, since writing needs the service-role client).

export type ConsentMethod = "accept_all" | "reject_all" | "custom";

export interface ConsentLogEntry {
  consentId: string;
  analytics: boolean;
  marketing: boolean;
  method: ConsentMethod;
  policyVersion: string;
  userId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

// Truncates the last IPv4 octet (or the trailing /64 of an IPv6 address) so
// the stored value can't pin down an individual device, matching the same
// anonymize_ip approach already used for Google Analytics
// (components/google-analytics.tsx) — the log proves a choice was made, it
// doesn't need to prove exactly whose.
export function anonymizeIp(ip: string | null | undefined): string | null {
  if (!ip || ip === "unknown") return null;
  if (ip.includes(":")) {
    const parts = ip.split(":");
    return parts.slice(0, 4).join(":") + "::";
  }
  const parts = ip.split(".");
  if (parts.length !== 4) return null;
  return `${parts[0]}.${parts[1]}.${parts[2]}.0`;
}

// Fire-and-forget by design: a logging failure must never block the
// visitor's actual consent choice from being saved in their own cookie.
export function logConsent(entry: ConsentLogEntry): void {
  if (!isSupabaseConfigured()) return;
  const supabase = createServiceSupabaseClient();
  supabase
    .from("cookie_consent_log")
    .insert({
      consent_id: entry.consentId,
      user_id: entry.userId ?? null,
      analytics: entry.analytics,
      marketing: entry.marketing,
      method: entry.method,
      policy_version: entry.policyVersion,
      ip_address: anonymizeIp(entry.ipAddress),
      user_agent: entry.userAgent ?? null,
    })
    .then(({ error }) => {
      if (error) console.error("[consent-log] failed to persist:", error);
    });
}
