import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug, saveTranslatedProfile } from "@/lib/profile-store";
import { CREDIT_COSTS, InsufficientCreditsError, getAccountCode } from "@/lib/credits";
import { spendCredits, refundCredits } from "@/lib/credits-server";
import { translateResume } from "@/lib/translate-resume";
import { recordPaidDownload } from "@/lib/paid-downloads";
import { PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";

// Calls Claude to translate the profile — same headroom as tailor-resume
// for the model call.
export const maxDuration = 60;

// Only ever ISO 639-1 codes from components/translate-cv-button.tsx's fixed
// language list (e.g. "it", "es", "zh") — never free text.
const MAX_LANGUAGE_CODE_LENGTH = 8;

function parseTemplate(value: unknown): PdfTemplate {
  return PDF_TEMPLATES.some(t => t.id === value) ? (value as PdfTemplate) : "ats-core";
}

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
    const format = body?.format === "word" ? "word" : "pdf";
    const template = parseTemplate(body?.template);

    if (typeof slug !== "string" || !slug) {
      return NextResponse.json({ error: "Missing slug." }, { status: 400 });
    }
    if (!targetLanguage || targetLanguage.length > MAX_LANGUAGE_CODE_LENGTH) {
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

    // The credit is already spent from here — any failure below must
    // refund it, or the user pays for a translation they never receive
    // (same gap found and fixed for interview-prep).
    let newSlug: string;
    let newProfileId: string;
    try {
      const translated = await translateResume(sourceRow.data, targetLanguage, user.id);
      translated.metadata.generated_at = new Date().toISOString();
      ({ slug: newSlug, id: newProfileId } = await saveTranslatedProfile(supabase, user.id, sourceRow.id, translated));
    } catch (err) {
      await refundCredits(user.id, CREDIT_COSTS.translate, "translate_refund", "Traduzione fallita");
      throw err;
    }

    // The 1 credit above already paid for this exact file — pre-mark it as
    // paid so the client's immediate GET to /api/pdf/[newSlug] or
    // /api/cv-word/[newSlug] (whichever actually streams the file) doesn't
    // spend a second credit for what is, from the user's perspective, one
    // single "translate" action. "docx" mirrors the same slot key
    // /api/cv-word/[slug] itself checks for a Word download.
    await recordPaidDownload(user.id, newProfileId, format === "word" ? "docx" : template);

    const code = await getAccountCode(supabase, user.id);

    return NextResponse.json({ slug: newSlug, code, template, format });
  } catch (err) {
    console.error("[translate-cv]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
