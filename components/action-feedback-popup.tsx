"use client";

import { useEffect, useState } from "react";
import { Star, X } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { hasGivenFeedback, dismissFeedback, submitFeedback, type FeedbackActionType } from "@/lib/action-feedback";

interface ActionFeedbackPopupProps {
  actionType: FeedbackActionType;
  // Flips true right when the user has just gotten real value out of the
  // action (a PDF actually downloaded, a tailoring run completed) — the
  // popup checks eligibility (not signed in / already answered / already
  // dismissed) at that moment rather than on every render, so it never
  // flashes for someone who already answered.
  trigger: boolean;
}

const PROMPTS: Record<FeedbackActionType, { it: string; en: string }> = {
  generate: {
    it: "Com'è andato il tuo nuovo CV?",
    en: "How did your new CV turn out?",
  },
  tailor: {
    it: "Com'è andato l'adattamento all'annuncio?",
    en: "How did the tailoring turn out?",
  },
};

export default function ActionFeedbackPopup({ actionType, trigger }: ActionFeedbackPopupProps) {
  const { lang } = useLanguage();
  const [visible, setVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!trigger) return;
    let cancelled = false;
    // Small delay so it doesn't compete for attention with whatever the
    // triggering action (a download, a "done" screen) is already showing.
    const timer = setTimeout(async () => {
      const already = await hasGivenFeedback(actionType);
      if (!cancelled && !already) setVisible(true);
    }, 1200);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
    // trigger is meant to fire once per mount (state flipping true), so it's
    // the only real dependency — actionType is fixed per usage site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trigger]);

  function handleClose() {
    dismissFeedback(actionType);
    setVisible(false);
  }

  async function handleSubmit(finalRating: number) {
    setRating(finalRating);
    await submitFeedback(actionType, finalRating, comment);
    setSubmitted(true);
    setTimeout(() => setVisible(false), 1800);
  }

  if (!visible) return null;

  return (
    <div
      className="fixed z-40 bottom-4 inset-x-4 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:w-80 rounded-2xl border p-4 space-y-3 relative"
      style={{ background: "var(--background)", borderColor: "var(--border)", boxShadow: "0 12px 32px rgba(0,0,0,0.35)" }}
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label={lang === "en" ? "Close" : "Chiudi"}
        className="absolute top-3 right-3 text-muted-foreground/50 hover:text-foreground transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>

      {submitted ? (
        <p className="text-sm font-semibold text-center py-2">
          {lang === "en" ? "Thanks for the feedback!" : "Grazie per il feedback!"}
        </p>
      ) : (
        <>
          <p className="text-sm font-semibold pr-4">{PROMPTS[actionType][lang]}</p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                onMouseEnter={() => setHoverRating(n)}
                onMouseLeave={() => setHoverRating(0)}
                aria-label={`${n} ${lang === "en" ? "stars" : "stelle"}`}
                className="p-0.5"
              >
                <Star
                  className="w-6 h-6 transition-colors"
                  style={{
                    fill: n <= (hoverRating || rating) ? "var(--primary)" : "transparent",
                    color: n <= (hoverRating || rating) ? "var(--primary)" : "var(--muted-foreground)",
                  }}
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <div className="space-y-2">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={lang === "en" ? "What could we improve? (optional)" : "Cosa possiamo migliorare? (facoltativo)"}
                rows={2}
                className="w-full text-xs rounded-lg border px-3 py-2 outline-none focus:border-primary/50 resize-none"
                style={{ borderColor: "var(--border)", background: "transparent" }}
              />
              <button
                type="button"
                onClick={() => handleSubmit(rating)}
                className="w-full py-2 rounded-lg text-xs font-semibold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >
                {lang === "en" ? "Send" : "Invia"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
