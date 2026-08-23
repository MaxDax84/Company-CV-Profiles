-- Splits the old "analytics" consent category into "statistics" (same
-- meaning, renamed to match the 4-category split now shown in the banner)
-- and adds a new, currently-inert "preferences" category alongside it — see
-- lib/consent.ts and components/cookie-consent-banner.tsx. Matches the
-- category split Cookiebot uses, adopted deliberately for consistency after
-- comparing the two banners.
--
-- Existing rows get "false" for the new preferences column since no consent
-- was ever collected for a category that didn't exist yet at the time.
alter table public.cookie_consent_log rename column analytics to statistics;
alter table public.cookie_consent_log add column if not exists preferences boolean not null default false;
