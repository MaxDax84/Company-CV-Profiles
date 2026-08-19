"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send } from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import type { ChatTurn } from "@/lib/cv-chat-question";
import CreditConfirmModal from "@/components/credit-confirm-modal";

interface CvChatProps {
  profile: { id: string; slug: string; data: ProfileSchema } | null;
  accountCode: string;
  credits: number;
}

type Status = "intro" | "loading" | "asking" | "ready" | "done" | "error" | "no-gaps";

type LastAction = { type: "start" } | { type: "answer"; answer: string } | { type: "finish" };

interface ChangedField {
  label: string;
  before: string;
  after: string;
}

function computeChangedFields(before: ProfileSchema, after: ProfileSchema): ChangedField[] {
  const changes: ChangedField[] = [];
  if (before.personal_info.bio !== after.personal_info.bio) {
    changes.push({ label: "Bio", before: before.personal_info.bio, after: after.personal_info.bio });
  }
  before.experience.forEach((exp, i) => {
    const afterExp = after.experience[i];
    if (!afterExp) return;
    const b = exp.description.join("\n");
    const a = afterExp.description.join("\n");
    if (b !== a) {
      changes.push({ label: `${exp.role} · ${exp.company}`, before: b, after: a });
    }
  });
  return changes;
}

export default function CvChat({ profile: profileProp, accountCode, credits }: CvChatProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("intro");
  const [transcript, setTranscript] = useState<ChatTurn[]>([]);
  const [questionCount, setQuestionCount] = useState(0);
  const [answerText, setAnswerText] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [lastAction, setLastAction] = useState<LastAction | null>(null);
  const [changedFields, setChangedFields] = useState<ChangedField[]>([]);

  if (!profileProp) {
    return (
      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-6 text-center space-y-3">
        <p className="text-sm font-semibold">Genera prima il tuo profilo</p>
        <p className="text-xs text-muted-foreground">
          Per usare l&apos;assistente serve prima un profilo, creato dal tuo CV.
        </p>
        <a
          href="/generate"
          className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          Carica il tuo CV →
        </a>
      </div>
    );
  }
  // Reassigned to a plain const (not the destructured parameter) so
  // TypeScript retains the non-null narrowing inside the closures defined
  // below (askForNext/handleFinish) — narrowing a destructured parameter
  // doesn't persist into nested function bodies, narrowing a const does.
  const profile = profileProp;

  async function askForNext(answer?: string) {
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/cv-chat/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(answer ? { answer } : {}),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Errore, riprova.");
        setStatus("error");
        return;
      }
      setTranscript(data.transcript ?? []);
      setQuestionCount(data.questionCount ?? 0);
      if (data.done) {
        setStatus((data.transcript ?? []).some((t: ChatTurn) => t.role === "user") ? "ready" : "no-gaps");
      } else {
        setStatus("asking");
      }
    } catch {
      setErrorMsg("Errore di rete, riprova.");
      setStatus("error");
    }
  }

  function handleStart() {
    setLastAction({ type: "start" });
    askForNext();
  }

  function handleSubmitAnswer() {
    const answer = answerText.trim();
    if (!answer) return;
    setAnswerText("");
    setLastAction({ type: "answer", answer });
    askForNext(answer);
  }

  async function handleFinish() {
    setConfirming(false);
    setStatus("loading");
    setErrorMsg("");
    setLastAction({ type: "finish" });
    try {
      const res = await fetch("/api/cv-chat/finish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Errore, riprova.");
        setStatus("error");
        return;
      }
      setChangedFields(computeChangedFields(profile.data, data.profile));
      setStatus("done");
      router.refresh();
    } catch {
      setErrorMsg("Errore di rete, riprova.");
      setStatus("error");
    }
  }

  function handleRetry() {
    if (!lastAction) return;
    if (lastAction.type === "start") askForNext();
    else if (lastAction.type === "answer") askForNext(lastAction.answer);
    else if (lastAction.type === "finish") handleFinish();
  }

  const lastQuestion = [...transcript].reverse().find((t) => t.role === "assistant");

  return (
    <div className="space-y-6">
      {status === "intro" && (
        <div className="glass-card rounded-2xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <p className="text-sm font-semibold">Rifinisci il tuo CV con l&apos;assistente AI</p>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Ti farò qualche domanda mirata (massimo 6) per far emergere numeri e risultati concreti che magari non hai scritto — ad esempio &quot;di quanto sono aumentate le vendite?&quot;. Uso solo quello che mi dici tu: non invento mai nulla.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Inizia →
          </button>
        </div>
      )}

      {(status === "asking" || status === "loading" || status === "ready" || status === "error") && transcript.length > 0 && (
        <div className="space-y-3">
          {transcript.map((turn, i) => (
            <div key={i} className={`flex ${turn.role === "assistant" ? "justify-start" : "justify-end"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${turn.role === "assistant" ? "glass-card" : ""}`}
                style={turn.role === "user" ? { background: "var(--primary)", color: "var(--primary-foreground)" } : undefined}
              >
                {turn.content}
              </div>
            </div>
          ))}
        </div>
      )}

      {status === "loading" && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div
            className="w-4 h-4 rounded-full border-[2px] border-foreground/15 animate-spin"
            style={{ borderTopColor: "var(--primary)" }}
          />
          Sto pensando alla prossima domanda…
        </div>
      )}

      {status === "asking" && lastQuestion && (
        <div className="flex items-end gap-2">
          <textarea
            value={answerText}
            onChange={(e) => setAnswerText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmitAnswer();
              }
            }}
            placeholder="Scrivi la tua risposta…"
            rows={2}
            className="flex-1 rounded-xl border border-foreground/10 bg-foreground/[0.03] px-3 py-2 text-sm outline-none focus:border-primary/50 resize-none"
          />
          <button
            type="button"
            onClick={handleSubmitAnswer}
            disabled={!answerText.trim()}
            className="shrink-0 p-2.5 rounded-xl disabled:opacity-40"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            aria-label="Invia"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {status === "no-gaps" && (
        <div className="glass-card rounded-2xl p-6 text-center space-y-2">
          <p className="text-sm font-semibold">Il tuo CV è già ben specificato</p>
          <p className="text-xs text-muted-foreground">Non ho trovato vuoti utili da chiederti in questo momento.</p>
        </div>
      )}

      {status === "ready" && (
        <div className="glass-card rounded-2xl p-6 text-center space-y-3">
          <p className="text-sm font-semibold">Ho abbastanza informazioni per aggiornare il tuo CV</p>
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            Genera CV aggiornato (1 credito)
          </button>
        </div>
      )}

      {status === "error" && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-center space-y-2">
          <p className="text-xs text-destructive">{errorMsg}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="text-xs font-semibold underline underline-offset-2"
          >
            Riprova
          </button>
        </div>
      )}

      {status === "done" && (
        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-6 text-center space-y-1">
            <p className="text-sm font-semibold">CV aggiornato ✓</p>
            <p className="text-xs text-muted-foreground">
              {changedFields.length > 0
                ? `${changedFields.length} sezion${changedFields.length === 1 ? "e" : "i"} migliorat${changedFields.length === 1 ? "a" : "e"}.`
                : "Le tue risposte non hanno aggiunto informazioni utilizzabili, il CV resta invariato."}
            </p>
          </div>
          {changedFields.map((c, i) => (
            <div key={i} className="rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-5 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50">{c.label}</p>
              <p className="text-xs text-muted-foreground/60 line-through decoration-muted-foreground/30">{c.before}</p>
              <p className="text-sm font-medium" style={{ color: "var(--primary)" }}>{c.after}</p>
            </div>
          ))}
          <div className="flex gap-2 justify-center">
            <a
              href={`/${accountCode}/${profile.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex px-5 py-2.5 rounded-xl font-semibold text-sm"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Vedi il profilo aggiornato
            </a>
            <button
              type="button"
              onClick={() => {
                setStatus("intro");
                setTranscript([]);
                setQuestionCount(0);
                setChangedFields([]);
              }}
              className="px-4 py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Ricomincia
            </button>
          </div>
        </div>
      )}

      {confirming && (
        <CreditConfirmModal
          actionLabel="Generare il CV aggiornato in base alle tue risposte?"
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={handleFinish}
        />
      )}
    </div>
  );
}
