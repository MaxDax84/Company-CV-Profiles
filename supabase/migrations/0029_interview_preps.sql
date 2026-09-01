-- "Prepara il colloquio": a standalone AI-researched report (company info,
-- market, culture, recent news, JD-focus points) generated from a job
-- posting via Claude + web search/fetch, rendered as a 1-2 page PDF.
-- Deliberately NOT tied to any row in `profiles` — unlike tailored/translated
-- CVs and cover letters, this feature never reads the user's own CV, only
-- the job posting they paste — so there is no source_profile_id here.
--
-- Content is cached (not just a payment record, same reasoning as
-- 0008_cover_letters.sql): the real cost is the Claude + web search call,
-- so a re-download must re-render the stored `content` for free rather than
-- researching the same company again.
create table if not exists public.interview_preps (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  slug        text not null,
  company_name text,
  job_hash    text not null,
  content     jsonb not null,
  language    text not null default 'it',
  created_at  timestamptz not null default now(),
  unique (user_id, slug)
);

create index if not exists interview_preps_user_id_idx on public.interview_preps (user_id);
create index if not exists interview_preps_job_hash_idx on public.interview_preps (user_id, job_hash);

alter table public.interview_preps enable row level security;

drop policy if exists interview_preps_select_own on public.interview_preps;
create policy interview_preps_select_own on public.interview_preps
  for select using (auth.uid() = user_id);
drop policy if exists interview_preps_insert_own on public.interview_preps;
create policy interview_preps_insert_own on public.interview_preps
  for insert with check (auth.uid() = user_id);
