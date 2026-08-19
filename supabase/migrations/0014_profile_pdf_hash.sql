-- Lets /generate detect and warn when the PDF a user just uploaded is
-- byte-identical to a CV they already have saved (kind='primary'), instead
-- of silently creating a second, indistinguishable digital profile. Only
-- populated going forward (see lib/profile-store.ts's claimPendingProfile)
-- — existing rows stay null and simply never match, which is an accepted
-- gap rather than a backfill.
--
-- Written idempotently, matching the established pattern in this project's
-- other migrations.
alter table public.profiles add column if not exists pdf_hash text;

create index if not exists profiles_user_pdf_hash_idx
  on public.profiles (user_id, pdf_hash)
  where pdf_hash is not null;
