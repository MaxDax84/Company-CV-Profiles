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
