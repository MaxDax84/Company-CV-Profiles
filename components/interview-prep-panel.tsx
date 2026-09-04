"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Building2 } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { TRANSLATE_LANGUAGES } from "@/components/translate-cv-button";
import { triggerDownload } from "@/lib/trigger-download";

type JobSource = "text" | "url";
const JOB_TEXT_MIN = 200;
const ACCENT = "var(--primary)";
const COST = 2;

export interface InterviewPrepListItem {
  slug: string;
  company_name: string | null;
  content: { role_title: string | null };
  created_at: string;
}

interface InterviewPrepPanelProps {
  credits: number;
  reports: InterviewPrepListItem[];
}

export default function InterviewPrepPanel({ credits, reports }: InterviewPrepPanelProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const [reportLanguage, setReportLanguage] = useState(lang === "en" ? "en" : "it");
  const [jobSource, setJobSource] = useState<JobSource>("url");
  const [jobText, setJobText] = useState("");
  const [jobUrl, setJobUrl] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [working, setWorking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [duplicate, setDuplicate] = useState<{ slug: string; createdAt: string } | null>(null);
  const [redownloadingSlug, setRedownloadingSlug] = useState<string | null>(null);

  // Eases toward ~90% while the real research call is in flight (real web
  // searches, no granular progress available) — jumps to 100% right before
  // the overlay is dismissed, same pattern as signup-form.tsx's account
  // creation bar. A bare spinner alone starts to read as "stuck" past a few
  // seconds on a call that can genuinely take 20-40s.
  useEffect(() => {
    if (!working) { setProgress(0); return; }
    setProgress(8);
    const id = setInterval(() => {
      setProgress((p) => (p < 90 ? p + (90 - p) * 0.08 : p));
    }, 400);
    return () => clearInterval(id);
  }, [working]);

  const hasJob = jobSource === "text" ? jobText.trim().length >= JOB_TEXT_MIN : jobUrl.trim().length > 0;

  async function submit(forceRegenerate: boolean) {
    setWorking(true);
    setError(null);
    setDuplicate(null);
    try {
      const res = await fetch("/api/interview-prep", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobSource,
          jobText: jobSource === "text" ? jobText.trim() : undefined,
          jobUrl: jobSource === "url" ? jobUrl.trim() : undefined,
          language: reportLanguage,
          forceRegenerate,
        }),
      });
      const data = await res.json().catch(() => null);
      if (res.status === 409 && data?.duplicateOf) {
        setDuplicate(data.duplicateOf);
        setWorking(false);
        return;
      }
      if (!res.ok) {
        if (data?.code === "JOB_FETCH_FAILED") {
          setJobSource("text");
          setError(data.error);
        } else if (res.status >= 500) {
          // A 500 here means something genuinely unexpected broke server-side
          // (a real bug, not a validation/credits message written to be
          // shown to a user) — never surface the raw internal error text.
          throw new Error(lang === "en" ? "Something went wrong while researching the company. Please try again." : "Qualcosa è andato storto durante la ricerca sull'azienda. Riprova.");
        } else {
          throw new Error(data?.error ?? (lang === "en" ? "Unknown error" : "Errore sconosciuto"));
        }
        setWorking(false);
        return;
      }
      await triggerDownload(`/api/interview-prep/${data.slug}`);
      setJobText("");
      setJobUrl("");
      router.refresh(); // re-fetch credit balance + the reports list below
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "en" ? "Unknown error" : "Errore sconosciuto"));
    }
    setWorking(false);
  }

  async function redownload(slug: string) {
    setRedownloadingSlug(slug);
    try {
      await triggerDownload(`/api/interview-prep/${slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : (lang === "en" ? "Download failed, try again." : "Download fallito, riprova."));
    }
    setRedownloadingSlug(null);
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h2 className="font-heading text-2xl font-bold tracking-tight">
          {lang === "en" ? "Prepare for the interview" : "Prepara il colloquio"}
        </h2>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto">
          {lang === "en"
            ? "Paste a job posting (link or text) and get a 1-2 page PDF with what to know before you walk in: the company, its market, culture, recent news, and the key points from the posting itself — with sources."
            : "Incolla un annuncio (link o testo) e ottieni un PDF di 1-2 pagine con ciò che ti serve sapere prima del colloquio: l'azienda, il suo mercato, la cultura, le novità recenti e i punti chiave dell'annuncio — con le fonti."}
        </p>
      </div>

      <div className="max-w-xl mx-auto space-y-4">
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
            placeholder={lang === "en" ? "https://…" : "https://…"}
            className="w-full rounded-2xl border px-4 py-3 text-sm text-foreground/80 placeholder:text-muted-foreground/30 outline-none bg-transparent"
            style={{ borderColor: jobUrl ? "color-mix(in srgb, var(--primary) 38%, transparent)" : "var(--border)" }}
          />
        )}

        {error && (
          <div className="rounded-2xl bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive text-center">
            {error}
          </div>
        )}

        {duplicate && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4 text-sm text-center space-y-2">
            <p className="text-amber-700 dark:text-amber-400">
              {lang === "en"
                ? `You already prepared this exact job posting on ${new Date(duplicate.createdAt).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}.`
                : `Hai già preparato questo stesso annuncio il ${new Date(duplicate.createdAt).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}.`}
            </p>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => redownload(duplicate.slug)}
                className="px-4 py-2 rounded-lg text-xs font-semibold border border-foreground/10 hover:bg-foreground/[0.06]"
              >
                {lang === "en" ? "Download it again (free)" : "Riscaricalo (gratis)"}
              </button>
              <button
                type="button"
                onClick={() => { setDuplicate(null); setConfirming(true); }}
                className="px-4 py-2 rounded-lg text-xs font-semibold"
                style={{ background: ACCENT, color: "var(--primary-foreground)" }}
              >
                {lang === "en" ? `Regenerate (${COST} credits)` : `Rigenera (${COST} crediti)`}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => setConfirming(true)}
          disabled={!hasJob || working}
          className="w-full py-4 rounded-2xl font-semibold text-sm transition-all duration-200 disabled:cursor-not-allowed"
          style={hasJob && !working ? {
            background: ACCENT, color: "var(--primary-foreground)",
            boxShadow: "0 4px 24px color-mix(in srgb, var(--primary) 31%, transparent)",
          } : { background: "var(--muted)", color: "var(--muted-foreground)" }}
        >
          {lang === "en" ? "Prepare the interview" : "Prepara il colloquio"}
        </button>
      </div>

      {reports.length > 0 && (
        <div className="max-w-xl mx-auto space-y-2">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            {lang === "en" ? "Your reports" : "I tuoi colloqui preparati"}
          </p>
          <div className="space-y-2">
            {reports.map((r) => (
              <div key={r.slug} className="flex items-center justify-between gap-3 rounded-xl border border-foreground/10 px-4 py-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Building2 className="w-4 h-4 shrink-0 text-muted-foreground/60" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">
                      {r.company_name ?? (lang === "en" ? "Untitled report" : "Report senza nome")}
                      {r.content.role_title ? ` · ${r.content.role_title}` : ""}
                    </p>
                    <p className="text-[11px] text-muted-foreground/60">
                      {new Date(r.created_at).toLocaleDateString(lang === "en" ? "en-US" : "it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => redownload(r.slug)}
                  disabled={redownloadingSlug === r.slug}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold border border-foreground/10 hover:bg-foreground/[0.06] transition-colors"
                >
                  {lang === "en" ? "Download ↓" : "Scarica ↓"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {confirming && (
        <CreditConfirmModal
          actionLabel={lang === "en" ? "Prepare this interview?" : "Preparare questo colloquio?"}
          cost={COST}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={() => { setConfirming(false); submit(false); }}
        />
      )}
      {working && (
        <DownloadLoadingOverlay
          label={lang === "en" ? "Researching the company…" : "Sto studiando l'azienda…"}
          progress={progress}
        />
      )}
    </div>
  );
}
