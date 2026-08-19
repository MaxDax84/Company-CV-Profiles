import type { ProfileSchema } from "./schema";
import { logClaudeUsage } from "./log-claude-usage";

const SYSTEM_PROMPT = `You write a cover letter for a job application, based on a structured CV profile given to you as JSON. Return ONLY the letter's plain text — no markdown, no JSON, no explanation, no code fences, no subject line.

ANTI-FABRICATION: base every claim strictly on what the profile JSON actually states (bio, experience, skills, projects, certifications). Never invent an achievement, employer, skill, or metric that isn't already present in the profile.

LANGUAGE: write the entire letter in the language given by profile.metadata.language ("it" or "en").

ADDRESSING:
- If profile.metadata.target_company and/or profile.metadata.target_role are present, this is a letter for that specific job — open by naming the role and/or company naturally in the first sentence, and tailor which experience/skills you foreground to match that role's likely priorities (inferred only from the role title itself, not invented requirements).
- If neither is present, this is a SPECULATIVE, GENERAL-PURPOSE letter — NOT a continuation of or application for the candidate's current/most recent job title, and not addressed to any specific role at all. Open with "Gentile Team Risorse Umane," / "Dear Hiring Team," (in the letter's own language — translate this greeting, do not invent a person's name or a company name). The opening sentence must frame this explicitly as a general/speculative application — the candidate is reaching out to be considered for potential opportunities that match their profile, not applying to replace or continue in a named position. Summarize the candidate's overall professional identity and strongest track record across their whole career (not just the latest role) as a value proposition, and close by inviting the recipient to consider them for any current or future opening that fits their background — never phrase this as "I am writing to apply for the position of X" or name the candidate's own current job title as if it were the position being sought.

STRUCTURE: a real business letter, not a bulleted list — salutation, then 2-3 short body paragraphs (opening hook tied to the role or the candidate's core strength, one paragraph grounding it in 1-2 concrete pieces of experience from the profile, a closing paragraph expressing interest and inviting next steps), then a sign-off with the candidate's full name. Roughly 250-400 words total, single page. Separate paragraphs with a blank line.`;

export async function generateCoverLetter(profile: ProfileSchema): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-5",
      max_tokens: 2048,
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
              text: `<cv_profile_json>\n${JSON.stringify(profile)}\n</cv_profile_json>\n\nWrite the cover letter.`,
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
  logClaudeUsage("cover_letter", "claude-sonnet-5", json.usage);

  if (json.stop_reason === "max_tokens") {
    throw new Error("Cover letter generation was cut off.");
  }

  const textBlock = json.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("No text response from model");
  }

  return textBlock.text.trim();
}
