alter table public.profiles add column if not exists job_hash text;

create index if not exists profiles_source_job_hash_idx
  on public.profiles (user_id, source_profile_id, job_hash)
  where job_hash is not null;
