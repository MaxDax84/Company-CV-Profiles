-- Permanent record of every Claude API call this app makes, for real cost
-- tracking (console.log-only usage info disappears once Vercel's short log
-- retention window rolls over — useless for building actual statistics or
-- pricing/promo decisions on top of).
--
-- Pure internal ops data, never read by end users — RLS enabled with no
-- policies at all, so only the service-role client (which bypasses RLS)
-- can read or write it, same lockdown pattern as account_credits' own
-- "no client update policy at all" in 0001_init.sql.
--
-- user_id is nullable: some calls (parse-resume, on an anonymous /generate
-- upload before signup) happen before there's an account to attribute them
-- to.
--
-- Written idempotently (safe to re-run in full), matching the established
-- pattern in 0006/0007/0008/0011/0012 after those needed more than one
-- attempt on the live project.
create table if not exists public.claude_usage_log (
  id                     uuid primary key default gen_random_uuid(),
  operation              text not null,
  model                  text not null,
  input_tokens           int not null,
  output_tokens          int not null,
  cache_creation_tokens  int not null default 0,
  cache_read_tokens      int not null default 0,
  cost_usd               numeric(10, 6) not null,
  user_id                uuid references auth.users(id) on delete set null,
  created_at             timestamptz not null default now()
);

create index if not exists claude_usage_log_operation_idx on public.claude_usage_log (operation);
create index if not exists claude_usage_log_created_at_idx on public.claude_usage_log (created_at);
create index if not exists claude_usage_log_user_id_idx on public.claude_usage_log (user_id);

alter table public.claude_usage_log enable row level security;
-- No policies added on purpose: default-deny for the anon/authenticated
-- roles, only the service-role key (used exclusively server-side) can
-- read or write.
