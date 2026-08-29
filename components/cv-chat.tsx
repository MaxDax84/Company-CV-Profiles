"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send, SkipForward } from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import CreditConfirmModal from "@/components/credit-confirm-modal";

interface ChatTurn {
  question: string;
  targetField: string;
  answer: string;
}

type Phase = "intro" | "asking" | "loading" | "ready" | "finishing" | "done" | "error";

interface CvChatProps {
  profile: ProfileSchema;
  credits: number;
}

const SKIP_ANSWER = "Non lo so / preferisco non rispondere";

// Resolves a target_field path like "experience[1].description[2]" or
// "personal_info.bio" against a real profile object — used only to render
// the before/after summary, never to decide what the AI is allowed to
// change (that's enforced server-side).
function getByPath(profile: ProfileSchema, path: string): unknown {
  const parts = path.match(/[^.[\]]+/g) ?? [];
  let cur: unknown = profile;
  for (const part of parts) {
    if (cur == null) return undefined;
    cur = /^\d+$/.test(part) ? (cur as unknown[])[Number(part)] : (cur as Record<string, unknown>)[part];
  }
  return cur;
}

export default function CvChat({ profile, credits }: CvChatProps) {
  const router = useRouter();
  // Snapshotted once on mount, deliberately never updated from the `profile`
  // prop again — the "done" screen's before/after diff compares against
  // this. Without the snapshot, router.refresh() (called right after a
  // successful finish, to update the rest of the account page) re-fetches
  // the server data and hands this component the ALREADY-rewritten profile
  // as its new `profile` prop, which made "before" and "after" the same
  // value and silently emptied every diff card.
  const [originalProfile] = useState(profile);
  const [phase, setPhase] = useState<Phase>("intro");
  const [transcript, setTranscript] = useState<ChatTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<{ question: string; targetField: string } | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [finalProfile, setFinalProfile] = useState<ProfileSchema | null>(null);

  async function requestNextQuestion(body: Record<string, string>) {
    setPhase("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/cv-chat/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Errore, riprova.");
        setPhase("error");
        return;
      }
      if (data.done) {
        setCurrentQuestion(null);
        setPhase("ready");
        return;
      }
      setCurrentQuestion({ question: data.question, targetField: data.targetField });
      setPhase("asking");
    } catch {
      setErrorMsg("Errore di rete, riprova.");
      setPhase("error");
    }
  }

  function handleStart() {
    requestNextQuestion({});
  }

  function submitAnswer(answer: string) {
    if (!currentQuestion) return;
    setTranscript((t) => [...t, { question: currentQuestion.question, targetField: currentQuestion.targetField, answer }]);
    setAnswerInput("");
    requestNextQuestion({
      answer,
      pendingQuestion: currentQuestion.question,
      pendingTargetField: currentQuestion.targetField,
    });
  }

  async function handleConfirmFinish() {
    setConfirming(false);
    setPhase("finishing");
    setErrorMsg("");
    try {
      const res = await fetch("/api/cv-chat/finish", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? "Errore, riprova.");
        setPhase("error");
        return;
      }
      setFinalProfile(data.profile);
      setPhase("done");
      router.refresh();
    } catch {
      setErrorMsg("Errore di rete, riprova.");
      setPhase("error");
    }
  }

  function handleReset() {
    setPhase("intro");
    setTranscript([]);
    setCurrentQuestion(null);
    setAnswerInput("");
    setFinalProfile(null);
    setErrorMsg("");
  }

  const answeredCount = transcript.length;

  return (
    <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
      {phase === "intro" && (
        <div className="text-center space-y-4 py-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="font-heading text-lg font-bold">Rifinisci il tuo CV con l'AI</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Ti faccio qualche domanda mirata (massimo 6) per far emergere numeri e risultati concreti che mancano nel tuo CV — solo quello che mi dici tu, mai inventato. Alla fine riscrivo i punti coinvolti per 1 credito, speso solo se confermi.
            </p>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <Sparkles className="w-4 h-4" />
            Inizia
          </button>
        </div>
      )}

      {(phase === "asking" || phase === "loading") && (
        <div className="space-y-4">
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {transcript.map((turn, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-start">
                  <p className="max-w-[85%] text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 bg-foreground/[0.05]">{turn.question}</p>
                </div>
                <div className="flex justify-end">
                  <p
                    className="max-w-[85%] text-sm rounded-2xl rounded-tr-sm px-4 py-2.5"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    {turn.answer}
                  </p>
                </div>
              </div>
            ))}
            {currentQuestion && (
              <div className="flex justify-start">
                <p className="max-w-[85%] text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 bg-foreground/[0.05]">{currentQuestion.question}</p>
              </div>
            )}
            {phase === "loading" && (
              <div className="flex justify-start">
                <p className="text-xs text-muted-foreground/50 px-4 py-2">Sto pensando alla prossima domanda…</p>
              </div>
            )}
          </div>

          {phase === "asking" && currentQuestion && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (answerInput.trim()) submitAnswer(answerInput.trim());
              }}
              className="space-y-2"
            >
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={answerInput}
                  onChange={(e) => setAnswerInput(e.target.value)}
                  placeholder="Scrivi la tua risposta…"
                  autoFocus
                  className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-foreground/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!answerInput.trim()}
                  aria-label="Invia risposta"
                  className="p-2.5 rounded-xl disabled:opacity-40 transition-opacity"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => submitAnswer(SKIP_ANSWER)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  Non lo so / salta
                </button>
                {answeredCount > 0 && (
                  <button
                    type="button"
                    onClick={() => { setCurrentQuestion(null); setPhase("ready"); }}
                    className="text-xs font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    Ho finito, applica le risposte →
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      )}

      {phase === "ready" && (
        <div className="space-y-4">
          {answeredCount > 0 ? (
            <>
              <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {transcript.map((turn, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="flex justify-start">
                      <p className="max-w-[85%] text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 bg-foreground/[0.05]">{turn.question}</p>
                    </div>
                    <div className="flex justify-end">
                      <p
                        className="max-w-[85%] text-sm rounded-2xl rounded-tr-sm px-4 py-2.5"
                        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                      >
                        {turn.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-center space-y-3 pt-2 border-t border-foreground/10">
                <p className="text-sm text-muted-foreground">
                  {answeredCount === 1
                    ? "Ho una risposta da applicare al tuo CV."
                    : `Ho ${answeredCount} risposte da applicare al tuo CV.`}
                </p>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  <Sparkles className="w-4 h-4" />
                  Conferma e riscrivi il CV
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-3 py-4">
              <p className="text-sm text-muted-foreground">
                Il tuo CV sembra già ben quantificato — non ho trovato altro da chiederti.
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold"
                style={{ color: "var(--primary)" }}
              >
                ← Torna indietro
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "finishing" && (
        <div className="text-center py-8 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/15 border-t-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Sto riscrivendo il tuo CV…</p>
        </div>
      )}

      {phase === "done" && finalProfile && (
        <div className="space-y-5">
          <p className="text-sm font-semibold text-center" style={{ color: "var(--primary)" }}>CV aggiornato ✓</p>
          <div className="space-y-3">
            {transcript.map((turn, i) => {
              const before = getByPath(originalProfile, turn.targetField);
              const after = getByPath(finalProfile, turn.targetField);
              const beforeText = Array.isArray(before) ? before.join(" · ") : String(before ?? "");
              const afterText = Array.isArray(after) ? after.join(" · ") : String(after ?? "");
              if (beforeText === afterText) return null;
              return (
                <div key={i} className="rounded-xl border border-foreground/10 p-3 space-y-1.5 text-xs">
                  <p className="text-muted-foreground/60 line-through decoration-muted-foreground/30">{beforeText || "(vuoto)"}</p>
                  <p className="font-medium">{afterText}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <button
              type="button"
              onClick={handleReset}
              className="text-sm font-semibold"
              style={{ color: "var(--primary)" }}
            >
              Fatto
            </button>
          </div>
        </div>
      )}

      {phase === "error" && (
        <div className="text-center space-y-3 py-4">
          <p className="text-sm text-destructive">{errorMsg}</p>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs font-semibold"
            style={{ color: "var(--primary)" }}
          >
            ← Ricomincia
          </button>
        </div>
      )}

      {confirming && (
        <CreditConfirmModal
          actionLabel="Riscrivere il CV con queste risposte?"
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirmFinish}
        />
      )}
    </div>
  );
}
