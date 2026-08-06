"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="text-xs text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
    >
      {loading ? "Uscita…" : "Esci"}
    </button>
  );
}

export function DeleteProfileButton() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "deleting" | "error">("idle");

  async function handleDelete() {
    if (!window.confirm("Sei sicuro? Il profilo e il suo link smetteranno di funzionare subito.")) return;
    setStatus("deleting");
    try {
      const res = await fetch("/api/account/profile", { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleDelete}
        disabled={status === "deleting"}
        className="text-xs text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
      >
        {status === "deleting" ? "Eliminazione…" : "Elimina profilo"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-400">Qualcosa è andato storto. Riprova.</p>
      )}
    </div>
  );
}
