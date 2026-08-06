-- BeOnWeb account system: profiles + credits
-- Run once against a fresh Supabase project (SQL editor or `supabase db push`).

-- ── profiles ────────────────────────────────────────────────────────────
create table public.profiles (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references auth.users(id) on delete cascade,
  kind              text not null default 'primary' check (kind in ('primary', 'tailored')),
  slug              text not null unique,
  data              jsonb not null,              -- full ProfileSchema, unchanged shape
  source_profile_id uuid references public.profiles(id) on delete set null, -- kind='tailored' only
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Free tier = one profile page per account. Tailoring (paid) is uncapped —
-- enforced via a partial unique index, not a table-wide UNIQUE(user_id).
create unique index profiles_one_primary_per_user
  on public.profiles (user_id) where kind = 'primary';
create index profiles_user_id_idx on public.profiles (user_id);

-- ── account_credits ─────────────────────────────────────────────────────
-- Separate table, not columns on `profiles`: credits are a property of the
-- ACCOUNT, not of any one CV — a new kind='tailored' row must never reset a
-- balance. One row per user, auto-created on signup.
create table public.account_credits (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  credits    integer not null default 0,
  updated_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.account_credits (user_id, credits) values (new.id, 1); -- 1 free welcome credit
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users for each row execute function public.handle_new_user();

create function public.set_updated_at()
returns trigger language plpgsql as $$ begin new.updated_at = now(); return new; end; $$;
create trigger profiles_set_updated_at
  before update on public.profiles for each row execute function public.set_updated_at();

-- ── spend_credits RPC — the only way credits ever decrease ─────────────
create function public.spend_credits(p_amount integer)
returns integer language plpgsql security definer set search_path = public as $$
declare v_new_balance integer;
begin
  if p_amount is null or p_amount <= 0 then raise exception 'invalid_amount'; end if;
  update public.account_credits
    set credits = credits - p_amount, updated_at = now()
    where user_id = auth.uid() and credits >= p_amount
    returning credits into v_new_balance;
  if v_new_balance is null then raise exception 'insufficient_credits'; end if;
  return v_new_balance;
end;
$$;
grant execute on function public.spend_credits(integer) to authenticated;

-- Block direct client writes to the balance (mirrors a documented past
-- exploit-and-fix in a sibling project: never trust client-side arithmetic
-- for a value that represents money).
create function public.protect_credits_column()
returns trigger language plpgsql as $$
begin
  if new.credits is distinct from old.credits and current_user = 'authenticated' then
    raise exception 'direct_credits_write_forbidden';
  end if;
  return new;
end;
$$;
create trigger trg_protect_credits before update on public.account_credits
  for each row execute function public.protect_credits_column();
alter table public.account_credits enable always trigger trg_protect_credits;

-- No grant_credits RPC on purpose. Until real checkout exists, credits
-- beyond the free welcome one are granted by hand:
--   update account_credits set credits = credits + N where user_id = '...';
-- run in the Supabase SQL editor (service-role context, bypasses the
-- trigger above). When Stripe is added later, its webhook handler becomes
-- the only caller of a new grant function — never the browser.

-- ── RLS ─────────────────────────────────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.account_credits enable row level security;

create policy profiles_select_own on public.profiles for select using (auth.uid() = user_id);
create policy profiles_insert_own on public.profiles for insert with check (auth.uid() = user_id);
create policy profiles_update_own on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy profiles_delete_own on public.profiles for delete using (auth.uid() = user_id);

-- Read-only for the owner; no insert/update/delete policy at all — the
-- only writes are the trigger (signup) and spend_credits (both run as the
-- function owner, not `authenticated`, so RLS doesn't gate them).
create policy credits_select_own on public.account_credits for select using (auth.uid() = user_id);

-- No public SELECT policy on `profiles` — the public /profile/[slug] page
-- reads via a service-role client (lib/supabase/service.ts) in exactly one
-- server-only function, which also strips personal_info.email/phone before
-- the row is ever handed to a template component. Never add a public
-- policy here — it would let anyone query the raw `data` jsonb (including
-- the real, non-obfuscated email/phone) with just the anon key.
