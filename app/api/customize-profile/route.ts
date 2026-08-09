import { NextRequest, NextResponse } from "next/server";
import { getClientIp, customizeProfileRatelimit } from "@/lib/rate-limit";
import { updatePendingProfile } from "@/lib/profile-store";
import { isTemplateStyle } from "@/lib/templates";
import type { TemplateStyle } from "@/lib/schema";

export const runtime = 'edge';

// Second step of the two-phase /generate flow: the CV was already analyzed
// and scored (see /api/parse-resume), no Claude call happens here — this
// just applies the user's template/LinkedIn choices to their pending
// preview before it's shown as a finished page.
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const { success, reset } = await customizeProfileRatelimit.limit(clientIp);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }

    const body = await req.json().catch(() => null);
    const claimToken = body?.claimToken;
    const template = body?.template;
    const linkedin = body?.linkedin;

    if (!claimToken || typeof claimToken !== "string") {
      return NextResponse.json({ error: "Missing claim token" }, { status: 400 });
    }

    const updates: { template?: TemplateStyle; linkedin?: string } = {};
    if (template !== undefined) {
      if (!isTemplateStyle(template)) {
        return NextResponse.json({ error: "Invalid template" }, { status: 400 });
      }
      updates.template = template;
    }
    if (typeof linkedin === "string") updates.linkedin = linkedin;

    const result = await updatePendingProfile(claimToken, updates);
    if (!result) {
      return NextResponse.json(
        { error: "Preview expired. Please analyze your CV again." },
        { status: 410 }
      );
    }

    return NextResponse.json({ slug: result.slug, profile: result.profile });
  } catch (err) {
    console.error("[customize-profile]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
