"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { PDF_TEMPLATES, PDF_TEMPLATES_EN, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";
import { useLanguage } from "@/components/language-provider";

interface DownloadMenuButtonProps {
  slug: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  credits: number;
  onDownloaded?: () => void;
}

type Step = "closed" | "kind" | "format" | "template" | "compact" | "compact-result";
type Kind = "cv" | "letter";
type Format = "pdf" | "word";

// Consolidates PdfExportButton (3 templates), WordExportButton (single
// layout, see its own comment for why), and CoverLetterButton behind one
// "Download" entry point — first asks CV or cover letter; CV continues into
// the format/template steps below, cover letter skips straight to the
// confirm step since it has no format choice (single PDF layout, see
// components/cover-letter-button.tsx, still used as-is in the "CV Adattati"
// tab).
export default function DownloadMenuButton({ slug, label, icon, className, credits, onDownloaded }: DownloadMenuButtonProps) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<Step>("closed");
  const [kind, setKind] = useState<Kind>("cv");
  const [format, setFormat] = useState<Format>("pdf");
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);
  const [confirming, setConfirming] = useState(false);
  const [confirmingCompact, setConfirmingCompact] = useState(false);
  const [checkingPages, setCheckingPages] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paidTemplates, setPaidTemplates] = useState<string[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Same "already paid" status endpoint used by PdfExportButton/WordExportButton
  // — "docx" is the Word slot, template ids are the PDF slots. Cover letters
  // have their own, separate server-side caching (see /api/cover-letter),
  // so this fetch is irrelevant to that branch.
  useEffect(() => {
    if (step === "closed" || paidTemplates !== null) return;
    fetch(`/api/pdf/${slug}/status`)
      .then((res) => (res.ok ? res.json() : { paidTemplates: [] }))
      .then((data) => setPaidTemplates(data.paidTemplates ?? []))
      .catch(() => setPaidTemplates([]));
  }, [step, paidTemplates, slug]);

  function close() {
    setStep("closed");
    setKind("cv");
    setFormat("pdf");
    setTemplate(PDF_TEMPLATES[0].id);
    setErrorMsg(null);
  }

  async function startDownload(compact: boolean = false) {
    setDownloading(true);
    setErrorMsg(null);
    try {
      if (format === "pdf") {
        const headers = await triggerDownload(`/api/pdf/${slug}?template=${template}${compact ? "&compact=1" : ""}`);
        setPaidTemplates((prev) => (prev && !prev.includes(template) ? [...prev, template] : prev));
        onDownloaded?.();
        // Compaction tightens spacing and shrinks type size modestly, but a
        // genuinely content-heavy CV can still land on 2+ pages — the
        // server refunds the add-on itself in that case and delivers the
        // normal file instead; this just surfaces that outcome.
        if (compact && headers.get("x-compact-applied") === "false") {
          setDownloading(false);
          setStep("compact-result");
          return;
        }
      } else {
        await triggerDownload(`/api/cv-word/${slug}`);
        setPaidTemplates((prev) => (prev && !prev.includes("docx") ? [...prev, "docx"] : prev));
        onDownloaded?.();
      }
      close();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : (lang === "en" ? "Download failed, try again." : "Download fallito, riprova."));
    }
    setDownloading(false);
  }

  // Mirrors CoverLetterButton's own startDownload exactly — no format/
  // template choice, no client-side "already paid" check (the server
  // decides for real whether this exact letter was already generated).
  async function startLetterDownload() {
    setDownloading(true);
    setErrorMsg(null);
    try {
      await triggerDownload(`/api/cover-letter/${slug}`);
      onDownloaded?.();
      close();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : (lang === "en" ? "Download failed, try again." : "Download fallito, riprova."));
    }
    setDownloading(false);
  }

  // Asked fresh on every single PDF download, even repeat downloads of the
  // exact same file — never cached from a prior answer. Word/cover-letter
  // downloads skip this entirely (the compact add-on only applies to the
  // PDF layout).
  async function proceedToCompactCheck() {
    if (format !== "pdf") {
      await startDownload(false);
      return;
    }
    setCheckingPages(true);
    try {
      const res = await fetch(`/api/pdf/${slug}/pages?template=${template}`);
      const data = await res.json().catch(() => null);
      const pages = typeof data?.pages === "number" ? data.pages : 1;
      setCheckingPages(false);
      if (pages > 1) {
        setStep("compact");
      } else {
        await startDownload(false);
      }
    } catch {
      setCheckingPages(false);
      await startDownload(false);
    }
  }

  const paidKey = format === "pdf" ? template : "docx";
  function handleDownloadClick() {
    if (paidTemplates?.includes(paidKey)) {
      proceedToCompactCheck();
    } else {
      setConfirming(true);
    }
  }

  if (step === "closed") {
    return (
      <button type="button" onClick={() => setStep("kind")} className={className}>
        {icon}
        {icon ? <span className="text-[10px] leading-tight text-center line-clamp-2">{label}</span> : label}
      </button>
    );
  }

  return (
    <div
      className="w-full rounded-xl border border-foreground/10 p-3 space-y-2.5 text-left"
      style={{ background: "var(--background)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
    >
      {step === "kind" && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {lang === "en" ? "What do you want to download?" : "Cosa vuoi scaricare?"}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setKind("cv"); setStep("format"); }}
              className="flex-1 rounded-lg border border-foreground/10 px-3 py-3 text-sm font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
            >
              {lang === "en" ? "CV" : "CV"}
            </button>
            <button
              type="button"
              onClick={() => { setKind("letter"); setConfirming(true); }}
              className="flex-1 rounded-lg border border-foreground/10 px-3 py-3 text-sm font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
            >
              {lang === "en" ? "Cover letter" : "Lettera di presentazione"}
            </button>
          </div>
          {errorMsg && (
            <p className="text-[11px] rounded-lg px-3 py-2" style={{ background: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" }}>
              {errorMsg}
            </p>
          )}
          <button
            type="button"
            onClick={close}
            className="w-full text-center py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {lang === "en" ? "Cancel" : "Annulla"}
          </button>
        </>
      )}

      {step === "format" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {lang === "en" ? "Choose a format" : "Scegli un formato"}
            </p>
            <button type="button" onClick={() => setStep("kind")} className="text-[10px] font-semibold shrink-0" style={{ color: "var(--primary)" }}>
              {lang === "en" ? "← Back" : "← Indietro"}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setStep("template")}
              className="flex-1 rounded-lg border border-foreground/10 px-3 py-3 text-sm font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => { setFormat("word"); setStep("template"); }}
              className="flex-1 rounded-lg border border-foreground/10 px-3 py-3 text-sm font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
            >
              Word
            </button>
          </div>
          <button
            type="button"
            onClick={close}
            className="w-full text-center py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {lang === "en" ? "Cancel" : "Annulla"}
          </button>
        </>
      )}

      {step === "template" && format === "pdf" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {lang === "en" ? "Choose the PDF template" : "Scegli il template PDF"}
            </p>
            <button type="button" onClick={() => setStep("format")} className="text-[10px] font-semibold shrink-0" style={{ color: "var(--primary)" }}>
              {lang === "en" ? "← Back" : "← Indietro"}
            </button>
          </div>
          <Link href="/pdf-templates" className="inline-block text-[10px] font-semibold" style={{ color: "var(--primary)" }}>
            {lang === "en" ? "See all 3 formats →" : "Vedi i 3 formati →"}
          </Link>
          <div className="flex flex-col gap-1.5">
            {PDF_TEMPLATES.map(tpl => {
              const tplLabel = lang === "en" ? PDF_TEMPLATES_EN[tpl.id] : tpl;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl.id)}
                  className="rounded-lg border px-3 py-2 text-left transition-all duration-200"
                  style={{
                    borderColor: template === tpl.id ? "var(--primary)" : "var(--border)",
                    background: template === tpl.id ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent",
                  }}
                >
                  <span className="text-xs font-semibold block" style={{ color: template === tpl.id ? "var(--primary)" : "var(--foreground)" }}>
                    {tplLabel.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tplLabel.description}</span>
                </button>
              );
            })}
          </div>
          {errorMsg && (
            <p className="text-[11px] rounded-lg px-3 py-2" style={{ background: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" }}>
              {errorMsg}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadClick}
              className="flex-1 text-center py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {lang === "en" ? "Download" : "Scarica"}
            </button>
            <button type="button" onClick={close} className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              {lang === "en" ? "Cancel" : "Annulla"}
            </button>
          </div>
        </>
      )}

      {step === "template" && format === "word" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {lang === "en" ? "Word document" : "Documento Word"}
            </p>
            <button type="button" onClick={() => setStep("format")} className="text-[10px] font-semibold shrink-0" style={{ color: "var(--primary)" }}>
              {lang === "en" ? "← Back" : "← Indietro"}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground">
            {lang === "en"
              ? "A single plain layout, ready to edit freely."
              : "Un unico formato semplice, pronto per essere modificato liberamente."}
          </p>
          {errorMsg && (
            <p className="text-[11px] rounded-lg px-3 py-2" style={{ background: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" }}>
              {errorMsg}
            </p>
          )}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleDownloadClick}
              className="flex-1 text-center py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {lang === "en" ? "Download" : "Scarica"}
            </button>
            <button type="button" onClick={close} className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              {lang === "en" ? "Cancel" : "Annulla"}
            </button>
          </div>
        </>
      )}

      {confirming && (
        <CreditConfirmModal
          actionLabel={
            kind === "letter"
              ? (lang === "en" ? "Generate the cover letter?" : "Generare la lettera di presentazione?")
              : format === "pdf"
              ? (lang === "en" ? "Download the PDF?" : "Scaricare il PDF?")
              : (lang === "en" ? "Download the Word document?" : "Scaricare il documento Word?")
          }
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            if (kind === "letter") {
              await startLetterDownload();
            } else {
              await proceedToCompactCheck();
            }
          }}
        />
      )}

      {step === "compact" && (
        <>
          <p className="text-sm font-semibold">
            {lang === "en" ? "Your CV is longer than one page." : "Il tuo CV occupa più di una pagina."}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {lang === "en"
              ? "Want it compacted onto a single page? Spacing and type size shrink slightly — no content is removed."
              : "Vuoi comprimerlo in una pagina sola? Spaziatura e carattere si riducono leggermente, nessun contenuto viene rimosso."}
          </p>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setConfirmingCompact(true)}
              className="flex-1 text-center py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {lang === "en" ? "Yes, compact it (0.5 credits)" : "Sì, comprimi (0,5 crediti)"}
            </button>
            <button
              type="button"
              onClick={() => startDownload(false)}
              className="flex-1 text-center py-2 rounded-lg text-xs font-semibold border border-foreground/10 hover:bg-foreground/[0.06] transition-all duration-200"
            >
              {lang === "en" ? "No, keep as-is" : "No, lascia così"}
            </button>
          </div>
        </>
      )}

      {step === "compact-result" && (
        <>
          <p className="text-sm font-semibold">
            {lang === "en" ? "Couldn't fit it on one page" : "Non è stato possibile comprimerlo in una pagina"}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {lang === "en"
              ? "Your CV has too much content to fit on a single page even compacted — you got the normal file instead, and the 0.5 credit was refunded."
              : "Il tuo CV ha troppi contenuti per stare in una pagina anche compattato: hai ricevuto il file normale e il credito di 0,5 ti è stato rimborsato."}
          </p>
          <button
            type="button"
            onClick={close}
            className="w-full text-center py-2 rounded-lg text-xs font-semibold"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {lang === "en" ? "Got it" : "Ho capito"}
          </button>
        </>
      )}

      {confirmingCompact && (
        <CreditConfirmModal
          actionLabel={lang === "en" ? "Compact the CV to one page?" : "Comprimere il CV in una pagina?"}
          cost={0.5}
          balance={credits}
          onCancel={() => setConfirmingCompact(false)}
          onConfirm={async () => {
            setConfirmingCompact(false);
            await startDownload(true);
          }}
        />
      )}
      {(downloading || checkingPages) && (
        <DownloadLoadingOverlay
          label={
            checkingPages
              ? (lang === "en" ? "Checking your CV…" : "Sto controllando il tuo CV…")
              : kind === "letter"
              ? (lang === "en" ? "Writing your letter…" : "Sto scrivendo la tua lettera…")
              : format === "pdf"
              ? (lang === "en" ? "Preparing your PDF…" : "Sto preparando il tuo PDF…")
              : (lang === "en" ? "Preparing your Word document…" : "Sto preparando il tuo documento Word…")
          }
        />
      )}
    </div>
  );
}
