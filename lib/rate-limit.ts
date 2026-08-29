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

// Admin login: no captcha in front of it, so a slow brute-force cap per IP
// matters more here than on the other forms above.
export const adminLoginRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(10, "1 h"),
  prefix: "ratelimit:admin-login",
});

// Domain requests: also sends a real email through our own Gmail account,
// same abuse risk as the contact form above — but this one sat with no cap
// at all (an authenticated account is free and easy to create, so "requires
// login" isn't itself a meaningful barrier). Keyed by user id, not IP: the
// legitimate use case is "one account asks a handful of times," so limiting
// per-account is the more meaningful boundary than per-IP here.
export const requestDomainRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(3, "1 d"),
  prefix: "ratelimit:request-domain",
});

// Consent logging: no Claude call, no email, but it's a fully anonymous
// DB-insert endpoint with no cap at all — a generous limit just stops a
// runaway script from bloating the table, not meant to ever affect a real
// visitor's normal cookie-preference clicks.
export const consentLogRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(30, "10 m"),
  prefix: "ratelimit:consent-log",
});

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
