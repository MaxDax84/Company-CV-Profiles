"use client";

import { useState, type ReactNode, type CSSProperties } from "react";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";

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

  return (
    <>
      <button type="button" onClick={() => setConfirming(true)} className={className} style={style}>
        {icon}
        {icon ? <span className="text-[10px] leading-tight text-center line-clamp-2">{label}</span> : label}
      </button>
      {confirming && (
        <CreditConfirmModal
          actionLabel="Generare la lettera di presentazione?"
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={async () => {
            setConfirming(false);
            setDownloading(true);
            try {
              await triggerDownload(`/api/cover-letter/${slug}`);
            } catch {
              // Non-blocking, same reasoning as pdf-export-button.tsx.
            }
            setDownloading(false);
          }}
        />
      )}
      {downloading && <DownloadLoadingOverlay label="Sto scrivendo la tua lettera…" />}
    </>
  );
}
