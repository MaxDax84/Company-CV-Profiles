import type { AnalyticsEvents, AnalyticsEventName } from "./analytics-types";

// Edge-runtime-only half of the analytics module — for /api/parse-resume
// specifically, the one route in this app that runs on `export const
// runtime = 'edge'` (react-pdf, posthog-node, and most other Node-oriented
// packages need Node's http/https and generally can't run there). Rather
// than pull posthog-node into an Edge bundle at all — which risks a build
// failure, not just a runtime one — this calls PostHog's HTTP capture
// endpoint directly with `fetch`, which Edge supports natively.
//
// Never awaited by its caller on the success path (fire-and-forget) — the
// Edge runtime keeps a function alive until any promise it started
// resolves as long as the platform's waitUntil-equivalent is used; Vercel's
// Edge runtime extends the response lifetime for pending fetches
// automatically, so a plain (non-awaited) call here still reliably reaches
// PostHog without slowing the CV upload response down.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

export function trackEdge<E extends AnalyticsEventName>(
  distinctId: string,
  event: E,
  properties: AnalyticsEvents[E]
): void {
  if (!KEY) return;
  fetch(`${HOST}/i/v0/e/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: KEY, event, distinct_id: distinctId, properties }),
  }).catch(() => {
    // Best-effort — never let an analytics hiccup affect the actual CV parse.
  });
}
