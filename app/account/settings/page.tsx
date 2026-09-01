import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SupabaseNotConfigured from "@/components/supabase-not-configured";
import AccountSettingsView from "@/components/account-settings-view";
import AccountSettingsHeader from "@/components/account-settings-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { getOwnedProfileRow } from "@/lib/profile-store";
import { getAccountCode } from "@/lib/credits";
import { getAvatarUrl, isOptedOutOfLifecycleEmails } from "@/lib/account-settings";

export default async function AccountSettingsPage() {
  if (!isSupabaseConfigured()) return <SupabaseNotConfigured />;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRow, accountCode, avatarUrl, lifecycleEmailsOptedOut] = await Promise.all([
    getOwnedProfileRow(supabase, user.id, "primary"),
    getAccountCode(supabase, user.id),
    getAvatarUrl(supabase, user.id),
    isOptedOutOfLifecycleEmails(supabase, user.id),
  ]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-32 space-y-10">
        <AccountSettingsHeader createdAt={user.created_at} />

        <AccountSettingsView
          userId={user.id}
          userEmail={user.email ?? ""}
          avatarUrl={avatarUrl}
          accountCode={accountCode}
          profileRow={profileRow}
          lifecycleEmailsOptedOut={lifecycleEmailsOptedOut}
        />
      </div>
      <Footer />
    </div>
  );
}
