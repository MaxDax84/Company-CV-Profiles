import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import ConfirmPoliciesPageBody from "@/components/confirm-policies-page-body";

interface Props {
  searchParams: Promise<{ next?: string }>;
}

// One-time stop for a brand-new account created with Google from a page
// that had no signup checkboxes (the /login page's "Continue with Google"
// button) — app/auth/callback/route.ts sends first-time Google users here
// unless the signup form's own checkboxes were already ticked, so every
// account ends up with the same recorded declarations (terms + privacy +
// 14 years or older, see SIGNUP_POLICIES) whichever door it came in by.
// Requires a session: the declarations are logged against the user id of
// the account that was just created, and there's nothing to confirm for a
// signed-out visitor.
export default async function ConfirmPoliciesPage({ searchParams }: Props) {
  const { next } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return <ConfirmPoliciesPageBody userId={user.id} next={safeRedirectPath(next) ?? "/account"} />;
}
