"use client";

import { useState, type ReactNode, type CSSProperties } from "react";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";
import { useLanguage } from "@/components/language-provider";

interface CoverLetterButtonProps {
  slug: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  style?: CSSProperties;
  credits: number;
}

export default function CoverLetterButton({ slug, label, icon, className, style, credits }: CoverLetterButtonProps) {
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { lang } = useLanguage();

  return (
    <>
      <button type="button" onClick={() => setConfirming(true)} className={className} style={style}>
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
          actionLabel={lang === "en" ? "Generate the cover letter?" : "Generare la lettera di presentazione?"}
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            setDownloading(true);
            setErrorMsg(null);
            try {
              await triggerDownload(`/api/cover-letter/${slug}`);
            } catch (err) {
              setErrorMsg(err instanceof Error ? err.message : (lang === "en" ? "Download failed, try again." : "Download fallito, riprova."));
            }
            setDownloading(false);
          }}
        />
      )}
      {downloading && <DownloadLoadingOverlay label={lang === "en" ? "Writing your letter…" : "Sto scrivendo la tua lettera…"} />}
    </>
  );
}
