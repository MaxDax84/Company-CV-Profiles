-- New round of the same first-10-accounts style promo (see 0009), requested
-- 2026-09-03: the next 10 real signups get 20 welcome credits instead of the
-- normal 3. Threshold is (current account count + 10) rather than a fresh
-- "< 10" — the original promo already used up its own window long ago, so
-- reusing that exact condition would do nothing today.
--
-- 11 accounts existed at the time this was written, so the window is
-- accounts #12 through #21 inclusive (v_existing_count 11..20, checked
-- before the new row is inserted) — exactly 10 signups, self-limiting the
-- same way 0009 was: once account_credits reaches 21 rows, every signup
-- after that automatically falls back to the normal 3 credits, no manual
-- revert needed.
--
-- Still gated behind the welcome_credit_grants email-hash check from 0032
-- first, same as always — this promo cannot be farmed by deleting and
-- re-registering the same email.
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
    v_credits := 0;
    v_reason := 'welcome_already_granted';
  else
    select count(*) into v_existing_count from public.account_credits;
    if v_existing_count < 21 then
      v_credits := 20;
      v_reason := 'welcome_promo_next10';
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
