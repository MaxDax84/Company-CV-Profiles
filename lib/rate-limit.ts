import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "./kv";

// Guards the expensive/abusable endpoints (Claude API calls, outbound email)
// against scripted spam from a single source, since neither requires a login.
export const parseResumeRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:parse-resume",
});

export const tailorResumeRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:tailor-resume",
});

// Same budget as tailorResumeRatelimit — this now runs a real Claude call
// (the phase-2 "improve" pass on /generate), not just a KV write.
export const improveProfileRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:improve-profile",
});

// Contact form: no Claude call, but it does send a real email (with an
// attachment) through our own Gmail account on every request — without a
// cap, a script could spam/flood that inbox and risk the account getting
// flagged for abuse.
export const contactRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:contact",
});

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
