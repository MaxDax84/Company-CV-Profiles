-- Launch promo: the first 10 accounts ever created get 20 welcome credits
-- instead of the usual 1. Self-limiting by design — it counts existing
-- rows in account_credits at signup time, so once the 10th account has
-- been created, every signup after that automatically falls back to the
-- normal 1 credit with no manual revert needed. Safe to re-run.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  v_existing_count integer;
  v_credits integer;
  v_reason text;
begin
  select count(*) into v_existing_count from public.account_credits;
  if v_existing_count < 10 then
    v_credits := 20;
    v_reason := 'welcome_promo_first10';
  else
    v_credits := 1;
    v_reason := 'welcome';
  end if;
  insert into public.account_credits (user_id, credits, code) values (new.id, v_credits, public.generate_account_code());
  insert into public.credit_ledger (user_id, amount, reason) values (new.id, v_credits, v_reason);
  return new;
end;
$$;
