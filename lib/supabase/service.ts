import { createClient } from "@supabase/supabase-js";

// Service-role client: bypasses RLS entirely. Import ONLY in the public
// profile-by-slug reader (lib/profile-store.ts) and the PDF route's credit
// spend — never in anything a Client Component could pull in, and never for
// a query whose result reaches the browser without first stripping
// personal_info.email/phone.
export function createServiceSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
