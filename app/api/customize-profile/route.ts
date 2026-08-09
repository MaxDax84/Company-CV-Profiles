import { NextRequest, NextResponse } from "next/server";
import { getClientIp, improveProfileRatelimit } from "@/lib/rate-limit";
import { improveAndFinalizePendingProfile } from "@/lib/profile-store";
import { isTemplateStyle } from "@/lib/templates";
import { computeCvScore } from "@/lib/cv-score";

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
    const { success, reset } = await improveProfileRatelimit.limit(clientIp);
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

    const result = await improveAndFinalizePendingProfile(claimToken, template);
    if (!result) {
      return NextResponse.json(
        { error: "Preview expired. Please analyze your CV again." },
        { status: 410 }
      );
    }

    return NextResponse.json({
      slug: result.slug,
      profile: result.profile,
      cvScoreAfter: computeCvScore(result.profile),
    });
  } catch (err) {
    console.error("[customize-profile]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
