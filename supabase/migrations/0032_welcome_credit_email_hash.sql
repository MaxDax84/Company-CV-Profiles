-- Security audit finding: deleting an account (app/api/account/delete)
-- cascades away auth.users, profiles, AND account_credits entirely (see the
-- `on delete cascade` FKs in 0001_init.sql) — nothing survives to stop
-- handle_new_user() from treating the same person as a brand-new signup on
-- re-registration, so the welcome credit bonus could be farmed indefinitely
-- by delete-and-resignup with the same email.
--
-- This table is the one thing that must NOT disappear with the account. It
-- stores only a SHA-256 hash of the normalized (lowercased, trimmed) email —
-- never the plaintext — so it can outlive account deletion as a pure
-- dedup key without retaining anything personally identifiable, consistent
-- with the right-to-erasure work already done on the lifecycle emails.
create table public.welcome_credit_grants (
  email_hash text primary key,
  granted_at timestamptz not null default now()
);

-- Never read or written by client code, only by the trigger below (which
-- runs SECURITY DEFINER as the table owner, so RLS wouldn't gate it
-- anyway) — enabling RLS with zero policies makes that "no client access"
-- intent explicit rather than incidental.
alter table public.welcome_credit_grants enable row level security;

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_existing_count integer;
  v_credits integer;
  v_reason text;
  v_email_hash text;
  v_already_granted boolean;
begin
  v_email_hash := encode(sha256(convert_to(lower(trim(new.email)), 'UTF8')), 'hex');
  select exists(select 1 from public.welcome_credit_grants where email_hash = v_email_hash) into v_already_granted;

  if v_already_granted then
    -- Same email seen before (almost always: account deleted, then
    -- re-created) — new account still works, just starts at 0 credits
    -- instead of getting a second free bonus.
    v_credits := 0;
    v_reason := 'welcome_already_granted';
  else
    select count(*) into v_existing_count from public.account_credits;
    if v_existing_count < 10 then
      v_credits := 20;
      v_reason := 'welcome_promo_first10';
    else
      v_credits := 3;
      v_reason := 'welcome';
    end if;
    insert into public.welcome_credit_grants (email_hash) values (v_email_hash)
      on conflict (email_hash) do nothing;
  end if;

  insert into public.account_credits (user_id, credits, code) values (new.id, v_credits, public.generate_account_code());
  if v_credits > 0 then
    insert into public.credit_ledger (user_id, amount, reason) values (new.id, v_credits, v_reason);
  end if;
  return new;
end;
$$;
