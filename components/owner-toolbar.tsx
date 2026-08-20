"use client";

import PdfExportButton from "@/components/pdf-export-button";
import WordExportButton from "@/components/word-export-button";
import ActionFeedbackPopup from "@/components/action-feedback-popup";
import { useLanguage } from "@/components/language-provider";

interface OwnerToolbarProps {
  slug: string;
  kind: "primary" | "tailored" | "translated";
  credits: number;
}

// Shown only to the profile's own owner (see app/profile/[slug]/page.tsx) —
// a visitor opening the shared link never sees this. Without it, landing on
// your own public page was a dead end: no way back to the account, no way
// to grab the PDF, no way to tailor the CV to a job posting.
//
// Every template has its own `position: fixed; top: 0; z-index: 100` nav bar
// (see components/templates/Template*.tsx), which ignores normal document
// flow and always pins to the viewport's top edge regardless of what's
// rendered before it. A toolbar placed in normal flow just gets sat on top
// of and hidden. So this one is fixed too, with a higher z-index (wins the
// stack) and a height tall enough to fully cover the template's own bar
// (all four use 64px) rather than leaving a sliver peeking out beneath it.
// The color is a solid, saturated indigo specifically because it must read
// clearly over any of the four templates' backgrounds — near-black (Alpha),
// white (Beta), dark green (Gamma), or navy (Delta).
export default function OwnerToolbar({ slug, kind, credits }: OwnerToolbarProps) {
  const { lang } = useLanguage();

  return (
    <>
    <div
      className="fixed top-0 left-0 right-0 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 px-4 text-xs sm:text-sm"
      style={{ height: 64, zIndex: 200, background: "#6366f1", boxShadow: "0 2px 12px rgba(0,0,0,0.35)" }}
    >
      <span className="hidden sm:inline" style={{ color: "rgba(0,0,0,0.55)" }}>
        {lang === "en" ? "This is your public page —" : "Questa è la tua pagina pubblica —"}
      </span>
      <a href="/account" className="font-semibold transition-opacity hover:opacity-70" style={{ color: "#000" }}>
        {lang === "en" ? "Your account" : "Il tuo account"}
      </a>
      <span style={{ color: "rgba(0,0,0,0.3)" }}>·</span>
      <PdfExportButton
        slug={slug}
        label={lang === "en" ? "Download PDF ↓" : "Scarica PDF ↓"}
        credits={credits}
        className="font-semibold text-foreground transition-opacity hover:opacity-70"
      />
      <span style={{ color: "rgba(0,0,0,0.3)" }}>·</span>
      <WordExportButton
        slug={slug}
        label={lang === "en" ? "Download Word ↓" : "Scarica Word ↓"}
        credits={credits}
        className="font-semibold text-foreground transition-opacity hover:opacity-70"
      />
      {kind === "primary" && (
        <>
          <span style={{ color: "rgba(0,0,0,0.3)" }}>·</span>
          <a href={`/tailor?profile=${slug}`} className="font-bold underline underline-offset-2 transition-opacity hover:opacity-70" style={{ color: "#000" }}>
            {lang === "en" ? "Tailor to a job posting →" : "Adatta a un annuncio →"}
          </a>
        </>
      )}
    </div>
    {/* Own page freshly opened is already the "got real value" moment
        here (unlike /tailor, which produces a downloadable file rather
        than a page) — no need to wait for an actual download. */}
    {kind === "primary" && <ActionFeedbackPopup actionType="generate" trigger={true} />}
    </>
  );
}
