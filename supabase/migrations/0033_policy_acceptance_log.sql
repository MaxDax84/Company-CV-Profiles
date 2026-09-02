-- Server-side proof that a user ticked a "ho letto e accetto" checkbox
-- before an action that shares their personal data with us (CV upload,
-- job-posting tailoring, contact/support forms, account signup). Until now
-- every one of these checkboxes was a client-side-only UI gate (disables
-- the submit button) with zero durable record of who accepted what and
-- when — no different, evidentially, than not having a checkbox at all.
-- Mirrors cookie_consent_log's shape and lockdown exactly
-- (0019_cookie_consent_log.sql).
create table public.policy_acceptance_log (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users(id) on delete set null,
  context        text not null,   -- 'signup' | 'cv_upload' | 'tailor_resume' | 'contact_form' | 'support_form'
  policies       text[] not null, -- e.g. {'privacy'} or {'privacy','terms'}
  policy_version text not null,
  ip_address     text,
  user_agent     text,
  created_at     timestamptz not null default now()
);
create index policy_acceptance_log_user_id_idx on public.policy_acceptance_log (user_id, created_at desc);

alter table public.policy_acceptance_log enable row level security;
-- No policies at all: written only by the service-role client from
-- app/api/policy-acceptance-log/route.ts, never directly by a browser —
-- same "no client access, RLS just makes that explicit" reasoning as
-- claude_usage_log and cookie_consent_log.
