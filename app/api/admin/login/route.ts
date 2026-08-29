import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword, createAdminSession, ADMIN_SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from "@/lib/admin-auth";
import { adminLoginRatelimit, getClientIp } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req);
  const { success } = await adminLoginRatelimit.limit(ip);
  if (!success) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Admin login not configured." }, { status: 503 });
  }

  const { password } = await req.json().catch(() => ({ password: "" }));
  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }

  const token = await createAdminSession();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
