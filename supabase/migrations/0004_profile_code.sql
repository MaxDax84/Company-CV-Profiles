-- Every claimed profile's public address moves from /profile/<slug> to
-- /<account-code>/<slug>, where <account-code> is a single permanent
-- 7-digit number generated once per ACCOUNT at signup (not per CV) and
-- shared by every CV under that account. <slug> only needs to be unique
-- within one account's own profiles now, not globally, since the account
-- code already disambiguates across different users.

delete from public.profiles;

-- Slug's old *global* uniqueness constraint is replaced by a per-account
-- one below — drop it first (name found dynamically, since it may differ
-- from the literal "profiles_slug_key" depending on how it was created).
do $$
declare
  con_name text;
begin
  select con.conname into con_name
  from pg_constraint con
  join pg_class rel on rel.oid = con.conrelid
  where rel.relname = 'profiles'
    and con.contype = 'u'
    and con.conkey = (
      select array_agg(attnum)
      from pg_attribute
      where attrelid = 'public.profiles'::regclass and attname = 'slug'
    );
  if con_name is not null then
    execute format('alter table public.profiles drop constraint %I', con_name);
  end if;
end $$;

alter table public.profiles add constraint profiles_user_slug_unique unique (user_id, slug);

-- One permanent code per account, stored alongside the credit balance
-- (account_credits already has exactly one row per user).
alter table public.account_credits add column code text;

create or replace function public.generate_account_code()
returns text language plpgsql as $$
declare
  new_code text;
  tries int := 0;
begin
  loop
    new_code := lpad((floor(random() * 10000000))::text, 7, '0');
    exit when not exists (select 1 from public.account_credits where code = new_code);
    tries := tries + 1;
    if tries > 20 then
      raise exception 'Could not generate a unique account code';
    end if;
  end loop;
  return new_code;
end;
$$;

-- Extend the signup trigger to also assign an account code.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.account_credits (user_id, credits, code) values (new.id, 1, public.generate_account_code());
  insert into public.credit_ledger (user_id, amount, reason) values (new.id, 1, 'welcome');
  return new;
end;
$$;

-- Backfill codes for any account created before this migration.
do $$
declare
  r record;
begin
  for r in select user_id from public.account_credits where code is null loop
    update public.account_credits set code = public.generate_account_code() where user_id = r.user_id;
  end loop;
end $$;

alter table public.account_credits alter column code set not null;
alter table public.account_credits add constraint account_credits_code_unique unique (code);
create index account_credits_code_idx on public.account_credits (code);
