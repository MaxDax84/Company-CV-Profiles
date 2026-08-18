import type { ProfileSchema } from "./schema";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";

// Opt-in feature: translate an already-generated CV profile into another
// language, for people who want a multilingual profile page. A pure
// translation pass — unlike lib/improve-resume.ts or lib/tailor-resume.ts,
// nothing here is meant to change tone, add detail, or optimize anything.
const SYSTEM_PROMPT = `You translate an existing structured CV profile into a target language. This is a faithful, literal translation pass — not a rewrite, not an improvement, not an optimization. You will be given the source profile as JSON and a target language as an ISO 639-1 two-letter code (e.g. "it", "es", "fr", "de", "pt", "en", "zh", "ar").

TRANSLATE (into the target language):
- personal_info.title, personal_info.bio, personal_info.bio_original (if present)
- Every experience's "role" and every "description" bullet
- Every education's "degree", "field", and "grade" (if present)
- Every certification's "name" (translate only if it's a generic description, e.g. "Advanced Excel Course" — keep official/proper certification names as issued, e.g. "AWS Solutions Architect", "PMP" stay in their original form)
- Every skill in skills.hard / skills.soft / skills.tools — EXCEPT proper technology/tool/product names that are conventionally kept in their original form in every language (e.g. "JavaScript", "Kubernetes", "Salesforce", "Excel" stay as-is; "Lavoro di squadra" becomes "Teamwork", "Gestione del team" becomes "Team management")
- Every project's "title", "description", and "tags"
- Every item in "other"
- Every experience's "start_date" and "end_date", but ONLY the words in them — a written-out month name (e.g. "Luglio 2016" → "July 2016", "Julio 2016") or a status word for an ongoing role (e.g. "presente"/"in corso" → "present", "ongoing"). NEVER change the actual year or numeric month this represents, and if the value is already purely numeric (e.g. "2021-03", "2024") there is nothing to translate — copy it through unchanged.

NEVER TRANSLATE OR CHANGE, copy through EXACTLY as in the source:
- personal_info.full_name, email_obfuscated, phone_obfuscated, email, phone, social_links
- Every experience's company and location
- Every education's institution, start_year, end_year (these are plain numbers or the literal string "present" already in the schema's own format, not free text — leave them exactly as given)
- Every certification's issuer, year, url
- Every project's url and image_placeholder
- metadata.primary_color, metadata.template
- All numbers, percentages, team sizes, budgets, and the actual chronological value of every date — translate the words around a date, never the year/month/day it refers to

RULES:
- Do not add, remove, embellish, shorten, or reorder any content. Every fact, achievement, and number in the source must appear, translated, in the same place in the output — nothing more, nothing less.
- If a source field is empty or absent, leave it that way in the output.
- Write naturally in the target language — a fluent native speaker's phrasing, not a word-for-word mechanical translation, but never inventing content that isn't a direct translation of the source.
- Set metadata.language to the exact target language code you were given.
- Set metadata.generated_at to the current ISO timestamp.

OUTPUT FORMAT:
- Return ONLY a valid JSON object matching the schema below, no markdown, no explanation, no code fences.
- The schema uses "| undefined" to mark optional fields. NEVER write the literal word "undefined" in your JSON output — use null or omit the field.

Schema:
${PROFILE_JSON_SCHEMA_BLOCK}`;

export async function translateResume(sourceProfile: ProfileSchema, targetLanguageCode: string): Promise<ProfileSchema> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 8192,
      // Array form + cache_control: this system prompt is identical across
      // every translation call — caching cuts input-token cost and latency
      // on every request after the first within the 5-minute window.
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      output_config: { effort: "medium" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `<source_cv_json>\n${JSON.stringify(sourceProfile)}\n</source_cv_json>\n\n<target_language_code>${targetLanguageCode}</target_language_code>\n\nTranslate the source profile into the target language and return the JSON object.`,
            },
          ],
        },
      ],
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${body}`);
  }

  const json = await res.json() as {
    stop_reason: string;
    content: { type: string; text: string }[];
  };

  const translated = extractProfileJson(json, "CV too long to process.");

  // Deterministic backstop, same posture as improve-resume.ts/tailor-resume.ts:
  // fields that must never change are hard-copied from the source regardless
  // of how well the model followed the prompt.
  translated.personal_info.full_name = sourceProfile.personal_info.full_name;
  translated.personal_info.email_obfuscated = sourceProfile.personal_info.email_obfuscated;
  translated.personal_info.phone_obfuscated = sourceProfile.personal_info.phone_obfuscated;
  translated.personal_info.email = sourceProfile.personal_info.email;
  translated.personal_info.phone = sourceProfile.personal_info.phone;
  translated.personal_info.social_links = sourceProfile.personal_info.social_links;
  translated.experience = translated.experience.map((exp, i) => ({
    ...exp,
    company: sourceProfile.experience[i]?.company ?? exp.company,
    // start_date/end_date are deliberately NOT hard-copied here — the
    // prompt above is allowed to translate a spelled-out month name or an
    // "ongoing" status word within them (e.g. "Luglio 2016" → "July 2016").
    location: sourceProfile.experience[i]?.location ?? exp.location,
  }));
  translated.metadata.primary_color = sourceProfile.metadata.primary_color;
  translated.metadata.template = sourceProfile.metadata.template;

  return translated;
}
