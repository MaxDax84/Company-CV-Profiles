import type { ProfileSchema } from "./schema";
import { extractProfileJson, PROFILE_JSON_SCHEMA_BLOCK } from "./claude-json";
import { collectAllowedTechTokens, buildSourceCorpus, keepAllowed } from "./profile-corpus";
import type { ChatTurn } from "./cv-chat-question";

const SYSTEM_PROMPT = `You rewrite specific fields of a user's existing structured CV profile based on their own answers in a short guided conversation — never inventing anything the user didn't actually say or that wasn't already true in the source profile. You are given the source profile as JSON and the full conversation transcript: each question the assistant asked (with the exact profile field it targeted) and the user's own answer.

WHAT TO DO: for each question/answer pair, incorporate the user's answer into the profile, in the general area of the field the question targeted — normally by tightening the phrasing of the relevant bullet(s) in "experience[].description" or the relevant sentence in "personal_info.bio" to include the concrete fact/number the user just supplied. Use your judgment on the exact field and wording — the targeted field is a strong hint of where the answer belongs, not a rigid instruction to overwrite that exact array index verbatim.

ANTI-FABRICATION RULES — same hard limits as the rest of this app, never crossed:
- Only add a number, scope, or fact if the user stated it themselves in their answer, OR it was already present in the source profile. Never estimate, round, or infer a number the user didn't give.
- If a user's answer is vague, hedged, or doesn't contain a usable fact ("non ricordo", "circa, non saprei", "I don't remember"), leave that field's original text unchanged — do not force a rewrite that isn't backed by anything concrete.
- Never add a company, role, certification, degree, or project that isn't in the source.
- Never touch any experience's company/start_date/end_date/location, or anything in "education" or "certifications" — those are never in scope for this chat.
- Never drop or water down an existing quantified result already present in the source.
- Never add a skill/tool/technology unless it is genuinely evidenced by the source profile or by the user's own answers in this conversation.

If a field the transcript targeted turns out fine to leave untouched (the user's answer added nothing usable), return that field unchanged from the source — do not force a change for its own sake.

FIELDS TO PRESERVE EXACTLY, NEVER CHANGE: personal_info.full_name, email(_obfuscated), phone(_obfuscated), location, social_links; every experience's company/start_date/end_date/location; all of "education"; all of "certifications"; each project's url/image_placeholder (unless a project was itself the target of a question); metadata.primary_color, metadata.template, metadata.language, metadata.target_company, metadata.target_role, metadata.suggested_titles, metadata.score_before (copy through unchanged).

LANGUAGE: write everything you rewrite in the same language as the source profile.

OUTPUT FORMAT: Return ONLY a valid JSON object matching the schema below, no markdown, no explanation, no code fences. Set metadata.generated_at to the current ISO timestamp.

Schema:
${PROFILE_JSON_SCHEMA_BLOCK}`;

function formatTranscript(transcript: ChatTurn[]): string {
  return transcript
    .map((t) => (t.role === "assistant" ? `Q [target: ${t.targetField}]: ${t.content}` : `A: ${t.content}`))
    .join("\n");
}

export async function reformulateProfileFromChat(
  sourceProfile: ProfileSchema,
  transcript: ChatTurn[]
): Promise<ProfileSchema> {
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
              text: `<source_cv_json>\n${JSON.stringify(sourceProfile)}\n</source_cv_json>\n\n<conversation_transcript>\n${formatTranscript(transcript)}\n</conversation_transcript>\n\nApply the user's answers to the source profile and return the JSON object.`,
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

  const json = await res.json() as { stop_reason: string; content: { type: string; text: string }[] };
  const updated = extractProfileJson(json, "Il CV o la conversazione sono troppo lunghi da processare.");

  // Same deterministic backstop as lib/tailor-resume.ts, extended with the
  // user's own chat answers as a second legitimate evidence source — a
  // skill/tech token survives if it's evidenced by the ORIGINAL profile OR
  // by something the user actually typed in this conversation.
  const allowed = collectAllowedTechTokens(sourceProfile);
  const userAnswers = transcript.filter((t) => t.role === "user").map((t) => t.content).join(" \n ");
  const corpus = `${buildSourceCorpus(sourceProfile)} \n ${userAnswers.toLowerCase()}`;
  updated.skills.hard = keepAllowed(updated.skills.hard, allowed, corpus);
  updated.skills.soft = keepAllowed(updated.skills.soft, allowed, corpus);
  updated.skills.tools = keepAllowed(updated.skills.tools, allowed, corpus);
  updated.experience = updated.experience.map((exp) => ({
    ...exp,
    technologies: keepAllowed(exp.technologies, allowed, corpus),
  }));

  return updated;
}
