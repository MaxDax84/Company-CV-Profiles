import type { ProfileSchema } from "./schema";
import { extractProfileJson } from "./claude-json";
import { logClaudeUsage } from "./log-claude-usage";

// Hard ceiling enforced in code (app/api/cv-chat/next-question/route.ts),
// not just mentioned in the prompt below — a model that ignores its own
// instruction can't push the conversation past this.
export const MAX_QUESTIONS = 6;

export interface ChatTurn {
  question: string;
  target_field: string;
  answer: string;
}

export interface QuestionResult {
  done: boolean;
  question?: string;
  target_field?: string;
}

const SYSTEM_PROMPT = `You are helping someone improve their CV by asking targeted follow-up questions, one at a time, to surface concrete numbers and results that are missing from it — the same gaps a recruiter would silently mark the CV down for.

You will be given the CV as JSON, plus the conversation so far (questions already asked, their target field, and the user's answers).

WHAT TO LOOK FOR (in priority order):
1. An experience bullet describing an achievement or responsibility with NO number, percentage, amount, team size, or scope attached, where a real person could plausibly know one (e.g. "Migliorato il processo di onboarding" has no number; "Gestito un team" has no size).
2. A generic, non-specific bio/summary that could describe almost anyone in the role, rather than this specific person's actual scope or specialty.
3. A skills section that is empty or very sparse relative to how senior/experienced the CV otherwise looks.
4. A role description that only lists duties ("Responsabile di...") with no outcome or result stated at all.

RULES:
- Ask exactly ONE question per turn, about ONE specific gap in ONE specific field. Never ask two things at once.
- The question must be natural and conversational, as if a helpful colleague were asking — not a form field label. Reference the actual role/company/bullet it's about, so the person immediately knows what you mean.
- Never ask about a "target_field" that already appears in the conversation so far — always look at what hasn't been asked yet.
- Never ask the person to invent a number they don't actually have — frame it as "do you have a rough number for X?" not "what is X?", and if their previous answer already said "I don't know" or was vague/declined for a similar gap, don't ask a near-identical question again.
- "target_field" must be the exact path into the CV JSON that this question is about, in JS-path notation, e.g. "experience[1].description[2]" for the 3rd bullet of the 2nd experience, or "personal_info.bio" for the bio. Point at the most specific existing element the question is about — if the question would add a NEW bullet rather than fix an existing one, target the experience's description array itself, e.g. "experience[0].description".
- Ask in the SAME LANGUAGE as the CV (metadata.language — "it" or "en").
- Set "done": true (and omit "question"/"target_field") once either: there is genuinely nothing significant left to ask about (the CV is already concrete and well-quantified), or the conversation so far already covered the most impactful gaps you can find. Do not manufacture a weak question just to keep going.

OUTPUT FORMAT: return ONLY a valid JSON object, no markdown, no explanation, no code fences: {"done": boolean, "question": string | undefined, "target_field": string | undefined}. Never write the literal word "undefined" — omit the field instead when not applicable.`;

export async function getNextQuestion(profile: ProfileSchema, transcript: ChatTurn[]): Promise<QuestionResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `<cv_profile_json>\n${JSON.stringify(profile)}\n</cv_profile_json>\n\n<conversation_so_far>\n${JSON.stringify(transcript)}\n</conversation_so_far>\n\nChoose the next question (or signal done) and return the JSON object.`,
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
  logClaudeUsage("cv_chat_question", "claude-haiku-4-5-20251001", json.usage);

  return extractProfileJson<QuestionResult>(json, "Conversation too long to process.");
}
