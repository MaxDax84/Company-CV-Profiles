import type { ProfileSchema } from "./schema";
import { extractProfileJson } from "./claude-json";
import { logClaudeUsage } from "./log-claude-usage";

export interface ChatTurn {
  role: "assistant" | "user";
  content: string;
  // Only ever set on assistant turns — the exact profile field the question
  // was about (e.g. "experience[1].description[2]"), so the transcript
  // itself is the map lib/cv-chat-reformulate.ts needs at the end.
  targetField?: string;
}

interface QuestionResult {
  done: boolean;
  question: string | null;
  target_field: string | null;
}

// Hard ceiling enforced in code (see app/api/cv-chat/next-question/route.ts),
// not just suggested in the prompt — the model can stop earlier on its own
// judgment, but never later than this.
export const MAX_QUESTIONS = 6;

const SYSTEM_PROMPT = `You help identify the single most valuable follow-up question to ask a job seeker, in order to strengthen their CV — specifically to surface concrete numbers, scope, and results that are missing or vague. You are given the CV as JSON and the conversation so far (questions already asked and the user's own answers). Ask about ONE gap at a time.

WHAT COUNTS AS A GOOD GAP TO ASK ABOUT:
- A bullet in "experience[].description" that describes a responsibility or achievement without a number (%, count, amount, team size, timeframe, scope) where a number plausibly exists and would meaningfully strengthen the bullet.
- A vague claim ("improved efficiency", "led a team") with no scale or outcome attached.
- personal_info.bio, if it's generic and could be sharpened with one concrete fact from elsewhere in the CV.
Do NOT ask about: certifications, education, or contact info (never editable by this chat); anything already asked in this conversation; a section that is already precise and quantified.

HOW TO CHOOSE: pick the ONE gap most likely to matter to a recruiter — prioritize the most recent/senior role, and prioritize a genuinely measurable-sounding claim over a purely qualitative one. Never invent or suggest what the missing number might be — you are asking the user to supply it, not guessing it yourself.

TARGET FIELD: every question must name the exact field it targets, using this path syntax: "experience[<index>].description[<index>]" for one specific bullet, "experience[<index>].description" for a role's bullets in general, or "personal_info.bio". Use the same 0-based indices as the source JSON.

WHEN TO STOP: if the CV genuinely has no further meaningful gaps, or you've already asked about every real gap it has, signal done rather than forcing a trivial or repetitive question. Never ask two questions about materially the same gap.

LANGUAGE: write the question in the same language as the CV.

OUTPUT FORMAT: Return ONLY a valid JSON object, no markdown, no explanation, no code fences:
{"done": boolean, "question": string | null, "target_field": string | null}
"done": true means "question" and "target_field" must both be null. Otherwise "done" is false and both must be set.`;

function formatTranscript(transcript: ChatTurn[]): string {
  if (transcript.length === 0) return "(no messages yet — this is the first question)";
  return transcript
    .map((t) => (t.role === "assistant" ? `Q [${t.targetField}]: ${t.content}` : `A: ${t.content}`))
    .join("\n");
}

export async function askNextQuestion(
  profile: ProfileSchema,
  transcript: ChatTurn[],
  userId?: string
): Promise<{ done: boolean; question: string | null; targetField: string | null }> {
  const questionsAsked = transcript.filter((t) => t.role === "assistant").length;

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
              text: `<cv_profile_json>\n${JSON.stringify(profile)}\n</cv_profile_json>\n\n<conversation_so_far>\n${formatTranscript(transcript)}\n</conversation_so_far>\n\nQuestions asked so far: ${questionsAsked} of a maximum ${MAX_QUESTIONS}.\n\nDecide the next question (or signal done) and return the JSON object.`,
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
  logClaudeUsage("cv_chat_question", "claude-haiku-4-5-20251001", json.usage, userId);
  const result = extractProfileJson<QuestionResult>(json, "La conversazione è diventata troppo lunga da processare.");

  return { done: result.done, question: result.question, targetField: result.target_field };
}
