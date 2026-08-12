"use client";

import { useState } from "react";
import { PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";

interface PdfExportButtonProps {
  slug: string;
  label: string;
  className?: string;
}

export default function PdfExportButton({ slug, label, className }: PdfExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {label}
      </button>
    );
  }

  return (
    <div className="w-full rounded-xl border border-black/10 bg-black/[0.02] p-3 space-y-2.5 text-left">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Scegli il template PDF</p>
      <div className="space-y-1.5">
        {PDF_TEMPLATES.map(tpl => (
          <label key={tpl.id} className="flex items-start gap-2 cursor-pointer">
            <input
              type="radio"
              name={`pdf-template-${slug}`}
              checked={template === tpl.id}
              onChange={() => setTemplate(tpl.id)}
              className="mt-1"
            />
            <span>
              <span className="block text-xs font-semibold text-foreground/80">{tpl.name}</span>
              <span className="block text-[10px] text-muted-foreground/60">{tpl.description}</span>
            </span>
          </label>
        ))}
      </div>
      <div className="flex gap-2 pt-1">
        <a
          href={`/api/pdf/${slug}?template=${template}`}
          download
          onClick={() => setOpen(false)}
          className="flex-1 text-center py-2 rounded-lg text-xs font-semibold"
          style={{ background: "#6366f1", color: "#000" }}
        >
          Scarica
        </a>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Annulla
        </button>
      </div>
    </div>
  );
}
