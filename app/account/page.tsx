import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import SupabaseNotConfigured from "@/components/supabase-not-configured";
import AccountTabs from "@/components/account-tabs";
import { LogoutButton } from "@/components/account-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { getOwnedPrimaryProfiles, getOwnedTailoredProfiles } from "@/lib/profile-store";
import { getCreditBalance, getCreditLedger, getAccountCode } from "@/lib/credits";

export default async function AccountPage() {
  if (!isSupabaseConfigured()) return <SupabaseNotConfigured />;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [primaryProfiles, tailoredProfiles, credits, ledger, accountCode] = await Promise.all([
    getOwnedPrimaryProfiles(supabase, user.id),
    getOwnedTailoredProfiles(supabase, user.id),
    getCreditBalance(supabase, user.id),
    getCreditLedger(supabase, user.id),
    getAccountCode(supabase, user.id),
  ]);

  const memberSince = new Date(user.created_at).toLocaleDateString("it-IT", { year: "numeric", month: "long" });

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-32 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Il tuo account</h1>
            <p className="text-sm text-muted-foreground mt-1">Membro da {memberSince}</p>
          </div>
          <LogoutButton />
        </div>

        <AccountTabs
          userEmail={user.email ?? ""}
          accountCode={accountCode}
          primaryProfiles={primaryProfiles}
          tailoredProfiles={tailoredProfiles}
          credits={credits}
          ledger={ledger}
        />
      </div>
    </div>
  );
}
