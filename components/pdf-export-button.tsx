"use client";

import { useState, type ReactNode } from "react";
import { PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import CreditConfirmModal from "@/components/credit-confirm-modal";

interface PdfExportButtonProps {
  slug: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  credits: number;
}

export default function PdfExportButton({ slug, label, icon, className, credits }: PdfExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {icon}
        {icon ? <span className="text-[10px] leading-tight text-center line-clamp-2">{label}</span> : label}
      </button>
    );
  }

  return (
    <div className="w-full rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3 space-y-2.5 text-left">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Scegli il template PDF</p>
      <div className="grid grid-cols-3 gap-2">
        {PDF_TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            onClick={() => setTemplate(tpl.id)}
            className="rounded-lg overflow-hidden border-2 cursor-pointer transition-all duration-200"
            style={{ borderColor: template === tpl.id ? "var(--primary)" : "var(--border)" }}
          >
            <div className="relative h-16 overflow-hidden bg-white">
              <iframe
                src={`/pdf-preview/${tpl.id}`}
                title={tpl.name}
                tabIndex={-1}
                className="animate-template-preview-scroll pointer-events-none"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 1200,
                  height: 1697,
                  border: "none",
                  transform: "scale(0.16)",
                  transformOrigin: "top left",
                }}
              />
            </div>
            <p
              className="text-[10px] font-semibold text-center py-1"
              style={{ background: template === tpl.id ? "color-mix(in srgb, var(--primary) 12%, transparent)" : "transparent", color: template === tpl.id ? "var(--primary)" : "var(--muted-foreground)" }}
            >
              {tpl.name}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60">{PDF_TEMPLATES.find(t => t.id === template)?.description}</p>
      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="flex-1 text-center py-2 rounded-lg text-xs font-semibold"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          Scarica
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Annulla
        </button>
      </div>
      {confirming && (
        <CreditConfirmModal
          actionLabel="Scaricare il PDF?"
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={() => {
            window.location.href = `/api/pdf/${slug}?template=${template}`;
            setConfirming(false);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
