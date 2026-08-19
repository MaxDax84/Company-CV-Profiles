import { logClaudeUsage } from "./log-claude-usage";

// Opt-in feature mirroring lib/translate-resume.ts, but for plain text
// instead of structured JSON — a cover letter is just prose, so there's no
// schema to preserve, only the letter's own structure (paragraph breaks,
// salutation, sign-off). A faithful translation pass: not a rewrite, not a
// re-optimization, no new claims.
const SYSTEM_PROMPT = `You translate an existing cover letter into a target language, given as an ISO 639-1 code (e.g. "it", "es", "fr", "de", "pt", "en", "zh", "ar"). This is a faithful translation pass — not a rewrite, not an improvement, not a re-optimization.

RULES:
- Translate the entire letter into natural, professional business-letter language for the target language — a fluent native speaker's phrasing, not a word-for-word mechanical translation.
- Preserve the letter's structure exactly: same salutation style, same paragraph breaks (a blank line between paragraphs), same sign-off, same overall length and level of detail.
- Never add, remove, embellish, or reinterpret any claim, fact, achievement, or detail — every sentence in the source must have a corresponding translated sentence in the output, nothing more, nothing less.
- A person's name in the sign-off stays exactly as written, never translated or altered.
- Return ONLY the translated letter's plain text — no markdown, no explanation, no code fences, no notes.`;

export async function translateCoverLetter(letterText: string, targetLanguageCode: string): Promise<string> {
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
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      output_config: { effort: "medium" },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `<target_language_code>${targetLanguageCode}</target_language_code>\n\n<source_letter>\n${letterText}\n</source_letter>\n\nTranslate the letter into the target language and return the plain text.`,
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
  logClaudeUsage("translate_cover_letter", "claude-sonnet-5", json.usage);

  if (json.stop_reason === "max_tokens") {
    throw new Error("Cover letter translation was cut off.");
  }

  const textBlock = json.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("No text response from model");
  }

  return textBlock.text.trim();
}
