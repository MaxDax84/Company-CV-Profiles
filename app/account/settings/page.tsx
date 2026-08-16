import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import SupabaseNotConfigured from "@/components/supabase-not-configured";
import AccountSettingsView from "@/components/account-settings-view";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { getOwnedProfileRow } from "@/lib/profile-store";
import { getAccountCode } from "@/lib/credits";
import { getAvatarUrl } from "@/lib/account-settings";

export default async function AccountSettingsPage() {
  if (!isSupabaseConfigured()) return <SupabaseNotConfigured />;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRow, accountCode, avatarUrl] = await Promise.all([
    getOwnedProfileRow(supabase, user.id, "primary"),
    getAccountCode(supabase, user.id),
    getAvatarUrl(supabase, user.id),
  ]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-32 space-y-10">
        <div>
          <a href="/account" className="text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
            ← Torna alla dashboard
          </a>
          <h1 className="font-heading text-2xl font-bold tracking-tight mt-2">Impostazioni account</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Membro da {new Date(user.created_at).toLocaleDateString("it-IT", { year: "numeric", month: "long" })}
          </p>
        </div>

        <AccountSettingsView
          userId={user.id}
          userEmail={user.email ?? ""}
          avatarUrl={avatarUrl}
          accountCode={accountCode}
          profileRow={profileRow}
        />
      </div>
      <Footer />
    </div>
  );
}
