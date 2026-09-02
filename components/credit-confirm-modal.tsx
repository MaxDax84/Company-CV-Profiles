"use client";

import { useLanguage } from "./language-provider";

interface CreditConfirmModalProps {
  actionLabel: string;
  cost: number;
  balance: number;
  /** Extra note shown above the cost line — e.g. a low job-relevance warning. */
  warning?: string;
  /** Optional link rendered inside the warning box (e.g. "open the existing CV"). */
  warningLink?: { href: string; label: string };
  // For a free action that still needs a warn-and-confirm step (e.g.
  // tailoring, which only the resulting download costs a credit for) —
  // hides the cost/balance line and the "insufficient credits" branch
  // entirely, since neither applies.
  hideCost?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// Shared by every credit-spending action (PDF download, cover letter,
// tailoring) — actual enforcement always happens server-side in
// spend_credits regardless of what this shows, so a `balance` that's a
// render-cycle stale (same caveat the existing "Crediti esauriti" banners
// already accept) is fine; this is a heads-up, not the source of truth.
export default function CreditConfirmModal({ actionLabel, cost, balance, warning, warningLink, hideCost, onConfirm, onCancel }: CreditConfirmModalProps) {
  const { lang } = useLanguage();
  const insufficient = !hideCost && balance < cost;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="glass-card rounded-2xl p-6 max-w-sm w-full space-y-4 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-semibold">{actionLabel}</p>
        {warning && (
          <div className="text-xs rounded-lg px-3 py-2 text-left space-y-1.5" style={{ background: "rgba(251,191,36,0.1)", color: "rgba(180,130,10,0.95)", border: "1px solid rgba(251,191,36,0.3)" }}>
            <p>⚠️ {warning}</p>
            {warningLink && (
              <a href={warningLink.href} className="font-semibold underline underline-offset-2 block">
                {warningLink.label}
              </a>
            )}
          </div>
        )}
        {!hideCost && (
          <p className="text-sm text-muted-foreground">
            {insufficient
              ? (lang === "en"
                  ? `You don't have enough credits for this — current balance: ${balance}.`
                  : `Non hai abbastanza crediti per questa azione — saldo attuale: ${balance}.`)
              : (lang === "en"
                  ? `Costs ${cost} credit${cost > 1 ? "s" : ""}. Current balance: ${balance} credit${balance === 1 ? "" : "s"}.`
                  : `Costa ${cost} credit${cost > 1 ? "i" : "o"}. Saldo attuale: ${balance} credit${balance === 1 ? "o" : "i"}.`)}
          </p>
        )}
        <div className="flex gap-2 justify-center pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {lang === "en" ? "Cancel" : "Annulla"}
          </button>
          {insufficient ? (
            <a
              href="/account?tab=credits"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {lang === "en" ? "Go to credits" : "Vai ai crediti"}
            </a>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              {lang === "en" ? "Confirm" : "Conferma"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
