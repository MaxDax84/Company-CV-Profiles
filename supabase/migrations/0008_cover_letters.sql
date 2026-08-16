-- "Pay once, re-download free" for cover letters, mirroring paid_downloads
-- for PDFs (0006) — but a PDF re-render is genuinely free (react-pdf, no
-- Claude call), while a cover letter's actual TEXT comes from Claude. A
-- "free re-download" that silently called Claude again on every repeat
-- would mean absorbing that cost ourselves without charging for it — so
-- this table caches the generated letter text itself, not just a payment
-- record: a repeat request re-renders the cached text into a PDF (free)
-- instead of generating a new letter (not free).
--
-- Written idempotently (safe to re-run in full), matching the established
-- pattern in 0006/0007 after those needed more than one attempt on the
-- live project.
create table if not exists public.cover_letters (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  profile_id  uuid not null unique references public.profiles(id) on delete cascade,
  letter_text text not null,
  created_at  timestamptz not null default now()
);

create index if not exists cover_letters_user_id_idx on public.cover_letters (user_id);

alter table public.cover_letters enable row level security;

drop policy if exists cover_letters_select_own on public.cover_letters;
create policy cover_letters_select_own on public.cover_letters
  for select using (auth.uid() = user_id);
drop policy if exists cover_letters_insert_own on public.cover_letters;
create policy cover_letters_insert_own on public.cover_letters
  for insert with check (auth.uid() = user_id);
