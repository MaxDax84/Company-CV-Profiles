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

// Called once by <PostHogProvider> on mount. Starts with in-memory-only
// persistence — no cookie/localStorage write happens until
// setAnalyticsConsent(true) is called after the visitor actually accepts the
// "statistics" cookie category. person_profiles: 'identified_only' means an
// anonymous visitor's pageviews never create a full Person profile — only
// identify() (called after a real login/signup) does.
export function initAnalyticsClient(): void {
  if (initialized || !KEY || typeof window === "undefined") return;
  posthog.init(KEY, {
    api_host: HOST,
    person_profiles: "identified_only",
    persistence: "memory",
    session_recording: { maskAllInputs: true },
    capture_pageview: false, // this app tracks specific product events, not generic pageviews
  });
  initialized = true;
}

// Flips persistence to durable storage once statistics consent is granted,
// and back to in-memory (dropping anything already stored) if consent is
// later withdrawn from the "Cookie preferences" panel — mirrors
// components/google-analytics.tsx's mount/unmount gating for GA.
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
