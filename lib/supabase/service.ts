import { createClient } from "@supabase/supabase-js";

// True once the three Supabase env vars exist — before the project is set
// up (e.g. a fresh local checkout with no .env.local entries yet), account
// features are expected to be unavailable, but that should degrade
// gracefully rather than crash every page that happens to import something
// Supabase-adjacent.
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Service-role client: bypasses RLS entirely. Import ONLY in the public
// profile-by-slug reader (lib/profile-store.ts) and the PDF route's credit
// spend — never in anything a Client Component could pull in, and never for
// a query whose result reaches the browser without first stripping
// personal_info.email/phone. Callers should check isSupabaseConfigured()
// first — this throws if the env vars are missing.
export function createServiceSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
