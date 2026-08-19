import { NextRequest, NextResponse } from "next/server";
import { kv } from "@/lib/kv";
import { parseResumeRatelimit, getClientIp } from "@/lib/rate-limit";
import { verifyTurnstile } from "@/lib/turnstile";
import { resolveProfileFromPdf, savePendingProfile, findDuplicatePrimaryProfile, PENDING_TTL_SECONDS } from "@/lib/profile-store";
import { computeCvScore } from "@/lib/cv-score";
import { NotAResumeError } from "@/lib/parse-resume";
import { createServerSupabaseClient } from "@/lib/supabase/server";

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
    // The page's address is derived from this filename (see
    // savePendingProfile) rather than the person's name, per the user's
    // request — "name" here is only present on a real File (vs. a bare
    // Blob), which is what a browser <input type="file"> upload always is.
    const filenameBase = "name" in file && typeof file.name === "string"
      ? file.name.replace(/\.pdf$/i, "")
      : undefined;
    const arrayBuffer = await file.arrayBuffer();

    const resolved = await resolveProfileFromPdf(arrayBuffer, templateChoice);

    // Only meaningful for someone already signed in (e.g. via "+ Carica un
    // nuovo CV" from their account) — an anonymous /generate visitor has no
    // saved CVs to match against yet. Best-effort: getUser() failing or
    // returning nobody just means "skip the check", never a hard error —
    // this warning is a courtesy, not something worth blocking an upload
    // over.
    let duplicateOf = null;
    try {
      const supabase = await createServerSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        duplicateOf = await findDuplicatePrimaryProfile(supabase, user.id, resolved.pdfHash);
      }
    } catch (err) {
      console.error("[parse-resume] duplicate check failed", err);
    }

    // Same PDF re-uploaded within the pending window (accidental resubmit,
    // or someone trying to run up the Claude bill by replaying the same
    // file): reuse the existing pending slug instead of minting a new one
    // for identical content, but always issue a fresh claim token.
    if (resolved.fromCache && resolved.cachedSlug) {
      if (resolved.templateChanged) {
        await kv.set(`profile:${resolved.cachedSlug}`, JSON.stringify(resolved.profile), { ex: PENDING_TTL_SECONDS });
      }
      const claimToken = crypto.randomUUID();
      await kv.set(`claim:${claimToken}`, JSON.stringify({ slug: resolved.cachedSlug }), { ex: PENDING_TTL_SECONDS });
      return NextResponse.json({
        slug: resolved.cachedSlug,
        profile: resolved.profile,
        claimToken,
        cvScore: { before: resolved.scoreBefore, after: computeCvScore(resolved.profile) },
        suggestedTitles: resolved.suggestedTitles,
        duplicateOf,
      });
    }

    const profile = resolved.profile;

    // Override LinkedIn URL if provided by the user
    const linkedinInput = formData.get("linkedin");
    if (linkedinInput && typeof linkedinInput === "string" && linkedinInput.trim()) {
      let linkedinUrl = linkedinInput.trim();
      if (!linkedinUrl.startsWith("http")) linkedinUrl = "https://" + linkedinUrl;
      profile.personal_info.social_links.linkedin = linkedinUrl;
    }

    const { slug, claimToken } = await savePendingProfile(profile, filenameBase, resolved.pdfHash);
    await kv.set(`pdf-hash:${resolved.pdfHash}`, slug, { ex: PENDING_TTL_SECONDS });

    return NextResponse.json({
      slug,
      profile,
      claimToken,
      cvScore: { before: resolved.scoreBefore, after: computeCvScore(profile) },
      suggestedTitles: resolved.suggestedTitles,
      duplicateOf,
    });
  } catch (err) {
    if (err instanceof NotAResumeError) {
      return NextResponse.json(
        { error: "Il file caricato non sembra essere un CV. Carica un curriculum in formato PDF.", code: "NOT_A_RESUME" },
        { status: 422 }
      );
    }
    console.error("[parse-resume]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
