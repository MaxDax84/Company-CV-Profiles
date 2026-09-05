import { NextRequest, NextResponse } from "next/server";
import { getClientIp, improveProfileRatelimit, improveProfileAuthedRatelimit } from "@/lib/rate-limit";
import { improveAndFinalizePendingProfile } from "@/lib/profile-store";
import { isTemplateStyle } from "@/lib/templates";
import { computeCvScore, floorScoreAgainst } from "@/lib/cv-score";
import { trackServer } from "@/lib/analytics-server";
import { readPosthogDistinctId } from "@/lib/analytics-types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// Node runtime (not edge): this route now makes a Claude call (the phase-2
// "improve" pass) — maxDuration only takes effect on Node functions.
export const maxDuration = 60;

// Second step of the two-phase /generate flow: phase 1 (/api/parse-resume)
// only extracts faithfully and scores the CV as-is. This is where the AI
// actually improves the content (mainly the bio) and the user's chosen
// template gets applied, right before the page is finalized.
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);

    // This route works for both an anonymous /generate visitor and a
    // signed-in one (e.g. re-generating from their account) — best-effort,
    // same reasoning as /api/parse-resume: getUser() failing just means
    // "treat as anonymous" for rate-limiting purposes, never a hard error.
    let user: { id: string } | null = null;
    try {
      const supabase = await createServerSupabaseClient();
      user = (await supabase.auth.getUser()).data.user;
    } catch (err) {
      console.error("[customize-profile] getUser failed", err);
    }

    const { success, reset } = user
      ? await improveProfileAuthedRatelimit.limit(user.id)
      : await improveProfileRatelimit.limit(clientIp);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }

    const body = await req.json().catch(() => null);
    const claimToken = body?.claimToken;
    const template = body?.template;

    if (!claimToken || typeof claimToken !== "string") {
      return NextResponse.json({ error: "Missing claim token" }, { status: 400 });
    }
    if (template !== undefined && !isTemplateStyle(template)) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const startedAt = Date.now();
    const result = await improveAndFinalizePendingProfile(claimToken, template);
    if (!result) {
      return NextResponse.json(
        { error: "Preview expired. Please analyze your CV again." },
        { status: 410 }
      );
    }

    // Fired here, once the AI-improved page is actually ready to return —
    // not on the client's button click — per the spec's own rule: hooking
    // this to the click would inflate activation numbers with people who
    // clicked but never got (or waited for) a finished page.
    const distinctId = readPosthogDistinctId(req.cookies, process.env.NEXT_PUBLIC_POSTHOG_KEY);
    await trackServer(distinctId, "profile_page_generated", { ms_elapsed: Date.now() - startedAt });

    return NextResponse.json({
      slug: result.slug,
      profile: result.profile,
      cvScoreAfter: floorScoreAgainst(computeCvScore(result.profile), result.profile.metadata.score_before),
    });
  } catch (err) {
    console.error("[customize-profile]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
