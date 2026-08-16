"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditableSlugProps {
  profileId: string;
  slug: string;
}

export default function EditableSlug({ profileId, slug }: EditableSlugProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(slug);
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSave() {
    if (value.trim() === slug) {
      setEditing(false);
      return;
    }
    setStatus("saving");
    try {
      const res = await fetch("/api/account/rename-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: profileId, slug: value }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(data.error ?? "Errore, riprova.");
        return;
      }
      setStatus("idle");
      setEditing(false);
      router.refresh();
    } catch {
      setStatus("error");
      setErrorMsg("Errore, riprova.");
    }
  }

  if (!editing) {
    return (
      <div className="space-y-0.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
          Nome del CV caricato come PDF:
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/60">
          <span className="truncate">{slug}</span>
          <button
            onClick={() => { setValue(slug); setEditing(true); setStatus("idle"); }}
            className="font-semibold text-primary hover:opacity-80 transition-opacity shrink-0"
          >
            Modifica nome
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/40">
        Nome del CV caricato come PDF:
      </p>
      <div className="flex items-center gap-2">
        <input
          value={value}
          onChange={e => setValue(e.target.value)}
          className="flex-1 min-w-0 bg-foreground/[0.03] border border-foreground/10 rounded-lg px-2.5 py-1 text-xs outline-none focus:border-primary/50"
        />
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity disabled:opacity-50 shrink-0"
        >
          {status === "saving" ? "Salvataggio…" : "Salva"}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors shrink-0"
        >
          Annulla
        </button>
      </div>
      {status === "error" && <p className="text-xs text-red-600">{errorMsg}</p>}
    </div>
  );
}
