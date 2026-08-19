"use client";

interface CreditConfirmModalProps {
  actionLabel: string;
  cost: number;
  balance: number;
  /** Extra note shown above the cost line — e.g. a low job-relevance warning. */
  warning?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

// Shared by every credit-spending action (PDF download, cover letter,
// tailoring) — actual enforcement always happens server-side in
// spend_credits regardless of what this shows, so a `balance` that's a
// render-cycle stale (same caveat the existing "Crediti esauriti" banners
// already accept) is fine; this is a heads-up, not the source of truth.
export default function CreditConfirmModal({ actionLabel, cost, balance, warning, onConfirm, onCancel }: CreditConfirmModalProps) {
  const insufficient = balance < cost;

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
          <p className="text-xs rounded-lg px-3 py-2 text-left" style={{ background: "rgba(251,191,36,0.1)", color: "rgba(180,130,10,0.95)", border: "1px solid rgba(251,191,36,0.3)" }}>
            ⚠️ {warning}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          {insufficient
            ? `Non hai abbastanza crediti per questa azione — saldo attuale: ${balance}.`
            : `Costa ${cost} credito${cost > 1 ? "i" : ""}. Saldo attuale: ${balance} credit${balance === 1 ? "o" : "i"}.`}
        </p>
        <div className="flex gap-2 justify-center pt-1">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Annulla
          </button>
          {insufficient ? (
            <a
              href="/account?tab=credits"
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Vai ai crediti
            </a>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Conferma
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
