"use client";

import posthog from "posthog-js";
import type { AnalyticsEvents, AnalyticsEventName } from "./analytics-types";

// Browser-only half of the analytics module — see lib/analytics-server.ts
// for the Node-route half and lib/analytics-edge.ts for the one Edge route
// that can use neither SDK. Split by runtime instead of "one file" (as
// originally speced) because posthog-js touches `window` at import time and
// posthog-node pulls in Node's http/https — mixing either into the wrong
// bundle risks breaking the Edge route's build, not just its runtime
// behavior. This file is the only one ever imported from a "use client"
// component.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

let initialized = false;

// Called by <PostHogProvider> only once the visitor has actually accepted
// the "statistics" cookie category — never on plain mount. That timing is
// what the Cookie Policy promises ("if you decline, PostHog is never loaded
// and no event is recorded"), and it has to be the init() call itself that
// waits, not just capture(): posthog-js's init() unconditionally fetches
// its remote config (/array/<token>/config.js from the PostHog assets host)
// and feature flags (/flags) regardless of the consent state — those
// requests go through _send_request(), which has no consent check at all
// (verified against posthog-js 1.427.x). Only capture() is gated by
// consent. So a "init early, opt in later" setup would still leak the
// visitor's IP to PostHog on every visit; deferring init() is the only
// approach that gives zero PostHog network activity pre-consent.
//
// opt_out_capturing_by_default is kept on top as a belt-and-braces guard:
// even if init() ever ran too early again, nothing is captured until
// setAnalyticsConsent(true) explicitly opts in. Starts with in-memory-only
// persistence — the switch to durable storage also happens only in
// setAnalyticsConsent(true). person_profiles: 'identified_only' means an
// anonymous visitor's events never create a full Person profile — only
// identify() (called after a real login/signup) does.
export function initAnalyticsClient(): void {
  if (initialized || !KEY || typeof window === "undefined") return;
  posthog.init(KEY, {
    api_host: HOST,
    person_profiles: "identified_only",
    persistence: "memory",
    opt_out_capturing_by_default: true,
    session_recording: { maskAllInputs: true },
    capture_pageview: false, // this app tracks specific product events, not generic pageviews
  });
  initialized = true;
}

// Flips persistence to durable storage once statistics consent is granted,
// and back to in-memory (dropping anything already stored) if consent is
// later withdrawn from the "Cookie preferences" panel — mirrors
// components/google-analytics.tsx's mount/unmount gating for GA. A no-op
// before initAnalyticsClient() has run, which is the normal state for every
// visitor who hasn't accepted statistics cookies (see above).
export function setAnalyticsConsent(granted: boolean): void {
  if (!initialized) return;
  if (granted) {
    posthog.set_config({ persistence: "localStorage+cookie" });
    posthog.opt_in_capturing();
  } else {
    posthog.opt_out_capturing();
    posthog.set_config({ persistence: "memory" });
  }
}

// user.id must be the Supabase auth user id — never pass email/name here,
// only the two properties the spec calls for.
export function identifyUser(userId: string, props: { signup_date: string; plan: string }): void {
  if (!initialized) return;
  posthog.identify(userId, props);
}

function track<E extends AnalyticsEventName>(event: E, properties: AnalyticsEvents[E]): void {
  if (!initialized) return;
  posthog.capture(event, properties);
}

export const trackClient = {
  signupCompleted: (p: AnalyticsEvents["signup_completed"]) => track("signup_completed", p),
  cvUploadStarted: (p: AnalyticsEvents["cv_upload_started"]) => track("cv_upload_started", p),
  scoreViewed: (p: AnalyticsEvents["score_viewed"]) => track("score_viewed", p),
  profilePageGenerated: (p: AnalyticsEvents["profile_page_generated"]) => track("profile_page_generated", p),
  jobAdPasted: (p: AnalyticsEvents["job_ad_pasted"]) => track("job_ad_pasted", p),
  publicPageViewed: (p: AnalyticsEvents["public_page_viewed"]) => track("public_page_viewed", p),
};
