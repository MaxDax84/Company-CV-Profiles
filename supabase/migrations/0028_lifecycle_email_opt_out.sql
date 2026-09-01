-- Legal audit finding: the 3 lifecycle emails added this session (welcome,
-- zero-balance, inactivity reminder — see lib/email.ts) had no opt-out
-- mechanism. Art. 130 Codice Privacy requires that a recipient be able to
-- object to each such communication, easily and free of charge — the
-- inactivity reminder in particular reads more like a re-engagement nudge
-- than a strict transactional receipt. One flag covers all three rather
-- than three separate toggles, since conceptually they're all "emails
-- about your account", not independent categories a user would want to
-- pick apart.
--
-- Lives on account_settings (not account_credits) because it's a user
-- preference, not part of the credits ledger — and account_settings
-- already has an owner-writable RLS policy (see 0007_account_avatar.sql),
-- so the in-app toggle can write it directly, same pattern as avatar_url.
alter table public.account_settings
  add column if not exists lifecycle_emails_opt_out boolean not null default false;
