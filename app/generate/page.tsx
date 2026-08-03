"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Copy, Check, Share2 } from "lucide-react";
import type { TemplateStyle, ProfileSchema } from "@/lib/schema";
import { useLanguage } from "@/components/language-provider";
import { translations } from "@/lib/i18n";
import { renderPdfThumbnail } from "@/lib/pdf-thumbnail";
import Navigation from "@/components/navigation";

type State = "idle" | "uploading" | "done" | "error";

const TEMPLATES: { id: TemplateStyle; name: string; accent: string; bg: string; demoSlug: string }[] = [
  { id: "alpha", name: "Alpha", accent: "#6366f1", bg: "#030608", demoSlug: "marco-ferretti" },
  { id: "beta",  name: "Beta",  accent: "#4f46e5", bg: "#ffffff", demoSlug: "marco-ferretti-beta" },
  { id: "gamma", name: "Gamma", accent: "#10b981", bg: "#0b1f14", demoSlug: "marco-ferretti-gamma" },
  { id: "delta", name: "Delta", accent: "#c9a84c", bg: "#0a1628", demoSlug: "marco-ferretti-delta" },
];

export default function GeneratePage() {
  const [template, setTemplate] = useState<TemplateStyle>("alpha");
  const [file, setFile] = useState<File | null>(null);
  const [pdfThumbnail, setPdfThumbnail] = useState<string | null>(null);
  const [linkedin, setLinkedin] = useState("");
  const [email, setEmail] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [slug, setSlug] = useState<string | null>(null);
  const [profile, setProfile] = useState<ProfileSchema | null>(null);
  const [manageToken, setManageToken] = useState<string | null>(null);
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state !== "uploading") {
      setStepIndex(0);
      return;
    }
    const id = setInterval(() => setStepIndex(i => i + 1), 3000);
    return () => clearInterval(id);
  }, [state]);

  async function handleGenerate() {
    if (!file) return;
    setState("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("template", template);
    if (linkedin.trim()) formData.append("linkedin", linkedin.trim());

    try {
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore sconosciuto");
      setSlug(data.slug);
      setProfile(data.profile);
      setManageToken(data.manageToken ?? null);
      setState("done");

      if (email.trim() && data.manageToken) {
        setEmailStatus("sending");
        try {
          const emailRes = await fetch("/api/send-manage-email", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: email.trim(), token: data.manageToken }),
          });
          setEmailStatus(emailRes.ok ? "sent" : "error");
        } catch {
          setEmailStatus("error");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setState("error");
    }
  }

  function loadFile(f: File) {
    setFile(f);
    setPdfThumbnail(null);
    // Best-effort — the upload flow doesn't depend on this succeeding.
    renderPdfThumbnail(f).then(setPdfThumbnail).catch(() => {});
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
    setEmailStatus("idle");
    setFile(null);
    setPdfThumbnail(null);
    setLinkedin("");
    setEmail("");
    setError(null);
    setPrivacy(false);
    setCopied(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function profileUrl() {
    return typeof window !== "undefined" ? `${window.location.origin}/profile/${slug}` : "";
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(profileUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const url = profileUrl();
    if (navigator.share) {
      try {
        await navigator.share({ url, title: profile?.personal_info.full_name });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      await handleCopyLink();
    }
  }

  const { lang } = useLanguage();
  const t = translations[lang].generate;
  const selected = TEMPLATES.find(t => t.id === template)!;
  const canGenerate = !!file && privacy && state !== "uploading";

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
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {t.title}
          </h1>
          <p className="text-muted-foreground">
            {t.subtitle}
          </p>
        </div>

        {state === "done" ? (
          /* ── Done state ── */
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-5" style={{ boxShadow: "0 0 40px oklch(0.65 0.25 264 / 0.10)" }}>
            <div className="text-4xl">✅</div>
            <div>
              <p className="font-semibold text-foreground">{t.done}</p>
              <p className="text-sm text-muted-foreground mt-1">{t.doneNote}</p>
            </div>
            <p className="text-xs text-muted-foreground/50">{t.doneExpiry}</p>

            {profile?.personal_info.bio_original && profile.personal_info.bio_original !== profile.personal_info.bio && (
              <div className="text-left rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60 text-center">
                  {t.beforeAfterTitle}
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {/* PRIMA — the raw PDF, rendered client-side, never uploaded anywhere for this */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 text-center">
                      {t.beforeLabel}
                    </p>
                    <div className="w-full max-w-[260px] mx-auto rounded-xl overflow-hidden border border-white/10" style={{ filter: "grayscale(0.5) contrast(0.92) brightness(0.92)" }}>
                      {pdfThumbnail ? (
                        <img src={pdfThumbnail} alt="CV originale" className="w-full h-auto block" />
                      ) : (
                        <div className="aspect-[210/297] flex items-center justify-center bg-white/5 text-muted-foreground/30 text-xs">PDF</div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/60 line-through decoration-muted-foreground/30 px-1 text-center">
                      {profile.personal_info.bio_original}
                    </p>
                  </div>

                  {/* DOPO — the real generated page, scaled down in a live iframe (always in sync with the actual template) */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-center" style={{ color: selected.accent }}>
                      {t.afterLabel}
                    </p>
                    <div
                      className="w-full max-w-[260px] mx-auto rounded-xl overflow-hidden relative"
                      style={{ height: 368, border: `2px solid ${selected.accent}`, boxShadow: `0 0 24px ${selected.accent}35`, background: selected.bg }}
                    >
                      <div className="absolute top-0 left-0 right-0 h-6 flex items-center gap-1.5 px-2.5 z-10" style={{ background: "rgba(0,0,0,0.35)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400/70" />
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/70" />
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400/70" />
                      </div>
                      <iframe
                        src={`/profile/${slug}`}
                        title={t.afterLabel}
                        tabIndex={-1}
                        style={{
                          position: "absolute",
                          top: 24,
                          left: 0,
                          width: 1200,
                          height: 1697,
                          border: "none",
                          transform: "scale(0.21667)",
                          transformOrigin: "top left",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                    <p
                      className="text-xs font-semibold px-3 py-2 rounded-lg text-center"
                      style={{ color: selected.accent, background: `${selected.accent}15`, borderLeft: `2px solid ${selected.accent}` }}
                    >
                      {profile.personal_info.bio}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <a
              href={`/profile/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: selected.accent, color: "#000", boxShadow: `0 4px 20px ${selected.accent}50` }}
            >
              {t.openProfile}
            </a>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleCopyLink}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border border-white/10 bg-white/[0.03] text-foreground/80 transition-all hover:bg-white/[0.06]"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? t.copyLinkDone : t.copyLink}
              </button>
              <button
                onClick={handleShare}
                className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border border-white/10 bg-white/[0.03] text-foreground/80 transition-all hover:bg-white/[0.06]"
              >
                <Share2 className="w-3.5 h-3.5" />
                {t.share}
              </button>
            </div>

            {manageToken && (
              <div className="text-left rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                  {t.manageLinkTitle}
                </p>
                <p className="text-xs text-muted-foreground/60">{t.manageLinkNote}</p>
                <a
                  href={`/manage/${manageToken}`}
                  className="block text-xs break-all hover:underline"
                  style={{ color: selected.accent }}
                >
                  {typeof window !== "undefined" ? window.location.origin : ""}/manage/{manageToken}
                </a>
                {emailStatus === "sent" && (
                  <p className="text-[11px] text-muted-foreground/50">{t.emailSentNote}</p>
                )}
                {emailStatus === "error" && (
                  <p className="text-[11px] text-red-400/70">{t.emailErrorNote}</p>
                )}
              </div>
            )}

            <button
              onClick={handleReset}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              {t.generateAnother}
            </button>
          </div>
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
            {/* Upload area */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {t.stepUpload}
              </p>
              <div
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={e => e.preventDefault()}
                className="border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all duration-300"
                style={{ borderColor: file ? `${selected.accent}70` : `${selected.accent}35`, boxShadow: file ? `0 0 24px ${selected.accent}18` : "none" }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = `${selected.accent}70`;
                  el.style.boxShadow = `0 0 32px ${selected.accent}18`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement;
                  el.style.borderColor = file ? `${selected.accent}70` : `${selected.accent}35`;
                  el.style.boxShadow = file ? `0 0 24px ${selected.accent}18` : "none";
                }}
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
            </div>

            {/* LinkedIn input */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {t.stepLinkedin}
              </p>
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
                style={{ borderColor: linkedin ? `${selected.accent}60` : "rgba(255,255,255,0.08)" }}
              >
                <svg className="w-4 h-4 shrink-0 text-muted-foreground/50" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
                <input
                  type="url"
                  value={linkedin}
                  onChange={e => setLinkedin(e.target.value)}
                  placeholder={t.linkedinPlaceholder}
                  className="flex-1 bg-transparent text-sm text-foreground/80 placeholder:text-muted-foreground/30 outline-none"
                />
                {linkedin && (
                  <button
                    onClick={() => setLinkedin("")}
                    className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Email input (optional — used only to send the management link) */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {t.stepEmail}
              </p>
              <div
                className="flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all duration-200"
                style={{ borderColor: email ? `${selected.accent}60` : "rgba(255,255,255,0.08)" }}
              >
                <svg className="w-4 h-4 shrink-0 text-muted-foreground/50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16v16H4z" strokeLinejoin="round" />
                  <path d="M4 6l8 7 8-7" strokeLinejoin="round" />
                </svg>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="flex-1 bg-transparent text-sm text-foreground/80 placeholder:text-muted-foreground/30 outline-none"
                />
                {email && (
                  <button
                    onClick={() => setEmail("")}
                    className="text-muted-foreground/30 hover:text-muted-foreground/60 transition-colors text-xs"
                  >
                    ✕
                  </button>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground/40">{t.emailHint}</p>
            </div>

            {/* Template selector */}
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {t.stepTemplate}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TEMPLATES.map(tpl => (
                  <button
                    key={tpl.id}
                    onClick={() => setTemplate(tpl.id)}
                    className="group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left"
                    style={{
                      borderColor: template === tpl.id ? tpl.accent : "rgba(255,255,255,0.08)",
                      boxShadow: template === tpl.id ? `0 0 16px ${tpl.accent}40, 0 0 0 1px ${tpl.accent}` : "none",
                    }}
                  >
                    <div className="h-14" style={{ background: tpl.bg, borderBottom: `2px solid ${tpl.accent}30` }}>
                      <div className="h-full flex items-center justify-center">
                        <span className="text-xs font-bold tracking-widest" style={{ color: tpl.accent }}>
                          {tpl.name.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="p-3 bg-white/[0.03] space-y-1.5">
                      <p className="text-xs font-semibold text-foreground/80 leading-tight">{tpl.name}</p>
                      <p className="text-[10px] text-foreground/50 leading-tight">{(t.templates as Record<string, string>)[tpl.id]}</p>
                      <a
                        href={`/profile/${tpl.demoSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md transition-opacity hover:opacity-80"
                        style={{ background: `${tpl.accent}22`, color: tpl.accent, border: `1px solid ${tpl.accent}40` }}
                      >
                        Preview ↗
                      </a>
                    </div>
                    {template === tpl.id && (
                      <div
                        className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: tpl.accent, boxShadow: `0 0 8px ${tpl.accent}80` }}
                      >
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                          <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
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

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={canGenerate ? {
                background: selected.accent,
                color: "#000",
                boxShadow: `0 4px 24px ${selected.accent}50`,
              } : {
                background: "rgba(255,255,255,0.06)",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              {file ? t.ctaReady : t.ctaWaiting}
            </button>
          </>
        )}

      </div>
      </div>
      </div>
    </div>
  );
}
