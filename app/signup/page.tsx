import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { safeRedirectPath } from "@/lib/safe-redirect";
import SignupPageBody from "@/components/signup-page-body";

interface Props {
  searchParams: Promise<{ next?: string; claim?: string }>;
}

// Same "already-authenticated visitors skip the form" guard as /login —
// see there for why, including the claim-token exception.
export default async function SignupPage({ searchParams }: Props) {
  const { next, claim } = await searchParams;
  if (!claim) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) redirect(safeRedirectPath(next) ?? "/account");
  }
  return <SignupPageBody />;
}
