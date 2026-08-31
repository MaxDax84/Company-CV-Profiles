-- UX audit finding: the single welcome credit gets consumed by the very
-- first PDF download (the product's actual "aha" moment), so a new user
-- never gets to try tailoring-to-a-job-posting's download, a cover letter,
-- or a translation before hitting "insufficient credits". Raising the
-- welcome grant to 3 lets a new account try more than one feature before
-- that first wall. The already-expired first-10-accounts promo (20 credits,
-- see 0009) is untouched — it's self-limiting and long since fell back to
-- the normal path for any real account today.
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
    v_credits := 3;
    v_reason := 'welcome';
  end if;
  insert into public.account_credits (user_id, credits, code) values (new.id, v_credits, public.generate_account_code());
  insert into public.credit_ledger (user_id, amount, reason) values (new.id, v_credits, v_reason);
  return new;
end;
$$;
