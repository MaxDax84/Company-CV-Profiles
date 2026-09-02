-- Symmetric counterpart to spend_credits (0001_init.sql / 0002_credit_ledger.sql):
-- used when a credit was already spent for an action that then failed to
-- deliver (e.g. interview-prep's Claude call throwing after the 2-credit
-- charge went through) — without this, a failed generation silently costs
-- the user real credits for nothing.
--
-- Deliberately NOT granted to `authenticated` — only service_role may call
-- it, so a client can never invoke this RPC directly to self-grant credits.
-- Server code must go through the service-role client (see
-- lib/supabase/service.ts), never the request-scoped one used for spending.
create function public.refund_credits(p_user_id uuid, p_amount integer, p_reason text, p_detail text default null)
returns integer language plpgsql security definer set search_path = public as $$
declare v_new_balance integer;
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

revoke all on function public.refund_credits(uuid, integer, text, text) from public;
grant execute on function public.refund_credits(uuid, integer, text, text) to service_role;
