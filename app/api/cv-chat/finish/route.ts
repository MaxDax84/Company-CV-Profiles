import { NextRequest, NextResponse } from "next/server";
import { tailorResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { spendCredits } from "@/lib/credits-server";
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

    const body = await req.json().catch(() => null);
    const slug = typeof body?.slug === "string" ? body.slug : undefined;
    if (!slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }

    // Same slug-scoped, primary-only guard as next-question/route.ts.
    let row = await getOwnedProfileBySlug(supabase, user.id, slug);
    if (row && row.kind !== "primary") {
      row = null;
    }
    if (!row) {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
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

    // Tags the CV's own name so it's visibly distinguishable in the list
    // from one never touched by the assistant — English regardless of UI
    // language, since toSlug() strips apostrophes/accents anyway (an
    // Italian tag would mangle into something like "con-l-ai").
    const AI_TAG = "-powered-by-ai";
    const newSlug = row.slug.endsWith(AI_TAG) ? row.slug : `${row.slug}${AI_TAG}`;

    let { error } = await supabase
      .from("profiles")
      .update({ data: reformulated, slug: newSlug })
      .eq("id", row.id)
      .eq("user_id", user.id);
    if (error?.code === "23505") {
      // Vanishingly unlikely slug collision on this exact tagged name —
      // the content rewrite matters far more than the cosmetic rename, so
      // fall back to updating content only rather than failing the whole
      // request over it.
      ({ error } = await supabase.from("profiles").update({ data: reformulated }).eq("id", row.id).eq("user_id", user.id));
    }
    if (error) throw error;

    await markChatSessionCompleted(supabase, row.id);

    return NextResponse.json({ success: true, profile: reformulated, slug: newSlug });
  } catch (err) {
    console.error("[cv-chat/finish]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
