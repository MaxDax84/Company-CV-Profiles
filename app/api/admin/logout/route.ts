import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, destroyAdminSession } from "@/lib/admin-auth";

export async function POST() {
  // Deletes the KV-side session token, not just the cookie — revokes access
  // immediately even for another browser/device still holding this cookie.
  await destroyAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.delete(ADMIN_SESSION_COOKIE);
  return res;
}
