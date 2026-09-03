import { NextRequest, NextResponse } from "next/server";
import { resolveMx } from "dns/promises";
import { getClientIp, checkEmailDomainRatelimit } from "@/lib/rate-limit";

export const runtime = "nodejs"; // dns/promises needs Node, not the edge runtime

// Catches a mistyped/made-up domain ("bmail.com") at signup instead of a
// silent dead end when the confirmation email never arrives. Deliberately
// NOT a whitelist of "known" providers — that would reject real company or
// personal domains just for being unfamiliar. A domain with no mail
// exchanger configured genuinely cannot receive email, whoever owns it.
export async function POST(req: NextRequest) {
  try {
    const clientIp = getClientIp(req);
    const { success } = await checkEmailDomainRatelimit.limit(clientIp);
    if (!success) {
      return NextResponse.json({ error: "Too many requests." }, { status: 429 });
    }

    const body = await req.json().catch(() => null);
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    const domain = email.split("@")[1];
    if (!domain) {
      return NextResponse.json({ valid: false });
    }

    try {
      const records = await resolveMx(domain);
      return NextResponse.json({ valid: records.length > 0 });
    } catch (err) {
      const code = (err as NodeJS.ErrnoException)?.code;
      if (code === "ENOTFOUND" || code === "ENODATA") {
        // No such domain, or a real domain with no mail exchanger — either
        // way it genuinely cannot receive email.
        return NextResponse.json({ valid: false });
      }
      // Any other DNS failure (timeout, resolver hiccup, etc.) is our own
      // infrastructure's problem, not evidence the domain is bad — never
      // block a real signup over it.
      console.error("[account/check-email-domain] DNS lookup failed", err);
      return NextResponse.json({ valid: true });
    }
  } catch (err) {
    console.error("[account/check-email-domain]", err);
    return NextResponse.json({ valid: true });
  }
}
