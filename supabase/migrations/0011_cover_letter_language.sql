-- Cover letters can now exist in more than one language per profile: the
-- original (in the CV's own language) plus any number of translations,
-- mirroring the CV translation feature but without needing a whole separate
-- profile row — only the letter TEXT differs per language; name, contact,
-- and template accent still always come from the source profile.
--
-- Written idempotently (safe to re-run in full), matching the established
-- pattern in 0006/0007/0008 after those needed more than one attempt on the
-- live project.
alter table public.cover_letters add column if not exists language text;

update public.cover_letters cl
set language = coalesce(p.data->'metadata'->>'language', 'it')
from public.profiles p
where cl.profile_id = p.id and cl.language is null;

-- Any row that still has no language (source profile row itself missing,
-- e.g. hard-deleted) falls back to 'it' rather than blocking the migration.
update public.cover_letters set language = 'it' where language is null;

alter table public.cover_letters alter column language set default 'it';
alter table public.cover_letters alter column language set not null;

alter table public.cover_letters drop constraint if exists cover_letters_profile_id_key;
alter table public.cover_letters drop constraint if exists cover_letters_profile_id_language_key;
alter table public.cover_letters add constraint cover_letters_profile_id_language_key unique (profile_id, language);
