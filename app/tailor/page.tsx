import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import TailorForm from "@/components/tailor-form";
import SupabaseNotConfigured from "@/components/supabase-not-configured";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { getOwnedProfileRow } from "@/lib/profile-store";
import { getCreditBalance } from "@/lib/credits";

export default async function TailorPage() {
  if (!isSupabaseConfigured()) return <SupabaseNotConfigured />;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRow, credits] = await Promise.all([
    getOwnedProfileRow(supabase, user.id, "primary"),
    getCreditBalance(supabase, user.id),
  ]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="animate-fade-in">

      {/* Background */}
      <div className="absolute inset-0 grid-overlay" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      <div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-glow-pulse pointer-events-none"
        style={{ background: "oklch(0.72 0.18 280 / 0.07)", animationDelay: "2.5s" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.10_0.012_255)_100%)] pointer-events-none" />

      <div className="flex items-center justify-center px-6 py-24">
        <div className="max-w-2xl w-full">
          <TailorForm credits={credits} hasProfile={!!profileRow} />
        </div>
      </div>
      </div>
    </div>
  );
}
