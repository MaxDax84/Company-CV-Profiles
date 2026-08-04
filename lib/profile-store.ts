import { kv } from "./kv";
import type { ProfileSchema } from "./schema";
import { parseResume } from "./parse-resume";
import { TEMPLATE_COLORS, PROFILE_TTL_SECONDS, isTemplateStyle } from "./templates";
import { ALLOWED_PROFILE_HOSTS } from "./site-config";

// Shared slug/KV plumbing used by both /api/parse-resume and /api/tailor-resume.

// Converts "Mario Rossi" → "mario-rossi", with collision suffix if needed
export function toSlug(fullName: string): string {
  return fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function getProfileBySlug(slug: string): Promise<ProfileSchema | null> {
  const raw = await kv.get<string>(`profile:${slug}`);
  if (!raw) return null;
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

// Saves a brand-new profile under a fresh, collision-free slug, plus its own
// management token — used by both flows so every generated/tailored profile
// is a fully independent profile:<slug> + manage:<token> pair.
export async function saveNewProfile(profile: ProfileSchema): Promise<{ slug: string; manageToken: string }> {
  const baseSlug = toSlug(profile.personal_info.full_name) || "profile";
  let slug = baseSlug;
  let attempt = 0;
  while (await kv.exists(`profile:${slug}`)) {
    attempt++;
    slug = `${baseSlug}-${attempt}`;
  }

  // Matches the "48 ore poi eliminato" copy shown to the user on /generate.
  await kv.set(`profile:${slug}`, JSON.stringify(profile), { ex: PROFILE_TTL_SECONDS });

  // Management token: lets the profile owner change template or delete the
  // profile later without a full login system. Never embedded in the
  // profile JSON itself (that object is sent to the client template
  // components), so it can't leak through the public page.
  const manageToken = crypto.randomUUID();
  await kv.set(`manage:${manageToken}`, slug, { ex: PROFILE_TTL_SECONDS });

  return { slug, manageToken };
}

// Web Crypto (not Node's `crypto` module — this must stay edge-compatible)
async function hashPdf(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export interface ResolveFromPdfResult {
  profile: ProfileSchema;
  pdfHash: string;
  fromCache: boolean;
  cachedSlug: string | null;
  templateChanged: boolean;
}

// Extracts a profile from an uploaded PDF, reusing a cached extraction if
// this exact file was uploaded before (accidental resubmit, or someone
// replaying a file to run up the Claude bill) instead of paying for a fresh
// call. Reapplies `templateChoice` even on a cache hit, since the extracted
// content is identical but the user may have picked a different look.
//
// Deliberately does NOT touch the public profile:<slug>/manage:<token>
// records itself — callers decide whether a cache hit should reuse the
// existing public slug (as /api/parse-resume does) or just borrow the
// extracted data as an input to something else (as /api/tailor-resume does).
export async function resolveProfileFromPdf(
  buf: ArrayBuffer,
  templateChoice: unknown
): Promise<ResolveFromPdfResult> {
  const pdfHash = await hashPdf(buf);
  const cachedSlug = await kv.get<string>(`pdf-hash:${pdfHash}`);
  if (cachedSlug) {
    const cachedProfile = await getProfileBySlug(cachedSlug);
    if (cachedProfile) {
      let templateChanged = false;
      if (isTemplateStyle(templateChoice) && templateChoice !== cachedProfile.metadata.template) {
        cachedProfile.metadata.template = templateChoice;
        cachedProfile.metadata.primary_color = TEMPLATE_COLORS[templateChoice];
        templateChanged = true;
      }
      return { profile: cachedProfile, pdfHash, fromCache: true, cachedSlug, templateChanged };
    }
  }

  const profile = await parseResume(buf);

  // Normalize apostrophes in name (e.g. D'Assano → Dassano)
  profile.personal_info.full_name = profile.personal_info.full_name.replace(/'/g, "");

  // User's choice always wins over the AI suggestion
  if (isTemplateStyle(templateChoice)) {
    profile.metadata.template = templateChoice;
    profile.metadata.primary_color = TEMPLATE_COLORS[templateChoice];
  }

  return { profile, pdfHash, fromCache: false, cachedSlug: null, templateChanged: false };
}

// Parses a URL the user claims points at a profile this tool already
// generated, and returns its slug — or null if the URL doesn't point at one
// of our own allowed hosts in the expected /profile/<slug> shape. Used by
// /tailor's "paste your profile link instead of re-uploading" CV source.
export function extractSlugFromProfileUrl(input: string): string | null {
  let url: URL;
  try {
    url = new URL(input);
  } catch {
    return null;
  }

  const isLocalDev = process.env.NODE_ENV !== "production" && url.hostname === "localhost";
  if (url.protocol !== "https:" && !isLocalDev) return null;
  if (!ALLOWED_PROFILE_HOSTS.includes(url.hostname.toLowerCase())) return null;

  const match = url.pathname.match(/^\/profile\/([a-z0-9-]+)\/?$/);
  return match ? match[1] : null;
}
