"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import AdminNav from "@/components/admin-nav";

const ACTION_TYPE_LABELS: Record<string, string> = {
  generate: "Generazione CV",
  tailor: "Adattamento a un annuncio",
};

function actionTypeLabel(actionType: string): string {
  return ACTION_TYPE_LABELS[actionType] ?? actionType;
}

interface FeedbackEntry {
  action_type: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

interface ByActionType {
  actionType: string;
  count: number;
  avgRating: number;
}

interface FeedbackResponse {
  totalResponses: number;
  overallAvgRating: number;
  byActionType: ByActionType[];
  entries: FeedbackEntry[];
  truncated: boolean;
}

function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className="w-3.5 h-3.5"
          style={{
            fill: n <= rating ? "var(--primary)" : "transparent",
            color: n <= rating ? "var(--primary)" : "var(--muted-foreground)",
          }}
        />
      ))}
    </div>
  );
}

export default function AdminFeedbackPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [data, setData] = useState<FeedbackResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadFeedback() {
    setLoadError(null);
    const res = await fetch("/api/admin/feedback");
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    if (!res.ok) {
      setLoadError((await res.json().catch(() => ({ error: "Errore" }))).error ?? "Errore");
      return;
    }
    setData(await res.json());
    setAuthed(true);
  }

  useEffect(() => {
    loadFeedback();
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
    await loadFeedback();
  }

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setData(null);
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

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Feedback utenti</h1>
          <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Esci
          </button>
        </div>

        <AdminNav />

        {loadError && <p className="text-sm text-destructive">{loadError}</p>}

        {data && (
          <>
            {/* Overview cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="rounded-xl border border-foreground/10 p-4 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Risposte totali</p>
                <p className="text-lg font-bold">{data.totalResponses}</p>
              </div>
              <div className="rounded-xl border border-foreground/10 p-4 space-y-1">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">Valutazione media</p>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold">{data.overallAvgRating.toFixed(1)}</p>
                  {data.totalResponses > 0 && <StarRow rating={Math.round(data.overallAvgRating)} />}
                </div>
              </div>
            </div>

            {data.totalResponses === 0 ? (
              <p className="text-sm text-muted-foreground">Nessun feedback ricevuto finora.</p>
            ) : (
              <>
                {/* By action type */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Media per tipo di azione</p>
                  <div className="overflow-x-auto rounded-xl border border-foreground/10">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-foreground/10 text-left text-[10px] uppercase tracking-widest text-muted-foreground/60">
                          <th className="px-3 py-2 font-medium">Azione</th>
                          <th className="px-3 py-2 font-medium text-right">Risposte</th>
                          <th className="px-3 py-2 font-medium text-right">Media</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.byActionType.map((row) => (
                          <tr key={row.actionType} className="border-b border-foreground/5 last:border-0">
                            <td className="px-3 py-2">{actionTypeLabel(row.actionType)}</td>
                            <td className="px-3 py-2 text-right tabular-nums">{row.count}</td>
                            <td className="px-3 py-2 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="tabular-nums font-semibold">{row.avgRating.toFixed(1)}</span>
                                <StarRow rating={Math.round(row.avgRating)} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Individual entries */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">Tutte le risposte</p>
                  <div className="space-y-2">
                    {data.entries.map((entry, i) => (
                      <div key={i} className="rounded-xl border border-foreground/10 p-4 space-y-1.5">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <StarRow rating={entry.rating} />
                            <span className="text-xs font-semibold text-muted-foreground">{actionTypeLabel(entry.action_type)}</span>
                          </div>
                          <span className="text-[10px] text-muted-foreground/50">
                            {new Date(entry.created_at).toLocaleString("it-IT")}
                          </span>
                        </div>
                        {entry.comment && <p className="text-sm text-foreground/80">{entry.comment}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </main>
  );
}
