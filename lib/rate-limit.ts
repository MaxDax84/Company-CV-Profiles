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

// The CV chat's "next question" turn — deliberately much more generous than
// the 5/hour above: those all guard a ONE-SHOT anonymous action, but a
// single normal chat conversation here legitimately makes up to
// MAX_QUESTIONS (6) of these calls back-to-back, sometimes more with a
// retry after a transient error. 5/hour would exhaust itself mid-
// conversation on completely normal use (this is exactly what happened in
// real testing). Still authenticated (unlike the endpoints above), so IP
// rate limiting here is a secondary guard, not the only one.
export const cvChatQuestionRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(30, "1 h"),
  prefix: "ratelimit:cv-chat-question",
});

// The CV chat's final reformulation call — structurally the same shape of
// request as tailorResumeRatelimit (one full-profile Sonnet rewrite), same
// budget, but its own prefix so it doesn't share a quota with unrelated
// /api/tailor-resume calls from the same user.
export const cvChatFinishRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:cv-chat-finish",
});

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
