-- Supports a 0.5-credit "compact to one page" PDF add-on — the balance and
-- ledger columns need to hold a fraction, not just whole credits. Every
-- existing spend/grant is a whole number already, so this is purely
-- widening the type, not changing any stored value.
alter table public.account_credits alter column credits type numeric(10,1) using credits::numeric(10,1);
alter table public.credit_ledger alter column amount type numeric(10,1) using amount::numeric(10,1);

-- Recreated with numeric(10,1) parameters instead of integer — same shape
-- otherwise (see 0005_credit_ledger_detail.sql). Dropped first since
-- changing a parameter's type changes the function's signature.
drop function if exists public.spend_credits(integer, text, text);

create function public.spend_credits(p_amount numeric(10,1), p_reason text default 'usage', p_detail text default null)
returns numeric(10,1) language plpgsql security definer set search_path = public as $$
declare v_new_balance numeric(10,1);
begin
  if p_amount is null or p_amount <= 0 then raise exception 'invalid_amount'; end if;
  update public.account_credits
    set credits = credits - p_amount, updated_at = now()
    where user_id = auth.uid() and credits >= p_amount
    returning credits into v_new_balance;
  if v_new_balance is null then raise exception 'insufficient_credits'; end if;
  insert into public.credit_ledger (user_id, amount, reason, detail) values (auth.uid(), -p_amount, p_reason, p_detail);
  return v_new_balance;
end;
$$;
grant execute on function public.spend_credits(numeric(10,1), text, text) to authenticated;

-- Same treatment for refund_credits (0031) — still service-role only.
drop function if exists public.refund_credits(uuid, integer, text, text);

create function public.refund_credits(p_user_id uuid, p_amount numeric(10,1), p_reason text, p_detail text default null)
returns numeric(10,1) language plpgsql security definer set search_path = public as $$
declare v_new_balance numeric(10,1);
begin
  if p_amount is null or p_amount <= 0 then raise exception 'invalid_amount'; end if;
  update public.account_credits
    set credits = credits + p_amount, updated_at = now()
    where user_id = p_user_id
    returning credits into v_new_balance;
  if v_new_balance is null then raise exception 'user_not_found'; end if;
  insert into public.credit_ledger (user_id, amount, reason, detail) values (p_user_id, p_amount, p_reason, p_detail);
  return v_new_balance;
end;
$$;
revoke all on function public.refund_credits(uuid, numeric(10,1), text, text) from public;
grant execute on function public.refund_credits(uuid, numeric(10,1), text, text) to service_role;
