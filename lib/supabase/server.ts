import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

// For Server Components and Route Handlers. Reads/writes the session cookie
// via next/headers. Server Components can't set cookies (only Route
// Handlers and Server Actions can) — the setAll write is wrapped in a
// try/catch for that case; middleware.ts is what actually keeps the
// session refreshed on every request.
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — no-op, middleware handles refresh.
          }
        },
      },
    }
  );
}
