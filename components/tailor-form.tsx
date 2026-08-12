"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/i18n";
import TurnstileWidget, { type TurnstileHandle } from "@/components/turnstile-widget";
import ProfileResultPanel from "@/components/profile-result-panel";
import PdfExportButton from "@/components/pdf-export-button";
import StepProgress from "@/components/step-progress";

type State = "idle" | "uploading" | "done" | "error";
type JobSource = "text" | "url";

const JOB_TEXT_MIN = 200;
const ACCENT = "#6366f1";

interface TailorFormProps {
  credits: number;
  hasProfile: boolean;
  sourceSlug: string | null;
}

export default function TailorForm({ credits, hasProfile, sourceSlug }: TailorFormProps) {
  const router = useRouter();
  const [jobSource, setJobSource] = useState<JobSource>("text");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [slug, setSlug] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileSchema | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

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
  const hasCredits = credits > 0;
  const canGenerate = hasJob && hasCredits && privacy && !!turnstileToken && state !== "uploading";
  const needsPrivacy = hasJob && hasCredits && !privacy;

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
          throw new Error(t.jobFetchFailedNote);
        }
        throw new Error(data.error ?? "Errore sconosciuto");
      }
      setSlug(data.slug);
      setCode(data.code);
      setProfile(data.profile);
      setState("done");
      router.refresh(); // re-fetch the server-rendered credit balance
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setState("error");
    } finally {
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  function handleReset() {
    setState("idle");
    setSlug(null);
    setCode(null);
    setProfile(null);
    setJobText("");
    setJobUrl("");
    setError(null);
    setPrivacy(false);
  }

  const accent = profile?.metadata.primary_color ?? ACCENT;

  return (
    <div className="relative z-10 w-full space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium">
          <Sparkles className="w-3 h-3" />
          {t.badge}
        </div>
        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight" style={{ whiteSpace: "pre-line" }}>
          {t.title}
        </h1>
        <p className="text-muted-foreground" style={{ whiteSpace: "pre-line" }}>
          {t.subtitle}
        </p>
      </div>

      {!hasProfile ? (
        <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center space-y-3">
          <p className="text-sm font-semibold">Genera prima il tuo profilo</p>
          <p className="text-xs text-muted-foreground">
            Per adattarlo a un annuncio serve prima un profilo, creato dal tuo CV.
          </p>
          <a
            href="/generate"
            className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: ACCENT, color: "#000" }}
          >
            Carica il tuo CV →
          </a>
        </div>
      ) : !hasCredits && state !== "done" ? (
        <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-5 text-center space-y-1">
          <p className="text-sm font-semibold text-amber-300">Crediti esauriti</p>
          <p className="text-xs text-muted-foreground">
            Adattare il CV a un annuncio costa 1 credito. Vai al tuo{" "}
            <a href="/account" className="underline hover:text-foreground">account</a> o scrivici per aggiungerne.
          </p>
        </div>
      ) : null}

      {hasProfile && sourceSlug && (state === "idle" || state === "error") ? (
        <p className="text-xs text-center text-muted-foreground/60">
          Stai adattando: <span className="font-semibold text-foreground/80">{sourceSlug}</span>
        </p>
      ) : null}

      {hasProfile && (state === "idle" || state === "error") ? (
        <StepProgress accent={ACCENT} steps={[{ label: "Annuncio", done: hasJob }]} />
      ) : null}

      {hasProfile && state === "done" && slug && profile ? (
        <ProfileResultPanel
          slug={slug}
          code={code ?? undefined}
          profile={profile}
          accentColor={accent}
          labels={t}
          onReset={handleReset}
          extraActions={
            <PdfExportButton
              slug={slug}
              label={t.downloadPdf}
              className="block w-full py-2.5 px-4 rounded-xl text-xs font-semibold text-center border border-white/10 bg-white/[0.03] text-foreground/80 transition-all hover:bg-white/[0.06]"
            />
          }
          beforeAfter={
            profile.personal_info.bio_original ? (
              <div className="text-left rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 text-center">
                  {t.beforeAfterTitle}
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 text-center">
                      {t.beforeLabel}
                    </p>
                    <p className="text-xs text-muted-foreground/60 line-through decoration-muted-foreground/30 px-3 py-4 rounded-xl border border-white/10 bg-white/[0.02] text-center">
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
      ) : hasProfile && state === "uploading" ? (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-12 space-y-5" style={{ boxShadow: "0 0 40px oklch(0.65 0.25 264 / 0.08)" }}>
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
                      borderColor: done || active ? "var(--primary)" : "rgba(255,255,255,0.15)",
                      background: done ? "var(--primary)" : "transparent",
                      color: done ? "#000" : "transparent",
                    }}
                  >
                    ✓
                  </span>
                  <span
                    className="transition-colors duration-300"
                    style={{ color: done ? "var(--primary)" : active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.35)" }}
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
              {(["text", "url"] as const).map(src => (
                <button
                  key={src}
                  onClick={() => setJobSource(src)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                    jobSource === src ? "" : "hover:border-white/25 hover:bg-white/[0.06] hover:text-white/80 hover:shadow-lg hover:shadow-black/20"
                  }`}
                  style={jobSource === src
                    ? { borderColor: `${ACCENT}70`, background: `${ACCENT}15`, color: ACCENT }
                    : { borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
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
                style={{ borderColor: jobText ? `${ACCENT}60` : "rgba(255,255,255,0.08)" }}
              />
            ) : (
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
                style={{ borderColor: jobUrl ? `${ACCENT}60` : "rgba(255,255,255,0.08)" }}
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
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 text-center">
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
                    borderColor: privacy ? "var(--primary)" : "rgba(255,255,255,0.2)",
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
          {hasJob && hasCredits && (
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
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed"
            style={canGenerate ? {
              background: ACCENT,
              color: "#000",
              boxShadow: `0 4px 24px ${ACCENT}50`,
            } : needsPrivacy ? {
              background: "rgba(251,191,36,0.08)",
              color: "rgba(251,191,36,0.9)",
              border: "1px solid rgba(251,191,36,0.3)",
            } : {
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {!hasCredits ? "Crediti insufficienti" : hasJob ? t.ctaReady : t.ctaWaiting}
          </button>
          {needsPrivacy && (
            <p className="text-xs text-center -mt-3" style={{ color: "rgba(251,191,36,0.8)" }}>
              {t.needPrivacyNote}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
