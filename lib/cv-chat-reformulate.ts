import type { ProfileSchema } from "./schema";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";
import { logClaudeUsage } from "./log-claude-usage";
import { collectAllowedTechTokens, buildSourceCorpus, keepAllowed } from "./profile-corpus";
import type { ChatTurn } from "./cv-chat-question";

const SYSTEM_PROMPT = `You rewrite a structured CV profile using facts the person just gave you in a short Q&A conversation, to add concrete numbers and results that were missing — without inventing anything they didn't actually say.

You will be given the CURRENT profile as JSON and the full Q&A conversation (each turn has the question that was asked, the exact "target_field" it was about, and the person's answer).

ANTI-FABRICATION RULES — the hard limits, never crossed:
- Only change a field that a conversation turn's "target_field" points at. Every other field must be copied through completely unchanged.
- Use ONLY the fact(s) the person actually stated in that turn's "answer" to rewrite the target field — never add a number, scope, or detail they didn't give you, even a plausible-sounding one.
- If an answer is vague, uncertain, off-topic, or effectively "I don't know" / "I don't remember" / "not sure" (in whichever language they wrote it), leave that target_field completely unchanged from the current profile — do not force a rewrite without a real fact behind it. A skipped question produces zero changes to that field, not a softened guess.
- When "target_field" points at an existing bullet (e.g. "experience[1].description[2]"), rewrite that exact bullet to naturally incorporate the new fact — do not add a separate new bullet next to it for the same fact.
- When "target_field" points at an experience's whole description array (e.g. "experience[0].description"), and the answer gives a real fact, add ONE new bullet to that array incorporating it — don't rewrite the existing bullets.
- Never add a company, employer, role, certification, degree, project, skill, or technology that isn't already in the current profile or explicitly stated in an answer.
- Never change dates, company names, institution names, degree titles, or any field no conversation turn targeted.
- Keep the same language as the current profile's own text (metadata.language) — the person's answers may be written in either language, but the rewritten CV stays in its own original language.

OUTPUT FORMAT:
- Return ONLY a valid JSON object matching the schema below — the COMPLETE profile, not just the changed fields, no markdown, no explanation, no code fences.
- The schema uses "| undefined" to mark optional fields. NEVER write the literal word "undefined" — use null or omit the field.
- Copy metadata through unchanged except generated_at, which you set to the current ISO timestamp.

Schema:
${PROFILE_JSON_SCHEMA_BLOCK}`;

export async function reformulateProfileFromChat(sourceProfile: ProfileSchema, transcript: ChatTurn[]): Promise<ProfileSchema> {
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
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      output_config: { effort: "medium" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `<current_cv_json>\n${JSON.stringify(sourceProfile)}\n</current_cv_json>\n\n<conversation>\n${JSON.stringify(transcript)}\n</conversation>\n\nApply the conversation's answers to the current profile and return the complete updated JSON object.`,
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
  logClaudeUsage("cv_chat_finish", "claude-sonnet-5", json.usage);

  const reformulated = extractProfileJson(json, "Conversation too long to process.");

  // Same deterministic anti-fabrication backstop as tailor-resume.ts, with
  // the source corpus extended to also treat the chat's own answers as
  // legitimate evidence — a skill mentioned only in an answer, never in the
  // original CV text, must still survive this filter.
  const allowed = collectAllowedTechTokens(sourceProfile);
  const corpus = `${buildSourceCorpus(sourceProfile)} \n ${transcript.map((t) => t.answer).join(" \n ")}`.toLowerCase();
  reformulated.skills.hard = keepAllowed(reformulated.skills.hard, allowed, corpus);
  reformulated.skills.soft = keepAllowed(reformulated.skills.soft, allowed, corpus);
  reformulated.skills.tools = keepAllowed(reformulated.skills.tools, allowed, corpus);
  reformulated.experience = reformulated.experience.map((exp, i) => ({
    ...exp,
    technologies: keepAllowed(exp.technologies, allowed, corpus),
    // Deterministically carried over, not trusted from the model — no chat
    // question ever targets this classification, and the conversation never
    // adds/removes/reorders whole experience entries, so a positional match
    // against the source is safe (same reasoning as tailor-resume.ts).
    is_career_experience: sourceProfile.experience[i]?.is_career_experience,
  }));

  return reformulated;
}
