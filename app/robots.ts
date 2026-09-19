import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Routes that must never be crawled: everything behind a login, the admin
// area, the API surface, and the auth entry points. These are either
// per-user (so a crawler sees nothing useful), noise in search results
// (login/signup), or actively harmful to index (auth callbacks carry
// one-time tokens in the URL). Public profile pages are NOT listed here:
// they already carry `robots: { index: false, follow: false }` in their own
// metadata (app/profile/[slug]/page.tsx, app/[code]/[slug]/page.tsx), which
// is the stronger signal, and a Disallow would actually prevent a crawler
// from ever reading that noindex tag.
const DISALLOWED = [
  "/account",
  "/admin",
  "/api",
  "/auth",
  "/login",
  "/signup",
  "/reset-password",
  "/forgot-password",
];

// The AI answer engines. Jobli is a product people should be able to find
// by asking an assistant "how do I get my CV past an ATS" — being cited is
// the point, so these are allowed explicitly rather than left to the
// wildcard rule (several of them, notably Google-Extended and
// Applebot-Extended, are opt-out-by-default crawlers that site owners
// routinely block wholesale; spelling out an Allow makes the intent
// unambiguous and survives a future tightening of the wildcard rule).
// See also public/llms.txt for the plain-text summary they can read.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "anthropic-ai",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOWED,
      },
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: DISALLOWED,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
