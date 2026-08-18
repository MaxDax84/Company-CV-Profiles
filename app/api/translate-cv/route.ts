import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug, saveTranslatedProfile } from "@/lib/profile-store";
import { spendCredits, CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { translateResume } from "@/lib/translate-resume";
import { getAccountCode } from "@/lib/credits";

// Calls Claude to translate the profile — same headroom as tailor-resume
// for the model call.
export const maxDuration = 60;

const MAX_LANGUAGE_LENGTH = 40;

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const body = await req.json().catch(() => null);
    const slug = body?.slug;
    const targetLanguage = typeof body?.targetLanguage === "string" ? body.targetLanguage.trim() : "";

    if (typeof slug !== "string" || !slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }
    if (!targetLanguage || targetLanguage.length > MAX_LANGUAGE_LENGTH) {
      return NextResponse.json({ error: "Invalid target language." }, { status: 400 });
    }

    // Only ever translate an uploaded (primary) CV, never a tailored or
    // already-translated one — same "not found" treatment as an invalid
    // slug, mirroring tailor-resume's own source-row guard.
    const sourceRow = await getOwnedProfileBySlug(supabase, user.id, slug);
    if (!sourceRow || sourceRow.kind !== "primary") {
      return NextResponse.json({ error: "Profile not found." }, { status: 404 });
    }

    try {
      await spendCredits(supabase, CREDIT_COSTS.translate, "translate", `${sourceRow.data.personal_info.full_name} → ${targetLanguage}`);
    } catch (err) {
      if (err instanceof InsufficientCreditsError) {
        return NextResponse.json(
          { error: "Not enough credits to translate your profile.", code: "INSUFFICIENT_CREDITS" },
          { status: 402 }
        );
      }
      throw err;
    }

    const translated = await translateResume(sourceRow.data, targetLanguage);
    translated.metadata.generated_at = new Date().toISOString();

    const { slug: newSlug } = await saveTranslatedProfile(supabase, user.id, sourceRow.id, translated);
    const code = await getAccountCode(supabase, user.id);

    return NextResponse.json({ slug: newSlug, code, profile: translated });
  } catch (err) {
    console.error("[translate-cv]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
