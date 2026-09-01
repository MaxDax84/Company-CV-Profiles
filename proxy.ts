import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase auth session cookie on every request. Without this,
// Server Components/Route Handlers would see a stale or expired session
// since only this proxy layer (or a client-side call) can actually rewrite
// the cookie mid-request-lifecycle.
// Pages that never read the session server-side (no createServerSupabaseClient
// / supabase.auth call anywhere in their route) — verified by grepping the
// app tree, not guessed. Keep this list in sync if one of them starts
// checking auth; until then, skip the Supabase round-trip below entirely
// rather than paying for it on every legal/marketing/showcase page view.
const STATIC_PREFIXES = ["/privacy", "/terms", "/cookies", "/showcase", "/portfolio", "/pdf-preview", "/profile"];

function isStaticPath(pathname: string): boolean {
  return pathname === "/" || STATIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// /profile and /pdf-preview are deliberately framed by our own pages (see
// the X-Frame-Options override in next.config.mjs for the same two
// prefixes) — every other path stays fully un-frameable. Mirrors that file
// so CSP's frame-ancestors (which modern browsers honor over
// X-Frame-Options) doesn't silently loosen what X-Frame-Options enforces.
const FRAMEABLE_PREFIXES = ["/profile", "/pdf-preview"];

function isFrameablePath(pathname: string): boolean {
  return FRAMEABLE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

// Content-Security-Policy, currently shipped as Report-Only — browsers
// evaluate it and log console warnings for anything that would be blocked,
// but nothing is actually blocked yet. Meant to be watched for a while
// (check the browser console on /, /generate, /tailor, /login, and a
// /profile/<slug> page) before flipping the header name to the enforcing
// "Content-Security-Policy" once we're confident nothing legitimate trips it.
//
// Every external origin below was found by auditing what the site actually
// loads (see project memory) rather than guessed:
//  - Cloudflare Turnstile (anti-bot widget on the CV upload/tailor forms)
//  - Cookiebot (consent banner, while NEXT_PUBLIC_COOKIE_CMP=cookiebot)
//  - Google Analytics (gated behind consent/Cookiebot; inactive today since
//    NEXT_PUBLIC_GA_MEASUREMENT_ID isn't set, kept here so it doesn't break
//    silently the day it is)
//  - our own Supabase project (auth, REST, Storage — avatars)
//
// No 'nonce'/'unsafe-inline' needed in script-src: the only previously
// inline script (theme-flash prevention) now lives at public/theme-init.js
// and loads via 'self' like any other same-origin script — deliberately
// avoided a per-request nonce, which would require reading next/headers in
// the root layout and force every page in the app out of static generation.
//
// style-src keeps 'unsafe-inline': the app uses React's `style={{...}}` prop
// pervasively (not just a few spots), so dropping it would break the look of
// most pages. This is a common, accepted trade-off — CSS-based exfiltration
// is a far narrower attack class than script injection, which script-src
// still locks down to this explicit host allowlist.
//
// Known gap, not yet worth fixing: components/google-analytics.tsx renders
// its gtag init snippet as an inline <Script> (children content, no src).
// Harmless today since that script never mounts without a real
// NEXT_PUBLIC_GA_MEASUREMENT_ID — but the moment GA is switched on, watch
// the console for a script-src violation on it (fix: move the snippet to a
// static file the same way theme-init.js was, rather than adding
// 'unsafe-inline' back).
function buildCsp(pathname: string): string {
  const supabaseOrigin = (() => {
    try {
      return process.env.NEXT_PUBLIC_SUPABASE_URL ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).origin : "";
    } catch {
      return "";
    }
  })();

  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "https://consent.cookiebot.com",
      "https://consentcdn.cookiebot.com",
      "https://www.googletagmanager.com",
      "https://challenges.cloudflare.com",
    ],
    "style-src": ["'self'", "'unsafe-inline'"],
    "img-src": ["'self'", "data:", ...(supabaseOrigin ? [supabaseOrigin] : [])],
    "font-src": ["'self'"],
    "connect-src": [
      "'self'",
      ...(supabaseOrigin ? [supabaseOrigin] : []),
      "https://challenges.cloudflare.com",
      "https://consent.cookiebot.com",
      "https://consentcdn.cookiebot.com",
      "https://www.google-analytics.com",
      "https://analytics.google.com",
    ],
    "frame-src": ["'self'", "https://consentcdn.cookiebot.com", "https://challenges.cloudflare.com"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
    "frame-ancestors": [isFrameablePath(pathname) ? "'self'" : "'none'"],
    "upgrade-insecure-requests": [],
  };

  return Object.entries(directives)
    .map(([key, values]) => (values.length > 0 ? `${key} ${values.join(" ")}` : key))
    .join("; ");
}

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });
  response.headers.set("Content-Security-Policy-Report-Only", buildCsp(request.nextUrl.pathname));

  if (isStaticPath(request.nextUrl.pathname)) {
    return response;
  }

  // This runs on every remaining request (see matcher below), including
  // pages that have nothing to do with accounts. Supabase isn't configured
  // yet in every environment (e.g. local dev before the project exists) —
  // fail open instead of taking the entire site down over a missing session
  // refresh. Auth-gated pages/routes still enforce their own getUser() check
  // and will correctly reject unauthenticated access on their own.
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          // Replaces, rather than extends, the `response` from above — the
          // CSP header has to be re-applied here too, or a request that
          // actually refreshes the Supabase cookie would lose it.
          response = NextResponse.next({ request });
          response.headers.set("Content-Security-Policy-Report-Only", buildCsp(request.nextUrl.pathname));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // getUser() (not getSession()) revalidates the token against Supabase
  // instead of trusting the local JWT — required for this check to be
  // meaningful rather than a no-op.
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
