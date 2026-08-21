alter table public.profiles add column if not exists is_public boolean not null default true;
