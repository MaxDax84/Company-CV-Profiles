-- Credit transaction ledger: append-only history of every credit change,
-- purely for the account dashboard's "Storico crediti". account_credits.credits
-- remains the sole source of truth for the actual balance and spend checks —
-- this table is read-only from the app's perspective.
create table public.credit_ledger (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references auth.users(id) on delete cascade,
  amount     integer not null,        -- positive = credited, negative = spent
  reason     text not null,           -- 'welcome', 'pdf_download', 'tailor', 'manual_grant'
  created_at timestamptz not null default now()
);
create index credit_ledger_user_id_idx on public.credit_ledger (user_id, created_at desc);

alter table public.credit_ledger enable row level security;
create policy credit_ledger_select_own on public.credit_ledger for select using (auth.uid() = user_id);
-- No insert/update/delete policy for `authenticated` — every row is written
-- by a SECURITY DEFINER function below (or a manual service-role grant),
-- never directly from the client.

-- Extend the welcome-credit trigger to also log it.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.account_credits (user_id, credits) values (new.id, 1);
  insert into public.credit_ledger (user_id, amount, reason) values (new.id, 1, 'welcome');
  return new;
end;
$$;

-- Replace spend_credits with a version that also logs to the ledger and
-- accepts a reason. Dropped and recreated (not just CREATE OR REPLACE)
-- because adding a parameter changes the signature — leaving the old
-- single-argument version in place too would make PostgREST's RPC
-- resolution ambiguous when a caller omits p_reason.
drop function if exists public.spend_credits(integer);

create function public.spend_credits(p_amount integer, p_reason text default 'usage')
returns integer language plpgsql security definer set search_path = public as $$
declare v_new_balance integer;
begin
  if p_amount is null or p_amount <= 0 then raise exception 'invalid_amount'; end if;
  update public.account_credits
    set credits = credits - p_amount, updated_at = now()
    where user_id = auth.uid() and credits >= p_amount
    returning credits into v_new_balance;
  if v_new_balance is null then raise exception 'insufficient_credits'; end if;
  insert into public.credit_ledger (user_id, amount, reason) values (auth.uid(), -p_amount, p_reason);
  return v_new_balance;
end;
$$;
grant execute on function public.spend_credits(integer, text) to authenticated;

-- Manual credit grants (still hand-run in the SQL editor until Stripe
-- exists) should also log to the ledger for consistency, e.g.:
--   update account_credits set credits = credits + 5 where user_id = '...';
--   insert into credit_ledger (user_id, amount, reason) values ('...', 5, 'manual_grant');
