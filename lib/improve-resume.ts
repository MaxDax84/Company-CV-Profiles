import type { ProfileSchema } from "./schema";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";
import { logClaudeUsage } from "./log-claude-usage";

// Phase 2 of /generate: lib/parse-resume.ts only extracts faithfully now (see
// its bio instruction) and computes the "before" score. This is the step
// that actually raises the score — crafting a strong bio, opening weak-verb
// bullets on a stronger one, tightening a wall-of-text bullet, and narrowly
// swapping a generic tool reference for the specific one it obviously means
// (see lib/cv-score.ts's STRONG_VERB_ROOTS and the specificSkills/clarity
// scoring for how these get graded deterministically on both sides) — plus
// ATS structure and part of clarity being properties of Jobli's own export
// template rather than anything computed from content. specific_skills' raw
// count and quantified_results' actual numbers are still fixed by what's
// genuinely in the source and can't move without fabricating. Same
// anti-fabrication posture as lib/tailor-resume.ts.
const SYSTEM_PROMPT = `You improve an existing, already-extracted structured CV profile to make it read as strong and clear as possible — without inventing anything not truthfully present in the source. You will be given the full profile as JSON.

WHAT TO IMPROVE:
- Rewrite "personal_info.bio": max 140 characters, professional tone, third person, in the SAME LANGUAGE as the rest of the profile (see metadata.language). Draw only on what's already true in the profile — the person's title, their experience roles, their skills, their projects. When there's more distinctive content than fits, prioritize the most specific, differentiating skills or qualifiers (e.g. a named strategy, methodology, or niche specialization) over generic ones (e.g. "strategic partnerships", "strong background") — never let a specific, distinctive term get cut in favor of a vaguer one just to save space.
- You may lightly tighten the grammar or phrasing of individual experience "description" bullets if a bullet is genuinely unclear or awkwardly worded — never to shorten, summarize, or rephrase a bullet that already reads clearly. Separately, if a bullet OPENS on a passive or duty-listing phrase (e.g. "Responsible for...", "Mi occupavo di...", "In charge of..."), rewrite just the opening into a strong, active, results-oriented verb that accurately restates the same existing fact (e.g. "Responsible for managing client relationships" → "Managed client relationships"). In English use simple past tense ("Managed", "Led"); in Italian use the past participle, the standard convention for CV bullets ("Gestito", "Guidato", "Ottimizzato") — NOT the imperfect ("Gestiva") or another conjugated form. This is restating a true fact more sharply, not a new claim, so it's allowed even when the rest of the bullet already reads clearly. Never drop, round, or alter a %, number, scope, team size, budget, or timeframe stated in a bullet.
- Separately, if a bullet is unusually long and reads as a dense block covering several ideas at once, you may tighten it into a more scannable single bullet by cutting redundant words and combining related clauses — but you must keep every distinct fact, number, scope, or achievement it states; never drop one to save space. Do not split one bullet into multiple bullets — the number of bullets per experience entry must stay exactly the same.
- Skill/tool contextualization, narrowly: if a bullet already refers to a tool/software CATEGORY in generic terms (e.g. "using CRM software", "strumenti di analisi dati", "il sistema aziendale", "un tool di project management") and exactly ONE tool of that category is named in "skills.hard"/"skills.tools", you may replace the generic phrase with that specific tool's name (e.g. "using CRM software" → "using Salesforce", only if Salesforce is the sole CRM listed in skills). This makes an already-stated, already-true fact more specific — not a new claim. Do NOT do this if the bullet doesn't already reference that category of tool at all, or if more than one tool of that category is listed in skills (you cannot know which one applies) — never insert a skill/tool name into a bullet that gave no indication a tool like that was used there.

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
      // Array form + cache_control: identical prompt on every call. Note this
      // one is short enough it may sit under Sonnet's 1024-token caching
      // minimum today — harmless either way, and it activates for free if
      // the prompt grows.
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
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
    usage?: { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
  };
  logClaudeUsage("improve_resume", "claude-sonnet-5", json.usage);

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
    ? improved.experience.map((exp, i) => ({
        ...sourceProfile.experience[i],
        description: preserveBulletNumbers(sourceProfile.experience[i].description, exp.description),
      }))
    : sourceProfile.experience;

  return improved;
}

const NUMBER_TOKEN = /\d+(?:[.,]\d+)?%?/g;

function extractNumbers(text: string): string[] {
  return text.match(NUMBER_TOKEN) ?? [];
}

// The prompt already says never to drop/alter a %, figure, or timeframe in
// a bullet — but that's an instruction, not a guarantee, and a "lightly
// tightened" rewrite can silently drop a number even when told not to. This
// is what was actually causing "Risultati misurabili" (which counts bullets
// containing a number) to regress after optimization even though nothing
// was supposed to be removable: the AI rewrite, not a scoring mismatch (that
// separate bug was already fixed — see the header comment in lib/cv-score.ts).
// Per-bullet, per-source-number check: if the rewrite is missing even one
// number the source bullet had, keep the original bullet instead of the
// rewrite. Silent and conservative on purpose — this can only ever make the
// output closer to the source, never further from it.
function preserveBulletNumbers(sourceBullets: string[], improvedBullets: string[]): string[] {
  if (improvedBullets.length !== sourceBullets.length) return sourceBullets;
  return improvedBullets.map((bullet, i) => {
    const sourceNumbers = extractNumbers(sourceBullets[i]);
    if (sourceNumbers.length === 0) return bullet;
    const bulletNumbers = extractNumbers(bullet);
    const preserved = sourceNumbers.every((n) => bulletNumbers.includes(n));
    return preserved ? bullet : sourceBullets[i];
  });
}
