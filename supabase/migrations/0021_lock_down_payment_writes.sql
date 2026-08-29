-- Security fix: paid_downloads and cover_letters had an "insert own" RLS
-- policy that only checked auth.uid() = user_id — nothing verified a credit
-- was ever actually spent. Any authenticated user could call the Supabase
-- REST API directly (their own session + the public anon key, no special
-- access needed) and insert a fake "already paid" / "already generated" row
-- for one of their own profiles, then hit /api/pdf/[slug], /api/cv-word/[slug]
-- or /api/cover-letter/[slug] — those routes check exactly this table
-- *before* charging a credit, so the fake row made every download/letter free.
--
-- Fix: remove the client-writable insert policy entirely. Only a service-role
-- client (lib/paid-downloads.ts's recordPaidDownload, lib/cover-letters.ts's
-- rememberCoverLetter — both updated alongside this migration to use
-- createServiceSupabaseClient for the write) can insert these rows now. The
-- select-own policies are untouched: the account dashboard still needs to
-- read a user's own download/letter history.

drop policy if exists paid_downloads_insert_own on public.paid_downloads;
drop policy if exists cover_letters_insert_own on public.cover_letters;

-- Belt-and-suspenders bucket-level validation for avatar uploads (see
-- components/avatar-upload-form.tsx) — that upload goes straight from the
-- browser to Supabase Storage with only client-side JS checks (file type,
-- 3MB size), which are trivially bypassed by calling the Storage API
-- directly. Supabase Storage enforces these two constraints itself,
-- independent of any RLS policy, so this closes the gap without needing to
-- route the upload through a Next.js API route.
update storage.buckets
  set file_size_limit = 3 * 1024 * 1024,
      allowed_mime_types = array['image/png', 'image/jpeg', 'image/webp', 'image/gif']
  where id = 'avatars';
