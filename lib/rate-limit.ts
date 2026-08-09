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

// No Claude call here (just a KV write), so a looser limit than the two
// above is fine — this only guards against scripted spam re-writing the
// same pending preview over and over.
export const customizeProfileRatelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(20, "1 h"),
  prefix: "ratelimit:customize-profile",
});

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}
