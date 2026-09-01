import { logClaudeUsage } from "./log-claude-usage";
import { escapeControlCharsInStrings } from "./claude-json";

// Researches the hiring company behind a job posting (via Claude's
// server-side web_search + web_fetch tools) and returns a compact,
// interview-prep report: what the company does, its market, culture,
// recent news, and the JD's own critical points — each backed by a real
// source URL Claude actually visited. Deliberately does NOT touch the
// user's CV at all (see the product spec this was built from) — this makes
// the feature usable both from a signed-in account and, later, from an
// anonymous visitor who hasn't uploaded a CV yet.

export interface InterviewPrepSource {
  title: string;
  url: string;
}

export interface InterviewPrepContent {
  company_name: string | null;
  role_title: string | null;
  company_summary: string;
  market: string;
  culture_values: string;
  recent_news: string[];
  role_focus_points: string[];
  likely_questions: string[];
  sources: InterviewPrepSource[];
  language: "it" | "en";
}

const SYSTEM_PROMPT = `You help a job candidate prepare for an interview by researching the hiring company behind a job posting and summarizing what they need to know before walking in. You will be given the job posting as plain text. Use the web_search and web_fetch tools to research the company using real, current, public sources (the company's own website, its LinkedIn page, recent press coverage) — never rely on prior knowledge alone for anything that could be outdated (team size, products, leadership, recent moves).

WHAT TO PRODUCE (all from real sources you actually searched/fetched, never invented):
- The company's name and the role title, read from the job posting itself. If the job posting is anonymized or a generic listing with no identifiable company, set company_name to null and say so plainly in company_summary rather than guessing.
- A summary of what the company does, roughly how large it is, its main products/services, and its stated mission — relevant to make a genuine, informed conversation, not a marketing blurb.
- The market/sector it operates in and its general position there (competitors, niche, growth stage) if genuinely findable.
- Its culture and values, drawn from its own careers page, About page, or LinkedIn — not invented generic corporate language.
- 2-5 concrete, recent, dated news items or public moves (funding, launches, expansions, leadership changes) — skip this section (empty array) if you can't find anything genuinely recent and specific, rather than padding it with generic facts.
- role_focus_points: concrete, specific things from the JOB POSTING TEXT itself worth keeping in mind for the interview — critical requirements, unusual aspects of the role, anything a candidate could easily overlook on a first read.
- likely_questions: plausible interview questions this specific posting and company profile suggest, grounded in what the posting actually asks for (not generic "tell me about yourself" filler).
- sources: every URL you actually fetched or that a cited fact came from, each with a short descriptive title. Only include URLs you genuinely visited via the tools — never list a URL you didn't actually use.

RULES:
- Never fabricate a fact, statistic, or news item. If you can't verify something with the tools, leave it out rather than guessing.
- Keep every field concise — the final output becomes a 1-2 page PDF the candidate skims right before the interview, not a research dossier. company_summary, market, and culture_values should each be 2-4 sentences at most. Each item in recent_news/role_focus_points/likely_questions should be one sentence.
- Do not write any commentary, preamble, or explanation of your research process in your visible text — only use text to reason briefly if needed, then output nothing but the final JSON object as your last message.

LANGUAGE: write every text field in the SAME LANGUAGE as the job posting text you were given.

OUTPUT FORMAT — your final message must be ONLY a single valid JSON object matching this shape, no markdown, no explanation, no code fences:
{
  "company_name": string | null,
  "role_title": string | null,
  "company_summary": string,
  "market": string,
  "culture_values": string,
  "recent_news": string[],
  "role_focus_points": string[],
  "likely_questions": string[],
  "sources": [{ "title": string, "url": string }],
  "language": "it" | "en"
}`;

interface ClaudeToolResponse {
  stop_reason: string;
  content: Array<{ type: string; text?: string; [key: string]: unknown }>;
  usage?: { input_tokens: number; output_tokens: number; cache_creation_input_tokens?: number; cache_read_input_tokens?: number };
}

async function callClaude(messages: unknown[]): Promise<ClaudeToolResponse> {
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
      output_config: { effort: "high" },
      tools: [
        { type: "web_search_20250305", name: "web_search", max_uses: 4 },
        { type: "web_fetch_20250910", name: "web_fetch", max_uses: 3 },
      ],
      messages,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${body}`);
  }
  return res.json() as Promise<ClaudeToolResponse>;
}

// Tool-use responses interleave server_tool_use / *_tool_result blocks
// around the model's actual text — unlike tailor-resume's single-shot JSON
// reply, the real answer is whichever "text" block comes LAST, not first.
function extractLastJsonObject(content: ClaudeToolResponse["content"]): InterviewPrepContent {
  const textBlocks = content.filter((b): b is { type: "text"; text: string } => b.type === "text" && typeof b.text === "string");
  const last = textBlocks[textBlocks.length - 1];
  if (!last) throw new Error("No text response from model");

  const raw = last.text.trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`No JSON object found in model output: ${cleaned.slice(0, 500)}`);
  }
  const jsonStr = cleaned.slice(start, end + 1);

  try {
    return JSON.parse(jsonStr);
  } catch {
    const repaired = escapeControlCharsInStrings(jsonStr).replace(/:(\s*)undefined(\s*[,}\]])/g, ":$1null$2");
    return JSON.parse(repaired);
  }
}

const MAX_CONTINUATIONS = 4;

export async function generateInterviewPrep(jobPostingText: string, userId?: string | null): Promise<InterviewPrepContent> {
  const messages: unknown[] = [
    {
      role: "user",
      content: `<job_posting>\n${jobPostingText}\n</job_posting>\n\nResearch the hiring company and produce the JSON report described in your instructions.`,
    },
  ];

  let response = await callClaude(messages);
  logClaudeUsage("interview_prep", "claude-sonnet-5", response.usage, userId);

  // Server-tool turns can pause after their internal iteration cap — resend
  // the paused assistant turn unchanged to let the API pick back up, per
  // Anthropic's documented pause_turn continuation pattern.
  let continuations = 0;
  while (response.stop_reason === "pause_turn" && continuations < MAX_CONTINUATIONS) {
    messages.push({ role: "assistant", content: response.content });
    response = await callClaude(messages);
    logClaudeUsage("interview_prep", "claude-sonnet-5", response.usage, userId);
    continuations++;
  }

  if (response.stop_reason === "refusal") {
    throw new Error("The model declined to research this job posting.");
  }

  return extractLastJsonObject(response.content);
}
