"use client";

import { useState } from "react";
import {
  UploadCloud, Target, Download, ExternalLink, Mail, X,
  LayoutDashboard, FileText, Wallet,
} from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import type { CreditLedgerEntry } from "@/lib/credits";
import type { PaidDownloadEntry } from "@/lib/paid-downloads";
import type { GeneratedCoverLetterEntry } from "@/lib/cover-letters";
import { PDF_TEMPLATES } from "@/components/pdf/AtsResumeDocument";
import { computeCvScore } from "@/lib/cv-score";
import PdfExportButton from "@/components/pdf-export-button";
import CoverLetterButton from "@/components/cover-letter-button";
import EditableSlug from "@/components/editable-slug";
import { DeleteProfileButton } from "@/components/account-actions";

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

// Same 3-band read as the /generate score card (see lib/score-comments.ts)
// collapsed to a single traffic-light color for a compact badge — red
// clearly-below-target, amber approaching it, green at-or-above.
function scoreBadgeColor(score: number): string {
  if (score < 50) return "#ef4444";
  if (score < 75) return "#f59e0b";
  return "#22c55e";
}

type ProfileRow = { id: string; slug: string; data: ProfileSchema; created_at: string };

// Commercial sections — the ones used often — stay as visible tabs. Account
// settings (rarely touched) moved into a separate drawer, see SETTINGS_ICON
// button below, instead of competing for space in this row. "label" is the
// short tab-button text; "title" is the fuller section heading shown above
// the tab row (see AccountShell) — deliberately different for "dashboard"
// (button reads "Riepilogo", section heading reads "Dashboard").
const TABS = [
  { id: "dashboard", label: "Riepilogo", title: "Dashboard", icon: LayoutDashboard },
  { id: "cv", label: "I miei CV", title: "I miei CV", icon: FileText },
  { id: "adapted", label: "CV Adattati", title: "CV adattati alle offerte", icon: Target },
  { id: "downloads", label: "Download", title: "Download", icon: Download },
  { id: "credits", label: "Crediti", title: "Crediti", icon: Wallet },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function isTabId(value: string | null): value is TabId {
  return TABS.some(t => t.id === value);
}

export function getTabTitle(tab: TabId): string {
  return TABS.find(t => t.id === tab)?.title ?? "";
}

interface AccountTabsProps {
  userEmail: string;
  accountCode: string;
  primaryProfiles: ProfileRow[];
  tailoredProfiles: ProfileRow[];
  credits: number;
  ledger: CreditLedgerEntry[];
  paidDownloads: PaidDownloadEntry[];
  coverLetters: GeneratedCoverLetterEntry[];
  // Owned by AccountShell — account settings are now their own page (see
  // app/account/settings/page.tsx), reached via the avatar dropdown in the
  // global nav, so this component only needs the commercial tab itself.
  tab: TabId;
  setTab: (tab: TabId) => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
      {children}
    </h2>
  );
}

export default function AccountTabs({ userEmail, accountCode, primaryProfiles, tailoredProfiles, credits, ledger, paidDownloads, coverLetters, tab, setTab }: AccountTabsProps) {
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const profileRow = primaryProfiles[0] ?? null;
  const usedTotal = ledger.filter(e => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const profilesById = new Map([...primaryProfiles, ...tailoredProfiles].map(row => [row.id, row]));

  return (
    <div className="space-y-8">
      {/* Tab switcher — the settings-drawer trigger that used to live here
          (a gear icon) moved to the avatar dropdown in the global nav (see
          components/account-avatar-menu.tsx), reachable from every page. */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            style={tab === id
              ? { background: ACCENT, color: "#000" }
              : { background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Dashboard ─────────────────────────────────────────────── */}
      {tab === "dashboard" && (
        <div className="space-y-8">
          <div
            className="rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6"
            style={{ background: `linear-gradient(135deg, ${ACCENT}18, ${ACCENT}05)`, border: `1px solid ${ACCENT}30` }}
          >
            <div>
              <p className="text-sm text-muted-foreground/70 mb-1">Bentornato,</p>
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                {profileRow?.data.personal_info.full_name ?? userEmail}
              </h2>
              <p className="text-sm mt-2">
                <span className="font-bold" style={{ color: ACCENT }}>{credits}</span>
                <span className="text-muted-foreground"> credit{credits === 1 ? "o" : "i"} disponibil{credits === 1 ? "e" : "i"}</span>
              </p>
            </div>
            {primaryProfiles.length < MAX_CVS && (
              <a
                href="/generate"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: ACCENT, color: "#000" }}
              >
                <UploadCloud className="w-4 h-4" />
                Carica un nuovo CV
              </a>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>CV recenti</SectionTitle>
              {primaryProfiles.length > 0 && (
                <button onClick={() => setTab("cv")} className="text-xs font-semibold" style={{ color: ACCENT }}>
                  Vedi tutti →
                </button>
              )}
            </div>
            {primaryProfiles.length > 0 ? (
              <div className="space-y-2">
                {primaryProfiles.slice(0, 3).map((row) => {
                  const score = computeCvScore(row.data).total;
                  return (
                    <div key={row.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate">{row.slug}</p>
                        <p className="text-xs text-muted-foreground/60">
                          {new Date(row.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className="text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ color: scoreBadgeColor(score), background: `${scoreBadgeColor(score)}18` }}
                        >
                          {score}/100
                        </span>
                        <a
                          href={`/${accountCode}/${row.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-foreground/[0.06] transition-colors"
                          aria-label="Apri profilo"
                        >
                          <ExternalLink className="w-4 h-4 text-muted-foreground" />
                        </a>
                      </div>
                    </div>
                  );
                })}
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
      )}

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
                  <button
                    onClick={() => setLimitModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                    style={{ background: `${ACCENT}20`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
                  >
                    + Carica un nuovo CV
                  </button>
                )
              )}
            </div>
            {primaryProfiles.length > 0 ? (
              <div className="space-y-3">
                {primaryProfiles.map((row) => (
                  <div key={row.id} className="glass-card rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <EditableSlug profileId={row.id} slug={row.slug} variant="heading" />
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {new Date(row.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <p
                        className="text-xs font-bold px-2.5 py-1 rounded-full"
                        style={{ color: scoreBadgeColor(computeCvScore(row.data).total), background: `${scoreBadgeColor(computeCvScore(row.data).total)}18` }}
                      >
                        {computeCvScore(row.data).total}/100
                      </p>
                    </div>
                    {row.data.metadata.suggested_titles && row.data.metadata.suggested_titles.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                          Ruoli in linea con questo CV
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {row.data.metadata.suggested_titles.map((title) => (
                            <span
                              key={title}
                              className="px-2.5 py-1 rounded-full text-[11px] font-semibold"
                              style={{ background: `${ACCENT}15`, color: ACCENT, border: `1px solid ${ACCENT}40` }}
                            >
                              {title}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="flex flex-wrap items-start gap-2">
                      <a
                        href={`/${accountCode}/${row.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl font-semibold transition-all duration-200"
                        style={{ background: ACCENT, color: "#000" }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-[10px] leading-tight text-center line-clamp-2">Apri profilo</span>
                      </a>
                      <a
                        href={`/tailor?profile=${row.slug}`}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl border border-primary/40 text-primary font-semibold hover:bg-primary/8 transition-all duration-200"
                      >
                        <Target className="w-4 h-4" />
                        <span className="text-[10px] leading-tight text-center line-clamp-2">Adatta a un annuncio</span>
                      </a>
                      <PdfExportButton
                        slug={row.slug}
                        label="Scarica PDF"
                        icon={<Download className="w-4 h-4" />}
                        credits={credits}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl border border-foreground/10 font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                      />
                      <CoverLetterButton
                        slug={row.slug}
                        label="Lettera di presentazione"
                        icon={<Mail className="w-4 h-4" />}
                        credits={credits}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl border border-foreground/10 font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                      />
                    </div>
                    <div className="pt-2 border-t border-foreground/10">
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

        </div>
      )}

      {/* ── Tab: CV Adattati ──────────────────────────────────────────── */}
      {tab === "adapted" && (
        <div className="space-y-3">
          <SectionTitle>CV adattati alle offerte ({tailoredProfiles.length})</SectionTitle>
          {tailoredProfiles.length > 0 ? (
            <div className="space-y-3">
              {tailoredProfiles.map((row) => (
                <div key={row.id} className="glass-card rounded-2xl p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2.5">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                          Titolo nel CV adattato
                        </p>
                        <p className="text-sm font-semibold">{row.data.personal_info.title || row.data.personal_info.full_name}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          Creato il {new Date(row.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      {(row.data.metadata.target_role || row.data.metadata.target_company) && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                            Annuncio a cui è stato adattato
                          </p>
                          <p className="text-xs font-medium" style={{ color: ACCENT }}>
                            {row.data.metadata.target_role}
                            {row.data.metadata.target_role && row.data.metadata.target_company ? " presso " : ""}
                            {row.data.metadata.target_company}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <EditableSlug profileId={row.id} slug={row.slug} />
                  <div className="flex flex-wrap items-center gap-2">
                    <PdfExportButton
                      slug={row.slug}
                      label="PDF ↓"
                      credits={credits}
                      className="px-3 py-1.5 rounded-lg border border-foreground/10 text-xs font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                    />
                    <CoverLetterButton
                      slug={row.slug}
                      label="Lettera ↓"
                      credits={credits}
                      className="px-3 py-1.5 rounded-lg border border-foreground/10 text-xs font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                    />
                    <DeleteProfileButton
                      profileId={row.id}
                      label="Elimina"
                      confirmMessage="Sei sicuro? Questo CV adattato verrà eliminato definitivamente."
                    />
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
      )}

      {/* ── Tab: Download ──────────────────────────────────────────────── */}
      {tab === "downloads" && (
        <div className="space-y-10">
          <div className="space-y-3">
            <SectionTitle>CV scaricati ({paidDownloads.length})</SectionTitle>
            <p className="text-xs text-muted-foreground/60">
              Ogni PDF già generato puoi riscaricarlo qui gratuitamente, quante volte vuoi.
            </p>
            {paidDownloads.length > 0 ? (
              <div className="glass-card rounded-2xl divide-y divide-foreground/5">
                {paidDownloads.map((dl) => {
                  const row = profilesById.get(dl.profile_id);
                  if (!row) return null;
                  const templateName = PDF_TEMPLATES.find(t => t.id === dl.template)?.name ?? dl.template;
                  return (
                    <div key={dl.id} className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap">
                      <div>
                        <p className="text-sm font-medium">{row.slug} · {templateName}</p>
                        <p className="text-xs text-muted-foreground/50">
                          Generato il {new Date(dl.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <a
                        href={`/api/pdf/${row.slug}?template=${dl.template}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{ background: `${ACCENT}20`, color: ACCENT }}
                      >
                        Riscarica ↓
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Non hai ancora scaricato nessun PDF. Ogni PDF generato comparirà qui, riscaricabile gratis.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <SectionTitle>Lettere di presentazione scaricate ({coverLetters.length})</SectionTitle>
            <p className="text-xs text-muted-foreground/60">
              Ogni lettera già generata puoi riscaricarla qui gratuitamente, quante volte vuoi.
            </p>
            {coverLetters.length > 0 ? (
              <div className="glass-card rounded-2xl divide-y divide-foreground/5">
                {coverLetters.map((letter) => {
                  const row = profilesById.get(letter.profile_id);
                  if (!row) return null;
                  const target = row.data.metadata.target_role || row.data.metadata.target_company || "candidatura generica";
                  return (
                    <div key={letter.id} className="flex items-center justify-between gap-3 px-5 py-3 flex-wrap">
                      <div>
                        <p className="text-sm font-medium">Lettera per {target}</p>
                        <p className="text-xs text-muted-foreground/50">
                          Generata il {new Date(letter.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                        </p>
                      </div>
                      <a
                        href={`/api/cover-letter/${row.slug}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                        style={{ background: `${ACCENT}20`, color: ACCENT }}
                      >
                        Riscarica ↓
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Non hai ancora generato nessuna lettera. Ogni lettera generata comparirà qui, riscaricabile gratis.
                </p>
              </div>
            )}
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
              <div className="glass-card rounded-2xl divide-y divide-foreground/5">
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

      {/* Shown instead of navigating to /generate once MAX_CVS is reached —
          keeps the button itself always present/clickable rather than
          swapping it for disabled-looking text. */}
      {limitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setLimitModalOpen(false)}>
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLimitModalOpen(false)}
              aria-label="Chiudi"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm font-semibold mb-2">Limite di {MAX_CVS} CV raggiunto</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Per caricarne uno nuovo, elimina prima uno dei CV esistenti qui sotto.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
