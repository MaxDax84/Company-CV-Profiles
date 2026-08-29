import { NextRequest, NextResponse } from "next/server";
import { tailorResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileRow } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { getActiveChatSession, markChatSessionCompleted } from "@/lib/cv-chat-store";
import { reformulateProfileFromChat } from "@/lib/cv-chat-reformulate";

// Calls Claude (Sonnet) — same headroom as tailor-resume's single-call route.
export const maxDuration = 60;

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

    const row = await getOwnedProfileRow(supabase, user.id, "primary");
    if (!row) {
      return NextResponse.json({ error: "No primary profile." }, { status: 404 });
    }

    const session = await getActiveChatSession(supabase, row.id);
    if (session.transcript.length === 0) {
      return NextResponse.json({ error: "No answers to apply yet." }, { status: 400 });
    }

    // Spent before the Sonnet call, mirroring app/api/tailor-resume's own
    // credit-then-call order exactly (see lib/credits.ts).
    try {
      await spendCredits(supabase, CREDIT_COSTS.chat, "chat_refine", `${row.data.personal_info.full_name} · rifinitura CV via chat`);
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: "Not enough credits to apply these answers.", code: "INSUFFICIENT_CREDITS" },
          { status: 402 }
        );
      }
      throw err;
    }

    const reformulated = await reformulateProfileFromChat(row.data, session.transcript);

    // Not part of what the model is asked to touch (score_before isn't even
    // in the schema it's given) — copied through explicitly rather than
    // trusted to survive the round-trip, same defensive posture as
    // bio_original in app/api/tailor-resume/route.ts.
    reformulated.metadata.template = row.data.metadata.template;
    reformulated.metadata.primary_color = row.data.metadata.primary_color;
    reformulated.metadata.score_before = row.data.metadata.score_before;
    reformulated.metadata.suggested_titles = row.data.metadata.suggested_titles;
    reformulated.metadata.generated_at = new Date().toISOString();

    const { error } = await supabase
      .from("profiles")
      .update({ data: reformulated })
      .eq("id", row.id)
      .eq("user_id", user.id);
    if (error) throw error;

    await markChatSessionCompleted(supabase, row.id);

    return NextResponse.json({ success: true, profile: reformulated });
  } catch (err) {
    console.error("[cv-chat/finish]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
