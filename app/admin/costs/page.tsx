"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin-nav";

// Human-readable labels for lib/log-claude-usage.ts's ClaudeOperation union
// — kept as a lookup (not a rename of the underlying values) so the raw
// operation string stays a stable, grep-able identifier in the database and
// codebase; only this dashboard needs it to read naturally.
const OPERATION_LABELS: Record<string, string> = {
  parse_resume: "Analisi del CV caricato",
  improve_resume: "Miglioramento del CV",
  tailor_resume: "Adattamento a un annuncio",
  relevance_check: "Controllo pertinenza annuncio",
  cover_letter: "Lettera di presentazione",
  translate_resume: "Traduzione CV",
  translate_cover_letter: "Traduzione lettera di presentazione",
  cv_chat_question: "Chat AI (domanda)",
  cv_chat_finish: "Chat AI (rifinitura CV)",
  interview_prep: "Preparazione colloquio",
};

function operationLabel(operation: string): string {
  return OPERATION_LABELS[operation] ?? operation;
}

// Where each operation actually sits in a user's real journey through the
// product, not how expensive it is — parse+improve happen on upload
// (/generate), the chat refinement is a later optional step on the same CV,
// then relevance-check+tailor happen when adapting to a job posting, and
// cover letters / translations are downstream extras either flow can reach.
// Unknown future operations sort last rather than erroring.
const OPERATION_PROCESS_ORDER = [
  "parse_resume",
  "improve_resume",
  "cv_chat_question",
  "cv_chat_finish",
  "relevance_check",
  "tailor_resume",
  "cover_letter",
  "translate_resume",
  "translate_cover_letter",
  "interview_prep",
];

function byProcessOrder(a: { operation: string }, b: { operation: string }): number {
  const ai = OPERATION_PROCESS_ORDER.indexOf(a.operation);
  const bi = OPERATION_PROCESS_ORDER.indexOf(b.operation);
  return (ai === -1 ? OPERATION_PROCESS_ORDER.length : ai) - (bi === -1 ? OPERATION_PROCESS_ORDER.length : bi);
}

interface OperationStat {
  operation: string;
  count: number;
  totalCost: number;
  avgCost: number;
  avgInputTokens: number;
  avgOutputTokens: number;
}

interface ModelStat {
  model: string;
  count: number;
  totalCost: number;
  avgCost: number;
}

interface CostsResponse {
  totalCalls: number;
  totalCost: number;
  avgCostPerCall: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  operations: OperationStat[];
  models: ModelStat[];
  dailyCosts: { day: string; cost: number }[];
  truncated: boolean;
}

function fmtUsd(n: number, decimals = 4) {
  return `$${n.toFixed(decimals)}`;
}

export default function AdminCostsPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [stats, setStats] = useState<CostsResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadStats() {
    setLoadError(null);
    const res = await fetch("/api/admin/costs");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      setLoadError((await res.json().catch(() => ({ error: "Errore" }))).error ?? "Errore");
      return;
    }
    setStats(await res.json());
    setAuthed(true);
  }

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoggingIn(false);
    if (!res.ok) {
      setLoginError((await res.json().catch(() => ({ error: "Errore" }))).error ?? "Password errata.");
      return;
    }
    setPassword("");
    await loadStats();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setStats(null);
    setAuthed(false);
  }

  if (authed === null) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-sm text-muted-foreground">Caricamento…</p>
      </main>
    );
  }

  if (!authed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
        <form onSubmit={handleLogin} className="w-full max-w-xs space-y-4 rounded-2xl border border-foreground/10 p-6" style={{ background: "var(--background)" }}>
          <h1 className="font-heading text-lg font-bold">Admin</h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-primary/50"
            style={{ borderColor: "var(--border)", background: "transparent" }}
          />
          {loginError && <p className="text-xs text-destructive">{loginError}</p>}
          <button
            type="submit"
            disabled={loggingIn || !password}
            className="w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            {loggingIn ? "Accesso…" : "Entra"}
          </button>
        </form>
      </main>
    );
  }

  const maxDaily = Math.max(1, ...(stats?.dailyCosts.map((d) => d.cost) ?? [0]));

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Costi API Claude</h1>
          <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Esci
          </button>
        </div>

        <AdminNav />

        {loadError && <p className="text-sm text-destructive">{loadError}</p>}

        {stats && (
          <>
            {/* Overview cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Costo totale", value: fmtUsd(stats.totalCost, 2) },
                { label: "Chiamate totali", value: stats.totalCalls.toLocaleString("it-IT") },
                { label: "Costo medio/chiamata", value: fmtUsd(stats.avgCostPerCall) },
                { label: "Token input+output", value: (stats.totalInputTokens + stats.totalOutputTokens).toLocaleString("it-IT") },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-foreground/10 p-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{card.label}</p>
                  <p className="text-lg font-bold">{card.value}</p>
                </div>
              ))}
            </div>
            {stats.truncated && (
              <p className="text-xs text-amber-500">
                Nota: mostrate solo le righe più recenti (limite raggiunto) — le statistiche potrebbero non coprire lo storico completo.
              </p>
            )}

            {/* Daily costs sparkline */}
            {stats.dailyCosts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Costo giornaliero (ultimi 30 giorni)</p>
                <div className="flex items-end gap-1 h-24 rounded-xl border border-foreground/10 p-3">
                  {stats.dailyCosts.map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center justify-end gap-1 group relative">
                      <div
                        className="w-full rounded-sm transition-all"
                        style={{ height: `${Math.max(2, (d.cost / maxDaily) * 100)}%`, background: "var(--primary)" }}
                        title={`${d.day}: ${fmtUsd(d.cost)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* By operation, ordered by where each step actually falls in the
                user's journey (upload → refine → tailor → extras), not by
                cost — see OPERATION_PROCESS_ORDER above. */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Costo medio per operazione (in ordine di processo)</p>
              <div className="overflow-x-auto rounded-xl border border-foreground/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left text-[10px] uppercase tracking-widest text-muted-foreground/60">
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">Operazione</th>
                      <th className="px-3 py-2 font-medium text-right">Chiamate</th>
                      <th className="px-3 py-2 font-medium text-right">Costo medio</th>
                      <th className="px-3 py-2 font-medium text-right">Costo totale</th>
                      <th className="px-3 py-2 font-medium text-right">Token medi (in/out)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...stats.operations].sort(byProcessOrder).map((op, i) => (
                      <tr key={op.operation} className="border-b border-foreground/5 last:border-0">
                        <td className="px-3 py-2 tabular-nums text-muted-foreground/50">{i + 1}</td>
                        <td className="px-3 py-2">
                          <span className="text-sm">{operationLabel(op.operation)}</span>
                          <span className="block font-mono text-[10px] text-muted-foreground/50">{op.operation}</span>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">{op.count}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-semibold">{fmtUsd(op.avgCost)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{fmtUsd(op.totalCost, 2)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-muted-foreground text-xs">
                          {op.avgInputTokens.toLocaleString("it-IT")} / {op.avgOutputTokens.toLocaleString("it-IT")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* By model */}
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Per modello</p>
              <div className="overflow-x-auto rounded-xl border border-foreground/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left text-[10px] uppercase tracking-widest text-muted-foreground/60">
                      <th className="px-3 py-2 font-medium">Modello</th>
                      <th className="px-3 py-2 font-medium text-right">Chiamate</th>
                      <th className="px-3 py-2 font-medium text-right">Costo medio</th>
                      <th className="px-3 py-2 font-medium text-right">Costo totale</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.models.map((m) => (
                      <tr key={m.model} className="border-b border-foreground/5 last:border-0">
                        <td className="px-3 py-2 font-mono text-xs">{m.model}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{m.count}</td>
                        <td className="px-3 py-2 text-right tabular-nums font-semibold">{fmtUsd(m.avgCost)}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{fmtUsd(m.totalCost, 2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
