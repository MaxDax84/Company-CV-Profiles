import { Ratelimit } from "@upstash/ratelimit";
import { kv } from "./kv";

// Guards the expensive/abusable endpoints (Claude API calls, outbound email)
// against scripted spam from a single source, since neither requires a login.
export const parseResumeRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:parse-resume",
});

export const sendEmailRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(3, "1 h"),
  prefix: "ratelimit:send-email",
});

export const tailorResumeRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  prefix: "ratelimit:tailor-resume",
});

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
