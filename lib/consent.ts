// Shared types + cookie read/write for the cookie-consent system (see
// components/consent-provider.tsx). "necessary" is always true and never
// shown as a toggle — Supabase Auth session cookies and the Cloudflare
// Turnstile anti-bot token are exempt from consent under Art. 122 of the
// Italian Privacy Code / the Garante's 2021 guidelines (strictly necessary
// for a service the user actively requested), so blocking them on a
// rejected/unanswered banner would break the site rather than protect
// anyone's privacy.
export interface ConsentState {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
}

export const DEFAULT_CONSENT: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

// The consent record itself is a strictly-necessary cookie (recording a
// choice about cookies doesn't require consent to set) — not the same
// category as what it's recording. 6 months, the interval commonly
// recommended for re-prompting so consent doesn't go stale indefinitely.
export const CONSENT_COOKIE_NAME = "jobli_cookie_consent";
const CONSENT_COOKIE_MAX_AGE_DAYS = 180;

export function readConsentCookie(): ConsentState | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${CONSENT_COOKIE_NAME}=([^;]*)`));
  if (!match) return null;
  try {
    const parsed = JSON.parse(decodeURIComponent(match[1]));
    if (typeof parsed.analytics === "boolean" && typeof parsed.marketing === "boolean") {
      return { necessary: true, analytics: parsed.analytics, marketing: parsed.marketing };
    }
  } catch {
    // Malformed/tampered cookie — treat as no prior consent.
  }
  return null;
}

export function writeConsentCookie(consent: ConsentState): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify({ analytics: consent.analytics, marketing: consent.marketing }));
  const maxAge = CONSENT_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60;
  document.cookie = `${CONSENT_COOKIE_NAME}=${value}; path=/; max-age=${maxAge}; SameSite=Lax`;
}
