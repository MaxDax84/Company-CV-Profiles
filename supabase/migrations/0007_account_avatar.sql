-- Profile photo storage: a small owner-writable settings row plus a public
-- storage bucket. Kept separate from account_credits on purpose — that
-- table intentionally has no client update policy at all (see 0001_init.sql,
-- protect_credits_column) to keep the credits balance impossible to write
-- from the browser; bolting avatar_url onto it would mean either punching a
-- hole in that protection or a much fussier column-scoped policy. A
-- dedicated table stays simple and fully owner-writable with zero risk to
-- the credits guarantee.
--
-- Written idempotently (safe to re-run in full) because the first attempt
-- at running this stopped partway on a real Supabase project (table got
-- created, but a stale PostgREST schema cache made it look missing, and a
-- second attempt then failed with "relation already exists" before ever
-- reaching the policies/bucket below it).
create table if not exists public.account_settings (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.account_settings enable row level security;

drop policy if exists account_settings_select_own on public.account_settings;
create policy account_settings_select_own on public.account_settings
  for select using (auth.uid() = user_id);
drop policy if exists account_settings_insert_own on public.account_settings;
create policy account_settings_insert_own on public.account_settings
  for insert with check (auth.uid() = user_id);
drop policy if exists account_settings_update_own on public.account_settings;
create policy account_settings_update_own on public.account_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public bucket (avatars aren't sensitive) — writes scoped to a folder
-- named after the uploader's own user id, so nobody can overwrite or
-- delete another account's photo even though reads are public.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

drop policy if exists avatars_public_read on storage.objects;
create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');
drop policy if exists avatars_owner_insert on storage.objects;
create policy avatars_owner_insert on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists avatars_owner_update on storage.objects;
create policy avatars_owner_update on storage.objects
  for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
drop policy if exists avatars_owner_delete on storage.objects;
create policy avatars_owner_delete on storage.objects
  for delete using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
