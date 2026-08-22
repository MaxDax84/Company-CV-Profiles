"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_CONSENT,
  COOKIE_POLICY_VERSION,
  readConsentCookie,
  writeConsentCookie,
  getOrCreateConsentId,
  type ConsentState,
} from "@/lib/consent";

interface ConsentContextType {
  consent: ConsentState;
  // true once a stored choice was found or the user has just made one —
  // gates the banner (don't show it while this is still unknown on first
  // paint, and don't show it again once answered).
  hasResponded: boolean;
  // Re-opens the preferences panel on demand (footer "Cookie preferences"
  // link) — GDPR requires withdrawing/changing consent to be as easy as
  // giving it, not just a one-time first-visit prompt.
  bannerOpen: boolean;
  openBanner: () => void;
  closeBanner: () => void;
  savePreferences: (next: Pick<ConsentState, "analytics" | "marketing">) => void;
  acceptAll: () => void;
  rejectAll: () => void;
}

const ConsentContext = createContext<ConsentContextType>({
  consent: DEFAULT_CONSENT,
  hasResponded: false,
  bannerOpen: false,
  openBanner: () => {},
  closeBanner: () => {},
  savePreferences: () => {},
  acceptAll: () => {},
  rejectAll: () => {},
});

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [consent, setConsent] = useState<ConsentState>(DEFAULT_CONSENT);
  const [hasResponded, setHasResponded] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(false);

  // Runs once on mount (client-only — a cookie read can't happen during
  // SSR) to decide whether this is a first-time visitor (show the banner)
  // or a returning one with a stored choice (respect it silently).
  useEffect(() => {
    const stored = readConsentCookie();
    if (stored) {
      setConsent(stored);
      setHasResponded(true);
    } else {
      setBannerOpen(true);
    }
  }, []);

  // "method" only affects the server-side proof-of-consent record (see
  // supabase/migrations/0019_cookie_consent_log.sql) — the cookie itself
  // just stores the resulting booleans, same as before.
  function persist(next: ConsentState, method: "accept_all" | "reject_all" | "custom") {
    const consentId = getOrCreateConsentId();
    setConsent(next);
    setHasResponded(true);
    writeConsentCookie(next, consentId);
    setBannerOpen(false);

    fetch("/api/consent-log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        consentId,
        analytics: next.analytics,
        marketing: next.marketing,
        method,
        policyVersion: COOKIE_POLICY_VERSION,
      }),
    }).catch(() => {
      // Non-blocking — the visitor's own cookie is already saved above;
      // losing the server-side audit copy of one visit isn't worth
      // surfacing an error for.
    });
  }

  return (
    <ConsentContext.Provider
      value={{
        consent,
        hasResponded,
        bannerOpen,
        openBanner: () => setBannerOpen(true),
        closeBanner: () => setBannerOpen(false),
        savePreferences: (next) => persist({ necessary: true, ...next }, "custom"),
        acceptAll: () => persist({ necessary: true, analytics: true, marketing: true }, "accept_all"),
        rejectAll: () => persist({ necessary: true, analytics: false, marketing: false }, "reject_all"),
      }}
    >
      {children}
    </ConsentContext.Provider>
  );
}

export function useConsent() {
  return useContext(ConsentContext);
}
