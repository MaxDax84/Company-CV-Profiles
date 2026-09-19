import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { safeRedirectPath } from "@/lib/safe-redirect";
import LoginPageBody from "@/components/login-page-body";

interface Props {
  searchParams: Promise<{ next?: string; claim?: string }>;
}

// A visitor who's already signed in never needs the login form itself —
// land them straight where they were headed (see lib/safe-redirect.ts)
// or the dashboard, same "already-authenticated" guard /interview-prep
// already had. Skipped when a claim token is present: that means an
// anonymous preview is waiting to be attached to an account, and
// LoginPageBody's own submit handler is what actually calls /api/claim —
// redirecting away here would silently drop that pending CV.
// noindex: an auth form is pure noise in a results page, and it's also
// disallowed in app/robots.ts. Both are kept: robots.txt stops the crawl,
// the meta tag stops an already-known URL from staying indexed.
export const metadata: Metadata = {
  title: "Accedi",
  description: "Accedi al tuo account Jobli per ritrovare i tuoi CV, i crediti e i download.",
  robots: { index: false, follow: false },
};

export default async function LoginPage({ searchParams }: Props) {
  const { next, claim } = await searchParams;
  // Same guard as /account and /tailor: without real Supabase credentials
  // (local dev before the project exists, a misconfigured preview) the
  // already-signed-in check below is meaningless anyway — skip straight to
  // the form instead of crashing the whole page on an unhandled client-init
  // error.
  if (!claim && isSupabaseConfigured()) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect(safeRedirectPath(next) ?? "/account");
  }
  return <LoginPageBody />;
}
