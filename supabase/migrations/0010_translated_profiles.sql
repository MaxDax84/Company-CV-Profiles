-- Adds 'translated' as a third profile kind, alongside 'primary' and
-- 'tailored' — a translated CV is a full independent profile (gets its own
-- public page, like primary, since it's meant to be shared) but linked back
-- to its source via source_profile_id, the same column tailored profiles
-- already use.
--
-- Written idempotently (safe to re-run) — the original check constraint was
-- an unnamed inline column check, which Postgres auto-names
-- "profiles_kind_check" for a table/column named this way.
alter table public.profiles drop constraint if exists profiles_kind_check;
alter table public.profiles add constraint profiles_kind_check
  check (kind in ('primary', 'tailored', 'translated'));
