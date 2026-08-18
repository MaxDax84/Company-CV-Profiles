"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import CreditConfirmModal from "@/components/credit-confirm-modal";

// The CV's own CONTENT is genuinely translated into any of these (the
// prompt in lib/translate-resume.ts isn't limited to this list) — this is
// just a convenient picker covering the languages most people will
// actually want. The code (ISO 639-1) is both what's sent to the API and
// what ends up in the saved profile's metadata.language — exported so
// components/account-tabs.tsx can look up a friendly label for the
// Download list without duplicating this table.
export const TRANSLATE_LANGUAGES: { code: string; label: string }[] = [
  { code: "en", label: "Inglese" },
  { code: "es", label: "Spagnolo" },
  { code: "fr", label: "Francese" },
  { code: "de", label: "Tedesco" },
  { code: "pt", label: "Portoghese" },
  { code: "it", label: "Italiano" },
  { code: "zh", label: "Cinese (semplificato)" },
  { code: "ar", label: "Arabo" },
];

interface TranslateCvButtonProps {
  slug: string;
  credits: number;
  className?: string;
}

// Unlike PdfExportButton/CoverLetterButton, this can't just be a plain
// download link — it first has to create the translated profile (a real
// Claude call) before a PDF of it can exist at all. So: POST to create it,
// then immediately follow up with the normal PDF GET once we have the new
// slug. That second request is free (the route pre-marks it as paid) —
// translating costs exactly the 1 credit spent in the POST, not two.
export default function TranslateCvButton({ slug, credits, className }: TranslateCvButtonProps) {
  const router = useRouter();
  const [language, setLanguage] = useState(TRANSLATE_LANGUAGES[0].code);
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleConfirm() {
    setConfirming(false);
    setStatus("loading");
    try {
      const res = await fetch("/api/translate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, targetLanguage: language, template }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Errore, riprova.");
        return;
      }
      window.location.href = `/api/pdf/${data.slug}?template=${data.template}`;
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMsg("Errore, riprova.");
    }
  }

  const selectedLabel = TRANSLATE_LANGUAGES.find((l) => l.code === language)?.label ?? language;
  const selectedTemplateName = PDF_TEMPLATES.find((t) => t.id === template)?.name ?? template;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-foreground/[0.03] border border-foreground/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary/50 cursor-pointer"
      >
        {TRANSLATE_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value as PdfTemplate)}
        className="bg-foreground/[0.03] border border-foreground/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary/50 cursor-pointer"
      >
        {PDF_TEMPLATES.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={status === "loading"}
        className={className}
      >
        {status === "loading" ? "Traduzione…" : "Traduci e scarica PDF"}
      </button>
      {status === "error" && <p className="text-xs text-red-600 w-full">{errorMsg}</p>}
      {confirming && (
        <CreditConfirmModal
          actionLabel={`Tradurre questo CV in ${selectedLabel} e scaricarlo in PDF (${selectedTemplateName})?`}
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
