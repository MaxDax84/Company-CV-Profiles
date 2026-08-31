import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getOwnedProfileBySlug } from "@/lib/profile-store";
import { CREDIT_COSTS, InsufficientCreditsError } from "@/lib/credits";
import { spendCredits } from "@/lib/credits-server";
import { generateCoverLetter } from "@/lib/cover-letter";
import { translateCoverLetter } from "@/lib/translate-cover-letter";
import { getRememberedCoverLetter, rememberCoverLetter } from "@/lib/cover-letters";
import { CoverLetterDocument } from "@/components/pdf/CoverLetterDocument";
import { buildCoverLetterFilename } from "@/lib/download-filename";

// Calls Claude to write (or translate) the letter, then renders the PDF —
// same headroom as the tailor-resume route for the model call.
export const maxDuration = 60;

// Only ever ISO 639-1 codes from components/translate-cover-letter-button.tsx's
// fixed language list (e.g. "it", "es", "zh") — never free text.
const MAX_LANGUAGE_CODE_LENGTH = 8;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const requestedLanguage = new URL(req.url).searchParams.get("language");
  if (requestedLanguage && requestedLanguage.length > MAX_LANGUAGE_CODE_LENGTH) {
    return NextResponse.json({ error: "Invalid target language." }, { status: 400 });
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  // 404 (not 403) whether the slug doesn't exist or belongs to someone
  // else — don't let the response distinguish the two.
  const row = await getOwnedProfileBySlug(supabase, user.id, slug);
  if (!row) {
    return NextResponse.json({ error: "Profile not found." }, { status: 404 });
  }

  const originalLanguage = row.data.metadata.language;
  const targetLanguage = requestedLanguage || originalLanguage;
  const isTranslation = targetLanguage !== originalLanguage;

  const { target_company, target_role } = row.data.metadata;
  const detail = target_role || target_company
    ? `${row.data.personal_info.full_name} · ${[target_role, target_company].filter(Boolean).join(" — ")}`
    : `${row.data.personal_info.full_name} · lettera generica`;

  // Re-rendering a PDF from an already-written letter is free (react-pdf,
  // no Claude call) — so only the first request for a given (profile,
  // language) ever pays a credit or costs us a generation/translation
  // call. Later ones reuse the exact same cached text.
  let letterText = await getRememberedCoverLetter(supabase, row.id, targetLanguage);
  if (!letterText) {
    if (isTranslation) {
      // Translating starts from the letter's own original-language text —
      // generate it first (uncached, and free — deliberately not a second
      // charge) if it doesn't exist yet, so a translation always reflects
      // an existing real letter rather than writing a fresh one directly in
      // the target language. "Translate" is always exactly 1 credit total,
      // matching the flat pricing shown everywhere in the credits UI,
      // regardless of whether the original happened to be cached already.
      // Deliberately NOT persisted via rememberCoverLetter when it has to be
      // generated here: it's only translation source material the user
      // never asked for, and saving it would surface a second, unrequested
      // "generic" letter next to the translation in the Downloads list.
      let originalText = await getRememberedCoverLetter(supabase, row.id, originalLanguage);
      if (!originalText) {
        originalText = await generateCoverLetter(row.data);
      }
      try {
        await spendCredits(supabase, CREDIT_COSTS.translate, "translate_cover_letter", `${detail} → ${targetLanguage}`);
      } catch (err) {
        if (err instanceof InsufficientCreditsError) {
          return NextResponse.json(
            { error: "Not enough credits to translate this cover letter.", code: "INSUFFICIENT_CREDITS" },
            { status: 402 }
          );
        }
        throw err;
      }
      letterText = await translateCoverLetter(originalText, targetLanguage);
    } else {
      try {
        await spendCredits(supabase, CREDIT_COSTS.coverLetter, "cover_letter", detail);
      } catch (err) {
        if (err instanceof InsufficientCreditsError) {
          return NextResponse.json(
            { error: "Not enough credits to generate a cover letter.", code: "INSUFFICIENT_CREDITS" },
            { status: 402 }
          );
        }
        throw err;
      }
      letterText = await generateCoverLetter(row.data);
    }
    await rememberCoverLetter(user.id, row.id, targetLanguage, letterText);
  }

  const buffer = await renderToBuffer(
    <CoverLetterDocument profile={row.data} letterText={letterText} language={targetLanguage} />
  );

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${buildCoverLetterFilename(row.data, row.slug)}"`,
    },
  });
}
