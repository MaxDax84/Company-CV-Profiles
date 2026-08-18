"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CreditConfirmModal from "@/components/credit-confirm-modal";

const ACCENT = "#6366f1";

// The CV's own CONTENT is genuinely translated into any of these (the
// prompt in lib/translate-resume.ts isn't limited to this list) — this is
// just a convenient picker covering the languages most people will
// actually want. metadata.language gets set to the code, which the public
// templates use only for their own static section labels (Experience/
// Esperienza etc, see components/pdf/AtsResumeDocument.tsx and the web
// templates) — anything outside "it"/"en" here falls back to English
// labels around the (still correctly translated) CV content.
const LANGUAGES: { code: string; label: string }[] = [
  { code: "English", label: "Inglese" },
  { code: "Spanish", label: "Spagnolo" },
  { code: "French", label: "Francese" },
  { code: "German", label: "Tedesco" },
  { code: "Portuguese", label: "Portoghese" },
  { code: "Italian", label: "Italiano" },
  { code: "Chinese (Simplified)", label: "Cinese (semplificato)" },
  { code: "Arabic", label: "Arabo" },
];

interface TranslateCvButtonProps {
  slug: string;
  accountCode: string;
  credits: number;
  className?: string;
}

export default function TranslateCvButton({ slug, accountCode, credits, className }: TranslateCvButtonProps) {
  const router = useRouter();
  const [language, setLanguage] = useState(LANGUAGES[0].code);
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [resultSlug, setResultSlug] = useState<string | null>(null);

  async function handleConfirm() {
    setConfirming(false);
    setStatus("loading");
    try {
      const res = await fetch("/api/translate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, targetLanguage: language }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Errore, riprova.");
        return;
      }
      setResultSlug(data.slug);
      setStatus("idle");
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMsg("Errore, riprova.");
    }
  }

  if (resultSlug) {
    return (
      <a
        href={`/${accountCode}/${resultSlug}`}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        style={{ color: ACCENT }}
      >
        Apri la versione tradotta →
      </a>
    );
  }

  const selectedLabel = LANGUAGES.find((l) => l.code === language)?.label ?? language;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-foreground/[0.03] border border-foreground/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary/50 cursor-pointer"
      >
        {LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{l.label}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={status === "loading"}
        className={className}
      >
        {status === "loading" ? "Traduzione…" : "Traduci CV"}
      </button>
      {status === "error" && <p className="text-xs text-red-600 w-full">{errorMsg}</p>}
      {confirming && (
        <CreditConfirmModal
          actionLabel={`Tradurre questo CV in ${selectedLabel}?`}
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  );
}
