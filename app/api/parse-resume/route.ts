import { NextRequest, NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { PROFILE_TTL_SECONDS } from "@/lib/templates";
import { parseResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { resolveProfileFromPdf, saveNewProfile } from "@/lib/profile-store";

export const runtime = 'edge';
export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const { success, reset } = await parseResumeRatelimit.limit(clientIp);
    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a bit." },
        { status: 429, headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) } }
      );
    }

    const formData = await req.formData();

    const turnstileToken = formData.get("turnstileToken");
    const captchaOk = await verifyTurnstile(
      typeof turnstileToken === "string" ? turnstileToken : null,
      clientIp
    );
    if (!captchaOk) {
      return NextResponse.json({ error: "Captcha verification failed. Please try again." }, { status: 403 });
    }

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

    const resolved = await resolveProfileFromPdf(arrayBuffer, templateChoice);

    // Same PDF re-uploaded (accidental resubmit, or someone trying to run up
    // the Claude bill by replaying the same file): reuse the existing public
    // profile/slug instead of minting a new one for identical content.
    if (resolved.fromCache && resolved.cachedSlug) {
      if (resolved.templateChanged) {
        await kv.set(`profile:${resolved.cachedSlug}`, JSON.stringify(resolved.profile), { ex: PROFILE_TTL_SECONDS });
      }
      const manageToken = crypto.randomUUID();
      await kv.set(`manage:${manageToken}`, resolved.cachedSlug, { ex: PROFILE_TTL_SECONDS });
      return NextResponse.json({ slug: resolved.cachedSlug, profile: resolved.profile, manageToken });
    }

    const profile = resolved.profile;

    // Override LinkedIn URL if provided by the user
    const linkedinInput = formData.get("linkedin");
    if (linkedinInput && typeof linkedinInput === "string" && linkedinInput.trim()) {
      let linkedinUrl = linkedinInput.trim();
      if (!linkedinUrl.startsWith("http")) linkedinUrl = "https://" + linkedinUrl;
      profile.personal_info.social_links.linkedin = linkedinUrl;
    }

    const { slug, manageToken } = await saveNewProfile(profile);
    await kv.set(`pdf-hash:${resolved.pdfHash}`, slug, { ex: PROFILE_TTL_SECONDS });

    return NextResponse.json({ slug, profile, manageToken });
  } catch (err) {
    console.error("[parse-resume]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
