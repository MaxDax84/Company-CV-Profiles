import { createHmac, timingSafeEqual } from "crypto";

// One-click, no-login-required unsubscribe links for the lifecycle emails
// (see lib/email.ts) — required so a recipient can object to each email
// "easily and free of charge" per Art. 130 Codice Privacy, without forcing
// them to log in first just to stop an email. The token is a deterministic
// HMAC of the user's id, not a stored per-email value: nothing to generate
// or clean up, and it stays valid indefinitely (which is fine — its only
// job is proving "whoever clicked this link controls this email inbox",
// not authenticating a session).
function sign(userId: string): string | null {
  const secret = process.env.UNSUBSCRIBE_SECRET;
  if (!secret) return null;
  return createHmac("sha256", secret).update(userId).digest("hex");
}

// Never throws — building an email's unsubscribe link is not allowed to
// take down the email itself (or, worse, the credit spend / signup / cron
// run that triggered it). Falls back to the in-app settings toggle, which
// does the exact same thing, if the secret isn't configured for some reason.
export function buildUnsubscribeUrl(userId: string, siteUrl: string): string {
  const token = sign(userId);
  if (!token) {
    console.error("[unsubscribe] UNSUBSCRIBE_SECRET not configured, falling back to settings link");
    return `${siteUrl}/account/settings`;
  }
  return `${siteUrl}/api/account/unsubscribe?uid=${encodeURIComponent(userId)}&token=${token}`;
}

export function verifyUnsubscribeToken(userId: string, token: string): boolean {
  const expected = sign(userId);
  if (!expected) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}
