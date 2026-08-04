// Single source of truth for which hostnames the "paste an existing profile
// link" feature (see /tailor) accepts as a valid source. Env-configurable so
// adding a custom domain later is a one-line env change, not a code hunt —
// see the "domain change checklist" project note for the full list of things
// that need updating if/when this project moves off *.vercel.app.
export const ALLOWED_PROFILE_HOSTS: string[] =
  process.env.ALLOWED_PROFILE_HOSTS?.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean) ??
  ["company-cv-profiles.vercel.app"];
