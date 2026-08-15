"use client";

const ACCENT = "#6366f1";

interface CreditConfirmModalProps {
  actionLabel: string;
  cost: number;
  balance: number;
  onConfirm: () => void;
  onCancel: () => void;
}

// Shared by every credit-spending action (PDF download, cover letter,
// tailoring) — actual enforcement always happens server-side in
// spend_credits regardless of what this shows, so a `balance` that's a
// render-cycle stale (same caveat the existing "Crediti esauriti" banners
// already accept) is fine; this is a heads-up, not the source of truth.
export default function CreditConfirmModal({ actionLabel, cost, balance, onConfirm, onCancel }: CreditConfirmModalProps) {
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
              style={{ background: ACCENT, color: "#000" }}
            >
              Vai ai crediti
            </a>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: ACCENT, color: "#000" }}
            >
              Conferma
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
