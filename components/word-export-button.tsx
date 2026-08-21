"use client";

import { useEffect, useState, type ReactNode, type CSSProperties } from "react";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";
import { useLanguage } from "@/components/language-provider";

interface WordExportButtonProps {
  slug: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  credits: number;
  onDownloaded?: () => void;
}

// Single plain layout, no template picker (see lib/word-cv-document.ts) — a
// Word download exists to be edited, not to look a particular way, so there's
// nothing to choose between.
export default function WordExportButton({ slug, label, icon, className, style, credits, onDownloaded }: WordExportButtonProps) {
  const { lang } = useLanguage();
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [alreadyPaid, setAlreadyPaid] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Shares the same paid_downloads status endpoint as PdfExportButton — the
  // "docx" template key shows up there once this exact CV's Word doc has
  // been downloaded once, so a free re-download skips the credit prompt.
  useEffect(() => {
    fetch(`/api/pdf/${slug}/status`)
      .then((res) => (res.ok ? res.json() : { paidTemplates: [] }))
      .then((data) => setAlreadyPaid((data.paidTemplates ?? []).includes("docx")))
      .catch(() => {});
  }, [slug]);

  async function startDownload() {
    setDownloading(true);
    setErrorMsg(null);
    try {
      await triggerDownload(`/api/cv-word/${slug}`);
      setAlreadyPaid(true);
      onDownloaded?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : (lang === "en" ? "Download failed, try again." : "Download fallito, riprova."));
    }
    setDownloading(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => (alreadyPaid ? startDownload() : setConfirming(true))}
        className={className}
        style={style}
      >
        {icon}
        {icon ? <span className="text-[10px] leading-tight text-center line-clamp-2">{label}</span> : label}
      </button>
      {errorMsg && (
        <p className="text-[11px] rounded-lg px-3 py-2 mt-1" style={{ background: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" }}>
          {errorMsg}
        </p>
      )}
      {confirming && (
        <CreditConfirmModal
          actionLabel={lang === "en" ? "Download the Word document?" : "Scaricare il documento Word?"}
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            await startDownload();
          }}
        />
      )}
      {downloading && <DownloadLoadingOverlay label={lang === "en" ? "Preparing your Word document…" : "Sto preparando il tuo documento Word…"} />}
    </>
  );
}
