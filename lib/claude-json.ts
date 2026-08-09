import type { ProfileSchema } from "./schema";

// Shared by parse-resume.ts and tailor-resume.ts — both ask Claude to return
// a ProfileSchema as raw JSON text and need the same extraction/repair pass.

// Escapes raw control characters (newline, tab, carriage return) found inside
// JSON string literals — Claude occasionally emits these unescaped, which
// JSON.parse rejects even though the surrounding structure is otherwise valid.
export function escapeControlCharsInStrings(jsonStr: string): string {
  let result = "";
  let inString = false;
  let escapedNext = false;

  for (const ch of jsonStr) {
    if (escapedNext) {
      result += ch;
      escapedNext = false;
      continue;
    }
    if (ch === "\\") {
      result += ch;
      escapedNext = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      result += ch;
      continue;
    }
    if (inString && ch === "\n") result += "\\n";
    else if (inString && ch === "\r") result += "\\r";
    else if (inString && ch === "\t") result += "\\t";
    else result += ch;
  }

  return result;
}

interface ClaudeMessageResponse {
  stop_reason: string;
  content: { type: string; text: string }[];
}

// Pulls a JSON object out of a Claude messages-API response: guards against
// truncation, strips code fences, slices between the outer braces, then
// parses with a repair-and-retry pass for the malformed JSON Claude
// occasionally emits (raw control chars in strings, literal `undefined`).
// Generic so callers that ask for extra top-level fields alongside the
// ProfileSchema (e.g. parse-resume.ts's cv_score_before) get them typed —
// defaults to ProfileSchema for the common case.
export function extractProfileJson<T = ProfileSchema>(json: ClaudeMessageResponse, tooLongMessage: string): T {
  if (json.stop_reason === "max_tokens") {
    throw new Error(tooLongMessage);
  }

  const textBlock = json.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("No text response from model");
  }

  const raw = textBlock.text.trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`No JSON object found. stop_reason=${json.stop_reason} output=${cleaned.slice(0, 500)}`);
  }
  const jsonStr = cleaned.slice(start, end + 1);

  try {
    return JSON.parse(jsonStr);
  } catch {
    // Claude sometimes emits literal control characters (e.g. newlines in a bio)
    // inside JSON string values, or the bare word `undefined` for an optional
    // field (copying the "string | undefined" schema notation) — neither is
    // valid JSON. Repair both and retry before giving up.
    const repaired = escapeControlCharsInStrings(jsonStr).replace(
      /:(\s*)undefined(\s*[,}\]])/g,
      ":$1null$2"
    );
    try {
      return JSON.parse(repaired);
    } catch {
      console.error(`[claude-json] Unparseable JSON:\n${jsonStr}`);
      throw new Error(`stop_reason=${json.stop_reason} | output_length=${cleaned.length} | tail=${cleaned.slice(-200)}`);
    }
  }
}

// The literal JSON-shape block appended to both the extraction and tailoring
// system prompts — kept in one place so it can't drift out of sync with
// lib/schema.ts's ProfileSchema.
export const PROFILE_JSON_SCHEMA_BLOCK = `{
  "personal_info": {
    "full_name": string,
    "title": string,
    "bio": string,
    "bio_original": string | undefined,
    "email_obfuscated": string,
    "phone_obfuscated": string | undefined,
    "email": string | undefined,
    "phone": string | undefined,
    "location": string | undefined,
    "social_links": {
      "linkedin": string | undefined,
      "github": string | undefined,
      "portfolio": string | undefined,
      "twitter": string | undefined
    }
  },
  "experience": [{
    "company": string,
    "role": string,
    "start_date": string,
    "end_date": string,
    "description": string[],
    "technologies": string[],
    "location": string | undefined
  }],
  "education": [{
    "institution": string,
    "degree": string,
    "field": string | undefined,
    "start_year": number,
    "end_year": number | "present",
    "grade": string | undefined
  }],
  "certifications": [{
    "name": string,
    "issuer": string,
    "year": number,
    "url": string | undefined
  }],
  "skills": {
    "hard": string[],
    "soft": string[],
    "tools": string[]
  },
  "projects": [{
    "title": string,
    "description": string,
    "tags": string[],
    "url": string | undefined,
    "image_placeholder": string
  }],
  "other": string[] | undefined,
  "metadata": {
    "primary_color": string,
    "template": "alpha" | "beta" | "gamma" | "delta",
    "language": "it" | "en",
    "generated_at": string
  }
}`;
