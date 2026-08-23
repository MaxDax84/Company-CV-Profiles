// Shared types + cookie read/write for the cookie-consent system (see
// components/consent-provider.tsx). "necessary" is always true and never
// shown as a toggle — Supabase Auth session cookies and the Cloudflare
// Turnstile anti-bot token are exempt from consent under Art. 122 of the
// Italian Privacy Code / the Garante's 2021 guidelines (strictly necessary
// for a service the user actively requested), so blocking them on a
// rejected/unanswered banner would break the site rather than protect
// anyone's privacy.
// 4 categories, matching the split Cookiebot uses (necessary / preferences /
// statistics / marketing) rather than our original 3 — "preferences" is wired
// the same way "marketing" already was: present in the banner and the policy
// page, gating nothing yet, ready for the day a functional/UX cookie (e.g. a
// server-persisted theme or language choice) actually needs consent.
export interface ConsentState {
  necessary: true;
  preferences: boolean;
  statistics: boolean;
  marketing: boolean;
}

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  preferences: false,
  statistics: false,
  marketing: false,
};

// Bump this whenever the /cookies policy text materially changes — sent
// alongside every consent-log entry (see lib/log-consent.ts) so we can
// always answer "which version of the policy did this person actually see
// when they agreed?", not just what analytics/marketing they chose.
export const COOKIE_POLICY_VERSION = "2026-08-23";

// The consent record itself is a strictly-necessary cookie (recording a
// choice about cookies doesn't require consent to set) — not the same
// category as what it's recording. 6 months, the interval commonly
// recommended for re-prompting so consent doesn't go stale indefinitely.
export const CONSENT_COOKIE_NAME = "jobli_cookie_consent";
const CONSENT_COOKIE_MAX_AGE_DAYS = 180;

export interface StoredConsent extends ConsentState {
  // Anonymous, not personally identifying — see
  // supabase/migrations/0019_cookie_consent_log.sql for why this exists and
  // what it does (and doesn't) prove.
  consentId: string;
}

export function readConsentCookie(): StoredConsent | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    if (
      typeof parsed.preferences === "boolean" &&
      typeof parsed.statistics === "boolean" &&
      typeof parsed.marketing === "boolean" &&
      typeof parsed.consentId === "string"
    ) {
      return {
        necessary: true,
        preferences: parsed.preferences,
        statistics: parsed.statistics,
        marketing: parsed.marketing,
        consentId: parsed.consentId,
      };
    }
  } catch {
    // Malformed/tampered cookie — treat as no prior consent.
  }
  return null;
}

// Reuses the existing consentId across repeated visits/re-consents so the
// server-side log (and the ID shown back to the user) stays one continuous
// trail per browser, instead of a new disconnected ID every time.
export function getOrCreateConsentId(): string {
  const existing = readConsentCookie();
  if (existing) return existing.consentId;
  return crypto.randomUUID();
}

export function writeConsentCookie(consent: ConsentState, consentId: string): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify({
    preferences: consent.preferences,
    statistics: consent.statistics,
    marketing: consent.marketing,
    consentId,
  }));
  const maxAge = CONSENT_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
