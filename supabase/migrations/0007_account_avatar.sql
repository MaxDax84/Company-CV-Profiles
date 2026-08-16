-- Profile photo storage: a small owner-writable settings row plus a public
-- storage bucket. Kept separate from account_credits on purpose — that
-- table intentionally has no client update policy at all (see 0001_init.sql,
-- protect_credits_column) to keep the credits balance impossible to write
-- from the browser; bolting avatar_url onto it would mean either punching a
-- hole in that protection or a much fussier column-scoped policy. A
-- dedicated table stays simple and fully owner-writable with zero risk to
-- the credits guarantee.
create table public.account_settings (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  avatar_url text,
  updated_at timestamptz not null default now()
);

alter table public.account_settings enable row level security;

create policy account_settings_select_own on public.account_settings
  for select using (auth.uid() = user_id);
create policy account_settings_insert_own on public.account_settings
  for insert with check (auth.uid() = user_id);
create policy account_settings_update_own on public.account_settings
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Public bucket (avatars aren't sensitive) — writes scoped to a folder
-- named after the uploader's own user id, so nobody can overwrite or
-- delete another account's photo even though reads are public.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy avatars_public_read on storage.objects
  for select using (bucket_id = 'avatars');
create policy avatars_owner_insert on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_owner_update on storage.objects
  for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy avatars_owner_delete on storage.objects
  for delete using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
