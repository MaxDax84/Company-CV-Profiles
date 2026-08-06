import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import PdfExportButton from "@/components/pdf-export-button";
import { LogoutButton, DeleteProfileButton } from "@/components/account-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileRow } from "@/lib/profile-store";
import { getCreditBalance } from "@/lib/credits";

const ACCENT = "#6366f1";

export default async function AccountPage() {
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
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-32 space-y-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Il tuo account</h1>
            <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
          </div>
          <LogoutButton />
        </div>

        <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1">
              Crediti disponibili
            </p>
            <p className="font-heading text-3xl font-bold" style={{ color: ACCENT }}>{credits}</p>
          </div>
          <p className="text-xs text-muted-foreground max-w-[14rem] text-right">
            1 credito = 1 download PDF o 1 adattamento a un annuncio. Per aggiungerne, scrivici.
          </p>
        </div>

        {profileRow ? (
          <div className="glass-card rounded-2xl p-6 space-y-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              Il tuo profilo
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`/profile/${profileRow.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{ background: ACCENT, color: "#000" }}
              >
                Apri profilo ↗
              </a>
              <a
                href={`/tailor?profile=${profileRow.slug}`}
                className="px-5 py-2.5 rounded-xl border border-primary/40 text-primary font-semibold text-sm hover:bg-primary/8 transition-all duration-200"
              >
                Adatta a un annuncio
              </a>
              <PdfExportButton
                slug={profileRow.slug}
                label="Scarica PDF ↓"
                className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/[0.06] transition-all duration-200"
              />
            </div>
            <div className="pt-2 border-t border-white/10">
              <DeleteProfileButton />
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 text-center space-y-3">
            <p className="text-sm text-muted-foreground">Non hai ancora un profilo.</p>
            <a
              href="/generate"
              className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
              style={{ background: ACCENT, color: "#000" }}
            >
              Carica il tuo CV →
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
