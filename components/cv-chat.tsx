"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Send, SkipForward } from "lucide-react";
import CreditConfirmModal from "@/components/credit-confirm-modal";
import { useLanguage } from "@/components/language-provider";

interface ChatTurn {
  question: string;
  targetField: string;
  answer: string;
}

type Phase = "intro" | "asking" | "loading" | "ready" | "finishing" | "error";

interface CvChatProps {
  slug: string;
  credits: number;
  // Called right after a successful rewrite, with the CV's possibly-renamed
  // slug (see app/api/cv-chat/finish/route.ts's "-powered-by-ai" tag) — the
  // parent closes this panel and shows its own confirmation toast, since
  // the CV list it reorders lives one level up, not in this component.
  onFinished?: (newSlug: string) => void;
}

export default function CvChat({ slug, credits, onFinished }: CvChatProps) {
  const router = useRouter();
  const { lang } = useLanguage();
  const tr = (it: string, en: string) => (lang === "en" ? en : it);
  // Sent as the literal "answer" text when the user skips a question — kept
  // in whichever language the UI itself is in, since it ends up in the
  // transcript alongside the user's own real answers.
  const skipAnswer = tr("Non lo so / preferisco non rispondere", "I don't know / I'd rather not answer");
  const genericError = tr("Errore, riprova.", "Something went wrong, try again.");
  const networkError = tr("Errore di rete, riprova.", "Network error, try again.");

  const [phase, setPhase] = useState<Phase>("intro");
  const [transcript, setTranscript] = useState<ChatTurn[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<{ question: string; targetField: string } | null>(null);
  const [answerInput, setAnswerInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirming, setConfirming] = useState(false);

  async function requestNextQuestion(body: Record<string, string>) {
    setPhase("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/cv-chat/next-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ...body }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? genericError);
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
      setErrorMsg(networkError);
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
      const res = await fetch("/api/cv-chat/finish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error ?? genericError);
        setPhase("error");
        return;
      }
      router.refresh();
      onFinished?.(data.slug ?? slug);
      handleReset();
    } catch {
      setErrorMsg(networkError);
      setPhase("error");
    }
  }

  function handleReset() {
    setPhase("intro");
    setTranscript([]);
    setCurrentQuestion(null);
    setAnswerInput("");
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
            <h3 className="font-heading text-lg font-bold">{tr("Rifinisci il tuo CV con l'AI", "Refine your CV with AI")}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {tr(
                "Ti faccio qualche domanda mirata (massimo 6) per far emergere numeri e risultati concreti che mancano nel tuo CV — solo quello che mi dici tu, mai inventato. Alla fine riscrivo i punti coinvolti per 1 credito, speso solo se confermi.",
                "I'll ask a few targeted questions (up to 6) to surface concrete numbers and results missing from your CV — only what you tell me, never invented. At the end I rewrite the relevant parts for 1 credit, spent only if you confirm."
              )}
            </p>
          </div>
          <button
            type="button"
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
          >
            <Sparkles className="w-4 h-4" />
            {tr("Inizia", "Start")}
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
                <p className="text-xs text-muted-foreground/50 px-4 py-2">{tr("Sto pensando alla prossima domanda…", "Thinking of the next question…")}</p>
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
                  placeholder={tr("Scrivi la tua risposta…", "Write your answer…")}
                  autoFocus
                  className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-foreground/10 text-sm placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/60 transition-all duration-200"
                />
                <button
                  type="submit"
                  disabled={!answerInput.trim()}
                  aria-label={tr("Invia risposta", "Send answer")}
                  className="p-2.5 rounded-xl disabled:opacity-40 transition-opacity"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => submitAnswer(skipAnswer)}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                  {tr("Non lo so / salta", "I don't know / skip")}
                </button>
                {answeredCount > 0 && (
                  <button
                    type="button"
                    onClick={() => { setCurrentQuestion(null); setPhase("ready"); }}
                    className="text-xs font-semibold"
                    style={{ color: "var(--primary)" }}
                  >
                    {tr("Ho finito, applica le risposte →", "I'm done, apply the answers →")}
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
                    ? tr("Ho una risposta da applicare al tuo CV.", "I have one answer to apply to your CV.")
                    : tr(`Ho ${answeredCount} risposte da applicare al tuo CV.`, `I have ${answeredCount} answers to apply to your CV.`)}
                </p>
                <button
                  type="button"
                  onClick={() => setConfirming(true)}
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
                  style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                >
                  <Sparkles className="w-4 h-4" />
                  {tr("Conferma e riscrivi il CV", "Confirm and rewrite my CV")}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center space-y-3 py-4">
              <p className="text-sm text-muted-foreground">
                {tr(
                  "Il tuo CV sembra già ben quantificato — non ho trovato altro da chiederti.",
                  "Your CV already looks well quantified — I couldn't find anything else worth asking."
                )}
              </p>
              <button
                type="button"
                onClick={handleReset}
                className="text-xs font-semibold"
                style={{ color: "var(--primary)" }}
              >
                {tr("← Torna indietro", "← Go back")}
              </button>
            </div>
          )}
        </div>
      )}

      {phase === "finishing" && (
        <div className="text-center py-8 space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-foreground/15 border-t-primary animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">{tr("Sto riscrivendo il tuo CV…", "Rewriting your CV…")}</p>
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
            {tr("← Ricomincia", "← Start over")}
          </button>
        </div>
      )}

      {confirming && (
        <CreditConfirmModal
          actionLabel={tr("Riscrivere il CV con queste risposte?", "Rewrite the CV with these answers?")}
          cost={1}
          balance={credits}
          onCancel={() => setConfirming(false)}
          onConfirm={handleConfirmFinish}
        />
      )}
    </div>
  );
}
