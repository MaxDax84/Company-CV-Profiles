import { NextRequest, NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { parseResume } from "@/lib/parse-resume";
import { TEMPLATE_COLORS, PROFILE_TTL_SECONDS, isTemplateStyle } from "@/lib/templates";
import { parseResumeRatelimit, getClientIp } from "@/lib/rate-limit";

export const runtime = 'edge';
export const maxDuration = 30;

// Web Crypto (not Node's `crypto` module — this route runs on the edge)
async function hashPdf(buffer: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Converts "Mario Rossi" → "mario-rossi", with collision suffix if needed
function toSlug(fullName: string): string {
  return fullName
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  try {
    const { success, reset } = await parseResumeRatelimit.limit(getClientIp(req));
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }

    const formData = await req.formData();
    const file = formData.get("pdf");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "File must be a PDF" }, { status: 400 });
    }

    // 10 MB limit
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: "PDF must be under 10 MB" }, { status: 413 });
    }

    const templateChoice = formData.get("template");

    const arrayBuffer = await file.arrayBuffer();

    // Same PDF re-uploaded (accidental resubmit, or someone trying to run up
    // the Claude bill by replaying the same file): reuse the existing profile
    // instead of paying for a fresh extraction.
    const pdfHash = await hashPdf(arrayBuffer);
    const cachedSlug = await kv.get<string>(`pdf-hash:${pdfHash}`);
    if (cachedSlug) {
      const cachedRaw = await kv.get<string>(`profile:${cachedSlug}`);
      if (cachedRaw) {
        const cachedProfile = typeof cachedRaw === "string" ? JSON.parse(cachedRaw) : cachedRaw;

        // Re-apply the template choice even on a cache hit — the extracted
        // content is identical, but the user may have picked a different look.
        if (isTemplateStyle(templateChoice) && templateChoice !== cachedProfile.metadata.template) {
          cachedProfile.metadata.template = templateChoice;
          cachedProfile.metadata.primary_color = TEMPLATE_COLORS[templateChoice];
          await kv.set(`profile:${cachedSlug}`, JSON.stringify(cachedProfile), { ex: PROFILE_TTL_SECONDS });
        }

        const manageToken = crypto.randomUUID();
        await kv.set(`manage:${manageToken}`, cachedSlug, { ex: PROFILE_TTL_SECONDS });
        return NextResponse.json({ slug: cachedSlug, profile: cachedProfile, manageToken });
      }
    }

    const profile = await parseResume(arrayBuffer);

    // Normalize apostrophes in name (e.g. D'Assano → Dassano)
    profile.personal_info.full_name = profile.personal_info.full_name.replace(/'/g, "");

    // Override LinkedIn URL if provided by the user
    const linkedinInput = formData.get("linkedin");
    if (linkedinInput && typeof linkedinInput === "string" && linkedinInput.trim()) {
      let linkedinUrl = linkedinInput.trim();
      if (!linkedinUrl.startsWith("http")) linkedinUrl = "https://" + linkedinUrl;
      profile.personal_info.social_links.linkedin = linkedinUrl;
    }

    // User's choice always wins over the AI suggestion
    if (isTemplateStyle(templateChoice)) {
      profile.metadata.template = templateChoice;
      profile.metadata.primary_color = TEMPLATE_COLORS[templateChoice];
    }

    // Generate unique slug
    const baseSlug = toSlug(profile.personal_info.full_name) || "profile";
    let slug = baseSlug;
    let attempt = 0;
    while (await kv.exists(`profile:${slug}`)) {
      attempt++;
      slug = `${baseSlug}-${attempt}`;
    }

    // Matches the "48 ore poi eliminato" copy shown to the user on /generate.
    await kv.set(`profile:${slug}`, JSON.stringify(profile), { ex: PROFILE_TTL_SECONDS });
    await kv.set(`pdf-hash:${pdfHash}`, slug, { ex: PROFILE_TTL_SECONDS });

    // Management token: lets the profile owner change template or delete the
    // profile later without a full login system. Never embedded in the
    // profile JSON itself (that object is sent to the client template
    // components), so it can't leak through the public page.
    const manageToken = crypto.randomUUID();
    await kv.set(`manage:${manageToken}`, slug, { ex: PROFILE_TTL_SECONDS });

    return NextResponse.json({ slug, profile, manageToken });
  } catch (err) {
    console.error("[parse-resume]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
