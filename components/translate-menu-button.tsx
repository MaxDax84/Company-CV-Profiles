"use client";

import { useState, type ReactNode } from "react";
import { TRANSLATE_LANGUAGES } from "@/components/translate-cv-button";
import { PDF_TEMPLATES, PDF_TEMPLATES_EN, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import DownloadLoadingOverlay from "@/components/download-loading-overlay";
import { triggerDownload } from "@/lib/trigger-download";
import { useLanguage } from "@/components/language-provider";

interface TranslateMenuButtonProps {
  slug: string;
  label: string;
  icon?: ReactNode;
  className?: string;
  credits: number;
  onGoToDownloads?: () => void;
}

type Step = "closed" | "language" | "target" | "cv-format" | "cv-template";
type Target = "cv" | "letter";
type Format = "pdf" | "word";

// Consolidates TranslateCvButton and TranslateCoverLetterButton behind one
// "Traduzione" entry point: language, then CV or cover letter, then (CV
// only) PDF or Word, then (PDF only) which of the 3 templates. A cover
// letter only ever exists as PDF (see cover-letter-button.tsx), so that
// branch skips straight to the confirm step.
export default function TranslateMenuButton({ slug, label, icon, className, credits, onGoToDownloads }: TranslateMenuButtonProps) {
  const { lang } = useLanguage();
  const [step, setStep] = useState<Step>("closed");
  const [language, setLanguage] = useState(TRANSLATE_LANGUAGES[0].code);
  const [target, setTarget] = useState<Target>("cv");
  const [format, setFormat] = useState<Format>("pdf");
  const [template, setTemplate] = useState<PdfTemplate>(PDF_TEMPLATES[0].id);
  const [confirming, setConfirming] = useState(false);
  const [status, setStatus] = useState<"idle" | "translating" | "downloading" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [done, setDone] = useState(false);

  function close() {
    setStep("closed");
    setTarget("cv");
    setFormat("pdf");
    setTemplate(PDF_TEMPLATES[0].id);
    setErrorMsg("");
  }

  const selectedLangEntry = TRANSLATE_LANGUAGES.find((l) => l.code === language);
  const selectedLangName = (lang === "en" ? selectedLangEntry?.labelEn : selectedLangEntry?.label) ?? language;
  const selectedTpl = PDF_TEMPLATES.find((t) => t.id === template);
  const selectedTemplateName = (lang === "en" ? PDF_TEMPLATES_EN[template].name : selectedTpl?.name) ?? template;
  const genericError = lang === "en" ? "Error, try again." : "Errore, riprova.";

  async function handleConfirm() {
    setConfirming(false);
    setStatus("translating");
    try {
      if (target === "letter") {
        await triggerDownload(`/api/cover-letter/${slug}?language=${language}`);
      } else {
        const res = await fetch("/api/translate-cv", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug, targetLanguage: language, template, format }),
        });
        const data = await res.json();
        if (!res.ok) {
          setStatus("error");
          setErrorMsg(data.error ?? genericError);
          return;
        }
        setStatus("downloading");
        if (format === "word") {
          await triggerDownload(`/api/cv-word/${data.slug}`);
        } else {
          await triggerDownload(`/api/pdf/${data.slug}?template=${data.template}`);
        }
      }
      setStatus("idle");
      setDone(true);
      close();
    } catch {
      setStatus("error");
      setErrorMsg(genericError);
    }
  }

  if (step === "closed") {
    return (
      <button type="button" onClick={() => setStep("language")} className={className}>
        {icon}
        {icon ? <span className="text-[10px] leading-tight text-center line-clamp-2">{label}</span> : label}
      </button>
    );
  }

  return (
    <div
      className="w-full rounded-xl border border-foreground/10 p-3 space-y-2.5 text-left"
      style={{ background: "var(--background)", boxShadow: "0 8px 24px rgba(0,0,0,0.35)" }}
    >
      {step === "language" && (
        <>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
            {lang === "en" ? "Translate into which language?" : "Traduci in quale lingua?"}
          </p>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-lg px-2.5 py-2 text-xs outline-none focus:border-primary/50 cursor-pointer"
            style={{ colorScheme: "light" }}
          >
            {TRANSLATE_LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{lang === "en" ? l.labelEn : l.label}</option>
            ))}
          </select>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep("target")}
              className="flex-1 text-center py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {lang === "en" ? "Continue" : "Continua"}
            </button>
            <button type="button" onClick={close} className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              {lang === "en" ? "Cancel" : "Annulla"}
            </button>
          </div>
        </>
      )}

      {step === "target" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {lang === "en" ? "Translate what?" : "Cosa vuoi tradurre?"}
            </p>
            <button type="button" onClick={() => setStep("language")} className="text-[10px] font-semibold shrink-0" style={{ color: "var(--primary)" }}>
              {lang === "en" ? "← Back" : "← Indietro"}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setTarget("cv"); setStep("cv-format"); }}
              className="flex-1 rounded-lg border border-foreground/10 px-3 py-3 text-sm font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
            >
              {lang === "en" ? "CV" : "CV"}
            </button>
            <button
              type="button"
              onClick={() => { setTarget("letter"); setConfirming(true); }}
              className="flex-1 rounded-lg border border-foreground/10 px-3 py-3 text-sm font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
            >
              {lang === "en" ? "Cover letter" : "Lettera"}
            </button>
          </div>
        </>
      )}

      {step === "cv-format" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {lang === "en" ? "Choose a format" : "Scegli un formato"}
            </p>
            <button type="button" onClick={() => setStep("target")} className="text-[10px] font-semibold shrink-0" style={{ color: "var(--primary)" }}>
              {lang === "en" ? "← Back" : "← Indietro"}
            </button>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => { setFormat("pdf"); setStep("cv-template"); }}
              className="flex-1 rounded-lg border border-foreground/10 px-3 py-3 text-sm font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
            >
              PDF
            </button>
            <button
              type="button"
              onClick={() => { setFormat("word"); setConfirming(true); }}
              className="flex-1 rounded-lg border border-foreground/10 px-3 py-3 text-sm font-semibold hover:bg-foreground/[0.06] transition-all duration-200"
            >
              Word
            </button>
          </div>
        </>
      )}

      {step === "cv-template" && (
        <>
          <div className="flex items-center justify-between gap-2">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              {lang === "en" ? "Choose the PDF template" : "Scegli il template PDF"}
            </p>
            <button type="button" onClick={() => setStep("cv-format")} className="text-[10px] font-semibold shrink-0" style={{ color: "var(--primary)" }}>
              {lang === "en" ? "← Back" : "← Indietro"}
            </button>
          </div>
          <div className="flex flex-col gap-1.5">
            {PDF_TEMPLATES.map(tpl => {
              const tplLabel = lang === "en" ? PDF_TEMPLATES_EN[tpl.id] : tpl;
              return (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => setTemplate(tpl.id)}
                  className="rounded-lg border px-3 py-2 text-left transition-all duration-200"
                  style={{
                    borderColor: template === tpl.id ? "var(--primary)" : "var(--border)",
                    background: template === tpl.id ? "color-mix(in srgb, var(--primary) 10%, transparent)" : "transparent",
                  }}
                >
                  <span className="text-xs font-semibold block" style={{ color: template === tpl.id ? "var(--primary)" : "var(--foreground)" }}>
                    {tplLabel.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{tplLabel.description}</span>
                </button>
              );
            })}
          </div>
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="flex-1 text-center py-2 rounded-lg text-xs font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {lang === "en" ? "Translate and download" : "Traduci e scarica"}
            </button>
            <button type="button" onClick={close} className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground transition-colors">
              {lang === "en" ? "Cancel" : "Annulla"}
            </button>
          </div>
        </>
      )}

      {errorMsg && (
        <p className="text-[11px] rounded-lg px-3 py-2" style={{ background: "color-mix(in srgb, #ef4444 12%, transparent)", color: "#ef4444" }}>
          {errorMsg}
        </p>
      )}

      {confirming && (
        <CreditConfirmModal
          actionLabel={
            target === "letter"
              ? (lang === "en" ? `Translate the cover letter into ${selectedLangName} and download it as PDF?` : `Tradurre la lettera di presentazione in ${selectedLangName} e scaricarla in PDF?`)
              : format === "word"
              ? (lang === "en" ? `Translate this CV into ${selectedLangName} and download it as Word?` : `Tradurre questo CV in ${selectedLangName} e scaricarlo in Word?`)
              : (lang === "en" ? `Translate this CV into ${selectedLangName} and download it as PDF (${selectedTemplateName})?` : `Tradurre questo CV in ${selectedLangName} e scaricarlo in PDF (${selectedTemplateName})?`)
          }
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirm}
        />
      )}
      {status === "translating" && <DownloadLoadingOverlay label={target === "letter" ? (lang === "en" ? "Translating the letter…" : "Sto traducendo la lettera…") : (lang === "en" ? "Translating the CV…" : "Sto traducendo il CV…")} />}
      {status === "downloading" && <DownloadLoadingOverlay label={lang === "en" ? "Preparing your file…" : "Sto preparando il file…"} />}

      {done && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setDone(false)}
        >
          <div className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4 text-center" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-semibold">{lang === "en" ? "Translated and downloaded ✓" : "Tradotto e scaricato ✓"}</p>
            <p className="text-sm text-muted-foreground">
              {lang === "en"
                ? "The file is now also available in your account's Download section, in case you want to re-download it later."
                : "Il file è ora disponibile anche nella sezione Download del tuo account, se vuoi riscaricarlo più avanti."}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setDone(false); onGoToDownloads?.(); }}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {lang === "en" ? "Go to Downloads" : "Vai a Download"}
              </button>
              <button type="button" onClick={() => setDone(false)} className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors">
                {lang === "en" ? "Close" : "Chiudi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
