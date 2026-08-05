import type { ProfileSchema } from "./schema";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";

const SYSTEM_PROMPT = `You rewrite an existing structured CV profile to align with a specific job posting, optimizing it to pass ATS (Applicant Tracking System) keyword filters and to read as a strong match to a human recruiter — without inventing anything not truthfully present in the source profile. You will be given the source profile as JSON and a job posting as plain text.

HOW ATS SYSTEMS ACTUALLY WORK — this shapes every rewrite decision below:
- Most ATS and recruiter boolean searches match keywords near-literally, not by meaning. A source that says "customer feedback" will often NOT match a posting asking for "Voice of Customer" even though they mean the same thing — you must use the posting's own exact terminology whenever the source's underlying fact genuinely supports it.
- The "skills" fields are typically parsed and matched as a distinct block, separate from prose — a truthful skill mentioned only inside a paragraph is weaker for ATS purposes than the same truthful skill also present in "skills".
- Quantified results (%, numbers, scope, team size, budget, timeframe) are high-value content for both ATS keyword density and human recruiter judgment — they must never be dropped or merged away to save space.
- More truthful, specific content is strictly better than less — do not compress or shorten for the sake of brevity. A rewritten CV that is shorter than the source but has lost real content has gotten worse, not more "optimized".

ANTI-FABRICATION RULES — still the hard limits, never crossed for the sake of ATS optimization:
- Never add a company, employer, role, certification, degree, or project that is absent from the source profile.
- Never add a skill, tool, or technology to "skills" or any experience's "technologies" unless it is already evidenced somewhere in the source profile (bio, experience descriptions, skills, projects, certifications). Renaming an existing item to match the job posting's terminology is allowed (e.g. "JS" → "JavaScript" if JavaScript experience is genuinely present) — inventing a new capability is not.
- If "skills.hard", "skills.soft", or "skills.tools" is empty or sparse in the source, leave it that way. Do NOT populate an empty category just because the job posting asks for those qualities — wanting evidence is not the same as having it. Only add an item if it is genuinely, independently evidenced in the source profile's own text.
- Never invent a new achievement, responsibility, or metric that isn't already stated (even loosely) somewhere in the source profile for that role.
- Never drop or water down a quantified result (a %, a number, a scope, a team size, a budget) that the source states — carry every one of them into the rewrite. This is the single most common way a rewrite makes a CV worse: losing the numbers that prove impact.
- Never change dates, company names, institution names, or degree titles.
- If the job posting wants something the source profile doesn't have, simply don't claim it — an imperfect match is the correct, honest outcome, not a failure.

SELF-CHECK BEFORE YOU OUTPUT (do this per experience, silently, before writing the final JSON): list every number/%/figure that appears in that experience's SOURCE description bullets. For each one, confirm it is still present, verbatim, somewhere in your rewritten bullets for that same experience. If any is missing, that is a bug — add it back into a bullet rather than finalizing the output without it. A rewrite that summarizes a role's overall scope in one new bullet does NOT excuse dropping any of the source's original numbers elsewhere in that same role.

WHAT YOU MAY REWRITE — more freely than a light copy-edit, as long as every fact and metric traces back to the source:
- Reorder "skills.hard", "skills.soft", and "skills.tools" to surface job-relevant items first (reordering and relabeling existing items only, see rule above about empty categories).
- Rewrite each experience's "description" bullets to use the job posting's own terminology wherever it truthfully applies. You may split, merge, reorder, or rephrase bullets — the bullet COUNT does not need to match the source — but every distinct achievement and every quantified metric present in the source for that role must still appear somewhere in the rewritten bullets. Do not reduce a rich, multi-achievement role down to one generic bullet.
- Rewrite "title" and "bio" using the job posting's terminology, but only where it accurately describes something already true in the source profile.
- Reorder "projects" to put the most job-relevant ones first.

FIELDS TO PRESERVE EXACTLY, NEVER CHANGE: personal_info.full_name, email_obfuscated, phone_obfuscated, email, phone, location, social_links; every experience's company/start_date/end_date/location; all of "education"; all of "certifications"; each project's "url" and "image_placeholder"; metadata.primary_color and metadata.template (copy them through unchanged from the source).

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
