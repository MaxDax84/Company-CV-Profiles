"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles } from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/i18n";
import Navigation from "@/components/navigation";
import TurnstileWidget, { type TurnstileHandle } from "@/components/turnstile-widget";
import ProfileResultPanel from "@/components/profile-result-panel";
import PdfExportButton from "@/components/pdf-export-button";
import TrustBadges from "@/components/trust-badges";

type State = "idle" | "uploading" | "done" | "error";
type CvSource = "pdf" | "url";
type JobSource = "text" | "url";

const JOB_TEXT_MIN = 200;
const ACCENT = "#6366f1"; // no template is chosen before generation, so pre-submit UI uses a fixed accent

export default function TailorPage() {
  const [cvSource, setCvSource] = useState<CvSource>("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [profileUrl, setProfileUrl] = useState("");
  const [jobSource, setJobSource] = useState<JobSource>("text");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [slug, setSlug] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileSchema | null>(null);
  const [manageToken, setManageToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  useEffect(() => {
    if (state !== "uploading") {
      setStepIndex(0);
      return;
    }
    const id = setInterval(() => setStepIndex(i => i + 1), 3000);
    return () => clearInterval(id);
  }, [state]);

  const { lang } = useLanguage();
  const t = translations[lang].tailor;

  const hasCv = cvSource === "pdf" ? !!file : profileUrl.trim().length > 0;
  const hasJob = jobSource === "text" ? jobText.trim().length >= JOB_TEXT_MIN : jobUrl.trim().length > 0;
  const canGenerate = hasCv && hasJob && privacy && !!turnstileToken && state !== "uploading";
  const needsPrivacy = hasCv && hasJob && !privacy;

  async function handleGenerate() {
    if (!canGenerate) return;
    setState("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("turnstileToken", turnstileToken!);
    formData.append("cvSource", cvSource);
    if (cvSource === "pdf" && file) formData.append("pdf", file);
    if (cvSource === "url") formData.append("profileUrl", profileUrl.trim());
    formData.append("jobSource", jobSource);
    if (jobSource === "text") formData.append("jobText", jobText.trim());
    if (jobSource === "url") formData.append("jobUrl", jobUrl.trim());

    try {
      const res = await fetch("/api/tailor-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === "JOB_FETCH_FAILED") {
          setJobSource("text");
          throw new Error(t.jobFetchFailedNote);
        }
        throw new Error(data.error ?? "Errore sconosciuto");
      }
      setSlug(data.slug);
      setProfile(data.profile);
      setManageToken(data.manageToken ?? null);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setState("error");
    } finally {
      // Turnstile tokens are single-use — always get a fresh one for the next attempt.
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  function loadFile(f: File) {
    setFile(f);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) loadFile(f);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f?.type === "application/pdf") loadFile(f);
  }

  function handleReset() {
    setState("idle");
    setSlug(null);
    setProfile(null);
    setManageToken(null);
    setFile(null);
    setProfileUrl("");
    setJobText("");
    setJobUrl("");
    setError(null);
    setPrivacy(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  const accent = profile?.metadata.primary_color ?? ACCENT;

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
      <div className={`relative z-10 w-full space-y-10 transition-[max-width] duration-300 ${state === "done" ? "max-w-3xl" : "max-w-2xl"}`}>

        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            {t.badge}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight" style={{ whiteSpace: "pre-line" }}>
            {t.title}
          </h1>
          <p className="text-muted-foreground" style={{ whiteSpace: "pre-line" }}>
            {t.subtitle}
          </p>
        </div>

        {state === "done" && slug && profile ? (
          /* ── Done state ── */
          <ProfileResultPanel
            slug={slug}
            profile={profile}
            manageToken={manageToken}
            emailStatus="idle"
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
        ) : state === "uploading" ? (
          /* ── Uploading state ── */
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
        ) : (
          /* ── Idle / error state ── */
          <>
            {/* CV source */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {t.stepCv}
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["pdf", "url"] as const).map(src => (
                  <button
                    key={src}
                    onClick={() => setCvSource(src)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-200 hover:-translate-y-0.5 ${
                      cvSource === src ? "" : "hover:border-white/25 hover:bg-white/[0.06] hover:text-white/80 hover:shadow-lg hover:shadow-black/20"
                    }`}
                    style={cvSource === src
                      ? { borderColor: `${ACCENT}70`, background: `${ACCENT}15`, color: ACCENT }
                      : { borderColor: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)" }}
                  >
                    {src === "pdf" ? t.cvSourcePdf : t.cvSourceUrl}
                  </button>
                ))}
              </div>

              {cvSource === "pdf" && (
                <div
                  onClick={() => inputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={e => e.preventDefault()}
                  className="border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300"
                  style={{ borderColor: file ? `${ACCENT}70` : `${ACCENT}35` }}
                >
                  {file ? (
                    <>
                      <p className="text-3xl mb-3">✅</p>
                      <p className="font-medium text-foreground/80">{file.name}</p>
                      <p className="text-xs text-muted-foreground/50 mt-1">{t.clickToChange}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-4xl mb-4">📄</p>
                      <p className="font-medium text-foreground/80">{t.dragHere}</p>
                      <p className="text-sm text-muted-foreground mt-1">{t.dragOr}</p>
                      <p className="text-xs text-muted-foreground/50 mt-3">{t.dragLimit}</p>
                    </>
                  )}
                  <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                </div>
              )}
              {cvSource === "pdf" && <TrustBadges />}
              {cvSource === "url" && (
                <div className="space-y-2">
                  <div
                    className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
                    style={{ borderColor: profileUrl ? `${ACCENT}60` : "rgba(255,255,255,0.08)" }}
                  >
                    <input
                      type="url"
                      value={profileUrl}
                      onChange={e => setProfileUrl(e.target.value)}
                      placeholder={t.profileUrlPlaceholder}
                      className="flex-1 bg-transparent text-sm text-foreground/80 placeholder:text-muted-foreground/30 outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground/40">{t.profileUrlHint}</p>
                </div>
              )}
            </div>

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

            {/* Bot check — only mount once there's a CV source to submit */}
            {hasCv && (
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
              {hasCv && hasJob ? t.ctaReady : t.ctaWaiting}
            </button>
            {needsPrivacy && (
              <p className="text-xs text-center -mt-3" style={{ color: "rgba(251,191,36,0.8)" }}>
                {t.needPrivacyNote}
              </p>
            )}
          </>
        )}

      </div>
      </div>
      </div>
    </div>
  );
}
