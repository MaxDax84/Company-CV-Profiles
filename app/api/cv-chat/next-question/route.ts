import { NextRequest, NextResponse } from "next/server";
import { tailorResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileRow } from "@/lib/profile-store";
import { getActiveChatSession, saveChatTurn } from "@/lib/cv-chat-store";
import { askNextQuestion, MAX_QUESTIONS, type ChatTurn } from "@/lib/cv-chat-question";

// Node runtime (not edge): this route makes a Claude call — maxDuration only
// takes effect on Node functions.
export const maxDuration = 30;

const ANSWER_MAX_LENGTH = 1000;

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const { success, reset } = await tailorResumeRatelimit.limit(clientIp);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }

    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const answer = typeof body?.answer === "string" ? body.answer.trim() : undefined;
    if (answer !== undefined && (answer.length === 0 || answer.length > ANSWER_MAX_LENGTH)) {
      return NextResponse.json({ error: "Invalid answer." }, { status: 400 });
    }

    const row = await getOwnedProfileRow(supabase, user.id, "primary");
    if (!row) {
      return NextResponse.json({ error: "Genera prima il tuo profilo." }, { status: 404 });
    }

    const session = await getActiveChatSession(supabase, user.id, row.id);

    // The last assistant question's targetField, so the user's answer can
    // be tagged with what it's actually answering.
    const lastQuestion = [...session.transcript].reverse().find((t) => t.role === "assistant");
    const newTranscript: ChatTurn[] = answer
      ? [...session.transcript, { role: "user", content: answer, targetField: lastQuestion?.targetField }]
      : session.transcript;

    const questionsAsked = newTranscript.filter((t) => t.role === "assistant").length;
    if (questionsAsked >= MAX_QUESTIONS) {
      // Cap reached — persist the answer that pushed it over (if any), but
      // don't spend another Claude call asking for a 7th question.
      if (answer) await saveChatTurn(supabase, session.id, newTranscript, questionsAsked);
      return NextResponse.json({
        done: true, question: null, targetField: null, questionCount: questionsAsked, transcript: newTranscript,
      });
    }

    // Built in memory and only persisted after Haiku succeeds — if this
    // call throws, nothing is written, and the client (which still has the
    // answer it just typed) can simply resend the identical request.
    const result = await askNextQuestion(row.data, newTranscript);

    const finalTranscript: ChatTurn[] = result.done
      ? newTranscript
      : [...newTranscript, { role: "assistant", content: result.question!, targetField: result.targetField! }];
    const finalQuestionCount = finalTranscript.filter((t) => t.role === "assistant").length;

    await saveChatTurn(supabase, session.id, finalTranscript, finalQuestionCount);

    // Full transcript returned (not just the newest question) so the client
    // can render the whole conversation from scratch — including resuming
    // one already in progress from a previous visit.
    return NextResponse.json({
      done: result.done,
      question: result.question,
      targetField: result.targetField,
      questionCount: finalQuestionCount,
      transcript: finalTranscript,
    });
  } catch (err) {
    console.error("[cv-chat/next-question]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
