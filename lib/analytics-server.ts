import { PostHog } from "posthog-node";
import type { AnalyticsEvents, AnalyticsEventName } from "./analytics-types";

// Node-route half of the analytics module — see lib/analytics-client.ts for
// the browser half and lib/analytics-edge.ts for the one route (/api/parse-resume)
// that runs on the Edge runtime, where posthog-node (it depends on Node's
// http/https) cannot run at all. NEVER import this file from an `edge`
// route or from anything a "use client" component could pull in.

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com";

// One client per function invocation (not a module-level singleton) — each
// serverless invocation is its own process lifetime, and this client must
// be shut down (flushed) before the function returns or queued events are
// silently dropped. flushAndShutdown() below does that.
function client(): PostHog | null {
  if (!KEY) return null;
  return new PostHog(KEY, { host: HOST, flushAt: 1, flushInterval: 0 });
}

// distinctId: the Supabase auth user id for a logged-in action, or any
// stable-for-this-request string (e.g. the route's own request id) for one
// that isn't tied to a specific person — PostHog requires *some* id.
export async function trackServer<E extends AnalyticsEventName>(
  distinctId: string,
  event: E,
  properties: AnalyticsEvents[E]
): Promise<void> {
  const ph = client();
  if (!ph) return;
  ph.capture({ distinctId, event, properties });
  // Node serverless functions can be frozen the instant the response is
  // sent — awaited shutdown (not fire-and-forget) is the only way to
  // guarantee this one event actually reaches PostHog before that happens.
  await ph.shutdown();
}
