"use client";

import { useEffect, useState } from "react";
import AdminNav from "@/components/admin-nav";

interface UserRow {
  userId: string;
  email: string | null;
  code: string | null;
  signupAt: string | null;
  currentBalance: number;
  totalSpent: number;
  totalGranted: number;
  spendCount: number;
  lastActivityAt: string | null;
  spentByReason: Record<string, number>;
}

interface UsersResponse {
  users: UserRow[];
  truncated: boolean;
}

function fmtDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminUsersPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [data, setData] = useState<UsersResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  async function loadUsers() {
    setLoadError(null);
    const res = await fetch("/api/admin/users");
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
    loadUsers();
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
    await loadUsers();
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

  const users = data?.users ?? [];
  const activeUsers = users.filter((u) => u.spendCount > 0);
  const totalUsers = users.length;
  const totalSpentAll = users.reduce((sum, u) => sum + u.totalSpent, 0);
  const avgSpentActive = activeUsers.length > 0 ? totalSpentAll / activeUsers.length : 0;

  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl font-bold">Utenti per Crediti Usati</h1>
          <button onClick={handleLogout} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Esci
          </button>
        </div>

        <AdminNav />

        {loadError && <p className="text-sm text-destructive">{loadError}</p>}

        {data && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: "Account totali", value: totalUsers.toLocaleString("it-IT") },
                { label: "Account attivi (≥1 spesa)", value: activeUsers.length.toLocaleString("it-IT") },
                { label: "Crediti spesi (totale)", value: totalSpentAll.toLocaleString("it-IT") },
                { label: "Media per attivo", value: avgSpentActive.toFixed(1) },
              ].map((card) => (
                <div key={card.label} className="rounded-xl border border-foreground/10 p-4 space-y-1">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground/60">{card.label}</p>
                  <p className="text-lg font-bold">{card.value}</p>
                </div>
              ))}
            </div>
            {data.truncated && (
              <p className="text-xs text-amber-500">
                Nota: il ledger crediti ha più righe del limite considerato — la classifica potrebbe non coprire lo storico più vecchio.
              </p>
            )}

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                Classifica per crediti spesi
              </p>
              <div className="overflow-x-auto rounded-xl border border-foreground/10">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-foreground/10 text-left text-[10px] uppercase tracking-widest text-muted-foreground/60">
                      <th className="px-3 py-2 font-medium">#</th>
                      <th className="px-3 py-2 font-medium">Account</th>
                      <th className="px-3 py-2 font-medium text-right">Crediti spesi</th>
                      <th className="px-3 py-2 font-medium text-right">Saldo attuale</th>
                      <th className="px-3 py-2 font-medium text-right">N. transazioni</th>
                      <th className="px-3 py-2 font-medium text-right">Registrato il</th>
                      <th className="px-3 py-2 font-medium text-right">Ultima attività</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u.userId} className="border-b border-foreground/5 last:border-0">
                        <td className="px-3 py-2 tabular-nums text-muted-foreground/50">{i + 1}</td>
                        <td className="px-3 py-2">
                          <span className="text-sm">{u.email ?? "—"}</span>
                          <span className="block font-mono text-[10px] text-muted-foreground/50">{u.code ?? u.userId.slice(0, 8)}</span>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums font-semibold">{u.totalSpent}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{u.currentBalance}</td>
                        <td className="px-3 py-2 text-right tabular-nums">{u.spendCount}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-xs text-muted-foreground">{fmtDate(u.signupAt)}</td>
                        <td className="px-3 py-2 text-right tabular-nums text-xs text-muted-foreground">{fmtDate(u.lastActivityAt)}</td>
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
