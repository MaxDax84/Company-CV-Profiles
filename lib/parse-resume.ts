import Anthropic from "@anthropic-ai/sdk";
import type { ProfileSchema } from "./schema";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are a precise CV data extractor. Your task is to extract information from a CV/resume PDF and return ONLY a valid JSON object matching the schema below.

Rules:
- Return ONLY the JSON object, no markdown, no explanation, no code fences.
- Never hallucinate data that is not present in the document. Use null or omit optional fields if data is missing.
- Obfuscate email: keep first letter, replace middle with ***, keep domain. Example: "mario.rossi@gmail.com" → "m***@gmail.com".
- Obfuscate phone: keep country code and last 4 digits, replace rest with *. Example: "+39 333 1234567" → "+39 3** *** 4567".
- For description bullet points: max 4 items, concise, start with action verb.
- For bio: max 200 characters, professional tone, third person.
- For primary_color: suggest a hex color that matches the person's industry (e.g. #6366f1 for tech, #0ea5e9 for finance, #10b981 for healthcare).
- For template: choose "alpha" for creative/design roles, "beta" for tech/engineering, "gamma" for business/finance, "delta" for any other.
- For image_placeholder: assign "gradient-1" through "gradient-8" to each project sequentially.
- Detect language from the CV content and set metadata.language to "it" or "en".

Schema:
{
  "personal_info": {
    "full_name": string,
    "title": string,
    "bio": string,
    "email_obfuscated": string,
    "phone_obfuscated": string | undefined,
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
  "metadata": {
    "primary_color": string,
    "template": "alpha" | "beta" | "gamma" | "delta",
    "language": "it" | "en",
    "generated_at": string
  }
}`;

export async function parseResume(pdfBuffer: Buffer): Promise<ProfileSchema> {
  const base64Pdf = pdfBuffer.toString("base64");

  const stream = client.messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "document",
            source: {
              type: "base64",
              media_type: "application/pdf",
              data: base64Pdf,
            },
          },
          {
            type: "text",
            text: "Extract all data from this CV and return the JSON object. Set metadata.generated_at to the current ISO timestamp.",
          },
        ],
      },
    ],
  });

  const message = await stream.finalMessage();
  const textBlock = message.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from model");
  }

  const raw = textBlock.text.trim();

  // Strip accidental markdown code fences if present
  const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  let profile: ProfileSchema;
  try {
    profile = JSON.parse(cleaned);
  } catch {
    throw new Error(`Model returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  // Ensure generated_at is set
  if (!profile.metadata?.generated_at) {
    profile.metadata.generated_at = new Date().toISOString();
  }

  return profile;
}
