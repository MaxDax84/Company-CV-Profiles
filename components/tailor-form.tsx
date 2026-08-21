"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/i18n";
import TurnstileWidget, { type TurnstileHandle } from "@/components/turnstile-widget";
import ProfileResultPanel from "@/components/profile-result-panel";
import PdfExportButton from "@/components/pdf-export-button";
import WordExportButton from "@/components/word-export-button";
import CoverLetterButton from "@/components/cover-letter-button";
import StepProgress from "@/components/step-progress";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import ActionFeedbackPopup from "@/components/action-feedback-popup";

type State = "idle" | "uploading" | "done" | "error";
type JobSource = "text" | "url";
type Relevance = { score: number; reason: string; duplicateOf: { slug: string; createdAt: string } | null };

const JOB_TEXT_MIN = 200;
const ACCENT = "var(--primary)";
// Below this, the job posting doesn't genuinely match the CV — the tailored
// result will be honest (no invented skills/experience) but largely
// unchanged from the source, so the user should know before spending a
// credit on it.
const RELEVANCE_WARNING_THRESHOLD = 40;

// On mobile, downloading the tailored PDF/Word can navigate the browser
// away from this page entirely (iOS Safari's blob+download-attribute
// handling for PDFs is unreliable — it often opens its own PDF viewer
// instead of respecting `download`), and hitting "back" from there is a
// real page reload, not a same-tab history pop — every bit of in-memory
// React state (the "done" result) is gone. Stashing the result in
// sessionStorage keyed by slug, plus reflecting the slug in the URL via
// a plain history.pushState (no Next.js navigation, so it doesn't trigger
// a server re-fetch), lets a fresh mount after that reload restore the
// exact same "done" screen instead of resetting to the empty form.
const RESULT_STORAGE_PREFIX = "jobli_tailor_result_";

interface TailorFormProps {
  credits: number;
  hasProfile: boolean;
  sourceSlug: string | null;
  availableProfiles: { slug: string }[];
}

export default function TailorForm({ credits, hasProfile, sourceSlug, availableProfiles }: TailorFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  // "url" first/default — pasting a link is the faster path, and its
  // failure mode (can't read the page) already has a clear recovery: it
  // shows an error and auto-switches to "text" for the user (see the
  // JOB_FETCH_FAILED handling below).
  const [jobSource, setJobSource] = useState<JobSource>("url");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [slug, setSlug] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);
  // A dedicated popup instead of the generic bottom-of-form error text —
  // that text sat below the fold often enough that this specific failure
  // (common, since many job boards actively block scrapers) went unnoticed.
  const [jobFetchFailedOpen, setJobFetchFailedOpen] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);
  const [checkingRelevance, setCheckingRelevance] = useState(false);
  const [relevance, setRelevance] = useState<Relevance | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  // Restore the "done" screen after a reload that lands back on this exact
  // URL (see RESULT_STORAGE_PREFIX above) — e.g. the browser "back" button
  // after a mobile PDF viewer took over the tab. Mount-only: at the moment
  // this runs, a fresh tailoring completed in THIS session hasn't happened
  // yet, so there's nothing to conflict with.
  useEffect(() => {
    const resultSlug = searchParams.get("result");
    if (!resultSlug) return;
    const stored = sessionStorage.getItem(RESULT_STORAGE_PREFIX + resultSlug);
    if (!stored) return;
    try {
      const { code: storedCode, profile: storedProfile } = JSON.parse(stored);
      setSlug(resultSlug);
      setCode(storedCode);
      setProfile(storedProfile);
      setState("done");
    } catch {
      // Corrupted/unexpected stored value — fall through to the normal
      // empty-form state rather than throwing.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (state !== "uploading") {
      setStepIndex(0);
      return;
    }
    const id = setInterval(() => setStepIndex(i => i + 1), 3000);
    return () => clearInterval(id);
  }, [state]);

  // The URL stays /tailor across idle → uploading → done/error, but the
  // content underneath changes completely each time.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [state]);

  const { lang } = useLanguage();
  const t = translations[lang].tailor;

  const hasJob = jobSource === "text" ? jobText.trim().length >= JOB_TEXT_MIN : jobUrl.trim().length > 0;
  const canGenerate = hasJob && privacy && !!turnstileToken && state !== "uploading";
  const needsPrivacy = hasJob && !privacy;

  // Tailoring itself is free — only downloading the resulting PDF/Word costs
  // a credit (see PdfExportButton/WordExportButton). This still runs the
  // free relevance-check first, and only interrupts with a popup when
  // there's something genuinely worth flagging (a low-relevance match, or an
  // exact repeat of an already-tailored CV+job combo, see lib/profile-store.ts's
  // findDuplicateTailoredProfile) — otherwise it goes straight through.
  async function handleGenerateClick() {
    if (!canGenerate) return;
    setCheckingRelevance(true);
    let result: Relevance | null = null;
    try {
      const formData = new FormData();
      formData.append("jobSource", jobSource);
      if (sourceSlug) formData.append("sourceSlug", sourceSlug);
      if (jobSource === "text") formData.append("jobText", jobText.trim());
      if (jobSource === "url") formData.append("jobUrl", jobUrl.trim());
      const res = await fetch("/api/relevance-check", { method: "POST", body: formData });
      result = res.ok ? await res.json() : null;
    } catch {
      result = null;
    }
    setRelevance(result);
    setCheckingRelevance(false);
    const hasWarning = result && (result.duplicateOf || result.score < RELEVANCE_WARNING_THRESHOLD);
    if (hasWarning) {
      setConfirming(true);
    } else {
      handleGenerate();
    }
  }

  async function handleGenerate() {
    if (!canGenerate) return;
    setState("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("turnstileToken", turnstileToken!);
    formData.append("jobSource", jobSource);
    if (sourceSlug) formData.append("sourceSlug", sourceSlug);
    if (jobSource === "text") formData.append("jobText", jobText.trim());
    if (jobSource === "url") formData.append("jobUrl", jobUrl.trim());

    try {
      const res = await fetch("/api/tailor-resume", { method: "POST", body: formData });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(t.timeoutErrorNote);
      }
      if (!res.ok) {
        if (data.code === "JOB_FETCH_FAILED") {
          setJobSource("text");
          setJobFetchFailedOpen(true);
          setState("idle");
          return;
        }
        throw new Error(data.error ?? (lang === "en" ? "Unknown error" : "Errore sconosciuto"));
      }
      setSlug(data.slug);
      setCode(data.code);
      setProfile(data.profile);
      setState("done");
      sessionStorage.setItem(RESULT_STORAGE_PREFIX + data.slug, JSON.stringify({ code: data.code, profile: data.profile }));
      const resultUrl = new URL(window.location.href);
      resultUrl.searchParams.set("result", data.slug);
      window.history.pushState(null, "", resultUrl.toString());
      router.refresh(); // re-fetch the server-rendered credit balance
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "en" ? "Unknown error" : "Errore sconosciuto"));
      setState("error");
    } finally {
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  function handleReset() {
    if (slug) sessionStorage.removeItem(RESULT_STORAGE_PREFIX + slug);
    const resetUrl = new URL(window.location.href);
    resetUrl.searchParams.delete("result");
    window.history.pushState(null, "", resetUrl.toString());
    setState("idle");
    setSlug(null);
    setCode(null);
    setProfile(null);
    setJobText("");
    setJobUrl("");
    setError(null);
    setPrivacy(false);
    setRelevance(null);
    setPdfDownloaded(false);
  }

  const accent = profile?.metadata.primary_color ?? ACCENT;

  // The H1/subtitle follow the story as the user moves through the flow
  // (idle/error → uploading), instead of showing the same pitch copy
  // throughout — and are hidden once done, like /generate, since the result
  // panel already makes its own point by then.
  const headerTitle = state === "uploading" ? t.titleUploading : t.title;
  const headerSubtitle = state === "uploading" ? t.subtitleUploading : t.subtitle;

  return (
    <div className="relative z-10 w-full space-y-10">
      {/* Header */}
      {state !== "done" && (
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            {t.badge}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight" style={{ whiteSpace: "pre-line" }}>
            {headerTitle}
          </h1>
          <p className="text-muted-foreground" style={{ whiteSpace: "pre-line" }}>
            {headerSubtitle}
          </p>
        </div>
      )}

      {!hasProfile ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center space-y-3">
          <p className="text-sm font-semibold">{lang === "en" ? "Generate your profile first" : "Genera prima il tuo profilo"}</p>
          <p className="text-xs text-muted-foreground">
            {lang === "en" ? "You need a profile, created from your CV, before you can tailor it to a job posting." : "Per adattarlo a un annuncio serve prima un profilo, creato dal tuo CV."}
          </p>
          <a
            href="/generate"
            className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: ACCENT, color: "var(--primary-foreground)" }}
          >
            {lang === "en" ? "Upload your CV →" : "Carica il tuo CV →"}
          </a>
        </div>
      ) : null}

      {hasProfile && sourceSlug && (state === "idle" || state === "error") ? (
        availableProfiles.length > 1 ? (
          <div className="text-xs text-center text-muted-foreground/60 flex items-center justify-center gap-2 flex-wrap">
            <span>{lang === "en" ? "Tailoring:" : "Stai adattando:"}</span>
            <select
              value={sourceSlug}
              onChange={(e) => router.push(`/tailor?profile=${e.target.value}`)}
              className="font-semibold text-foreground/80 bg-transparent border border-foreground/10 rounded-lg px-2 py-1 outline-none focus:border-primary/50 cursor-pointer"
              style={{ colorScheme: "light" }}
            >
              {availableProfiles.map((p) => (
                <option key={p.slug} value={p.slug}>{p.slug}</option>
              ))}
            </select>
          </div>
        ) : (
          <p className="text-xs text-center text-muted-foreground/60">
            {lang === "en" ? "Tailoring:" : "Stai adattando:"} <span className="font-semibold text-foreground/80">{sourceSlug}</span>
          </p>
        )
      ) : null}

      {hasProfile && (state === "idle" || state === "error") ? (
        <StepProgress accent={ACCENT} steps={[{ label: lang === "en" ? "Job posting" : "Annuncio", done: hasJob }]} />
      ) : null}

      {hasProfile && state === "done" && slug && profile ? (
        <>
          {relevance && relevance.score < RELEVANCE_WARNING_THRESHOLD && (
            <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-center space-y-1">
              <p className="font-semibold text-amber-700 dark:text-amber-400">{lang === "en" ? "I did my best, honestly" : "Ho fatto del mio meglio, con onestà"}</p>
              <p className="text-xs text-muted-foreground">
                {lang === "en"
                  ? "This job posting doesn't align well with your CV, so I couldn't write skills or experience that aren't genuinely there. The result may end up very similar to your original profile."
                  : "Questo annuncio si allinea poco al tuo CV, quindi non ho potuto scrivere competenze o esperienze che non sono realmente presenti. Il risultato potrebbe essere molto simile al profilo originale."}
              </p>
            </div>
          )}
          <ProfileResultPanel
          slug={slug}
          code={code ?? undefined}
          profile={profile}
          accentColor={accent}
          labels={t}
          onReset={handleReset}
          hideWebPageActions
          hideGenerateAnother
          extraActions={
            <div className="space-y-2">
              <PdfExportButton
                slug={slug}
                label={t.downloadPdf}
                credits={credits}
                className="block w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center border border-foreground/10 bg-foreground/[0.03] text-foreground/80 transition-all hover:bg-foreground/[0.06]"
                onDownloaded={() => setPdfDownloaded(true)}
              />
              <WordExportButton
                slug={slug}
                label={lang === "en" ? "Download Word" : "Scarica Word"}
                credits={credits}
                className="block w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center border border-foreground/10 bg-foreground/[0.03] text-foreground/80 transition-all hover:bg-foreground/[0.06]"
                onDownloaded={() => setPdfDownloaded(true)}
              />
              <CoverLetterButton
                slug={slug}
                label={t.downloadCoverLetter}
                credits={credits}
                className="block w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center border border-foreground/10 bg-foreground/[0.03] text-foreground/80 transition-all hover:bg-foreground/[0.06]"
              />
              <a
                href="/account?tab=adapted"
                className="block w-full py-2.5 px-4 text-xs font-semibold text-center transition-colors"
                style={{ color: ACCENT }}
              >
                {lang === "en" ? "Go to tailored CVs →" : "Vai ai CV adattati →"}
              </a>
            </div>
          }
          beforeAfter={
            profile.personal_info.bio_original ? (
              <div className="text-left rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 space-y-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 text-center">
                  {t.beforeAfterTitle}
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 text-center">
                      {t.beforeLabel}
                    </p>
                    <p className="text-xs text-muted-foreground/60 line-through decoration-muted-foreground/30 px-3 py-4 rounded-xl border border-foreground/10 bg-foreground/[0.02] text-center">
                      {profile.personal_info.bio_original}
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center" style={{ color: accent }}>
                      {t.afterLabel}
                    </p>
                    <p
                      className="text-xs font-semibold px-3 py-4 rounded-xl text-center"
                      style={{ color: accent, background: `${accent}15`, border: `1px solid ${accent}40` }}
                    >
                      {profile.personal_info.bio}
                    </p>
                  </div>
                </div>
              </div>
            ) : undefined
          }
        />
        <ActionFeedbackPopup actionType="tailor" trigger={pdfDownloaded} />
        </>
      ) : hasProfile && state === "uploading" ? (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-12 space-y-5" style={{ boxShadow: "0 0 40px color-mix(in srgb, var(--primary) 12%, transparent)" }}>
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
          <div className="space-y-2 max-w-xs mx-auto">
            {t.generatingSteps.map((step, i) => {
              const done = i < stepIndex;
              const active = i === Math.min(stepIndex, t.generatingSteps.length - 1);
              return (
                <div key={step} className="flex items-center gap-2.5 text-sm">
                  <span
                    className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 text-[10px] border transition-colors duration-300"
                    style={{
                      borderColor: done || active ? "var(--primary)" : "var(--border)",
                      background: done ? "var(--primary)" : "transparent",
                      color: done ? "#000" : "transparent",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    className="transition-colors duration-300"
                    style={{ color: done ? "var(--primary)" : active ? "var(--foreground)" : "var(--muted-foreground)" }}
                  >
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground/50 text-center">{t.generatingNote}</p>
        </div>
      ) : hasProfile ? (
        <>
          {/* Job posting source */}
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              {t.stepJob}
            </p>
            <div className="grid grid-cols-2 gap-2">
              {(["url", "text"] as const).map(src => (
                <button
                  key={src}
                  onClick={() => setJobSource(src)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                    jobSource === src ? "" : "hover:border-foreground/25 hover:bg-foreground/[0.06] hover:text-foreground/80 hover:shadow-lg hover:shadow-foreground/20"
                  }`}
                  style={jobSource === src
                    ? { borderColor: "color-mix(in srgb, var(--primary) 44%, transparent)", background: "color-mix(in srgb, var(--primary) 8%, transparent)", color: ACCENT }
                    : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}
                >
                  {src === "text" ? t.jobSourceText : t.jobSourceUrl}
                </button>
              ))}
            </div>

            {jobSource === "text" ? (
              <textarea
                value={jobText}
                onChange={e => setJobText(e.target.value)}
                placeholder={t.jobTextPlaceholder}
                rows={6}
                className="w-full rounded-2xl border px-4 py-3 text-sm text-foreground/80 placeholder:text-muted-foreground/30 outline-none bg-transparent resize-none"
                style={{ borderColor: jobText ? "color-mix(in srgb, var(--primary) 38%, transparent)" : "var(--border)" }}
              />
            ) : (
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
                style={{ borderColor: jobUrl ? "color-mix(in srgb, var(--primary) 38%, transparent)" : "var(--border)" }}
              >
                <input
                  type="url"
                  value={jobUrl}
                  onChange={e => setJobUrl(e.target.value)}
                  placeholder={t.jobUrlPlaceholder}
                  className="flex-1 bg-transparent text-sm text-foreground/80 placeholder:text-muted-foreground/30 outline-none"
                />
              </div>
            )}
          </div>

          {/* Error */}
          {state === "error" && error && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          {/* Privacy consent */}
          <div className="space-y-2">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="relative mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  checked={privacy}
                  onChange={e => setPrivacy(e.target.checked)}
                  className="sr-only"
                />
                <div
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150"
                  style={{
                    borderColor: privacy ? "var(--primary)" : "var(--border)",
                    background: privacy ? "var(--primary)" : "transparent",
                  }}
                >
                  {privacy && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-muted-foreground leading-tight">
                {t.privacyLabel}{" "}
                <a
                  href="/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary underline underline-offset-2 hover:opacity-80"
                  onClick={e => e.stopPropagation()}
                >
                  {t.privacyLink}
                </a>
              </span>
            </label>
            <p className="text-xs text-muted-foreground/50 pl-7">{t.privacyNote}</p>
          </div>

          {/* Bot check — only mount once there's a job posting to submit */}
          {hasJob && (
            <div className="flex justify-center">
              <TurnstileWidget
                ref={turnstileRef}
                onVerify={setTurnstileToken}
                language={lang === "it" ? "it" : "en"}
              />
            </div>
          )}

          {/* Generate button */}
          <button
            onClick={handleGenerateClick}
            disabled={!canGenerate || checkingRelevance}
            className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed"
            style={canGenerate ? {
              background: ACCENT,
              color: "var(--primary-foreground)",
              boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 31%, transparent)",
            } : needsPrivacy ? {
              background: "rgba(251,191,36,0.08)",
              color: "rgba(251,191,36,0.9)",
              border: "1px solid rgba(251,191,36,0.3)",
            } : {
              background: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            {checkingRelevance
              ? (lang === "en" ? "Checking job posting relevance…" : "Verifico la pertinenza dell'annuncio…")
              : hasJob ? t.ctaReady : t.ctaWaiting}
          </button>
          {needsPrivacy && (
            <p className="text-xs text-center -mt-3" style={{ color: "rgba(251,191,36,0.8)" }}>
              {t.needPrivacyNote}
            </p>
          )}
          {confirming && (
            <CreditConfirmModal
              actionLabel={lang === "en" ? "Tailor the CV to this job posting?" : "Adattare il CV a questo annuncio?"}
              hideCost
              cost={0}
              balance={credits}
              warning={
                relevance?.duplicateOf
                  ? (lang === "en"
                      ? `You already tailored this exact CV to this exact job posting on ${new Date(relevance.duplicateOf.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}. Running it again will produce the same result.`
                      : `Hai già adattato esattamente questo CV a questo stesso annuncio il ${new Date(relevance.duplicateOf.createdAt).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}. Rifarlo produrrà lo stesso risultato.`)
                  : relevance && relevance.score < RELEVANCE_WARNING_THRESHOLD
                  ? (lang === "en"
                      ? `Estimated relevance is low (${relevance.score}/100): ${relevance.reason} The result won't invent skills or experience you don't have — it may stay very close to the original CV.`
                      : `Pertinenza stimata bassa (${relevance.score}/100): ${relevance.reason} Il risultato non inventerà competenze o esperienze che non hai — potrebbe restare molto simile al CV originale.`)
                  : undefined
              }
              warningLink={
                relevance?.duplicateOf
                  ? { href: "/account?tab=adapted", label: lang === "en" ? "Open your tailored CVs →" : "Apri i tuoi CV adattati →" }
                  : undefined
              }
              onCancel={() => setConfirming(false)}
              onConfirm={() => {
                setConfirming(false);
                handleGenerate();
              }}
            />
          )}
          {jobFetchFailedOpen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
              onClick={() => setJobFetchFailedOpen(false)}
            >
              <div
                className="relative w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <p className="text-sm text-foreground leading-relaxed mb-4">{t.jobFetchFailedNote}</p>
                <button
                  onClick={() => setJobFetchFailedOpen(false)}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm"
                  style={{ background: ACCENT, color: "var(--primary-foreground)" }}
                >
                  {lang === "en" ? "Got it" : "Ho capito"}
                </button>
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
