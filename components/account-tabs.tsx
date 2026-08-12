"use client";

import { useState } from "react";
import type { ProfileSchema } from "@/lib/schema";
import type { CreditLedgerEntry } from "@/lib/credits";
import { computeCvScore } from "@/lib/cv-score";
import PdfExportButton from "@/components/pdf-export-button";
import EditPersonalInfoForm from "@/components/edit-personal-info-form";
import EditableSlug from "@/components/editable-slug";
import ChangeEmailForm from "@/components/change-email-form";
import ChangePasswordForm from "@/components/change-password-form";
import { DeleteProfileButton, DeleteAccountButton } from "@/components/account-actions";

const ACCENT = "#6366f1";

const LEDGER_REASON_LABELS: Record<string, string> = {
  welcome: "Credito di benvenuto",
  pdf_download: "Download PDF",
  tailor: "Adattamento a un annuncio",
  manual_grant: "Credito aggiunto manualmente",
};

type ProfileRow = { id: string; slug: string; data: ProfileSchema; created_at: string };

interface AccountTabsProps {
  userEmail: string;
  accountCode: string;
  primaryProfiles: ProfileRow[];
  tailoredProfiles: ProfileRow[];
  credits: number;
  ledger: CreditLedgerEntry[];
}

const TABS = [
  { id: "cv", label: "I miei CV" },
  { id: "account", label: "Dati dell'account" },
  { id: "credits", label: "Crediti" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
      {children}
    </h2>
  );
}

export default function AccountTabs({ userEmail, accountCode, primaryProfiles, tailoredProfiles, credits, ledger }: AccountTabsProps) {
  const [tab, setTab] = useState<TabId>("cv");
  const profileRow = primaryProfiles[0] ?? null;
  const usedTotal = ledger.filter(e => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0);

  return (
    <div className="space-y-8">
      {/* Tab switcher */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            style={tab === id
              ? { background: ACCENT, color: "#000" }
              : { background: "rgba(255,255,255,0.03)", color: "rgba(255,255,255,0.6)", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: I miei CV ─────────────────────────────────────────────── */}
      {tab === "cv" && (
        <div className="space-y-10">
          <div className="space-y-3">
            <SectionTitle>CV caricati ({primaryProfiles.length})</SectionTitle>
            {primaryProfiles.length > 0 ? (
              <div className="space-y-3">
                {primaryProfiles.map((row) => (
                  <div key={row.id} className="glass-card rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold">{row.data.personal_info.full_name}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {new Date(row.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <p className="text-xs font-semibold" style={{ color: ACCENT }}>
                        Punteggio: {computeCvScore(row.data).total}/100
                      </p>
                    </div>
                    <EditableSlug profileId={row.id} slug={row.slug} />
                    <div className="flex flex-wrap items-center gap-3">
                      <a
                        href={`/${accountCode}/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200"
                        style={{ background: ACCENT, color: "#000" }}
                      >
                        Apri profilo ↗
                      </a>
                      <a
                        href={`/tailor?profile=${row.slug}`}
                        className="px-5 py-2.5 rounded-xl border border-primary/40 text-primary font-semibold text-sm hover:bg-primary/8 transition-all duration-200"
                      >
                        Adatta a un annuncio
                      </a>
                      <PdfExportButton
                        slug={row.slug}
                        label="Scarica PDF ↓"
                        className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold hover:bg-white/[0.06] transition-all duration-200"
                      />
                    </div>
                    <div className="pt-2 border-t border-white/10">
                      <DeleteProfileButton
                        profileId={row.id}
                        label="Elimina profilo"
                        confirmMessage="Sei sicuro? Il profilo e il suo link smetteranno di funzionare subito. Anche i CV adattati collegati resteranno, ma senza un'origine."
                      />
                    </div>
                  </div>
                ))}
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

          <div className="space-y-3">
            <SectionTitle>CV adattati alle offerte ({tailoredProfiles.length})</SectionTitle>
            {tailoredProfiles.length > 0 ? (
              <div className="space-y-3">
                {tailoredProfiles.map((row) => (
                  <div key={row.id} className="glass-card rounded-2xl p-5 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{row.data.personal_info.title || row.data.personal_info.full_name}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {new Date(row.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                    </div>
                    <EditableSlug profileId={row.id} slug={row.slug} />
                    <div className="flex flex-wrap items-center gap-2">
                      <a
                        href={`/${accountCode}/${row.slug}`}
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
        </div>
      )}

      {/* ── Tab: Dati dell'account ─────────────────────────────────────── */}
      {tab === "account" && (
        <div className="space-y-10">
          <div className="space-y-3">
            <SectionTitle>Dati anagrafici</SectionTitle>
            <div className="glass-card rounded-2xl p-6 grid sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground/60 mb-0.5">Email</p>
                <p className="text-sm font-medium">{userEmail}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground/60 mb-0.5">Codice account</p>
                <p className="text-sm font-medium font-mono tracking-wide">{accountCode}</p>
              </div>
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

          <div className="space-y-3">
            <SectionTitle>Email di riferimento</SectionTitle>
            <div className="glass-card rounded-2xl p-6">
              <ChangeEmailForm currentEmail={userEmail} />
            </div>
          </div>

          <div className="space-y-3">
            <SectionTitle>Password</SectionTitle>
            <div className="glass-card rounded-2xl p-6">
              <ChangePasswordForm />
            </div>
          </div>

          <div className="space-y-3">
            <SectionTitle>Zona pericolosa</SectionTitle>
            <div className="rounded-2xl p-6 border border-red-500/20 bg-red-500/[0.03] flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground max-w-sm">
                Elimina definitivamente il tuo account: profilo, CV adattati e crediti verranno cancellati senza possibilità di recupero.
              </p>
              <DeleteAccountButton />
            </div>
          </div>
        </div>
      )}

      {/* ── Tab: Crediti ───────────────────────────────────────────────── */}
      {tab === "credits" && (
        <div className="space-y-8">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="glass-card rounded-2xl p-6">
              <p className="font-heading text-3xl font-bold" style={{ color: ACCENT }}>{credits}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">disponibili</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <p className="font-heading text-3xl font-bold text-foreground/80">{usedTotal}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">usati finora</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            1 credito = 1 download PDF o 1 adattamento a un annuncio. Per aggiungerne, scrivici.
          </p>

          <div className="space-y-3">
            <SectionTitle>Offerte per te</SectionTitle>
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground">Nessuna promozione attiva al momento.</p>
            </div>
          </div>

          {ledger.length > 0 && (
            <div className="space-y-3">
              <SectionTitle>Storico</SectionTitle>
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
            </div>
          )}
        </div>
      )}
    </div>
  );
}
