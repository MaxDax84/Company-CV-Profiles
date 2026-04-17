import type { ProfileSchema } from "./schema";

const SYSTEM_PROMPT = `You are a precise CV data extractor. Your task is to extract information from a CV/resume PDF and return ONLY a valid JSON object matching the schema below.

Rules:
- Return ONLY the JSON object, no markdown, no explanation, no code fences.
- Never hallucinate data that is not present in the document. Use null or omit optional fields if data is missing.
- For full_name: remove apostrophes from surnames (e.g. "D'Assano" → "Dassano", "Dell'Aquila" → "DellAquila", "O'Brien" → "OBrien").
- Obfuscate email: keep first letter, replace middle with ***, keep domain. Example: "mario.rossi@gmail.com" → "m***@gmail.com".
- Obfuscate phone: keep country code and last 4 digits, replace rest with *. Example: "+39 333 1234567" → "+39 3** *** 4567".
- For description bullet points: EXACTLY 1 item, max 12 words, start with action verb.
- For bio: max 90 characters, professional tone, third person.
- For experience: include at most 5 most recent entries.
- For technologies per experience: max 3 items.
- For skills (hard/soft/tools): max 6 items each.
- For projects: max 2 entries.
- For certifications: max 4 entries.
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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function parseResume(pdfBuffer: ArrayBuffer): Promise<ProfileSchema> {
  const base64Pdf = arrayBufferToBase64(pdfBuffer);

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
      "anthropic-beta": "pdfs-2024-09-25",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 8192,
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
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${body}`);
  }

  const json = await res.json() as {
    stop_reason: string;
    content: { type: string; text: string }[];
  };

  if (json.stop_reason === "max_tokens") {
    throw new Error("CV too long to process. Please try with a shorter CV (max 2 pages recommended).");
  }

  const textBlock = json.content.find((b) => b.type === "text");
  if (!textBlock) {
    throw new Error("No text response from model");
  }

  const raw = textBlock.text.trim();
  const cleaned = raw.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");

  // Extract the JSON object robustly — handles extra text before/after the braces
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end === -1) {
    throw new Error(`No JSON object found. stop_reason=${json.stop_reason} output=${cleaned.slice(0, 500)}`);
  }
  const jsonStr = cleaned.slice(start, end + 1);

  let profile: ProfileSchema;
  try {
    profile = JSON.parse(jsonStr);
  } catch {
    throw new Error(`stop_reason=${json.stop_reason} | output_length=${cleaned.length} | tail=${cleaned.slice(-200)}`);
  }

  if (!profile.metadata?.generated_at) {
    profile.metadata.generated_at = new Date().toISOString();
  }

  return profile;
}
