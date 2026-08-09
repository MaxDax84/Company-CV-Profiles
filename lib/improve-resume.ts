import type { ProfileSchema } from "./schema";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";

// Phase 2 of /generate: lib/parse-resume.ts only extracts faithfully now (see
// its bio instruction) and computes the "before" score. This is the step
// that actually raises the score — mainly by crafting a strong bio, since
// the other 3 criteria (quantified results, ATS structure, specific skills)
// are fixed by what's genuinely in the source and can't be improved without
// fabricating. Same anti-fabrication posture as lib/tailor-resume.ts.
const SYSTEM_PROMPT = `You improve an existing, already-extracted structured CV profile to make it read as strong and clear as possible — without inventing anything not truthfully present in the source. You will be given the full profile as JSON.

WHAT TO IMPROVE:
- Rewrite "personal_info.bio": max 140 characters, professional tone, third person, in the SAME LANGUAGE as the rest of the profile (see metadata.language). Draw only on what's already true in the profile — the person's title, their experience roles, their skills, their projects. When there's more distinctive content than fits, prioritize the most specific, differentiating skills or qualifiers (e.g. a named strategy, methodology, or niche specialization) over generic ones (e.g. "strategic partnerships", "strong background") — never let a specific, distinctive term get cut in favor of a vaguer one just to save space.
- You may lightly tighten the grammar or phrasing of individual experience "description" bullets ONLY if a bullet is genuinely unclear or awkwardly worded — never to shorten, summarize, or rephrase a bullet that already reads clearly. Never drop, round, or alter a %, number, scope, team size, budget, or timeframe stated in a bullet.

ANTI-FABRICATION RULES — hard limits:
- Never add a company, employer, role, certification, degree, project, skill, or tool that is absent from the source profile.
- Never invent a new achievement, responsibility, or metric that isn't already stated somewhere in the source.
- Never change dates, company names, institution names, degree titles, or any quantified figure.

FIELDS TO PRESERVE EXACTLY, NEVER CHANGE: personal_info.full_name, title, email_obfuscated, phone_obfuscated, email, phone, location, social_links, bio_original; every experience's company/start_date/end_date/location/technologies; all of "education"; all of "certifications"; all of "skills"; all of "projects"; metadata (all fields — copy them through unchanged).

OUTPUT FORMAT:
- Return ONLY a valid JSON object matching the schema below, no markdown, no explanation, no code fences.
- The schema uses "| undefined" to mark optional fields. NEVER write the literal word "undefined" in your JSON output — use null or omit the field.

Schema:
${PROFILE_JSON_SCHEMA_BLOCK}`;

export async function improveResume(sourceProfile: ProfileSchema): Promise<ProfileSchema> {
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
      system: SYSTEM_PROMPT,
      output_config: { effort: "medium" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `<source_cv_json>\n${JSON.stringify(sourceProfile)}\n</source_cv_json>\n\nImprove this profile and return the JSON object.`,
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

  const improved = extractProfileJson(json, "CV too long to process.");

  // Deterministic backstop: hard-copy every field the model was told to
  // preserve exactly, rather than trusting the prompt alone. Only the bio
  // and (optionally lightly tightened) description bullets are allowed to
  // actually change.
  improved.personal_info = {
    ...sourceProfile.personal_info,
    bio: improved.personal_info.bio,
  };
  improved.skills = sourceProfile.skills;
  improved.education = sourceProfile.education;
  improved.certifications = sourceProfile.certifications;
  improved.projects = sourceProfile.projects;
  improved.other = sourceProfile.other;
  improved.metadata = sourceProfile.metadata;
  improved.experience = improved.experience.length === sourceProfile.experience.length
    ? improved.experience.map((exp, i) => ({ ...sourceProfile.experience[i], description: exp.description }))
    : sourceProfile.experience;

  return improved;
}
