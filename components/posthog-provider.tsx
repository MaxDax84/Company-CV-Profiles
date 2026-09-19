"use client";

import { useEffect } from "react";
import { useConsent } from "@/components/consent-provider";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { initAnalyticsClient, setAnalyticsConsent, identifyUser } from "@/lib/analytics-client";

// Mounted once in app/layout.tsx, mirrors components/google-analytics.tsx's
// consent gating: PostHog is not initialized at all until the visitor has
// accepted the "statistics" cookie category, so a visitor who never accepts
// (or hasn't answered the banner yet) generates zero requests to the
// PostHog host — no SDK init, no remote-config fetch, no events. See
// lib/analytics-client.ts for why the init() call itself has to wait and
// not just capture(). trackClient.* calls made before that point are
// dropped by design, not queued.
//
// Once initialized, withdrawing consent from the "Cookie preferences" panel
// opts the SDK back out and reverts to in-memory persistence (dropping
// what's stored); re-granting opts back in without re-initializing.
export default function PostHogProvider() {
  const { consent } = useConsent();
  const statisticsGranted = consent.statistics;

  useEffect(() => {
    if (statisticsGranted) {
      initAnalyticsClient();
      setAnalyticsConsent(true);
    } else {
      // No-op while never initialized; a real opt-out only after a grant.
      setAnalyticsConsent(false);
    }
  }, [statisticsGranted]);

  // Identifies the current session's logged-in user, if any — safe to call
  // on every mount/navigation: posthog-js only actually sends an $identify
  // event when the id or its properties genuinely change, so this doesn't
  // spam an event per page. Covers every login path (password, Google OAuth,
  // email-confirm) from one place instead of wiring identify() into each.
  useEffect(() => {
    if (!statisticsGranted) return;
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) return;
      identifyUser(user.id, { signup_date: user.created_at, plan: "pay-as-you-go" });
    });
  }, [statisticsGranted]);

  return null;
}
