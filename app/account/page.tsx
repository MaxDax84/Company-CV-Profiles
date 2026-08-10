import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import PdfExportButton from "@/components/pdf-export-button";
import SupabaseNotConfigured from "@/components/supabase-not-configured";
import EditPersonalInfoForm from "@/components/edit-personal-info-form";
import ChangePasswordForm from "@/components/change-password-form";
import { LogoutButton, DeleteProfileButton, DeleteAccountButton } from "@/components/account-actions";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/service";
import { getOwnedProfileRow, getOwnedTailoredProfiles } from "@/lib/profile-store";
import { getCreditBalance, getCreditLedger } from "@/lib/credits";
import { computeCvScore } from "@/lib/cv-score";

const ACCENT = "#6366f1";

const LEDGER_REASON_LABELS: Record<string, string> = {
  welcome: "Credito di benvenuto",
  pdf_download: "Download PDF",
  tailor: "Adattamento a un annuncio",
  manual_grant: "Credito aggiunto manualmente",
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
      {children}
    </h2>
  );
}

export default async function AccountPage() {
  if (!isSupabaseConfigured()) return <SupabaseNotConfigured />;

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [profileRow, tailoredProfiles, credits, ledger] = await Promise.all([
    getOwnedProfileRow(supabase, user.id, "primary"),
    getOwnedTailoredProfiles(supabase, user.id),
    getCreditBalance(supabase, user.id),
    getCreditLedger(supabase, user.id),
  ]);

  const memberSince = new Date(user.created_at).toLocaleDateString("it-IT", { year: "numeric", month: "long" });

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-32 space-y-12">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight">Il tuo account</h1>
            <p className="text-sm text-muted-foreground mt-1">Membro da {memberSince}</p>
          </div>
          <LogoutButton />
        </div>

        {/* ── Dati anagrafici ─────────────────────────────────────────── */}
        <div className="space-y-3">
          <SectionTitle>Dati anagrafici</SectionTitle>
          <div className="glass-card rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground/60 mb-0.5">Email</p>
              <p className="text-sm font-medium">{user.email}</p>
            </div>
            <div className="hidden sm:block" />
            {profileRow && (
              <EditPersonalInfoForm
                fullName={profileRow.data.personal_info.full_name}
                title={profileRow.data.personal_info.title}
                location={profileRow.data.personal_info.location ?? ""}
              />
            )}
          </div>
          {profileRow && (
            <p className="text-xs text-muted-foreground/50">
              Nome, ruolo e località arrivano dal tuo CV, ma puoi correggerli qui in qualsiasi momento.
            </p>
          )}
        </div>

        {/* ── Sicurezza ───────────────────────────────────────────────── */}
        <div className="space-y-3">
          <SectionTitle>Sicurezza</SectionTitle>
          <div className="glass-card rounded-2xl p-6">
            <ChangePasswordForm />
          </div>
        </div>

        {/* ── Crediti ─────────────────────────────────────────────────── */}
        <div className="space-y-3">
          <SectionTitle>Crediti</SectionTitle>
          <div className="glass-card rounded-2xl p-6 flex items-center justify-between">
            <div>
              <p className="font-heading text-3xl font-bold" style={{ color: ACCENT }}>{credits}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">disponibili</p>
            </div>
            <p className="text-xs text-muted-foreground max-w-[14rem] text-right">
              1 credito = 1 download PDF o 1 adattamento a un annuncio. Per aggiungerne, scrivici.
            </p>
          </div>

          {ledger.length > 0 && (
            <div className="glass-card rounded-2xl divide-y divide-white/5">
              {ledger.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between px-5 py-3">
                  <div>
                    <p className="text-sm">{LEDGER_REASON_LABELS[entry.reason] ?? entry.reason}</p>
                    <p className="text-xs text-muted-foreground/50">
                      {new Date(entry.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: entry.amount > 0 ? "#4ade80" : "#f87171" }}>
                    {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── CV principale ───────────────────────────────────────────── */}
        <div className="space-y-3">
          <SectionTitle>Il tuo CV principale</SectionTitle>
          {profileRow ? (
            <div className="glass-card rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">{profileRow.data.personal_info.full_name}</p>
                <p className="text-xs font-semibold" style={{ color: ACCENT }}>
                  Punteggio: {computeCvScore(profileRow.data).total}/100
                </p>
              </div>
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
                <DeleteProfileButton
                  profileId={profileRow.id}
                  label="Elimina profilo"
                  confirmMessage="Sei sicuro? Il profilo e il suo link smetteranno di funzionare subito. Anche i CV adattati collegati resteranno, ma senza un'origine."
                />
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

        {/* ── CV adattati alle offerte ────────────────────────────────── */}
        <div className="space-y-3">
          <SectionTitle>CV adattati alle offerte ({tailoredProfiles.length})</SectionTitle>
          {tailoredProfiles.length > 0 ? (
            <div className="space-y-3">
              {tailoredProfiles.map((row) => (
                <div key={row.id} className="glass-card rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{row.data.personal_info.title || row.data.personal_info.full_name}</p>
                    <p className="text-xs text-muted-foreground/60 mt-0.5">
                      {new Date(row.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <a
                      href={`/profile/${row.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                      style={{ background: `${ACCENT}20`, color: ACCENT }}
                    >
                      Apri ↗
                    </a>
                    <PdfExportButton
                      slug={row.slug}
                      label="PDF ↓"
                      className="px-3 py-1.5 rounded-lg border border-white/10 text-xs font-semibold hover:bg-white/[0.06] transition-all duration-200"
                    />
                    <DeleteProfileButton profileId={row.id} label="Elimina" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Nessun CV adattato ancora. Ogni volta che adatti il tuo CV a un annuncio, comparirà qui.
              </p>
            </div>
          )}
        </div>

        {/* ── Account (zona pericolosa) ───────────────────────────────── */}
        <div className="space-y-3">
          <SectionTitle>Account</SectionTitle>
          <div className="rounded-2xl p-6 border border-red-500/20 bg-red-500/[0.03] flex items-center justify-between gap-4 flex-wrap">
            <p className="text-xs text-muted-foreground max-w-sm">
              Elimina definitivamente il tuo account: profilo, CV adattati e crediti verranno cancellati senza possibilità di recupero.
            </p>
            <DeleteAccountButton />
          </div>
        </div>
      </div>
    </div>
  );
}
