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

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

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
          response = NextResponse.next({ request });
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
