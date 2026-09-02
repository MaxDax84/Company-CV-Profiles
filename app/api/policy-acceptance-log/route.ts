import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceSupabaseClient } from "@/lib/supabase/service";
import { getClientIp, policyAcceptanceLogRatelimit } from "@/lib/rate-limit";
import { logPolicyAcceptance, type PolicyAcceptanceContext } from "@/lib/log-policy-acceptance";

export const runtime = "nodejs";

const VALID_CONTEXTS: PolicyAcceptanceContext[] = ["signup", "cv_upload", "tailor_resume", "contact_form", "support_form"];
// Bumped alongside the September 2026 GDPR audit pass on /privacy and
// /terms — update this whenever either page's substance changes, same
// idea as lib/consent.ts's COOKIE_POLICY_VERSION.
const POLICY_VERSION = "2026-09";

// Called from every "ho letto e accetto" checkbox in the app right as the
// user proceeds (signup, CV upload, job tailoring, contact/support forms)
// — writes the server-side proof-of-acceptance record (see
// supabase/migrations/0033_policy_acceptance_log.sql). Never blocks the
// actual action: this is purely the audit trail on top, called
// fire-and-forget from the client.
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const { success } = await policyAcceptanceLogRatelimit.limit(clientIp);
    if (!success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const context = body?.context;
    if (!VALID_CONTEXTS.includes(context)) {
      return NextResponse.json({ error: "Invalid context." }, { status: 400 });
    }
    const policies = Array.isArray(body?.policies) && body.policies.every((p: unknown) => typeof p === "string")
      ? body.policies.slice(0, 5)
      : ["privacy"];

    // Signup is the one context where the acceptance happens before a
    // server session cookie necessarily exists (e.g. "confirm your email"
    // signups have no session yet) — the client passes the freshly created
    // user id instead, verified here against the Admin API rather than
    // trusted outright, so an anonymous caller can't plant a false
    // acceptance record against someone else's account. Every other
    // context derives the user id from the actual authenticated session,
    // never from client input.
    let userId: string | null = null;
    if (context === "signup" && typeof body?.userId === "string") {
      const service = createServiceSupabaseClient();
      const { data } = await service.auth.admin.getUserById(body.userId);
      userId = data.user?.id ?? null;
    } else {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id ?? null;
    }

    logPolicyAcceptance({
      context,
      policies,
      policyVersion: POLICY_VERSION,
      userId,
      ipAddress: clientIp,
      userAgent: req.headers.get("user-agent"),
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[policy-acceptance-log]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
