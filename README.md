# Jobli — Company website

## Analytics

Product analytics run on [PostHog](https://posthog.com) (EU region). Every event is typed and defined in one place — nothing calls `posthog.capture`/`.identify` directly outside these files:

- `lib/analytics-types.ts` — the event catalog: every event name and its property shape, in one `AnalyticsEvents` type. No SDK dependency, safe to import anywhere.
- `lib/analytics-client.ts` — browser-side tracking (`posthog-js`), used from `"use client"` components. Exports `trackClient.*`, plus `initAnalyticsClient()`/`setAnalyticsConsent()`/`identifyUser()` (wired up once in `components/posthog-provider.tsx`).
- `lib/analytics-server.ts` — server-side tracking (`posthog-node`) for Node-runtime API routes. Exports `trackServer(distinctId, event, properties)`.
- `lib/analytics-edge.ts` — a plain-`fetch` capture used *only* by `/api/parse-resume` (the one route on the Edge runtime — `posthog-node` needs Node's `http`/`https` and can't run there, and even an unused import of it risked breaking that route's build).

Consent: PostHog always initializes with in-memory-only persistence, and only starts writing to `localStorage`/cookies once a visitor accepts the "statistics" cookie category (`components/consent-provider.tsx`) — mirrors how `components/google-analytics.tsx` gates GA4. Session replay is on, with `maskAllInputs: true` plus a `ph-mask` class applied to every container known to render real CV/personal content.

### Events

| Event | Fired from |
|---|---|
| `signup_completed` | `components/signup-form.tsx` (password, no email-confirm step) and `app/auth/callback/route.ts` (Google OAuth / confirmed-email signup) |
| `cv_upload_started` | `app/generate/page.tsx` |
| `cv_parse_succeeded` / `cv_parse_failed` | `app/api/parse-resume/route.ts` (Edge — via `lib/analytics-edge.ts`) |
| `score_viewed` | `app/generate/page.tsx` |
| `profile_page_generated` | `app/api/customize-profile/route.ts` |
| `job_ad_pasted` | `components/tailor-form.tsx` |
| `adaptation_completed` | `app/api/tailor-resume/route.ts` |
| `download_completed` | `app/api/pdf/[slug]/route.tsx`, `app/api/cv-word/[slug]/route.ts`, `app/api/cover-letter/[slug]/route.tsx` |
| `credits_requested` | `app/api/account/request-credits/route.ts` |
| `public_page_viewed` | `app/[code]/[slug]/page.tsx` (via `components/public-page-view-tracker.tsx`) |

### Adding a new event

1. Add its name and property shape to `AnalyticsEvents` in `lib/analytics-types.ts`.
2. Add a `trackClient.xxx()` (in `lib/analytics-client.ts`) or call `trackServer(distinctId, "event_name", {...})` directly from a Node route — never a bare `posthog.capture(...)`.
3. Double-check no property carries CV content, a name, an email, or a phone number — counts/durations/codes/enums only.
