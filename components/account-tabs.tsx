"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { UploadCloud, Sparkles, Target, Download } from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import type { CreditLedgerEntry } from "@/lib/credits";
import { computeCvScore } from "@/lib/cv-score";
import PdfExportButton from "@/components/pdf-export-button";
import EditPersonalInfoForm from "@/components/edit-personal-info-form";
import EditableSlug from "@/components/editable-slug";
import ChangeEmailForm from "@/components/change-email-form";
import ChangePasswordForm from "@/components/change-password-form";
import RequestDomainForm from "@/components/request-domain-form";
import { DeleteProfileButton, DeleteAccountButton } from "@/components/account-actions";

const HOW_IT_WORKS = {
  sectionLabel: "Come funziona",
  title: "Dal CV al colloquio, in 4 passaggi",
  subtitle: "Nessuna scrittura da zero. La nostra AI parte da quello che hai già scritto e lo rende più efficace — senza mai inventare qualcosa che non hai fatto.",
  cards: [
    {
      icon: UploadCloud,
      title: "Carica il tuo CV",
      description: "Carica il PDF del tuo curriculum. In pochi secondi la nostra AI legge la tua esperienza e crea un profilo fedele a quello che hai scritto.",
    },
    {
      icon: Sparkles,
      title: "Ricevi il tuo punteggio",
      description: "Il tuo CV riceve subito un punteggio su 4 criteri: risultati misurabili, chiarezza, struttura ATS e competenze specifiche. L'AI lo migliora senza stravolgerlo — stesso contenuto, alzando il punteggio, senza mai inventare nulla.",
    },
    {
      icon: Target,
      title: "Adatta il CV a un annuncio",
      description: "Incolla il testo di un annuncio di lavoro: l'AI riscrive il tuo profilo per allinearlo a quella posizione, parola chiave per parola chiave, senza inventare nulla.",
    },
    {
      icon: Download,
      title: "Candidati con sicurezza",
      description: "Scarica il PDF ottimizzato per i sistemi ATS oppure condividi la tua landing page personale — una pagina web dedicata al tuo profilo, pronta da allegare o linkare in ogni candidatura.",
    },
  ],
};

const ACCENT = "#6366f1";

// Must match MAX_PRIMARY_PROFILES_PER_USER in lib/profile-store.ts (the
// actual enforcement point, at claim time) — kept as a separate constant
// here rather than imported, since that file pulls in server-only/service-
// role code that shouldn't end up in the client bundle.
const MAX_CVS = 4;

const LEDGER_REASON_LABELS: Record<string, string> = {
  welcome: "Credito di benvenuto",
  pdf_download: "Download PDF",
  tailor: "Adattamento a un annuncio",
  cover_letter: "Lettera di presentazione",
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
  { id: "how", label: "Come funziona" },
] as const;

type TabId = (typeof TABS)[number]["id"];

function isTabId(value: string | null): value is TabId {
  return TABS.some(t => t.id === value);
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
      {children}
    </h2>
  );
}

export default function AccountTabs({ userEmail, accountCode, primaryProfiles, tailoredProfiles, credits, ledger }: AccountTabsProps) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<TabId>(isTabId(requestedTab) ? requestedTab : "cv");
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
              : { background: "rgba(15, 23, 42,0.03)", color: "rgba(15, 23, 42,0.6)", border: "1px solid rgba(15, 23, 42,0.08)" }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Tab: I miei CV ─────────────────────────────────────────────── */}
      {tab === "cv" && (
        <div className="space-y-10">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <SectionTitle>CV caricati ({primaryProfiles.length}/{MAX_CVS})</SectionTitle>
              {primaryProfiles.length > 0 && (
                primaryProfiles.length < MAX_CVS ? (
                  <a
                    href="/generate"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{ background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
                  >
                    + Carica un nuovo CV
                  </a>
                ) : (
                  <span className="text-[11px] text-muted-foreground/60">
                    Limite raggiunto — elimina un CV per aggiungerne uno nuovo
                  </span>
                )
              )}
            </div>
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
                        className="px-5 py-2.5 rounded-xl border border-black/10 text-sm font-semibold hover:bg-black/[0.06] transition-all duration-200"
                      />
                      <a
                        href={`/api/cover-letter/${row.slug}`}
                        download
                        className="px-5 py-2.5 rounded-xl border border-black/10 text-sm font-semibold hover:bg-black/[0.06] transition-all duration-200"
                      >
                        Lettera di presentazione ↓
                      </a>
                    </div>
                    <div className="pt-2 border-t border-black/10">
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
                        className="px-3 py-1.5 rounded-lg border border-black/10 text-xs font-semibold hover:bg-black/[0.06] transition-all duration-200"
                      />
                      <a
                        href={`/api/cover-letter/${row.slug}`}
                        download
                        className="px-3 py-1.5 rounded-lg border border-black/10 text-xs font-semibold hover:bg-black/[0.06] transition-all duration-200"
                      >
                        Lettera ↓
                      </a>
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
            <SectionTitle>Dominio personalizzato</SectionTitle>
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <p className="text-xs text-muted-foreground">
                Vuoi la tua pagina su un dominio tuo (es. mario-rossi.it) invece del link GoOnWeb? Mandaci una richiesta, ti ricontattiamo per i dettagli.
              </p>
              <RequestDomainForm />
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
            1 credito = 1 download PDF, 1 adattamento a un annuncio o 1 lettera di presentazione. Per aggiungerne, scrivici.
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
              <div className="glass-card rounded-2xl divide-y divide-black/5">
                {ledger.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm">{LEDGER_REASON_LABELS[entry.reason] ?? entry.reason}</p>
                      {entry.detail && (
                        <p className="text-xs text-muted-foreground/70">{entry.detail}</p>
                      )}
                      <p className="text-xs text-muted-foreground/50">
                        {new Date(entry.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                      </p>
                    </div>
                    <p className="text-sm font-semibold" style={{ color: entry.amount > 0 ? "#16a34a" : "#dc2626" }}>
                      {entry.amount > 0 ? `+${entry.amount}` : entry.amount}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Come funziona ─────────────────────────────────────────── */}
      {tab === "how" && (
        <div className="space-y-8">
          <div className="space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em]">
              {HOW_IT_WORKS.sectionLabel}
            </p>
            <h2 className="font-heading text-2xl font-bold tracking-tight">{HOW_IT_WORKS.title}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">{HOW_IT_WORKS.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {HOW_IT_WORKS.cards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={card.title} className="glass-card rounded-2xl p-6 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-primary" />
                    </div>
                    <p className="text-xs font-semibold" style={{ color: ACCENT }}>{String(i + 1).padStart(2, "0")}</p>
                  </div>
                  <h3 className="text-sm font-semibold">{card.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{card.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
