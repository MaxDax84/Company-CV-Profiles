-- Post-action satisfaction feedback (star rating + optional free text),
-- shown once per user per action type (generate, tailor) right after the
-- user gets real value out of that action. One row per (user, action_type)
-- via the unique constraint below — the app checks for an existing row
-- before ever showing the popup, so this is a write-once table in practice,
-- not something the client updates repeatedly.
--
-- Written idempotently (safe to re-run in full), matching the pattern used
-- throughout this project's other migrations.
create table if not exists public.action_feedback (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  action_type text not null check (action_type in ('generate', 'tailor')),
  rating      smallint not null check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz not null default now(),
  unique (user_id, action_type)
);

alter table public.action_feedback enable row level security;

drop policy if exists action_feedback_select_own on public.action_feedback;
create policy action_feedback_select_own on public.action_feedback
  for select using (auth.uid() = user_id);
drop policy if exists action_feedback_insert_own on public.action_feedback;
create policy action_feedback_insert_own on public.action_feedback
  for insert with check (auth.uid() = user_id);
