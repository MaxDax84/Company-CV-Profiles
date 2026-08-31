-- UX audit: third and last lifecycle email — a nudge for accounts that
-- signed up, never downloaded anything, and went quiet. Driven by a daily
-- Vercel Cron hitting app/api/cron/inactivity-reminder/route.ts (see
-- vercel.json). This column is set for EVERY account once it's 7+ days
-- old and gets evaluated, whether or not the reminder was actually sent
-- (an account that already has downloads/letters by day 7 is "graduated",
-- not reminded) — so each account is only ever evaluated once, not
-- re-checked by the cron every day forever.
alter table public.account_credits
  add column if not exists inactivity_reminder_sent_at timestamptz;
