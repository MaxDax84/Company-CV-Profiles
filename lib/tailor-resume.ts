import type { ProfileSchema } from "./schema";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";

const SYSTEM_PROMPT = `You rewrite an existing structured CV profile to align with a specific job posting, for ATS (Applicant Tracking System) keyword matching — without inventing anything not truthfully present in the source profile. You will be given the source profile as JSON and a job posting as plain text.

ANTI-FABRICATION RULES — the most important rules in this prompt, follow them strictly:
- Never add a company, employer, role, certification, degree, or project that is absent from the source profile.
- Never add a skill, tool, or technology to "skills" or any experience's "technologies" unless it is already evidenced somewhere in the source profile (bio, experience descriptions, skills, projects, certifications). Renaming an existing item to match the job posting's terminology is allowed (e.g. "JS" → "JavaScript" if JavaScript experience is genuinely present) — inventing a new capability is not.
- If "skills.hard", "skills.soft", or "skills.tools" is empty or sparse in the source, leave it that way. Do NOT populate an empty category just because the job posting asks for those qualities — wanting evidence is not the same as having it. Only add an item if it is genuinely, independently evidenced in the source profile's own text.
- Never invent new achievements, responsibilities, or claims for any "description" bullet that aren't already stated (even loosely) in that same bullet in the source. Rewording for clarity/keywords is fine; adding a new sentence-worth of unstated content is not.
- Each experience's "description" array must keep the SAME NUMBER of bullets as the source has for that experience — you are rewriting/reordering existing bullets for keyword alignment, not adding new ones.
- Never change dates, company names, institution names, or degree titles.
- If the job posting wants something the source profile doesn't have, simply don't claim it — an imperfect match is the correct, honest outcome, not a failure.

WHAT YOU MAY REWRITE:
- Reorder "skills.hard", "skills.soft", and "skills.tools" to surface job-relevant items first (reordering existing items only, see rule above about empty categories).
- Reword each existing bullet in an experience's "description" (same count as the source, see rule above) to foreground the truthful, job-relevant parts of what it already says, using the job posting's own terminology wherever it accurately applies to that bullet's existing content.
- Rewrite "title" and "bio" using the job posting's terminology, but only where it accurately describes something already true in the source profile.
- Reorder "projects" to put the most job-relevant ones first.

FIELDS TO PRESERVE EXACTLY, NEVER CHANGE: personal_info.full_name, email_obfuscated, phone_obfuscated, location, social_links; every experience's company/start_date/end_date/location; all of "education"; all of "certifications"; each project's "url" and "image_placeholder"; metadata.primary_color and metadata.template (copy them through unchanged from the source).

LANGUAGE: write every piece of text you author (title, bio, description bullets) in the SAME LANGUAGE as the job posting, even if that differs from the source profile's language. Set metadata.language to that language's code ("it" or "en") — if the job posting is in neither language, default to "en".

OUTPUT FORMAT:
- Return ONLY a valid JSON object matching the schema below, no markdown, no explanation, no code fences.
- The schema uses "| undefined" to mark optional fields. NEVER write the literal word "undefined" in your JSON output — use null or omit the field.
- Set metadata.generated_at to the current ISO timestamp.

Schema:
${PROFILE_JSON_SCHEMA_BLOCK}`;

// Deterministic backstop for the anti-fabrication rules above: regardless of
// how well the model follows the prompt, a skill/tool/technology can only
// survive in the output if its exact (case-insensitive) text already
// appeared somewhere in the source profile's own skills/technologies.
function collectAllowedTechTokens(source: ProfileSchema): Set<string> {
  const items = [
    ...source.skills.hard,
    ...source.skills.soft,
    ...source.skills.tools,
    ...source.experience.flatMap((e) => e.technologies),
  ];
  return new Set(items.map((s) => s.toLowerCase().trim()));
}

function keepAllowed(items: string[], allowed: Set<string>): string[] {
  return items.filter((item) => allowed.has(item.toLowerCase().trim()));
}

export async function tailorResume(sourceProfile: ProfileSchema, jobPostingText: string): Promise<ProfileSchema> {
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
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `<source_cv_json>\n${JSON.stringify(sourceProfile)}\n</source_cv_json>\n\n<job_posting>\n${jobPostingText}\n</job_posting>\n\nRewrite the source profile to align with this job posting and return the JSON object.`,
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

  const tailored = extractProfileJson(
    json,
    "Job posting or CV too long to process."
  );

  const allowed = collectAllowedTechTokens(sourceProfile);
  tailored.skills.hard = keepAllowed(tailored.skills.hard, allowed);
  tailored.skills.soft = keepAllowed(tailored.skills.soft, allowed);
  tailored.skills.tools = keepAllowed(tailored.skills.tools, allowed);
  tailored.experience = tailored.experience.map((exp) => ({
    ...exp,
    technologies: keepAllowed(exp.technologies, allowed),
  }));

  return tailored;
}
