import type { ProfileSchema } from "./schema";
import { logClaudeUsage } from "./log-claude-usage";

const SYSTEM_PROMPT = `You estimate how relevant a candidate's CV profile is to a specific job posting — purely to warn the user before they spend a credit tailoring their CV to a job that doesn't genuinely match their background. You are not making a hiring decision.

Score from 0 to 100 how well the CV's actual experience, skills, and domain align with what the job posting is asking for. Judge realistically and strictly: a CV with no genuine overlap in domain, skills, or seniority should score low (below 20) even if a few generic words happen to coincide. A CV that's a strong, direct match for the role should score high (80+). Most real candidates tailoring to a reasonably-related role should land in the 40-75 range — reserve the extremes for genuinely obvious cases.

Return ONLY a valid JSON object, no markdown, no explanation, no code fences: {"score": number, "reason": string}. "reason" is one short sentence (max 140 characters), in the SAME LANGUAGE as the job posting, stating specifically why — name the actual gap or the actual match, never a generic phrase like "good fit" or "not related".`;

export interface RelevanceResult {
  score: number;
  reason: string;
}

export async function checkRelevance(profile: ProfileSchema, jobPostingText: string, userId?: string | null): Promise<RelevanceResult> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 256,
      system: [{ type: "text", text: SYSTEM_PROMPT, cache_control: { type: "ephemeral" } }],
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `<cv_profile_json>\n${JSON.stringify(profile)}\n</cv_profile_json>\n\n<job_posting>\n${jobPostingText}\n</job_posting>\n\nScore the relevance and return the JSON object.`,
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
  logClaudeUsage("relevance_check", "claude-haiku-4-5-20251001", json.usage, userId);

  const textBlock = json.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("No text response from model");
  }

  const raw = textBlock.text.trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`No JSON object found in relevance check output: ${cleaned.slice(0, 300)}`);
  }

  const parsed = JSON.parse(cleaned.slice(start, end + 1)) as RelevanceResult;
  return {
    score: Math.max(0, Math.min(100, Math.round(parsed.score))),
    reason: parsed.reason,
  };
}
