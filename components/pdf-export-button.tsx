"use client";

import { useState, type ReactNode } from "react";
import { PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";

interface PdfExportButtonProps {
  slug: string;
  label: string;
  icon?: ReactNode;
  className?: string;
}

export default function PdfExportButton({ slug, label, icon, className }: PdfExportButtonProps) {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className={className}>
        {icon}
        {icon ? <span className="text-[10px] leading-tight text-center">{label}</span> : label}
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
            style={{ borderColor: template === tpl.id ? "#6366f1" : "rgba(15,23,42,0.08)" }}
          >
            <div className="relative h-16 overflow-hidden bg-white">
              <iframe
                src={`/pdf-preview/${tpl.id}`}
                title={tpl.name}
                tabIndex={-1}
                className="animate-template-preview-scroll"
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
              style={{ background: template === tpl.id ? "#6366f120" : "transparent", color: template === tpl.id ? "#6366f1" : "#475569" }}
            >
              {tpl.name}
            </p>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-muted-foreground/60">{PDF_TEMPLATES.find(t => t.id === template)?.description}</p>
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
