-- Tracks which (profile, PDF template) combinations a user has already paid
-- a credit for, so re-downloading the exact same PDF is free — rendering it
-- again costs us nothing (react-pdf, no Claude call), only the first
-- generation should ever be billed. Also powers the account's "Download"
-- list (what you've generated, and when).
create table public.paid_downloads (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  template   text not null,
  created_at timestamptz not null default now()
);

-- One paid record per (profile, template) — the route checks this before
-- charging, and re-download requests simply find an existing row.
create unique index paid_downloads_profile_template_idx
  on public.paid_downloads (profile_id, template);
create index paid_downloads_user_id_idx on public.paid_downloads (user_id);

alter table public.paid_downloads enable row level security;

create policy paid_downloads_select_own on public.paid_downloads
  for select using (auth.uid() = user_id);
create policy paid_downloads_insert_own on public.paid_downloads
  for insert with check (auth.uid() = user_id);
