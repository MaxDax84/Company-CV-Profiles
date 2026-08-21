"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PDF_TEMPLATES, PDF_TEMPLATES_EN, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";
import { useLanguage } from "@/components/language-provider";

interface CvDownloadButtonProps {
  slug: string;
  label: string;
  className?: string;
  credits: number;
  onDownloaded?: () => void;
}

type Format = "pdf" | "word";

// Merges PdfExportButton and WordExportButton into a single "Download"
// entry point: pick the format first, then (only for PDF) the template —
// instead of two separate buttons sitting side by side wherever both
// formats are offered (components/tailor-form.tsx, components/owner-toolbar.tsx).
export default function CvDownloadButton({ slug, label, className, credits, onDownloaded }: CvDownloadButtonProps) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState<Format | null>(null);
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [paidTemplates, setPaidTemplates] = useState<string[] | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Same status endpoint PdfExportButton/WordExportButton already use — a
  // re-download of a format already paid for is free server-side (see
  // app/api/pdf/[slug]/route.tsx and app/api/cv-word/[slug]/route.ts). The
  // Word document's paid flag lives in the same array under "docx".
  useEffect(() => {
    if (!open || paidTemplates !== null) return;
    fetch(`/api/pdf/${slug}/status`)
      .then((res) => (res.ok ? res.json() : { paidTemplates: [] }))
      .then((data) => setPaidTemplates(data.paidTemplates ?? []))
      .catch(() => setPaidTemplates([]));
  }, [open, paidTemplates, slug]);

  const target = format === "pdf" ? template : "docx";
  const alreadyPaid = !!paidTemplates?.includes(target);

  async function startDownload() {
    setDownloading(true);
    setErrorMsg(null);
    try {
      const url = format === "pdf" ? `/api/pdf/${slug}?template=${template}` : `/api/cv-word/${slug}`;
      await triggerDownload(url);
      setPaidTemplates((prev) => (prev && !prev.includes(target) ? [...prev, target] : prev));
      onDownloaded?.();
      setOpen(false);
      setFormat(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : (lang === "en" ? "Download failed, try again." : "Download fallito, riprova."));
    }
    setDownloading(false);
  }

  function handleDownloadClick() {
    if (alreadyPaid) {
      startDownload();
    } else {
      setConfirming(true);
    }
  }

  function closeAll() {
    setOpen(false);
    setFormat(null);
    setErrorMsg(null);
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
    );
  }

  return (
    <div
      className="w-full rounded-xl border border-foreground/10 p-3 space-y-2.5 text-left"
      style={{ background: "var(--background)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
    >
      {format === null ? (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {lang === "en" ? "Choose a format" : "Scegli il formato"}
          </p>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={() => setFormat("pdf")}
              className="rounded-lg border px-3 py-2 text-left transition-all duration-200 hover:bg-foreground/[0.03]"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-xs font-semibold block">PDF</span>
              <span className="text-[10px] text-muted-foreground">
                {lang === "en" ? "3 ATS-friendly templates" : "3 template compatibili con gli ATS"}
              </span>
            </button>
            <button
              type="button"
              onClick={() => setFormat("word")}
              className="rounded-lg border px-3 py-2 text-left transition-all duration-200 hover:bg-foreground/[0.03]"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-xs font-semibold block">Word (.docx)</span>
              <span className="text-[10px] text-muted-foreground">
                {lang === "en" ? "Ready to edit further" : "Pronto per essere modificato"}
              </span>
            </button>
          </div>
          <button
            type="button"
            onClick={closeAll}
            className="w-full text-center py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {lang === "en" ? "Cancel" : "Annulla"}
          </button>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setFormat(null)}
              className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 hover:text-foreground transition-colors"
            >
              {lang === "en" ? "← Change format" : "← Cambia formato"}
            </button>
            {format === "pdf" && (
              <Link href="/pdf-templates" className="text-[10px] font-semibold shrink-0" style={{ color: "var(--primary)" }}>
                {lang === "en" ? "See all 3 formats →" : "Vedi i 3 formati →"}
              </Link>
            )}
          </div>

          {format === "pdf" && (
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
          )}

          {format === "word" && (
            <p className="text-xs text-muted-foreground">
              {lang === "en" ? "A single plain layout, ready to edit in Word." : "Un unico layout semplice, pronto da modificare in Word."}
            </p>
          )}

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
            <button
              type="button"
              onClick={closeAll}
              className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
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
          label={
            format === "pdf"
              ? (lang === "en" ? "Preparing your PDF…" : "Sto preparando il tuo PDF…")
              : (lang === "en" ? "Preparing your Word document…" : "Sto preparando il tuo documento Word…")
          }
        />
      )}
    </div>
  );
}
