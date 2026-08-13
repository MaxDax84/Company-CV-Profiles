-- credit_ledger.reason is a fixed category key used for the dashboard's
-- icon/label mapping ('pdf_download', 'tailor', ...) — it can't tell two
-- PDF downloads of different CVs apart. Add a free-text "detail" column
-- (e.g. "Mario Rossi · Classico") so the "Storico" history is legible on
-- its own, without the user having to reconstruct what happened from the
-- date alone.
alter table public.credit_ledger add column detail text;

-- Recreate spend_credits with an extra optional p_detail param, logged
-- alongside the existing reason. Dropped and recreated (not CREATE OR
-- REPLACE) for the same reason 0002 did it for p_reason: adding a
-- parameter changes the signature, and leaving the old one in place would
-- make PostgREST's RPC resolution ambiguous for callers that omit it.
drop function if exists public.spend_credits(integer, text);

create function public.spend_credits(p_amount integer, p_reason text default 'usage', p_detail text default null)
returns integer language plpgsql security definer set search_path = public as $$
declare v_new_balance integer;
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
grant execute on function public.spend_credits(integer, text, text) to authenticated;

-- Manual grants / welcome credits can carry a detail too, e.g.:
--   insert into credit_ledger (user_id, amount, reason, detail) values ('...', 5, 'manual_grant', 'Richiesta via email 13/08');
