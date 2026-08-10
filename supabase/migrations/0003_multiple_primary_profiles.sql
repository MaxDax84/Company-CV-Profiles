-- Allow multiple self-uploaded ("primary") CVs per account, not just one.
--
-- Previously a user could claim only a single kind='primary' profile ever —
-- uploading a second CV and logging into an existing account instead of
-- signing up would silently fail to claim it (the insert was rejected
-- before it even reached this constraint). Dropping the partial unique
-- index lets every uploaded CV become its own row, listed together on the
-- account dashboard, the same way kind='tailored' rows already work.
drop index if exists public.profiles_one_primary_per_user;

-- profiles_user_id_idx (from 0001_init.sql) already covers lookups by
-- user_id efficiently — no new index needed for listing a user's CVs.
