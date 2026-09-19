import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { claimPendingProfile } from "@/lib/profile-store";
import { getAccountCode } from "@/lib/credits";
import { claimWelcomeEmailSlot } from "@/lib/credits-server";
import { sendWelcomeEmail } from "@/lib/email";
import { isOptedOutOfLifecycleEmails } from "@/lib/account-settings";
import { safeRedirectPath } from "@/lib/safe-redirect";
import { trackServer } from "@/lib/analytics-server";
import { logPolicyAcceptance, POLICY_VERSION, SIGNUP_POLICIES } from "@/lib/log-policy-acceptance";
import { getClientIp } from "@/lib/rate-limit";

export const runtime = "nodejs";

// Lands here after Google OAuth (see components/google-auth-button.tsx):
// Supabase redirects back with a `code` param that only a server-side
// exchange can turn into a session (it needs to set httpOnly cookies —
// a client component can't do that). Mirrors /api/claim's logic inline
// instead of calling it, since we already have an authenticated `supabase`
// client here and can skip a redundant round-trip.
export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");
  const claimToken = searchParams.get("claim");
  const next = safeRedirectPath(searchParams.get("next"));
  // "1" only when the signup form's terms/privacy and 14+ checkboxes were
  // ticked before the Google button was clicked (google-auth-button.tsx).
  const policiesAccepted = searchParams.get("accepted") === "1";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchangeCodeForSession failed", error);
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  const isGoogle = user?.app_metadata?.provider === "google";

  // Set below when this turns out to be a brand-new Google account whose
  // signup declarations haven't been recorded yet — decides between landing
  // on the destination directly or via the /auth/confirm-policies stop.
  let needsPolicyConfirmation = false;

  // Hit on every Google login, not just the first — claimWelcomeEmailSlot
  // only returns true once per account (see lib/credits.ts), so this is
  // safe to check unconditionally here rather than trying to distinguish
  // "first ever login" from "just logging back in" up front. Awaited
  // (rather than fire-and-forget) because a serverless function isn't
  // guaranteed to keep running background work after its response goes
  // out — a few hundred ms on this redirect is a fine trade for actually
  // sending the email reliably.
  if (user?.email) {
    try {
      const won = await claimWelcomeEmailSlot(user.id);
      // Reuses this exact "first time ever" signal (it only ever returns
      // true once per account) rather than a separate check — covers both
      // Google OAuth and a confirmed-email password signup, the two flows
      // that land here; the immediate-session (no email confirm) password
      // path is tracked client-side in signup-form.tsx instead, since it
      // never reaches this route at all.
      if (won) {
        await trackServer(user.id, "signup_completed", {
          method: isGoogle ? "google" : "password",
        });
      }
      // Signup declarations for a NEW Google account. A password signup
      // already logged its own acceptance from signup-form.tsx before ever
      // reaching here, so this is Google-only. The "accepted" flag is
      // trusted exactly as much as the client-side fetch the password form
      // makes (same trust level, same record) — the user id, IP and
      // user-agent all come from this authenticated request, never from
      // the URL. Without the flag (a first Google login started from the
      // /login page, where there are no checkboxes) the account exists
      // already, so the declarations are collected right after instead —
      // see app/auth/confirm-policies/page.tsx.
      if (won && isGoogle) {
        if (policiesAccepted) {
          logPolicyAcceptance({
            context: "signup",
            policies: [...SIGNUP_POLICIES],
            policyVersion: POLICY_VERSION,
            userId: user.id,
            ipAddress: getClientIp(req),
            userAgent: req.headers.get("user-agent"),
          });
        } else {
          needsPolicyConfirmation = true;
        }
      }
      if (won && !(await isOptedOutOfLifecycleEmails(supabase, user.id))) {
        await sendWelcomeEmail(user.email, origin, user.id);
      }
    } catch (err) {
      console.error("[auth/callback] welcome email failed", err);
    }
  }

  let destination = next ?? "/account";
  if (claimToken && user) {
    const result = await claimPendingProfile(supabase, user.id, claimToken);
    if (!("error" in result)) {
      const accountCode = await getAccountCode(supabase, user.id);
      destination = `/${accountCode}/${result.slug}`;
    }
    // Signed in fine even though claiming this specific CV failed (e.g.
    // expired preview, 4-CV limit) — same fallback the password-based
    // login/signup forms use, land on the account rather than an error page.
  }

  if (needsPolicyConfirmation) {
    return NextResponse.redirect(`${origin}/auth/confirm-policies?next=${encodeURIComponent(destination)}`);
  }
  return NextResponse.redirect(`${origin}${destination}`);
}
