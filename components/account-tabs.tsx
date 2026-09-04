"use client";

import { useState, useEffect } from "react";
import {
  UploadCloud, Target, Download, ExternalLink, X, Globe,
  LayoutDashboard, FileText, Wallet, Sparkles, Lightbulb, ArrowRight, MessageSquareText, Pencil,
} from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import { CREDITS_REQUEST_COOLDOWN_HOURS, type CreditLedgerEntry } from "@/lib/credits";
import type { PaidDownloadEntry } from "@/lib/paid-downloads";
import type { GeneratedCoverLetterEntry } from "@/lib/cover-letters";
import { PDF_TEMPLATES, PDF_TEMPLATES_EN, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import { computeCvScore, floorScoreAgainst } from "@/lib/cv-score";
import CoverLetterButton from "@/components/cover-letter-button";
import { TRANSLATE_LANGUAGES } from "@/components/translate-cv-button";
import DownloadMenuButton from "@/components/download-menu-button";
import TranslateMenuButton from "@/components/translate-menu-button";
import EditableName from "@/components/editable-name";
import ProfileVisibilityToggle from "@/components/profile-visibility-toggle";
import { DeleteProfileButton } from "@/components/account-actions";
import CvChat from "@/components/cv-chat";
import EditCvText from "@/components/edit-cv-text";
import InterviewPrepPanel, { type InterviewPrepListItem } from "@/components/interview-prep-panel";
import { SUPPORT_EMAIL } from "@/lib/contact";
import { useLanguage } from "@/components/language-provider";
import type { Language } from "@/lib/i18n";

// Must match MAX_PRIMARY_PROFILES_PER_USER in lib/profile-store.ts (the
// actual enforcement point, at claim time) — kept as a separate constant
// here rather than imported, since that file pulls in server-only/service-
// role code that shouldn't end up in the client bundle.
const MAX_CVS = 4;

const LEDGER_REASON_LABELS: Record<string, { it: string; en: string }> = {
  welcome: { it: "Credito di benvenuto", en: "Welcome credit" },
  welcome_promo_first10: { it: "Credito di benvenuto (promo primi 10)", en: "Welcome credit (first-10 promo)" },
  welcome_promo_next10: { it: "Credito di benvenuto (promo)", en: "Welcome credit (promo)" },
  pdf_download: { it: "Download PDF", en: "PDF download" },
  word_download: { it: "Download Word", en: "Word download" },
  tailor: { it: "Adattamento a un annuncio", en: "Job-posting tailoring" },
  cover_letter: { it: "Lettera di presentazione", en: "Cover letter" },
  translate: { it: "Traduzione CV", en: "CV translation" },
  translate_cover_letter: { it: "Traduzione lettera di presentazione", en: "Cover letter translation" },
  chat_refine: { it: "Rifinitura CV via chat AI", en: "CV refinement via AI chat" },
  interview_prep: { it: "Preparazione colloquio", en: "Interview prep" },
  interview_prep_refund: { it: "Rimborso preparazione colloquio", en: "Interview prep refund" },
  cover_letter_refund: { it: "Rimborso lettera di presentazione", en: "Cover letter refund" },
  translate_refund: { it: "Rimborso traduzione", en: "Translation refund" },
  chat_refine_refund: { it: "Rimborso rifinitura CV", en: "CV refinement refund" },
  pdf_download_refund: { it: "Rimborso download PDF", en: "PDF download refund" },
  word_download_refund: { it: "Rimborso download Word", en: "Word download refund" },
  manual_grant: { it: "Credito aggiunto manualmente", en: "Manually added credit" },
};

// Same 3-band read as the /generate score card (see lib/score-comments.ts)
// collapsed to a single traffic-light color for a compact badge — red
// clearly-below-target, amber approaching it, green at-or-above.
function scoreBadgeColor(score: number): string {
  if (score < 50) return "#ef4444";
  if (score < 75) return "#f59e0b";
  return "#22c55e";
}

// The score shown anywhere in the account (dashboard, CV list) must never
// read lower than what was shown at generation time on /generate — same
// "after never drops below before" guarantee as floorScoreAgainst enforces
// there. Without this, a later scoring-formula change (a criterion's
// deterministic recompute getting stricter) would silently show existing
// users a LOWER number than they already saw, which is exactly the
// regression this was built to prevent in the first place.
function displayedScore(profile: ProfileSchema): number {
  return floorScoreAgainst(computeCvScore(profile), profile.metadata.score_before).total;
}

// UX audit finding: the dashboard listed available actions but never
// pointed at which one to try next — same static list whether someone just
// signed up or has already tried everything. A cheap fix using only data
// already loaded here: walk through the funnel in the order that actually
// matters (a CV worth improving beats a CV worth adapting) and surface the
// first thing not yet done. Returns null once there's genuinely nothing
// left to suggest, rather than forcing a suggestion that isn't useful.
type NextAction = "improve-score" | "try-tailor" | "try-download" | "try-cover-letter";

function getNextBestAction(
  primaryProfiles: ProfileRow[],
  tailoredProfiles: ProfileRow[],
  coverLetters: GeneratedCoverLetterEntry[],
  paidDownloads: PaidDownloadEntry[]
): NextAction | null {
  if (primaryProfiles.length === 0) return null;
  const lowestScore = Math.min(...primaryProfiles.map(row => displayedScore(row.data)));
  if (lowestScore < 70) return "improve-score";
  if (tailoredProfiles.length === 0) return "try-tailor";
  if (paidDownloads.length === 0) return "try-download";
  if (coverLetters.length === 0) return "try-cover-letter";
  return null;
}

type ProfileRow = { id: string; slug: string; display_name: string; data: ProfileSchema; created_at: string; is_public?: boolean };

// Commercial sections — the ones used often — stay as visible tabs. Account
// settings (rarely touched) moved into a separate drawer, see SETTINGS_ICON
// button below, instead of competing for space in this row. "label" is the
// short tab-button text; "title" is the fuller section heading shown above
// the tab row (see AccountShell) — deliberately different for "dashboard"
// (button reads "Riepilogo", section heading reads "Dashboard").
const TABS = [
  { id: "dashboard", labelIt: "Riepilogo", labelEn: "Overview", titleIt: "Dashboard", titleEn: "Dashboard", icon: LayoutDashboard },
  { id: "cv", labelIt: "I miei CV", labelEn: "My CVs", titleIt: "I miei CV", titleEn: "My CVs", icon: FileText },
  { id: "adapted", labelIt: "CV Adattati", labelEn: "Tailored CVs", titleIt: "CV adattati alle offerte", titleEn: "CVs tailored to job postings", icon: Target },
  { id: "interview", labelIt: "Prepara il colloquio", labelEn: "Prepare interview", titleIt: "Prepara il colloquio", titleEn: "Prepare for the interview", icon: MessageSquareText },
  { id: "downloads", labelIt: "Download", labelEn: "Downloads", titleIt: "Download", titleEn: "Downloads", icon: Download },
  { id: "credits", labelIt: "Crediti", labelEn: "Credits", titleIt: "Crediti", titleEn: "Credits", icon: Wallet },
] as const;

export type TabId = (typeof TABS)[number]["id"];

export function isTabId(value: string | null): value is TabId {
  return TABS.some(t => t.id === value);
}

export function getTabTitle(tab: TabId, lang: Language): string {
  const found = TABS.find(t => t.id === tab);
  return (lang === "en" ? found?.titleEn : found?.titleIt) ?? "";
}

interface AccountTabsProps {
  userEmail: string;
  accountCode: string;
  primaryProfiles: ProfileRow[];
  tailoredProfiles: ProfileRow[];
  translatedProfiles: ProfileRow[];
  credits: number;
  ledger: CreditLedgerEntry[];
  paidDownloads: PaidDownloadEntry[];
  coverLetters: GeneratedCoverLetterEntry[];
  creditsLastRequestedAt: string | null;
  interviewPreps: InterviewPrepListItem[];
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

export default function AccountTabs({ userEmail, accountCode, primaryProfiles, tailoredProfiles, translatedProfiles, credits, ledger, paidDownloads, coverLetters, creditsLastRequestedAt, interviewPreps, tab, setTab }: AccountTabsProps) {
  const { lang } = useLanguage();
  // Compact helper for this file's many one-off strings — full ternaries
  // everywhere else in the codebase, but this component alone has ~60+
  // distinct pieces of copy, so a shorthand keeps each line readable.
  const tr = (it: string, en: string) => (lang === "en" ? en : it);
  const dateLocale = lang === "en" ? "en-US" : "it-IT";
  const [limitModalOpen, setLimitModalOpen] = useState(false);
  const [chatOpenFor, setChatOpenFor] = useState<string | null>(null);
  const [textEditOpenFor, setTextEditOpenFor] = useState<string | null>(null);
  // Set right after CvChat's finish call succeeds — closes the inline chat
  // panel and shows the confirmation toast below, pointing at the CV's
  // (possibly renamed) slug.
  const [aiUpdatedSlug, setAiUpdatedSlug] = useState<string | null>(null);
  const [creditsRequestedAt, setCreditsRequestedAt] = useState(creditsLastRequestedAt);
  const [requestingCredits, setRequestingCredits] = useState(false);
  const [requestCreditsError, setRequestCreditsError] = useState<string | null>(null);
  const creditsRequestPending = creditsRequestedAt
    ? (Date.now() - new Date(creditsRequestedAt).getTime()) / (1000 * 60 * 60) < CREDITS_REQUEST_COOLDOWN_HOURS
    : false;

  async function handleRequestCredits() {
    setRequestingCredits(true);
    setRequestCreditsError(null);
    try {
      const res = await fetch("/api/account/request-credits", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? tr("Errore, riprova.", "Something went wrong, try again."));
      setCreditsRequestedAt(data.requestedAt as string);
    } catch (err) {
      setRequestCreditsError(err instanceof Error ? err.message : tr("Errore, riprova.", "Something went wrong, try again."));
    } finally {
      setRequestingCredits(false);
    }
  }
  const profileRow = primaryProfiles[0] ?? null;
  const usedTotal = ledger.filter(e => e.amount < 0).reduce((sum, e) => sum + Math.abs(e.amount), 0);
  const profilesById = new Map([
    ...primaryProfiles.map(row => ({ ...row, kind: "primary" as const })),
    ...tailoredProfiles.map(row => ({ ...row, kind: "tailored" as const })),
    ...translatedProfiles.map(row => ({ ...row, kind: "translated" as const })),
  ].map(row => [row.id, row]));

  return (
    <div className="space-y-8">
      {/* Tab switcher — the settings-drawer trigger that used to live here
          (a gear icon) moved to the avatar dropdown in the global nav (see
          components/account-avatar-menu.tsx), reachable from every page. */}
      <div className="flex flex-wrap gap-2">
        {TABS.map(({ id, labelIt, labelEn, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer"
            style={tab === id
              ? { background: "var(--primary)", color: "var(--primary-foreground)" }
              : { background: "var(--muted)", color: "var(--muted-foreground)", border: "1px solid var(--border)" }}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{lang === "en" ? labelEn : labelIt}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Dashboard ─────────────────────────────────────────────── */}
      {tab === "dashboard" && (
        <div className="space-y-8">
          <div className="glass-card rounded-2xl p-6 sm:p-8 flex flex-wrap items-center justify-between gap-6">
            <div className="min-w-0">
              <p className="text-sm text-muted-foreground/70 mb-1">{tr("Bentornato,", "Welcome back,")}</p>
              <h2 className="font-heading text-2xl font-bold tracking-tight break-words">
                {profileRow?.data.personal_info.full_name ?? userEmail}
              </h2>
              <p className="text-sm mt-2">
                <span className="font-bold" style={{ color: "var(--primary)" }}>{credits}</span>
                <span className="text-muted-foreground">
                  {" "}{lang === "en" ? `credit${credits === 1 ? "" : "s"} available` : `credit${credits === 1 ? "o" : "i"} disponibil${credits === 1 ? "e" : "i"}`}
                </span>
              </p>
            </div>
            {primaryProfiles.length < MAX_CVS && (
              <a
                href="/generate"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                <UploadCloud className="w-4 h-4" />
                {tr("Carica un nuovo CV", "Upload a new CV")}
              </a>
            )}
          </div>

          {(() => {
            const action = getNextBestAction(primaryProfiles, tailoredProfiles, coverLetters, paidDownloads);
            if (!action) return null;
            const COPY: Record<NextAction, { title: string; body: string; ctaLabel: string; onClick: () => void }> = {
              "improve-score": {
                title: tr("Il tuo CV può migliorare ancora", "Your CV can still improve"),
                body: tr("Il punteggio di almeno uno dei tuoi CV è sotto i 70/100 — l'Assistente AI ti fa le domande giuste per alzarlo.", "At least one of your CVs is scoring under 70/100 — the AI Assistant asks the right questions to raise it."),
                ctaLabel: tr("Vai ai miei CV →", "Go to my CVs →"),
                onClick: () => setTab("cv"),
              },
              "try-tailor": {
                title: tr("Prova ad adattare il tuo CV a un annuncio", "Try tailoring your CV to a job posting"),
                body: tr("È sempre gratis: paghi solo se poi scarichi il risultato.", "It's always free — you only pay if you actually download the result."),
                ctaLabel: tr("Adatta a un annuncio →", "Tailor to a job posting →"),
                onClick: () => setTab("cv"),
              },
              "try-download": {
                title: tr("Scarica il tuo CV ottimizzato", "Download your optimized CV"),
                body: tr("Hai un CV pronto ma non l'hai ancora scaricato in PDF o Word.", "You have a ready CV but haven't downloaded it as a PDF or Word file yet."),
                ctaLabel: tr("Vai ai miei CV →", "Go to my CVs →"),
                onClick: () => setTab("cv"),
              },
              "try-cover-letter": {
                title: tr("Genera una lettera di presentazione", "Generate a cover letter"),
                body: tr("Hai già adattato o scaricato un CV — una lettera su misura completa la candidatura.", "You've already tailored or downloaded a CV — a matching cover letter completes the application."),
                ctaLabel: tr("Vai ai miei CV →", "Go to my CVs →"),
                onClick: () => setTab("cv"),
              },
            };
            const c = COPY[action];
            return (
              <div className="glass-card rounded-2xl p-6 flex items-start gap-4 border" style={{ borderColor: "var(--primary)", background: "color-mix(in srgb, var(--primary) 6%, transparent)" }}>
                <div className="w-10 h-10 shrink-0 rounded-xl bg-primary/15 flex items-center justify-center">
                  <Lightbulb className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-1">
                    {tr("Prossimo passo consigliato", "Suggested next step")}
                  </p>
                  <h3 className="font-semibold text-sm mb-1">{c.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{c.body}</p>
                  <button
                    onClick={c.onClick}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    {c.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })()}

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>{tr("CV recenti", "Recent CVs")}</SectionTitle>
              {primaryProfiles.length > 0 && (
                <button onClick={() => setTab("cv")} className="text-xs font-semibold" style={{ color: "var(--primary)" }}>
                  {tr("Vedi tutti →", "See all →")}
                </button>
              )}
            </div>
            {primaryProfiles.length > 0 ? (
              <div className="space-y-2">
                {primaryProfiles.slice(0, 3).map((row) => {
                  const score = displayedScore(row.data);
                  return (
                    <div key={row.id} className="glass-card rounded-xl p-4 flex items-center justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold break-words">{row.slug}</p>
                        <p className="text-xs text-muted-foreground/60">
                          {new Date(row.created_at).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
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
                          aria-label={tr("Apri profilo", "Open profile")}
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
                <p className="text-sm text-muted-foreground">{tr("Non hai ancora un profilo.", "You don't have a profile yet.")}</p>
                <a
                  href="/generate"
                  className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  {tr("Carica il tuo CV →", "Upload your CV →")}
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
              <SectionTitle>{tr("CV caricati", "Uploaded CVs")} ({primaryProfiles.length}/{MAX_CVS})</SectionTitle>
              {primaryProfiles.length > 0 && (
                primaryProfiles.length < MAX_CVS ? (
                  <a
                    href="/generate"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-foreground/10 hover:bg-foreground/[0.06] transition-all duration-200"
                  >
                    {tr("+ Carica un nuovo CV", "+ Upload a new CV")}
                  </a>
                ) : (
                  <button
                    onClick={() => setLimitModalOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border border-foreground/10 hover:bg-foreground/[0.06] transition-all duration-200"
                  >
                    {tr("+ Carica un nuovo CV", "+ Upload a new CV")}
                  </button>
                )
              )}
            </div>
            {primaryProfiles.length > 0 ? (
              <div className="space-y-3">
                {primaryProfiles.map((row) => (
                  <div key={row.id} className="glass-card rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <EditableName profileId={row.id} displayName={row.display_name} variant="heading" />
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {new Date(row.created_at).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                        </p>
                        <div className="mt-1.5">
                          <ProfileVisibilityToggle profileId={row.id} initialIsPublic={row.is_public ?? true} />
                        </div>
                      </div>
                      <p
                        className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                        style={{ color: scoreBadgeColor(displayedScore(row.data)), background: `${scoreBadgeColor(displayedScore(row.data))}18` }}
                      >
                        {displayedScore(row.data)}/100
                      </p>
                    </div>
                    {row.data.metadata.suggested_titles && row.data.metadata.suggested_titles.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">
                          {tr("Ruoli in linea con questo CV", "Roles that fit this CV")}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {row.data.metadata.suggested_titles.map((title) => (
                            <span
                              key={title}
                              className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-foreground/[0.04] text-foreground/70 border border-foreground/10"
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
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span className="text-[10px] leading-tight text-center line-clamp-2">{tr("Apri profilo", "Open profile")}</span>
                      </a>
                      <button
                        type="button"
                        onClick={() => setChatOpenFor(chatOpenFor === row.id ? null : row.id)}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl border border-foreground/10 font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span className="text-[10px] leading-tight text-center line-clamp-2">{tr("Migliora CV con l'AI", "Improve CV with AI")}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setTextEditOpenFor(textEditOpenFor === row.id ? null : row.id)}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl border border-foreground/10 font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                      >
                        <Pencil className="w-4 h-4" />
                        <span className="text-[10px] leading-tight text-center line-clamp-2">{tr("Modifica testi", "Edit text")}</span>
                      </button>
                      <a
                        href={`/tailor?profile=${row.slug}`}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl border border-foreground/10 font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                      >
                        <Target className="w-4 h-4" />
                        <span className="text-[10px] leading-tight text-center line-clamp-2">{tr("Adatta a un annuncio", "Tailor to a job posting")}</span>
                      </a>
                      <DownloadMenuButton
                        slug={row.slug}
                        label={tr("Download CV/LP", "Download CV/CL")}
                        icon={<Download className="w-4 h-4" />}
                        credits={credits}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl border border-foreground/10 font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                      />
                      <TranslateMenuButton
                        slug={row.slug}
                        label={tr("Traduzione CV/LP", "Translate CV/CL")}
                        icon={<Globe className="w-4 h-4" />}
                        credits={credits}
                        onGoToDownloads={() => setTab("downloads")}
                        className="flex flex-col items-center justify-center gap-1 w-20 h-16 px-2 rounded-xl border border-foreground/10 font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                      />
                    </div>
                    {chatOpenFor === row.id && (
                      <div className="pt-2 border-t border-foreground/10">
                        <CvChat
                          slug={row.slug}
                          credits={credits}
                          onFinished={(newSlug) => { setChatOpenFor(null); setAiUpdatedSlug(newSlug); }}
                        />
                      </div>
                    )}
                    {textEditOpenFor === row.id && (
                      <div className="pt-2 border-t border-foreground/10">
                        <EditCvText profileId={row.id} profile={row.data} />
                      </div>
                    )}
                    <div className="pt-2 border-t border-foreground/10">
                      <DeleteProfileButton
                        profileId={row.id}
                        label={tr("Elimina profilo", "Delete profile")}
                        confirmMessage={tr(
                          "Sei sicuro? Il profilo e il suo link smetteranno di funzionare subito. Anche i CV adattati collegati resteranno, ma senza un'origine.",
                          "Are you sure? The profile and its link will stop working immediately. Any tailored CVs linked to it will remain, but without a source."
                        )}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center space-y-3">
                <p className="text-sm text-muted-foreground">{tr("Non hai ancora un profilo.", "You don't have a profile yet.")}</p>
                <a
                  href="/generate"
                  className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  {tr("Carica il tuo CV →", "Upload your CV →")}
                </a>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ── Tab: CV Adattati ──────────────────────────────────────────── */}
      {tab === "adapted" && (
        <div className="space-y-3">
          <SectionTitle>{tr("CV adattati alle offerte", "CVs tailored to job postings")} ({tailoredProfiles.length})</SectionTitle>
          {tailoredProfiles.length > 0 ? (
            <div className="space-y-3">
              {tailoredProfiles.map((row) => (
                <div key={row.id} className="glass-card rounded-2xl p-5 space-y-3">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2.5">
                      {(row.data.metadata.target_role || row.data.metadata.target_company) && (
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                            {tr("Annuncio a cui è stato adattato", "Job posting it was tailored to")}
                          </p>
                          <p className="text-xs font-medium" style={{ color: "var(--primary)" }}>
                            {row.data.metadata.target_role}
                            {row.data.metadata.target_role && row.data.metadata.target_company ? tr(" presso ", " at ") : ""}
                            {row.data.metadata.target_company}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
                          {tr("Titolo nel CV adattato", "Title in the tailored CV")}
                        </p>
                        <p className="text-sm font-semibold">{row.data.personal_info.title || row.data.personal_info.full_name}</p>
                        <p className="text-xs text-muted-foreground/60 mt-0.5">
                          {tr("Creato il", "Created on")} {new Date(row.created_at).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <EditableName profileId={row.id} displayName={row.display_name} />
                  <div className="flex flex-wrap items-center gap-2">
                    <DownloadMenuButton
                      slug={row.slug}
                      label={tr("Download", "Download")}
                      credits={credits}
                      className="px-3 py-1.5 rounded-lg border border-foreground/10 text-xs font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                    />
                    <CoverLetterButton
                      slug={row.slug}
                      label={tr("Lettera ↓", "Letter ↓")}
                      credits={credits}
                      className="px-3 py-1.5 rounded-lg border border-foreground/10 text-xs font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
                    />
                    <DeleteProfileButton
                      profileId={row.id}
                      label={tr("Elimina", "Delete")}
                      confirmMessage={tr("Sei sicuro? Questo CV adattato verrà eliminato definitivamente.", "Are you sure? This tailored CV will be permanently deleted.")}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-sm text-muted-foreground">
                {tr(
                  "Nessun CV adattato ancora. Ogni volta che adatti il tuo CV a un annuncio, comparirà qui.",
                  "No tailored CVs yet. Every time you tailor your CV to a job posting, it'll show up here."
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tab: Download ──────────────────────────────────────────────── */}
      {tab === "downloads" && (
        <div className="space-y-10">
          <div className="space-y-3">
            <SectionTitle>{tr("CV scaricati", "Downloaded CVs")} ({paidDownloads.length})</SectionTitle>
            <p className="text-xs text-muted-foreground/60">
              {tr("Ogni PDF già generato puoi riscaricarlo qui gratuitamente, quante volte vuoi.", "Any PDF you've already generated can be re-downloaded here for free, as many times as you like.")}
            </p>
            {paidDownloads.length > 0 ? (
              <div className="space-y-2.5">
                {paidDownloads.map((dl) => {
                  const row = profilesById.get(dl.profile_id);
                  if (!row) return null;
                  const templateName = dl.template === "docx"
                    ? "Word (.docx)"
                    : (lang === "en" ? PDF_TEMPLATES_EN[dl.template as PdfTemplate]?.name : PDF_TEMPLATES.find(t => t.id === dl.template)?.name) ?? dl.template;
                  const langEntry = row.kind === "translated" ? TRANSLATE_LANGUAGES.find(l => l.code === row.data.metadata.language) : null;
                  const languageLabel = langEntry ? (lang === "en" ? langEntry.labelEn : langEntry.label) : (row.kind === "translated" ? row.data.metadata.language : null);
                  return (
                    <div key={dl.id} className="glass-card rounded-xl flex items-center justify-between gap-3 px-4 py-3 flex-col sm:flex-row items-stretch sm:items-center">
                      <div className="min-w-0">
                        <p className="text-sm font-medium break-words">
                          {row.display_name}{languageLabel ? ` · ${tr("Tradotto in", "Translated to")} ${languageLabel}` : ""} · {templateName}
                        </p>
                        <p className="text-xs text-muted-foreground/50">
                          {tr("Generato il", "Generated on")} {new Date(dl.created_at).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                        </p>
                      </div>
                      <a
                        href={dl.template === "docx" ? `/api/cv-word/${row.slug}` : `/api/pdf/${row.slug}?template=${dl.template}`}
                        className="shrink-0 text-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-foreground/10 hover:bg-foreground/[0.06] transition-all duration-200"
                      >
                        {tr("Apri ↓", "Open ↓")}
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {tr("Non hai ancora scaricato nessun PDF. Ogni PDF generato comparirà qui, riscaricabile gratis.", "You haven't downloaded any PDF yet. Every PDF you generate will show up here, free to re-download.")}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <SectionTitle>{tr("Lettere di presentazione scaricate", "Downloaded cover letters")} ({coverLetters.length})</SectionTitle>
            <p className="text-xs text-muted-foreground/60">
              {tr("Ogni lettera già generata puoi riscaricarla qui gratuitamente, quante volte vuoi.", "Any letter you've already generated can be re-downloaded here for free, as many times as you like.")}
            </p>
            {coverLetters.length > 0 ? (
              <div className="space-y-2.5">
                {coverLetters.map((letter) => {
                  const row = profilesById.get(letter.profile_id);
                  if (!row) return null;
                  const isTranslated = letter.language !== row.data.metadata.language;
                  const letterLangEntry = isTranslated ? TRANSLATE_LANGUAGES.find(l => l.code === letter.language) : null;
                  const languageLabel = isTranslated
                    ? (letterLangEntry ? (lang === "en" ? letterLangEntry.labelEn : letterLangEntry.label) : letter.language)
                    : null;
                  return (
                    <div key={letter.id} className="glass-card rounded-xl flex items-center justify-between gap-3 px-4 py-3 flex-col sm:flex-row items-stretch sm:items-center">
                      <div className="min-w-0">
                        <p className="text-sm font-medium break-words">
                          {tr("Lettera per", "Letter for")} {row.display_name}{languageLabel ? ` · ${tr("Tradotta in", "Translated to")} ${languageLabel}` : ""}
                        </p>
                        <p className="text-xs text-muted-foreground/50">
                          {tr("Generata il", "Generated on")} {new Date(letter.created_at).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                        </p>
                      </div>
                      <a
                        href={`/api/cover-letter/${row.slug}?language=${letter.language}`}
                        className="shrink-0 text-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-foreground/10 hover:bg-foreground/[0.06] transition-all duration-200"
                      >
                        {tr("Apri ↓", "Open ↓")}
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {tr("Non hai ancora generato nessuna lettera. Ogni lettera generata comparirà qui, riscaricabile gratis.", "You haven't generated any letter yet. Every letter you generate will show up here, free to re-download.")}
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
              <p className="font-heading text-3xl font-bold" style={{ color: "var(--primary)" }}>{credits}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{tr("disponibili", "available")}</p>
            </div>
            <div className="glass-card rounded-2xl p-6">
              <p className="font-heading text-3xl font-bold text-foreground/80">{usedTotal}</p>
              <p className="text-xs text-muted-foreground/60 mt-1">{tr("usati finora", "used so far")}</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {tr(
              "Utilizzi 1 credito per sbloccare per la prima volta un PDF, un documento Word, una lettera o una traduzione. Adattare il CV a un annuncio è sempre gratuito. Da quel momento, potrai consultare i tuoi documenti o riscaricarli dalla sezione Download in qualsiasi momento, senza consumare altri crediti.",
              "You spend 1 credit to unlock a PDF, a Word document, a letter, or a translation for the first time. Tailoring your CV to a job posting is always free. From then on, you can view or re-download it from the Download section any time, at no extra cost."
            )}
          </p>

          <div className="space-y-3">
            <SectionTitle>{tr("Ricarica crediti", "Recharge credits")}</SectionTitle>
            <div className="glass-card rounded-2xl p-6 space-y-3">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {tr(
                  "L'acquisto diretto di pacchetti di crediti o di un piano mensile è in arrivo. Per ora, puoi richiedere 10 crediti extra con un click: verifichiamo la richiesta a mano e te li accreditiamo.",
                  "Buying credit packs or a monthly plan directly is coming soon. For now, you can request 10 extra credits with one click — we review it by hand and add them to your balance."
                )}
              </p>
              {creditsRequestPending ? (
                <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
                  {tr(
                    "Richiesta inviata — la verifichiamo a breve e ti accreditiamo i crediti.",
                    "Request sent — we'll review it shortly and add the credits."
                  )}
                </p>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleRequestCredits}
                    disabled={requestingCredits}
                    className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    {requestingCredits
                      ? tr("Invio richiesta…", "Sending request…")
                      : tr("Richiedi 10 crediti extra", "Request 10 extra credits")}
                  </button>
                  {requestCreditsError && (
                    <p className="text-xs text-red-500">{requestCreditsError}</p>
                  )}
                </>
              )}
              <p className="text-xs text-muted-foreground/60">
                {tr("Serve altro? Scrivici a ", "Need something else? Email us at ")}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-foreground">{SUPPORT_EMAIL}</a>.
              </p>
            </div>
          </div>

          {ledger.length > 0 && (
            <div className="space-y-3">
              <SectionTitle>{tr("Storico", "History")}</SectionTitle>
              <div className="glass-card rounded-2xl divide-y divide-foreground/5">
                {ledger.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm">{(lang === "en" ? LEDGER_REASON_LABELS[entry.reason]?.en : LEDGER_REASON_LABELS[entry.reason]?.it) ?? entry.reason}</p>
                      {entry.detail && (
                        <p className="text-xs text-muted-foreground/70">{entry.detail}</p>
                      )}
                      <p className="text-xs text-muted-foreground/50">
                        {new Date(entry.created_at).toLocaleDateString(dateLocale, { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
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

      {/* ── Tab: Prepara il colloquio ─────────────────────────────────── */}
      {tab === "interview" && (
        <InterviewPrepPanel credits={credits} reports={interviewPreps} />
      )}

      {/* Shown instead of navigating to /generate once MAX_CVS is reached —
          keeps the button itself always present/clickable rather than
          swapping it for disabled-looking text. */}
      {limitModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in" onClick={() => setLimitModalOpen(false)}>
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setLimitModalOpen(false)}
              aria-label={tr("Chiudi", "Close")}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-foreground/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <p className="text-sm font-semibold mb-2">{tr(`Limite di ${MAX_CVS} CV raggiunto`, `${MAX_CVS}-CV limit reached`)}</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tr("Per caricarne uno nuovo, elimina prima uno dei CV esistenti qui sotto.", "To upload a new one, first delete one of the existing CVs below.")}
            </p>
          </div>
        </div>
      )}

      {aiUpdatedSlug && (
        <AiUpdatedToast
          href={`/${accountCode}/${aiUpdatedSlug}`}
          onClose={() => setAiUpdatedSlug(null)}
          tr={tr}
        />
      )}
    </div>
  );
}

// Fire-and-forget confirmation after CvChat's finish call succeeds — same
// bottom-right card treatment as ActionFeedbackPopup, but a plain
// confirmation rather than a rating prompt, so it's its own small component
// instead of overloading that one with a second, unrelated purpose.
function AiUpdatedToast({ href, onClose, tr }: { href: string; onClose: () => void; tr: (it: string, en: string) => string }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 8000);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div
      className="fixed z-40 bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-80 rounded-2xl border p-4 space-y-3 animate-fade-in"
      style={{ background: "var(--background)", borderColor: "var(--border)", boxShadow: "0 12px 32px rgba(0,0,0,0.35)" }}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={tr("Chiudi", "Close")}
        className="absolute top-3 right-3 text-muted-foreground/50 hover:text-foreground transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
      <div className="flex items-start gap-2.5 pr-4">
        <Sparkles className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--primary)" }} />
        <p className="text-sm font-medium">
          {tr(
            "Ottimo, abbiamo aggiornato il tuo CV — puoi controllare aprendo il tuo profilo.",
            "Great — we've updated your CV. You can check it by opening your profile."
          )}
        </p>
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full text-center py-2 rounded-lg text-xs font-semibold"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        {tr("Apri profilo →", "Open profile →")}
      </a>
    </div>
  );
}
