import { NextRequest, NextResponse } from "next/server";
import { cvChatFinishRatelimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileRow } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { getActiveChatSession, markChatSessionCompleted } from "@/lib/cv-chat-store";
import { reformulateProfileFromChat } from "@/lib/cv-chat-reformulate";

// Node runtime (not edge): this route makes a Claude call — maxDuration only
// takes effect on Node functions. Matches tailor-resume's budget for the
// same Sonnet full-profile-rewrite shape of call.
export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const { success, reset } = await cvChatFinishRatelimit.limit(clientIp);
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

    const row = await getOwnedProfileRow(supabase, user.id, "primary");
    if (!row) {
      return NextResponse.json({ error: "Genera prima il tuo profilo." }, { status: 404 });
    }

    const session = await getActiveChatSession(supabase, user.id, row.id);
    const hasAnAnswer = session.transcript.some((t) => t.role === "user");
    if (!hasAnAnswer) {
      return NextResponse.json(
        { error: "Rispondi ad almeno una domanda prima di generare il CV aggiornato." },
        { status: 400 }
      );
    }

    // Spend the credit before running Claude. Not refunded if the
    // reformulation call itself later fails — same accepted v1 gap as
    // app/api/tailor-resume/route.ts already takes for its own Claude call.
    try {
      await spendCredits(supabase, CREDIT_COSTS.chat, "chat_refine", row.data.personal_info.full_name);
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: "Not enough credits.", code: "INSUFFICIENT_CREDITS" },
          { status: 402 }
        );
      }
      throw err;
    }

    const updated = await reformulateProfileFromChat(row.data, session.transcript, user.id);
    updated.metadata.generated_at = new Date().toISOString();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ data: updated })
      .eq("id", row.id)
      .eq("user_id", user.id);
    if (updateError) throw updateError;

    await markChatSessionCompleted(supabase, session.id);

    return NextResponse.json({ profile: updated });
  } catch (err) {
    console.error("[cv-chat/finish]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
