"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/components/language-provider";

export default function RequestDomainForm() {
  const [desiredDomain, setDesiredDomain] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const { lang } = useLanguage();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/account/request-domain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ desiredDomain: desiredDomain.trim(), note: note.trim() }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setDesiredDomain("");
      setNote("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className="text-xs text-green-700">
        {lang === "en" ? "Request sent — we'll contact you by email with the details." : "Richiesta inviata — ti contatteremo via email per i dettagli."}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-muted-foreground/60 mb-1">
          {lang === "en" ? "Desired domain (optional)" : "Dominio desiderato (opzionale)"}
        </label>
        <input
          type="text"
          value={desiredDomain}
          onChange={e => setDesiredDomain(e.target.value)}
          placeholder={lang === "en" ? "e.g. mario-rossi.com" : "es. mario-rossi.it"}
          className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground/60 mb-1">{lang === "en" ? "Notes (optional)" : "Note (opzionale)"}</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          placeholder={lang === "en" ? "Any other useful details" : "Altri dettagli utili"}
          className="w-full bg-foreground/[0.03] border border-foreground/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        {status === "sending" ? (lang === "en" ? "Sending…" : "Invio…") : (lang === "en" ? "Request custom domain" : "Richiedi dominio personalizzato")}
      </button>
      {status === "error" && (
        <p className="text-xs text-destructive">
          {lang === "en" ? "We couldn't send the request. Try again or contact us directly." : "Non siamo riusciti a inviare la richiesta. Riprova o scrivici direttamente."}
        </p>
      )}
    </form>
  );
}
