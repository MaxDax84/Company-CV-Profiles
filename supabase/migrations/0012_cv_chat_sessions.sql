-- CV refinement chat: a short guided Q&A (Haiku) that surfaces concrete gaps
-- in the user's primary CV (missing metrics, vague bullets), then rewrites
-- the relevant profile fields (Sonnet) from what the user actually said.
--
-- One row per primary profile, not a session-history table — every chat
-- session's whole point is to update the SAME primary profile in place, and
-- nothing in this feature browses past transcripts. Completing a session
-- does NOT block starting a new one: profile_id is unique, and a fresh
-- "Inizia" click resets transcript/status/question_count on the existing
-- row instead of inserting a second one.
--
-- Written idempotently (safe to re-run in full), matching the established
-- pattern in 0006/0007/0008/0011 after those needed more than one attempt on
-- the live project.
create table if not exists public.cv_chat_sessions (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references auth.users(id) on delete cascade,
  profile_id     uuid not null unique references public.profiles(id) on delete cascade,
  status         text not null default 'active' check (status in ('active', 'completed')),
  transcript     jsonb not null default '[]'::jsonb,
  question_count int not null default 0,
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
