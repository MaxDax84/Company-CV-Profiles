"use client";

import { useEffect } from "react";
import { useConsent } from "@/components/consent-provider";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { initAnalyticsClient, setAnalyticsConsent, identifyUser } from "@/lib/analytics-client";

// Mounted once in app/layout.tsx, mirrors components/google-analytics.tsx's
// consent gating (see that file's comment for the Cookiebot-trial carve-out
// this repeats). Unlike GA, PostHog always initializes (in-memory-only
// persistence, no cookie/localStorage write) so events from the very first
// pageview aren't lost — it only starts *persisting* once statistics
// consent is granted, and reverts to in-memory (dropping what's stored) the
// moment consent is withdrawn.
export default function PostHogProvider() {
  const { consent } = useConsent();
  const usingCookiebot = process.env.NEXT_PUBLIC_COOKIE_CMP === "cookiebot";
  // Cookiebot's own banner doesn't expose a per-category JS callback we can
  // read here the way our own ConsentProvider does — during the trial this
  // treats "logged in enough to reach the app" as consent, same tradeoff
  // GoogleAnalytics already makes for GA in that mode.
  const statisticsGranted = usingCookiebot || consent.statistics;

  useEffect(() => {
    initAnalyticsClient();
  }, []);

  useEffect(() => {
    setAnalyticsConsent(statisticsGranted);
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
