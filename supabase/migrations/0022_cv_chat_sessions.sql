-- AI chat CV refinement feature: one row per primary CV, holding the
-- in-progress (or last-completed) gap-filling conversation. Not a session
-- history — completing a conversation doesn't create a new row, the next
-- run just resets this same one (see lib/cv-chat-store.ts).
--
-- Written idempotently (safe to re-run in full), same pattern as every
-- other migration in this project.
create table if not exists public.cv_chat_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  profile_id     uuid not null unique references public.profiles(id) on delete cascade,
  transcript     jsonb not null default '[]'::jsonb,
  status         text not null default 'active' check (status in ('active', 'completed')),
  question_count integer not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create index if not exists cv_chat_sessions_user_id_idx on public.cv_chat_sessions (user_id);

alter table public.cv_chat_sessions enable row level security;

drop policy if exists cv_chat_sessions_select_own on public.cv_chat_sessions;
create policy cv_chat_sessions_select_own on public.cv_chat_sessions
  for select using (auth.uid() = user_id);
drop policy if exists cv_chat_sessions_insert_own on public.cv_chat_sessions;
create policy cv_chat_sessions_insert_own on public.cv_chat_sessions
  for insert with check (auth.uid() = user_id);
drop policy if exists cv_chat_sessions_update_own on public.cv_chat_sessions;
create policy cv_chat_sessions_update_own on public.cv_chat_sessions
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reuses the same trigger function every other timestamped table in this
-- project uses (created in 0001_init.sql).
drop trigger if exists cv_chat_sessions_set_updated_at on public.cv_chat_sessions;
create trigger cv_chat_sessions_set_updated_at
  before update on public.cv_chat_sessions for each row execute function public.set_updated_at();
