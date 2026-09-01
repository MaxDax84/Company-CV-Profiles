"use client";

import { useEffect, useState, type ReactNode } from "react";
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

type Step = "closed" | "format" | "template";
type Format = "pdf" | "word";

// Consolidates PdfExportButton (3 templates) and WordExportButton (single
// layout, see its own comment for why) behind one "Download" entry point —
// PDF asks which of the 3 templates, Word skips straight to the confirm
// step since there's only one layout to download.
export default function DownloadMenuButton({ slug, label, icon, className, credits, onDownloaded }: DownloadMenuButtonProps) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<Step>("closed");
  const [format, setFormat] = useState<Format>("pdf");
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paidTemplates, setPaidTemplates] = useState<string[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Same "already paid" status endpoint used by PdfExportButton/WordExportButton
  // — "docx" is the Word slot, template ids are the PDF slots.
  useEffect(() => {
    if (step === "closed" || paidTemplates !== null) return;
    fetch(`/api/pdf/${slug}/status`)
      .then((res) => (res.ok ? res.json() : { paidTemplates: [] }))
      .then((data) => setPaidTemplates(data.paidTemplates ?? []))
      .catch(() => setPaidTemplates([]));
  }, [step, paidTemplates, slug]);

  function close() {
    setStep("closed");
    setFormat("pdf");
    setTemplate(PDF_TEMPLATES[0].id);
    setErrorMsg(null);
  }

  async function startDownload() {
    setDownloading(true);
    setErrorMsg(null);
    try {
      if (format === "pdf") {
        await triggerDownload(`/api/pdf/${slug}?template=${template}`);
        setPaidTemplates((prev) => (prev && !prev.includes(template) ? [...prev, template] : prev));
      } else {
        await triggerDownload(`/api/cv-word/${slug}`);
        setPaidTemplates((prev) => (prev && !prev.includes("docx") ? [...prev, "docx"] : prev));
      }
      onDownloaded?.();
      close();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : (lang === "en" ? "Download failed, try again." : "Download fallito, riprova."));
    }
    setDownloading(false);
  }

  const paidKey = format === "pdf" ? template : "docx";
  function handleDownloadClick() {
    if (paidTemplates?.includes(paidKey)) {
      startDownload();
    } else {
      setConfirming(true);
    }
  }

  if (step === "closed") {
    return (
      <button type="button" onClick={() => setStep("format")} className={className}>
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
      {step === "format" && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {lang === "en" ? "Choose a format" : "Scegli un formato"}
          </p>
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
            format === "pdf"
              ? (lang === "en" ? "Download the PDF?" : "Scaricare il PDF?")
              : (lang === "en" ? "Download the Word document?" : "Scaricare il documento Word?")
          }
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            await startDownload();
          }}
        />
      )}
      {downloading && (
        <DownloadLoadingOverlay
          label={format === "pdf" ? (lang === "en" ? "Preparing your PDF…" : "Sto preparando il tuo PDF…") : (lang === "en" ? "Preparing your Word document…" : "Sto preparando il tuo documento Word…")}
        />
      )}
    </div>
  );
}
