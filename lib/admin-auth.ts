import { createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

// Single-admin gate for internal-only pages (e.g. /admin/costs) — no user
// table, no roles, just one shared password known only to the site owner.
// The session cookie's value is never the raw password: it's an HMAC of a
// fixed string keyed by ADMIN_PASSWORD, so a leaked cookie alone doesn't
// reveal the password, and forging a valid cookie requires knowing it.
export const ADMIN_SESSION_COOKIE = "jobli_admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function computeAdminToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("jobli-admin-session").digest("hex");
}

export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(candidate);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function verifyAdminSession(req: NextRequest): boolean {
  const token = computeAdminToken();
  if (!token) return false;
  const cookie = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
  if (!cookie) return false;
  const a = Buffer.from(cookie);
  const b = Buffer.from(token);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function getAdminSessionCookieValue(): string | null {
  return computeAdminToken();
}

export { SESSION_MAX_AGE_SECONDS };
