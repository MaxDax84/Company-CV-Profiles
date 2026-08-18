import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SupabaseNotConfigured from "@/components/supabase-not-configured";
import AccountShell from "@/components/account-shell";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { getOwnedPrimaryProfiles, getOwnedTailoredProfiles, getOwnedTranslatedProfiles } from "@/lib/profile-store";
import { getCreditBalance, getCreditLedger, getAccountCode } from "@/lib/credits";
import { getPaidDownloads } from "@/lib/paid-downloads";
import { getGeneratedCoverLetters } from "@/lib/cover-letters";

export default async function AccountPage() {
  if (!isSupabaseConfigured()) return <SupabaseNotConfigured />;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [primaryProfiles, tailoredProfiles, translatedProfiles, credits, ledger, accountCode, paidDownloads, coverLetters] = await Promise.all([
    getOwnedPrimaryProfiles(supabase, user.id),
    getOwnedTailoredProfiles(supabase, user.id),
    getOwnedTranslatedProfiles(supabase, user.id),
    getCreditBalance(supabase, user.id),
    getCreditLedger(supabase, user.id),
    getAccountCode(supabase, user.id),
    getPaidDownloads(supabase, user.id),
    getGeneratedCoverLetters(supabase, user.id),
  ]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-32">
        <AccountShell
          userEmail={user.email ?? ""}
          accountCode={accountCode}
          primaryProfiles={primaryProfiles}
          tailoredProfiles={tailoredProfiles}
          translatedProfiles={translatedProfiles}
          credits={credits}
          ledger={ledger}
          paidDownloads={paidDownloads}
          coverLetters={coverLetters}
        />
      </div>
      <Footer />
    </div>
  );
}
