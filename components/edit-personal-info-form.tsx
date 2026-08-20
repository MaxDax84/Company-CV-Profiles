"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/language-provider";

interface EditPersonalInfoFormProps {
  fullName: string;
  title: string;
  location: string;
}

export default function EditPersonalInfoForm({ fullName, title, location }: EditPersonalInfoFormProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState({ full_name: fullName, title, location });
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const { lang } = useLanguage();

  async function handleSave() {
    setStatus("saving");
    try {
      const res = await fetch("/api/account/update-profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error();
      setStatus("idle");
      setEditing(false);
      router.refresh();
    } catch {
      setStatus("error");
    }
  }

  if (!editing) {
    return (
      <div className="sm:col-span-2 flex items-start justify-between gap-4">
        <div className="grid sm:grid-cols-3 gap-4 flex-1">
          <div>
            <p className="text-xs text-muted-foreground/60 mb-0.5">{lang === "en" ? "Name" : "Nome"}</p>
            <p className="text-sm font-medium">{fullName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground/60 mb-0.5">{lang === "en" ? "Current Role" : "Ruolo Attuale"}</p>
            <p className="text-sm font-medium">{title || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground/60 mb-0.5">{lang === "en" ? "Location" : "Località"}</p>
            <p className="text-sm font-medium">{location || "—"}</p>
          </div>
        </div>
        <button
          onClick={() => setEditing(true)}
          className="text-xs font-semibold text-primary hover:opacity-80 transition-opacity shrink-0"
        >
          {lang === "en" ? "Edit" : "Modifica"}
        </button>
      </div>
    );
  }

  return (
    <div className="sm:col-span-2 space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-muted-foreground/60 mb-1 block">{lang === "en" ? "Name" : "Nome"}</label>
          <input
            value={values.full_name}
            onChange={e => setValues(v => ({ ...v, full_name: e.target.value }))}
            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground/60 mb-1 block">{lang === "en" ? "Current Role" : "Ruolo Attuale"}</label>
          <input
            value={values.title}
            onChange={e => setValues(v => ({ ...v, title: e.target.value }))}
            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </div>
        <div>
          <label className="text-xs text-muted-foreground/60 mb-1 block">{lang === "en" ? "Location" : "Località"}</label>
          <input
            value={values.location}
            onChange={e => setValues(v => ({ ...v, location: e.target.value }))}
            className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={status === "saving"}
          className="px-4 py-1.5 rounded-lg text-xs font-semibold disabled:opacity-50"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          {status === "saving" ? (lang === "en" ? "Saving…" : "Salvataggio…") : (lang === "en" ? "Save changes" : "Salva modifiche")}
        </button>
        <button
          onClick={() => setEditing(false)}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          {lang === "en" ? "Cancel" : "Annulla"}
        </button>
        {status === "error" && <p className="text-xs text-destructive">{lang === "en" ? "Error, try again." : "Errore, riprova."}</p>}
      </div>
    </div>
  );
}
