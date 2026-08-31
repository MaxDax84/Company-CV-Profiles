import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { claimPendingProfile } from "@/lib/profile-store";
import { getAccountCode } from "@/lib/credits";
import { claimWelcomeEmailSlot } from "@/lib/credits-server";
import { sendWelcomeEmail } from "@/lib/email";

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
      if (won) await sendWelcomeEmail(user.email, origin);
    } catch (err) {
      console.error("[auth/callback] welcome email failed", err);
    }
  }

  if (claimToken && user) {
    const result = await claimPendingProfile(supabase, user.id, claimToken);
    if (!("error" in result)) {
      const accountCode = await getAccountCode(supabase, user.id);
      return NextResponse.redirect(`${origin}/${accountCode}/${result.slug}`);
    }
    // Signed in fine even though claiming this specific CV failed (e.g.
    // expired preview, 4-CV limit) — same fallback the password-based
    // login/signup forms use, land on the account rather than an error page.
  }

  return NextResponse.redirect(`${origin}/account`);
}
