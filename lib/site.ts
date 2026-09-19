// The canonical public origin, in one place: app/layout.tsx's metadataBase,
// app/robots.ts, app/sitemap.ts and the JSON-LD blocks all resolve their
// absolute URLs from here.
//
// www, not the apex: both hosts used to serve identical 200s, which is a
// textbook duplicate-content split. next.config.mjs now 308s the apex to
// this host, so every absolute URL the site emits must already point at the
// redirect target, not at the thing being redirected.
export const SITE_URL = "https://www.jobli.it";

export const SITE_NAME = "Jobli";
