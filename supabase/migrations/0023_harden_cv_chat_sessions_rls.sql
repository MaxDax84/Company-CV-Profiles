-- Security hardening: cv_chat_sessions' insert/update policies only checked
-- auth.uid() = user_id, never that profile_id actually belongs to that same
-- user. Since profile_id is UNIQUE, an authenticated attacker who somehow
-- learned another user's internal profile UUID (profiles are only ever
-- addressed by human-readable slug in the app itself, but the UUID isn't a
-- secret keyed on anything) could insert a forged row — { user_id: attacker,
-- profile_id: victim's } — permanently claiming that profile_id. The
-- victim's own chat feature on that CV would then fail every write (RLS
-- update policy blocks it, since the row's user_id is the attacker's), a
-- denial of service against a single feature on a single CV. Not currently
-- known to be exploited (profile UUIDs aren't exposed anywhere in the app),
-- but the same defense-in-depth standard as the rest of this project's RLS
-- policies (see 0021's paid_downloads/cover_letters fix) applies here too.
--
-- Fix: require profile_id to resolve to a profiles row owned by the same
-- auth.uid() making the write. Written idempotently, safe to re-run in full.

drop policy if exists cv_chat_sessions_insert_own on public.cv_chat_sessions;
create policy cv_chat_sessions_insert_own on public.cv_chat_sessions
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );

drop policy if exists cv_chat_sessions_update_own on public.cv_chat_sessions;
create policy cv_chat_sessions_update_own on public.cv_chat_sessions
  for update using (auth.uid() = user_id) with check (
    auth.uid() = user_id
    and exists (
      select 1 from public.profiles p
      where p.id = profile_id and p.user_id = auth.uid()
    )
  );
