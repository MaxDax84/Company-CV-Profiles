"use client";

import { useEffect, useState, type ReactNode } from "react";
import { PDF_TEMPLATES, PDF_TEMPLATES_EN, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";
import { useLanguage } from "@/components/language-provider";

interface PdfExportButtonProps {
  slug: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  credits: number;
  onDownloaded?: () => void;
}

export default function PdfExportButton({ slug, label, icon, className, credits, onDownloaded }: PdfExportButtonProps) {
  const { lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);
  const [paidTemplates, setPaidTemplates] = useState<string[] | null>(null);

  // Re-downloading a template already paid for is free server-side (see
  // app/api/pdf/[slug]/route.tsx) — without this check the "costs 1 credit"
  // confirmation kept showing anyway, which reads as a false threat.
  useEffect(() => {
    if (!open || paidTemplates !== null) return;
    fetch(`/api/pdf/${slug}/status`)
      .then((res) => (res.ok ? res.json() : { paidTemplates: [] }))
      .then((data) => setPaidTemplates(data.paidTemplates ?? []))
      .catch(() => setPaidTemplates([]));
  }, [open, paidTemplates, slug]);

  async function startDownload() {
    setDownloading(true);
    try {
      await triggerDownload(`/api/pdf/${slug}?template=${template}`);
      setPaidTemplates((prev) => (prev && !prev.includes(template) ? [...prev, template] : prev));
      onDownloaded?.();
    } catch {
      // Non-blocking — the credit spend already happened server-side
      // if it reached that point; a network hiccup on the download
      // itself isn't worth a dedicated error state here.
    }
    setDownloading(false);
    setOpen(false);
  }

  function handleDownloadClick() {
    if (paidTemplates?.includes(template)) {
      startDownload();
    } else {
      setConfirming(true);
    }
  }

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={className}>
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
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
          {lang === "en" ? "Choose the PDF template" : "Scegli il template PDF"}
        </p>
        <a
          href="/pdf-templates"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-semibold shrink-0"
          style={{ color: "var(--primary)" }}
        >
          {lang === "en" ? "See all 3 formats →" : "Vedi i 3 formati →"}
        </a>
      </div>
      <div className="flex flex-col gap-1.5">
        {PDF_TEMPLATES.map(tpl => {
          const label = lang === "en" ? PDF_TEMPLATES_EN[tpl.id] : tpl;
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
              <span
                className="text-xs font-semibold block"
                style={{ color: template === tpl.id ? "var(--primary)" : "var(--foreground)" }}
              >
                {label.name}
              </span>
              <span className="text-[10px] text-muted-foreground">{label.description}</span>
            </button>
          );
        })}
      </div>
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
          onClick={() => setOpen(false)}
          className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {lang === "en" ? "Cancel" : "Annulla"}
        </button>
      </div>
      {confirming && (
        <CreditConfirmModal
          actionLabel={lang === "en" ? "Download the PDF?" : "Scaricare il PDF?"}
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            await startDownload();
          }}
        />
      )}
      {downloading && <DownloadLoadingOverlay label={lang === "en" ? "Preparing your PDF…" : "Sto preparando il tuo PDF…"} />}
    </div>
  );
}
