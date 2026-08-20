-- Lets /api/relevance-check and /api/tailor-resume detect "you already
-- tailored this exact CV to this exact job posting" before spending a
-- credit again — same idea as pdf_hash (0014) for duplicate CV uploads,
-- but scoped to kind='tailored' rows via (source_profile_id, job_hash).
alter table public.profiles add column if not exists job_hash text;

create index if not exists profiles_source_job_hash_idx
  on public.profiles (user_id, source_profile_id, job_hash)
  where job_hash is not null;
