-- UX audit: the only emails this project ever sent went TO the site owner
-- (contact form, domain requests) — nothing goes to users beyond Supabase's
-- own signup confirmation. This adds the one tracking column needed for a
-- new welcome email (see app/auth/callback/route.ts): set the first time a
-- user lands back after confirming signup (or their first Google login),
-- and checked before sending so the email fires exactly once per account —
-- required because /auth/callback is hit on every Google login, not just
-- the first one.
--
-- A "balance just hit zero" notification (lib/credits.ts) needs no such
-- column: spend_credits already throws once the balance is 0, so the
-- 0-crediti transition can only ever happen once per grant cycle on its
-- own — nothing to deduplicate.
alter table public.account_credits
  add column if not exists welcome_email_sent_at timestamptz;
