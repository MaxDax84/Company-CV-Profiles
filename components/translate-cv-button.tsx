"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PDF_TEMPLATES, PDF_TEMPLATES_EN, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";
import { useLanguage } from "@/components/language-provider";

// The CV's own CONTENT is genuinely translated into any of these (the
// prompt in lib/translate-resume.ts isn't limited to this list) — this is
// just a convenient picker covering the languages most people will
// actually want. The code (ISO 639-1) is both what's sent to the API and
// what ends up in the saved profile's metadata.language — exported so
// components/account-tabs.tsx can look up a friendly label for the
// Download list without duplicating this table. "label" (Italian) stays for
// backward-compat call sites; "labelEn" is used whenever the UI itself is
// in English.
export const TRANSLATE_LANGUAGES: { code: string; label: string; labelEn: string }[] = [
  { code: "en", label: "Inglese", labelEn: "English" },
  { code: "es", label: "Spagnolo", labelEn: "Spanish" },
  { code: "fr", label: "Francese", labelEn: "French" },
  { code: "de", label: "Tedesco", labelEn: "German" },
  { code: "pt", label: "Portoghese", labelEn: "Portuguese" },
  { code: "it", label: "Italiano", labelEn: "Italian" },
  { code: "zh", label: "Cinese (semplificato)", labelEn: "Chinese (Simplified)" },
];

interface TranslateCvButtonProps {
  slug: string;
  credits: number;
  className?: string;
  // Lets the parent (the account page's tab switcher) jump straight to the
  // Download tab when the user clicks through from the success popup below —
  // optional so this component still works standalone without one.
  onGoToDownloads?: () => void;
}

// Unlike PdfExportButton/CoverLetterButton, this can't just be a plain
// download link — it first has to create the translated profile (a real
// Claude call) before a PDF of it can exist at all. So: POST to create it,
// then immediately follow up with the normal PDF GET once we have the new
// slug. That second request is free (the route pre-marks it as paid) —
// translating costs exactly the 1 credit spent in the POST, not two.
export default function TranslateCvButton({ slug, credits, className, onGoToDownloads }: TranslateCvButtonProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const [language, setLanguage] = useState(TRANSLATE_LANGUAGES[0].code);
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<"idle" | "translating" | "downloading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  async function handleConfirm() {
    setConfirming(false);
    setStatus("translating");
    try {
      const res = await fetch("/api/translate-cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, targetLanguage: language, template }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? (lang === "en" ? "Error, try again." : "Errore, riprova."));
        return;
      }
      setStatus("downloading");
      await triggerDownload(`/api/pdf/${data.slug}?template=${data.template}`);
      setStatus("idle");
      setDone(true);
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMsg(lang === "en" ? "Error, try again." : "Errore, riprova.");
    }
  }

  const selectedLabel = TRANSLATE_LANGUAGES.find((l) => l.code === language);
  const selectedLanguageName = (lang === "en" ? selectedLabel?.labelEn : selectedLabel?.label) ?? language;
  const selectedTpl = PDF_TEMPLATES.find((t) => t.id === template);
  const selectedTemplateName = (lang === "en" ? PDF_TEMPLATES_EN[template].name : selectedTpl?.name) ?? template;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="bg-foreground/[0.03] border border-foreground/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary/50 cursor-pointer"
        style={{ colorScheme: "light" }}
      >
        {TRANSLATE_LANGUAGES.map((l) => (
          <option key={l.code} value={l.code}>{lang === "en" ? l.labelEn : l.label}</option>
        ))}
      </select>
      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value as PdfTemplate)}
        className="bg-foreground/[0.03] border border-foreground/10 rounded-lg px-2.5 py-1.5 text-xs outline-none focus:border-primary/50 cursor-pointer"
        style={{ colorScheme: "light" }}
      >
        {PDF_TEMPLATES.map((t) => (
          <option key={t.id} value={t.id}>{lang === "en" ? PDF_TEMPLATES_EN[t.id].name : t.name}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        disabled={status === "translating" || status === "downloading"}
        className={className}
      >
        {status === "translating"
          ? (lang === "en" ? "Translating…" : "Traduzione…")
          : status === "downloading"
          ? (lang === "en" ? "Downloading…" : "Download…")
          : (lang === "en" ? "Translate and download PDF" : "Traduci e scarica PDF")}
      </button>
      {status === "error" && <p className="text-xs text-destructive w-full">{errorMsg}</p>}
      {status === "translating" && <DownloadLoadingOverlay label={lang === "en" ? "Translating the CV…" : "Sto traducendo il CV…"} />}
      {status === "downloading" && <DownloadLoadingOverlay label={lang === "en" ? "Preparing your PDF…" : "Sto preparando il tuo PDF…"} />}
      {confirming && (
        <CreditConfirmModal
          actionLabel={lang === "en"
            ? `Translate this CV into ${selectedLanguageName} and download it as PDF (${selectedTemplateName})?`
            : `Tradurre questo CV in ${selectedLanguageName} e scaricarlo in PDF (${selectedTemplateName})?`}
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirm}
        />
      )}
      {done && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setDone(false)}
        >
          <div
            className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-semibold">{lang === "en" ? "CV translated and downloaded ✓" : "CV tradotto e scaricato ✓"}</p>
            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? "The PDF is now also available in your account's Download section, in case you want to re-download it later."
                : "Il PDF è ora disponibile anche nella sezione Download del tuo account, se vuoi riscaricarlo più avanti."}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setDone(false);
                  onGoToDownloads?.();
                }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {lang === "en" ? "Go to Downloads" : "Vai a Download"}
              </button>
              <button
                type="button"
                onClick={() => setDone(false)}
                className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {lang === "en" ? "Close" : "Chiudi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
