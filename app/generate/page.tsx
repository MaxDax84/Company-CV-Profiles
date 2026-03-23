"use client";

import { useState, useRef } from "react";
import type { TemplateStyle } from "@/lib/schema";

type State = "idle" | "uploading" | "done" | "error";

const TEMPLATES: { id: TemplateStyle; name: string; description: string; accent: string; bg: string; preview: string; demoSlug: string }[] = [
  {
    id: "alpha",
    name: "Alpha",
    description: "Dark · minimal · timeline",
    accent: "#6366f1",
    bg: "#030608",
    preview: "Inter · dark · sezioni a scroll",
    demoSlug: "marco-ferretti",
  },
  {
    id: "beta",
    name: "Beta",
    description: "Light · elegante · editoriale",
    accent: "#4f46e5",
    bg: "#ffffff",
    preview: "DM Serif · bianco · split layout",
    demoSlug: "marco-ferretti-beta",
  },
  {
    id: "gamma",
    name: "Gamma",
    description: "Hero scuro · sezioni chiare",
    accent: "#10b981",
    bg: "#0b1f14",
    preview: "Plus Jakarta · emerald · moderno",
    demoSlug: "marco-ferretti-gamma",
  },
  {
    id: "delta",
    name: "Delta",
    description: "Luxury · navy · gold",
    accent: "#c9a84c",
    bg: "#0a1628",
    preview: "Playfair · navy · premium",
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
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-2xl space-y-10">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Genera il tuo profilo</h1>
          <p className="text-white/50">Scegli uno stile, carica il CV in PDF e ottieni la tua pagina in secondi.</p>
        </div>

        {/* Template selector */}
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30">Scegli il template</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {TEMPLATES.map(t => (
              <button
                key={t.id}
                onClick={() => setTemplate(t.id)}
                className="group relative rounded-2xl overflow-hidden border-2 transition-all text-left"
                style={{
                  borderColor: template === t.id ? t.accent : "rgba(255,255,255,0.07)",
                  boxShadow: template === t.id ? `0 0 0 1px ${t.accent}` : "none",
                }}
              >
                {/* Color preview bar */}
                <div className="h-14" style={{ background: t.bg, borderBottom: `2px solid ${t.accent}30` }}>
                  <div className="h-full flex items-center justify-center">
                    <span className="text-xs font-bold tracking-widest" style={{ color: t.accent }}>{t.name.toUpperCase()}</span>
                  </div>
                </div>
                <div className="p-3 bg-white/[0.03] space-y-1.5">
                  <p className="text-xs font-semibold text-white/80 leading-tight">{t.name}</p>
                  <p className="text-[10px] text-white/40 leading-tight">{t.description}</p>
                  <a
                    href={`/profile/${t.demoSlug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md"
                    style={{ background: `${t.accent}22`, color: t.accent, border: `1px solid ${t.accent}40` }}
                  >
                    Preview ↗
                  </a>
                </div>

                {template === t.id && (
                  <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: t.accent }}>
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Upload area */}
        {state === "idle" || state === "error" ? (
          <>
            <div
              onClick={() => inputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={e => e.preventDefault()}
              className="border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all"
              style={{ borderColor: `${selected.accent}30` }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${selected.accent}60`}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${selected.accent}30`}
            >
              <p className="text-4xl mb-4">📄</p>
              <p className="font-medium text-white/80">Trascina il PDF qui</p>
              <p className="text-sm text-white/40 mt-1">oppure clicca per selezionare il file</p>
              <p className="text-xs text-white/25 mt-3">Max 10 MB · solo PDF</p>
              <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
            </div>
            {state === "error" && error && (
              <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-400 text-center">{error}</div>
            )}
          </>
        ) : state === "uploading" ? (
          <div className="rounded-3xl bg-white/[0.03] border border-white/[0.07] p-12 text-center space-y-4">
            <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-white animate-spin mx-auto" />
            <p className="text-white/60">Estrazione dati in corso…</p>
            <p className="text-xs text-white/30">Potrebbe richiedere 10–20 secondi</p>
          </div>
        ) : (
          <div className="rounded-3xl bg-white/[0.03] border border-white/[0.07] p-8 text-center space-y-5">
            <div className="text-4xl">✅</div>
            <div>
              <p className="font-semibold text-white">Profilo creato!</p>
              <p className="text-sm text-white/50 mt-1">Il tuo sito è disponibile a questo link:</p>
            </div>
            <a
              href={`/profile/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 px-4 rounded-2xl font-semibold text-sm transition-opacity hover:opacity-90"
              style={{ background: selected.accent, color: "#000" }}
            >
              Apri il profilo ↗
            </a>
            <button
              onClick={() => { setState("idle"); setSlug(null); }}
              className="text-xs text-white/30 hover:text-white/50 transition-colors"
            >
              Genera un altro
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
