"use client";

import { useState, useRef, useEffect } from "react";
import { Sparkles, Building2 } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useLanguage } from "@/components/language-provider";
import TurnstileWidget, { type TurnstileHandle } from "@/components/turnstile-widget";
import { TRANSLATE_LANGUAGES } from "@/components/translate-cv-button";
import type { InterviewPrepContent } from "@/lib/interview-prep";

type JobSource = "text" | "url";
type State = "idle" | "working" | "done" | "error";
const JOB_TEXT_MIN = 200;
const ACCENT = "var(--primary)";
const COST = 2;

export default function InterviewPrepAnonymousForm() {
  const { lang } = useLanguage();
  const [reportLanguage, setReportLanguage] = useState(lang === "en" ? "en" : "it");
  const [jobSource, setJobSource] = useState<JobSource>("url");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [privacy, setPrivacy] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [confirming, setConfirming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [content, setContent] = useState<InterviewPrepContent | null>(null);
  const [claimToken, setClaimToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(({ data }) => setIsLoggedIn(!!data.user));
  }, []);

  // Same eased-progress pattern as interview-prep-panel.tsx (the logged-in
  // version of this flow) — a bare spinner reads as stuck once the real
  // web-research call runs past a few seconds.
  useEffect(() => {
    if (state !== "working") { setProgress(0); return; }
    setProgress(8);
    const id = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.08 : p));
    }, 400);
    return () => clearInterval(id);
  }, [state]);

  const hasJob = jobSource === "text" ? jobText.trim().length >= JOB_TEXT_MIN : jobUrl.trim().length > 0;
  const canGenerate = hasJob && privacy && !!turnstileToken && state !== "working";

  async function handleGenerate() {
    if (!canGenerate) return;
    setState("working");
    setError(null);

    const formData = new FormData();
    formData.append("turnstileToken", turnstileToken!);
    formData.append("jobSource", jobSource);
    if (jobSource === "text") formData.append("jobText", jobText.trim());
    if (jobSource === "url") formData.append("jobUrl", jobUrl.trim());
    formData.append("language", reportLanguage);

    try {
      const res = await fetch("/api/interview-prep/anonymous", { method: "POST", body: formData });
      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error(lang === "en" ? "The request timed out — please try again." : "La richiesta è scaduta — riprova.");
      }
      if (!res.ok) {
        if (data.code === "JOB_FETCH_FAILED") {
          setJobSource("text");
          setError(data.error);
          setState("idle");
          return;
        }
        if (res.status >= 500) {
          // A 500 means something genuinely broke server-side — never
          // surface the raw internal error text to the visitor.
          throw new Error(lang === "en" ? "Something went wrong while researching the company. Please try again." : "Qualcosa è andato storto durante la ricerca sull'azienda. Riprova.");
        }
        throw new Error(data.error ?? (lang === "en" ? "Unknown error" : "Errore sconosciuto"));
      }
      setContent(data.content);
      setClaimToken(data.claimToken);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "en" ? "Unknown error" : "Errore sconosciuto"));
      setState("error");
    } finally {
      turnstileRef.current?.reset();
      setTurnstileToken(null);
    }
  }

  async function handleProceedLoggedIn() {
    if (!claimToken) return;
    setClaiming(true);
    setClaimError(null);
    try {
      const res = await fetch("/api/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ claimToken, kind: "interview" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? (lang === "en" ? "Unknown error" : "Errore sconosciuto"));
      window.location.href = "/account?tab=interview";
    } catch (err) {
      setClaimError(err instanceof Error ? err.message : (lang === "en" ? "Unknown error" : "Errore sconosciuto"));
      setClaiming(false);
    }
  }

  if (state === "done" && content) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="glass-card rounded-2xl p-6 space-y-4 text-left">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 shrink-0" style={{ color: ACCENT }} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {lang === "en" ? "Report ready" : "Report pronto"}
              </p>
              <p className="font-semibold">{content.company_name ?? (lang === "en" ? "Company not identified" : "Azienda non identificata")}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{content.company_summary}</p>
        </div>

        <div className="rounded-2xl border p-5 space-y-3" style={{ borderColor: "color-mix(in srgb, var(--primary) 40%, transparent)", background: "color-mix(in srgb, var(--primary) 6%, transparent)" }}>
          <p className="text-sm font-semibold" style={{ color: ACCENT }}>
            {lang === "en" ? "This is just a preview" : "Questa è solo un'anteprima"}
          </p>
          {isLoggedIn === true ? (
            <>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "en"
                  ? `Save this report to your account and download the full 1-2 page PDF (${COST} credits).`
                  : `Salva questo report nel tuo account e scarica il PDF completo di 1-2 pagine (${COST} crediti).`}
              </p>
              {claimError && <p className="text-xs text-destructive">{claimError}</p>}
              <button
                onClick={handleProceedLoggedIn}
                disabled={claiming}
                className="block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all disabled:opacity-60"
                style={{ background: ACCENT, color: "var(--primary-foreground)" }}
              >
                {claiming ? (lang === "en" ? "Saving…" : "Salvataggio…") : (lang === "en" ? "Save to my account →" : "Salva nel mio account →")}
              </button>
            </>
          ) : (
            <>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {lang === "en"
                  ? `Create a free account to save this report and download the full 1-2 page PDF (${COST} credits — new accounts start with 3 free credits).`
                  : `Crea un account gratuito per salvare questo report e scaricare il PDF completo di 1-2 pagine (${COST} crediti — i nuovi account partono con 3 crediti omaggio).`}
              </p>
              <a
                href={`/signup?claim=${claimToken}&kind=interview`}
                className="block w-full py-3 rounded-xl font-semibold text-sm text-center transition-all"
                style={{ background: ACCENT, color: "var(--primary-foreground)" }}
              >
                {lang === "en" ? "Create a free account or log in →" : "Crea account gratis o accedi →"}
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {state !== "working" && (
        <div className="text-center space-y-4 mb-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            {lang === "en" ? "Interview prep" : "Preparazione colloquio"}
          </div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
            {lang === "en" ? "Prepare for the interview" : "Prepara il colloquio"}
          </h1>
          <p className="text-muted-foreground">
            {lang === "en"
              ? "Paste the job posting — link or text. We'll research the company and hand you a report to study before you walk in."
              : "Incolla l'annuncio — link o testo. Studiamo l'azienda e ti diamo un report da leggere prima del colloquio."}
          </p>
        </div>
      )}

      {state === "working" ? (
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-12 text-center space-y-4" style={{ boxShadow: "0 0 40px color-mix(in srgb, var(--primary) 12%, transparent)" }}>
          <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">
            {lang === "en" ? "Researching the company…" : "Sto studiando l'azienda…"}
          </p>
          <div className="h-1.5 rounded-full bg-foreground/10 overflow-hidden max-w-xs mx-auto">
            <div
              className="h-full rounded-full transition-[width] duration-300 ease-out"
              style={{ width: `${progress}%`, background: "var(--primary)" }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="space-y-1.5">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
              {lang === "en" ? "Report language" : "Lingua del report"}
            </p>
            <select
              value={reportLanguage}
              onChange={(e) => setReportLanguage(e.target.value)}
              className="w-full sm:w-auto bg-foreground/[0.03] border border-foreground/10 rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/50 cursor-pointer"
              style={{ colorScheme: "light" }}
            >
              {TRANSLATE_LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>{lang === "en" ? l.labelEn : l.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(["url", "text"] as const).map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setJobSource(src)}
                className="py-2 px-3 rounded-xl text-xs font-semibold border cursor-pointer transition-all duration-200"
                style={jobSource === src
                  ? { borderColor: "color-mix(in srgb, var(--primary) 44%, transparent)", background: "color-mix(in srgb, var(--primary) 8%, transparent)", color: ACCENT }
                  : { borderColor: "var(--border)", color: "var(--muted-foreground)" }}
              >
                {src === "text" ? (lang === "en" ? "Paste text" : "Incolla il testo") : (lang === "en" ? "Paste a link" : "Incolla un link")}
              </button>
            ))}
          </div>

          {jobSource === "text" ? (
            <textarea
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder={lang === "en" ? "Paste the full job posting text here…" : "Incolla qui il testo completo dell'annuncio…"}
              rows={6}
              className="w-full rounded-2xl border px-4 py-3 text-sm text-foreground/80 placeholder:text-muted-foreground/30 outline-none bg-transparent resize-none"
              style={{ borderColor: jobText ? "color-mix(in srgb, var(--primary) 38%, transparent)" : "var(--border)" }}
            />
          ) : (
            <input
              type="url"
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://…"
              className="w-full rounded-2xl border px-4 py-3 text-sm text-foreground/80 placeholder:text-muted-foreground/30 outline-none bg-transparent"
              style={{ borderColor: jobUrl ? "color-mix(in srgb, var(--primary) 38%, transparent)" : "var(--border)" }}
            />
          )}

          {error && (
            <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative mt-0.5 shrink-0">
              <input type="checkbox" checked={privacy} onChange={(e) => setPrivacy(e.target.checked)} className="sr-only" />
              <div
                className="w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-150"
                style={{ borderColor: privacy ? "var(--primary)" : "var(--border)", background: privacy ? "var(--primary)" : "transparent" }}
              >
                {privacy && (
                  <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                    <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            </div>
            <span className="text-sm text-muted-foreground leading-tight">
              {lang === "en" ? "I accept the " : "Accetto la "}
              <a href="/privacy" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2 hover:opacity-80" onClick={(e) => e.stopPropagation()}>
                {lang === "en" ? "privacy policy" : "informativa sulla privacy"}
              </a>
            </span>
          </label>

          {hasJob && (
            <div className="flex justify-center">
              <TurnstileWidget ref={turnstileRef} onVerify={setTurnstileToken} language={lang === "it" ? "it" : "en"} />
            </div>
          )}

          <button
            onClick={() => setConfirming(true)}
            disabled={!canGenerate}
            className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed"
            style={canGenerate ? {
              background: ACCENT, color: "var(--primary-foreground)",
              boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 31%, transparent)",
            } : { background: "var(--muted)", color: "var(--muted-foreground)" }}
          >
            {lang === "en" ? "Prepare the interview" : "Prepara il colloquio"}
          </button>
        </>
      )}

      {confirming && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setConfirming(false)}>
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold">
              {lang === "en" ? "Prepare this interview?" : "Preparare questo colloquio?"}
            </p>
            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? `The report itself is free to generate. Saving it and downloading the PDF afterward will require a free account and cost ${COST} credits (new accounts start with 3 free credits).`
                : `Generare il report è gratis. Salvarlo e scaricare il PDF dopo richiederà un account gratuito e costerà ${COST} crediti (i nuovi account partono con 3 crediti omaggio).`}
            </p>
            <div className="flex gap-2 justify-center pt-1">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {lang === "en" ? "Cancel" : "Annulla"}
              </button>
              <button
                type="button"
                onClick={() => { setConfirming(false); handleGenerate(); }}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: ACCENT, color: "var(--primary-foreground)" }}
              >
                {lang === "en" ? "Confirm" : "Conferma"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
