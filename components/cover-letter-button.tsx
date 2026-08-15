"use client";

import { useState, type ReactNode } from "react";
import CreditConfirmModal from "@/components/credit-confirm-modal";

interface CoverLetterButtonProps {
  slug: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  credits: number;
}

export default function CoverLetterButton({ slug, label, icon, className, credits }: CoverLetterButtonProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <button type="button" onClick={() => setConfirming(true)} className={className}>
        {icon}
        {icon ? <span className="text-[10px] leading-tight text-center line-clamp-2">{label}</span> : label}
      </button>
      {confirming && (
        <CreditConfirmModal
          actionLabel="Generare la lettera di presentazione?"
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            window.location.href = `/api/cover-letter/${slug}`;
            setConfirming(false);
          }}
        />
      )}
    </>
  );
}
