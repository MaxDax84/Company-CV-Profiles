import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getClientIp } from "@/lib/rate-limit";
import { logConsent, type ConsentMethod } from "@/lib/log-consent";

export const runtime = "nodejs";

// Called from components/consent-provider.tsx every time a visitor accepts,
// rejects, or saves custom cookie preferences — writes the server-side
// proof-of-consent record (see supabase/migrations/0019_cookie_consent_log.sql).
// Never blocks or fails the visitor's own choice: the cookie is already
// written client-side before this is even called, this is purely the
// audit trail on top.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const consentId = body?.consentId;
    const preferences = body?.preferences;
    const statistics = body?.statistics;
    const marketing = body?.marketing;
    const method = body?.method as ConsentMethod;
    const policyVersion = body?.policyVersion;

    if (
      typeof consentId !== "string" ||
      typeof preferences !== "boolean" ||
      typeof statistics !== "boolean" ||
      typeof marketing !== "boolean" ||
      typeof policyVersion !== "string" ||
      !["accept_all", "reject_all", "custom"].includes(method)
    ) {
      return NextResponse.json({ error: "Invalid consent-log payload." }, { status: 400 });
    }

    // Anonymous visitors are the normal case here, not an error — the
    // consent record is valid with or without a signed-in user behind it.
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    logConsent({
      consentId,
      preferences,
      statistics,
      marketing,
      method,
      policyVersion,
      userId: user?.id ?? null,
      ipAddress: getClientIp(req),
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[consent-log]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
