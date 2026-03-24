"use client";

import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";
import type { TemplateStyle } from "@/lib/schema";

type State = "idle" | "uploading" | "done" | "error";

const TEMPLATES: { id: TemplateStyle; name: string; description: string; accent: string; bg: string; demoSlug: string }[] = [
  {
    id: "alpha",
    name: "Alpha",
    description: "Dark · minimal · timeline",
    accent: "#6366f1",
    bg: "#030608",
    demoSlug: "marco-ferretti",
  },
  {
    id: "beta",
    name: "Beta",
    description: "Light · elegante · editoriale",
    accent: "#4f46e5",
    bg: "#ffffff",
    demoSlug: "marco-ferretti-beta",
  },
  {
    id: "gamma",
    name: "Gamma",
    description: "Hero scuro · sezioni chiare",
    accent: "#10b981",
    bg: "#0b1f14",
    demoSlug: "marco-ferretti-gamma",
  },
  {
    id: "delta",
    name: "Delta",
    description: "Luxury · navy · gold",
    accent: "#c9a84c",
    bg: "#0a1628",
    demoSlug: "marco-ferretti-delta",
  },
];

export default function GeneratePage() {
  const [template, setTemplate] = useState<TemplateStyle>("alpha");
  const [state, setState] = useState<State>("idle");
  const [slug, setSlug] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(file: File) {
    setState("uploading");
    setError(null);

    const formData = new FormData();
    formData.append("pdf", file);
    formData.append("template", template);

    try {
      const res = await fetch("/api/parse-resume", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Errore sconosciuto");
      setSlug(data.slug);
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto");
      setState("error");
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type === "application/pdf") handleUpload(file);
  }

  const selected = TEMPLATES.find(t => t.id === template)!;

  return (
    <div className="relative min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-24 overflow-hidden animate-fade-in">

      {/* Background — same as homepage */}
      <div className="absolute inset-0 grid-overlay" />
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />
      <div
        className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full blur-[100px] animate-glow-pulse pointer-events-none"
        style={{ background: "oklch(0.72 0.18 280 / 0.07)", animationDelay: "2.5s" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,oklch(0.10_0.012_255)_100%)] pointer-events-none" />

      <div className="relative z-10 w-full max-w-2xl space-y-10">

        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/8 text-primary text-xs font-medium">
            <Sparkles className="w-3 h-3" />
            Generatore di profili
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            Crea il tuo profilo web
          </h1>
          <p className="text-muted-foreground">
            Scegli uno stile, carica il CV in PDF e ottieni la tua pagina in secondi.
          </p>
        </div>

        {/* Template selector */}
        <div className="space-y-3" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
            Scegli il template
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className="group relative rounded-2xl overflow-hidden border-2 transition-all duration-200 text-left"
                style={{
                  borderColor: template === t.id ? t.accent : "rgba(255,255,255,0.08)",
                  boxShadow: template === t.id ? `0 0 16px ${t.accent}40, 0 0 0 1px ${t.accent}` : "none",
                }}
              >
                {/* Color preview bar */}
                <div className="h-14" style={{ background: t.bg, borderBottom: `2px solid ${t.accent}30` }}>
                  <div className="h-full flex items-center justify-center">
                    <span className="text-xs font-bold tracking-widest" style={{ color: t.accent }}>
                      {t.name.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-3 bg-white/[0.03] space-y-1.5">
                  <p className="text-xs font-semibold text-foreground/80 leading-tight">{t.name}</p>
                  <p className="text-[10px] text-muted-foreground leading-tight">{t.description}</p>
                  <a
                    href={`/profile/${t.demoSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md transition-opacity hover:opacity-80"
                    style={{ background: `${t.accent}22`, color: t.accent, border: `1px solid ${t.accent}40` }}
                  >
                    Preview ↗
                  </a>
                </div>

                {template === t.id && (
                  <div
                    className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: t.accent, boxShadow: `0 0 8px ${t.accent}80` }}
                  >
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Upload / states */}
        {state === "idle" || state === "error" ? (
          <>
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300"
              style={{ borderColor: `${selected.accent}35`, boxShadow: "none" }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${selected.accent}70`;
                el.style.boxShadow = `0 0 32px ${selected.accent}18`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = `${selected.accent}35`;
                el.style.boxShadow = "none";
              }}
            >
              <p className="text-4xl mb-4">📄</p>
              <p className="font-medium text-foreground/80">Trascina il PDF qui</p>
              <p className="text-sm text-muted-foreground mt-1">oppure clicca per selezionare il file</p>
              <p className="text-xs text-muted-foreground/50 mt-3">Max 10 MB · solo PDF</p>
              <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </div>
            {state === "error" && error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 text-center">
                {error}
              </div>
            )}
          </>
        ) : state === "uploading" ? (
          <div className="rounded-3xl border border-primary/20 bg-primary/5 p-12 text-center space-y-4" style={{ boxShadow: "0 0 40px oklch(0.65 0.25 264 / 0.08)" }}>
            <div className="w-10 h-10 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto" />
            <p className="text-foreground/60">Estrazione dati in corso…</p>
            <p className="text-xs text-muted-foreground/50">Potrebbe richiedere 10–20 secondi</p>
          </div>
        ) : (
          <div className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-5" style={{ boxShadow: "0 0 40px oklch(0.65 0.25 264 / 0.10)" }}>
            <div className="text-4xl">✅</div>
            <div>
              <p className="font-semibold text-foreground">Profilo creato!</p>
              <p className="text-sm text-muted-foreground mt-1">Il tuo sito è disponibile a questo link:</p>
            </div>
            <a
              href={`/profile/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg"
              style={{ background: selected.accent, color: "#000", boxShadow: `0 4px 20px ${selected.accent}50` }}
            >
              Apri il profilo ↗
            </a>
            <button
              onClick={() => { setState("idle"); setSlug(null); }}
              className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              Genera un altro
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
