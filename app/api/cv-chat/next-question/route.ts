import { NextRequest, NextResponse } from "next/server";
import { tailorResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { getActiveChatSession, saveChatTurn } from "@/lib/cv-chat-store";
import { getNextQuestion, MAX_QUESTIONS, type ChatTurn } from "@/lib/cv-chat-question";

// Calls Claude (Haiku) — same headroom class as the other single-call routes.
export const maxDuration = 30;

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
    const slug = typeof body?.slug === "string" ? body.slug : undefined;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    // Refines one specific CV the caller picked (see components/account-tabs.tsx
    // — a button per uploaded CV, not an implicit "most recent" guess). Only
    // ever a primary (uploaded) CV, never a tailored/translated one — a
    // crafted slug pointing at those is treated as not found, same pattern
    // as app/api/tailor-resume/route.ts's own source-row guard.
    let row = await getOwnedProfileBySlug(supabase, user.id, slug);
    if (row && row.kind !== "primary") {
      row = null;
    }
    if (!row) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    const answer = typeof body?.answer === "string" ? body.answer.trim() : undefined;
    const pendingQuestion = typeof body?.pendingQuestion === "string" ? body.pendingQuestion : undefined;
    const pendingTargetField = typeof body?.pendingTargetField === "string" ? body.pendingTargetField : undefined;

    const session = await getActiveChatSession(supabase, row.id);
    // The just-answered turn, appended in memory only — not yet persisted.
    // Submitting an answer to a question always requires all three fields
    // together; a partial/malformed submission is treated as "no answer yet"
    // rather than silently dropping data.
    let transcript: ChatTurn[] = session.transcript;
    if (answer && pendingQuestion && pendingTargetField) {
      transcript = [...transcript, { question: pendingQuestion, target_field: pendingTargetField, answer }];
    }
    const turnWasAdded = transcript.length !== session.transcript.length;

    if (transcript.length >= MAX_QUESTIONS) {
      if (turnWasAdded) {
        await saveChatTurn(supabase, user.id, row.id, transcript);
      }
      return NextResponse.json({ done: true, questionCount: transcript.length });
    }

    const result = await getNextQuestion(row.data, transcript, user.id);

    // Persisted only now, after the Claude call has actually succeeded — an
    // error above leaves the DB untouched, so the client can just retry the
    // exact same request instead of landing in an inconsistent state.
    if (turnWasAdded) {
      await saveChatTurn(supabase, user.id, row.id, transcript);
    }

    if (result.done || !result.question || !result.target_field) {
      return NextResponse.json({ done: true, questionCount: transcript.length });
    }

    return NextResponse.json({
      done: false,
      question: result.question,
      targetField: result.target_field,
      questionCount: transcript.length,
    });
  } catch (err) {
    console.error("[cv-chat/next-question]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
