"use client";

import { useEffect } from "react";
import { trackClient } from "@/lib/analytics-client";

// Mounted (invisibly) on the permanent /<code>/<slug> profile page — see
// app/[code]/[slug]/page.tsx. `ownerId` is the account code from the URL,
// not the raw Supabase user id: it's already the account's public
// identifier (visible in the URL itself), so using it avoids a DB lookup
// just for this. The viewer themselves is never identified — no identify()
// call happens here, so this stays an anonymous event regardless of
// whether the visitor is logged into their own unrelated account.
export default function PublicPageViewTracker({ ownerId }: { ownerId: string }) {
  useEffect(() => {
    trackClient.publicPageViewed({ profile_owner_id: ownerId });
  }, [ownerId]);

  return null;
}
