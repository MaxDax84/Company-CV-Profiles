import type { ProfileSchema } from "./schema";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";

const SYSTEM_PROMPT = `You are a precise CV data extractor. Your task is to extract information from a CV/resume PDF and return ONLY a valid JSON object matching the schema below.

Rules:
- Return ONLY the JSON object, no markdown, no explanation, no code fences.
- Never hallucinate data that is not present in the document. Use null or omit optional fields if data is missing.
- The schema below uses "| undefined" to mark optional fields. NEVER write the literal word "undefined" in your JSON output — it is not valid JSON. For a missing optional field, use null or omit the field entirely.
- CRITICAL — LANGUAGE: First detect the dominant language of the source CV. Every piece of free text you write yourself (bio, description bullets, title if rephrased) MUST be in that same language — do not default to English or translate. If the CV is in Italian, write bio and description bullets in Italian; if in English, write them in English. Only metadata.language records the detected code ("it" or "en").
- For full_name: remove apostrophes from surnames (e.g. "D'Assano" → "Dassano", "Dell'Aquila" → "DellAquila", "O'Brien" → "OBrien").
- Also capture the REAL, non-obfuscated email and phone in "email" and "phone" — these are only ever used in a private downloadable PDF the person generates for themselves (never shown on the public web page), so they must be usable by a real recruiter. Copy them exactly as written in the CV (normalize obvious formatting like spacing, but never alter the digits/characters).
- Obfuscate email (separately, for "email_obfuscated"): keep first letter, replace middle with ***, keep domain. Example: "mario.rossi@gmail.com" → "m***@gmail.com".
- Obfuscate phone (separately, for "phone_obfuscated"): keep country code and last 4 digits, replace rest with *. Example: "+39 333 1234567" → "+39 3** *** 4567".
- For description bullet points: one bullet per distinct achievement or responsibility the CV actually describes for that role — do not compress multiple distinct achievements into a single bullet, and do not drop a bullet just to shorten the list. Preserve EVERY quantified result (%, numbers, scope, team size, budget, timeframe) stated in the source — these are the single most valuable content in a CV and must never be lost. Up to 6 bullets per experience if the source genuinely describes that many; fewer if the source has fewer. Each bullet max ~18 words, start with an action verb, third person implied.
- For bio: max 90 characters, professional tone, third person.
- For bio_original: a short, literal, unpolished restatement of how the CV itself describes the person's role (e.g. lifted near-verbatim from the CV's own summary or job title line) — this shows the "before" state, so do NOT apply any of the improvements you apply to "bio". Same language as the CV. If the CV has no self-description to draw from, omit this field.
- For experience: include at most 5 most recent entries.
- For technologies per experience: up to 6 items — include every named tool/technology/platform the source mentions for that role, do not truncate to fewer just to shorten the list.
- For skills (hard/soft/tools): max 6 items each.
- For projects: max 2 entries.
- For certifications: max 4 entries.
- For primary_color: suggest a hex color that matches the person's industry (e.g. #6366f1 for tech, #0ea5e9 for finance, #10b981 for healthcare).
- For template: choose "alpha" for creative/design roles, "beta" for tech/engineering, "gamma" for business/finance, "delta" for any other.
- For image_placeholder: assign "gradient-1" through "gradient-8" to each project sequentially.
- For other: catch-all for anything relevant that doesn't fit the sections above — hobbies, sports, volunteering, non-professional collaborations, extra languages, interests. Max 8 short items (a few words each), same language as the CV. Omit the field entirely if there's nothing like this in the CV — do not invent generic filler.
- Detect language from the CV content and set metadata.language to "it" or "en".

Schema:
${PROFILE_JSON_SCHEMA_BLOCK}`;

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function parseResume(pdfBuffer: ArrayBuffer): Promise<ProfileSchema> {
  const base64Pdf = arrayBufferToBase64(pdfBuffer);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "pdfs-2024-09-25",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "document",
              source: {
                type: "base64",
                media_type: "application/pdf",
                data: base64Pdf,
              },
            },
            {
              type: "text",
              text: "Extract all data from this CV and return the JSON object. Set metadata.generated_at to the current ISO timestamp.",
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

  const profile = extractProfileJson(
    json,
    "CV too long to process. Please try with a shorter CV (max 2 pages recommended)."
  );

  if (!profile.metadata?.generated_at) {
    profile.metadata.generated_at = new Date().toISOString();
  }

  return profile;
}
