-- UX audit: replace the plain "email us to top up" ask in the account's
-- Crediti tab with a real one-click request flow (app/api/account/request-credits).
-- No payment involved — the owner still grants credits by hand exactly as
-- today, this just removes the friction of composing an email and gives the
-- UI something to show ("request sent, pending review") and something to
-- rate-limit against, without adding a second table for one timestamp.
--
-- Deliberately NOT covered by account_credits' existing "no update policy"
-- lockdown (see 0001_init.sql's protect_credits_column comment) — the
-- request route only ever writes this column via a service-role client
-- server-side, after its own auth + rate-limit checks, same pattern as
-- lib/paid-downloads.ts. The column itself carries no monetary value, so it
-- doesn't need the credits column's own trigger-enforced protection.
alter table public.account_credits
  add column if not exists credits_last_requested_at timestamptz;
