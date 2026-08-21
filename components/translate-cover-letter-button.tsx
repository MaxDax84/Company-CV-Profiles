"use client";

import { useState } from "react";
import { TRANSLATE_LANGUAGES } from "@/components/translate-cv-button";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";
import { useLanguage } from "@/components/language-provider";

interface TranslateCoverLetterButtonProps {
  slug: string;
  credits: number;
  className?: string;
  // Lets the parent (the account page's tab switcher) jump straight to the
  // Download tab when the user clicks through from the success popup below —
  // optional so this component still works standalone without one.
  onGoToDownloads?: () => void;
}

// Simpler than TranslateCvButton: no template picker (a cover letter only
// ever has the one layout), and no separate POST+follow-up-GET — the target
// PDF is a plain GET to /api/cover-letter/[slug]?language=..., which
// generates-or-reuses the original letter and translates it server-side
// (see that route for the credit-cost reasoning).
export default function TranslateCoverLetterButton({ slug, credits, className, onGoToDownloads }: TranslateCoverLetterButtonProps) {
  const [language, setLanguage] = useState(TRANSLATE_LANGUAGES[0].code);
  const [confirming, setConfirming] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [done, setDone] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { lang } = useLanguage();

  const selectedEntry = TRANSLATE_LANGUAGES.find((l) => l.code === language);
  const selectedLabel = (lang === "en" ? selectedEntry?.labelEn : selectedEntry?.label) ?? language;

  async function handleConfirm() {
    setConfirming(false);
    setDownloading(true);
    setErrorMsg(null);
    try {
      await triggerDownload(`/api/cover-letter/${slug}?language=${language}`);
      setDone(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : (lang === "en" ? "Download failed, try again." : "Download fallito, riprova."));
    }
    setDownloading(false);
  }

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
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className={className}
      >
        {lang === "en" ? "Translate and download PDF" : "Traduci e scarica PDF"}
      </button>
      {errorMsg && (
        <p className="text-[11px] rounded-lg px-3 py-2 w-full" style={{ background: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" }}>
          {errorMsg}
        </p>
      )}
      {confirming && (
        <CreditConfirmModal
          actionLabel={lang === "en"
            ? `Translate the cover letter into ${selectedLabel} and download it as PDF?`
            : `Tradurre la lettera di presentazione in ${selectedLabel} e scaricarla in PDF?`}
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirm}
        />
      )}
      {downloading && <DownloadLoadingOverlay label={lang === "en" ? "Translating the letter…" : "Sto traducendo la lettera…"} />}
      {done && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setDone(false)}
        >
          <div
            className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm font-semibold">{lang === "en" ? "Letter translated and downloaded ✓" : "Lettera tradotta e scaricata ✓"}</p>
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
