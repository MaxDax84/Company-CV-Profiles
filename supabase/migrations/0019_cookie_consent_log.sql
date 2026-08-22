-- Verifiable proof of consent for the in-house cookie CMP (see
-- lib/consent.ts, components/consent-provider.tsx). The cookie on the
-- visitor's browser only proves what THEY can see; this table is the
-- server-side record we could actually produce if a consent were ever
-- disputed or a regulator asked for it.
--
-- consent_id is an anonymous UUID generated client-side and stored inside
-- the same jobli_cookie_consent cookie as the choice itself — it does not
-- identify a person, only "this browser, this choice, this moment", same
-- legal category as the consent cookie it travels with. user_id is filled
-- in only when the visitor happens to be signed in at the moment of
-- consent; most rows will have it null, which is expected, not a bug.
--
-- Insert-only by design: RLS enabled with no policies at all, so only the
-- service-role client (used exclusively from app/api/consent-log/route.ts)
-- can write to it — nobody, including us, can quietly edit a row after the
-- fact. Same lockdown pattern as claude_usage_log in 0013.
--
-- Written idempotently, safe to re-run in full, matching the established
-- pattern in 0006/0007/0008/0011/0013.
create table if not exists public.cookie_consent_log (
  id              uuid primary key default gen_random_uuid(),
  consent_id      text not null,
  user_id         uuid references auth.users(id) on delete set null,
  analytics       boolean not null,
  marketing       boolean not null,
  method          text not null, -- 'accept_all' | 'reject_all' | 'custom'
  policy_version  text not null,
  ip_address      text,
  user_agent      text,
  created_at      timestamptz not null default now()
);

create index if not exists cookie_consent_log_consent_id_idx on public.cookie_consent_log (consent_id);
create index if not exists cookie_consent_log_user_id_idx on public.cookie_consent_log (user_id);
create index if not exists cookie_consent_log_created_at_idx on public.cookie_consent_log (created_at);

alter table public.cookie_consent_log enable row level security;
-- No policies added on purpose: default-deny for the anon/authenticated
-- roles, only the service-role key (used exclusively server-side) can
-- read or write.
