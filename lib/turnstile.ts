// Verifies a Cloudflare Turnstile token server-side before trusting a request.
// Edge-compatible: plain fetch, no Node-only APIs (mirrors the Web Crypto
// approach used for PDF hashing in app/api/parse-resume/route.ts).
export async function verifyTurnstile(token: string | null, ip: string): Promise<boolean> {
  if (!token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: process.env.TURNSTILE_SECRET_KEY!,
        response: token,
        remoteip: ip,
      }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}
