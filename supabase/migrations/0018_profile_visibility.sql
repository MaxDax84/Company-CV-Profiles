-- Lets the owner of a primary (uploaded) CV take its public web page
-- offline entirely, keeping the CV itself saved in their account — until
-- now the only way to stop the page being reachable was deleting the CV
-- outright. Defaults to true so every existing profile keeps behaving
-- exactly as before this migration runs.
alter table public.profiles add column if not exists is_public boolean not null default true;
