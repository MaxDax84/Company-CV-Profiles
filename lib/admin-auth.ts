import { createHmac, timingSafeEqual, randomBytes } from "crypto";
import type { NextRequest } from "next/server";
import { kv } from "./kv";

// Single-admin gate for internal-only pages (e.g. /admin/costs) — no user
// table, no roles, just one shared password known only to the site owner.
export const ADMIN_SESSION_COOKIE = "jobli_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

// The single source of truth for "is there currently a valid admin
// session" — overwriting or deleting this key is what makes a session
// revocable. A previous version derived the cookie as a static
// HMAC(ADMIN_PASSWORD, fixed string): the same value every time, with no way
// to invalidate a leaked cookie short of rotating the password itself. A
// fresh random token per login, checked against this KV key, fixes both: a
// new login overwrites the key (any older cookie stops matching) and logout
// deletes it outright (immediate revocation, even for someone else still
// holding that cookie value).
const SESSION_KV_KEY = "admin:session_token";

export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

// Called right after a successful password check — mints a new session and
// makes it the only valid one.
export async function createAdminSession(): Promise<string> {
  const token = randomBytes(32).toString("hex");
  await kv.set(SESSION_KV_KEY, token, { ex: SESSION_MAX_AGE_SECONDS });
  return token;
}

export async function destroyAdminSession(): Promise<void> {
  await kv.del(SESSION_KV_KEY);
}

export async function verifyAdminSession(req: NextRequest): Promise<boolean> {
  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie) return false;
  const stored = await kv.get<string>(SESSION_KV_KEY);
  if (!stored) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(stored);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
