import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
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
export default async function LoginPage({ searchParams }: Props) {
  const { next, claim } = await searchParams;
  if (!claim) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect(safeRedirectPath(next) ?? "/account");
  }
  return <LoginPageBody />;
}
