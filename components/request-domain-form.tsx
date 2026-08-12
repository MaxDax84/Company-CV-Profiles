"use client";

import { useState, type FormEvent } from "react";

export default function RequestDomainForm() {
  const [desiredDomain, setDesiredDomain] = useState("");
  const [note, setNote] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

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
        Richiesta inviata — ti contatteremo via email per i dettagli.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs text-muted-foreground/60 mb-1">Dominio desiderato (opzionale)</label>
        <input
          type="text"
          value={desiredDomain}
          onChange={e => setDesiredDomain(e.target.value)}
          placeholder="es. mario-rossi.it"
          className="w-full bg-black/[0.03] border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50"
        />
      </div>
      <div>
        <label className="block text-xs text-muted-foreground/60 mb-1">Note (opzionale)</label>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          placeholder="Altri dettagli utili"
          className="w-full bg-black/[0.03] border border-black/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
        />
      </div>
      <button
        type="submit"
        disabled={status === "sending"}
        className="px-4 py-2 rounded-lg text-xs font-semibold disabled:opacity-50"
        style={{ background: "#6366f1", color: "#000" }}
      >
        {status === "sending" ? "Invio…" : "Richiedi dominio personalizzato"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-600">Non siamo riusciti a inviare la richiesta. Riprova o scrivici direttamente.</p>
      )}
    </form>
  );
}
