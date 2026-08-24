"use client";

import Navigation from "@/components/navigation";
import ActionFeedbackPopup from "@/components/action-feedback-popup";

interface OwnerToolbarProps {
  kind: "primary" | "tailored" | "translated";
}

// Shown only to the profile's own owner (see app/[code]/[slug]/page.tsx) —
// a visitor opening the shared link never sees this. It's the same fixed
// top nav used everywhere else on the site, so a signed-in owner always has
// a way back to their account instead of landing on a dead end.
//
// Every template has its own `position: fixed; top: 0; z-index: 100` nav
// bar (see components/templates/Template*.tsx). The standard Navigation
// only sets z-50, so on its own it would end up underneath the template's
// bar — wrapping it in a `position: relative` stacking context with a
// higher z-index makes it win instead, fully covering the template's own
// bar (both are the same 64px height, so there's no sliver peeking out
// beneath it).
export default function OwnerToolbar({ kind }: OwnerToolbarProps) {
  return (
    <>
      <div style={{ position: "relative", zIndex: 200 }}>
        <Navigation />
      </div>
      {/* Own page freshly opened is already the "got real value" moment
          here (unlike /tailor, which produces a downloadable file rather
          than a page) — no need to wait for an actual download. */}
      {kind === "primary" && <ActionFeedbackPopup actionType="generate" trigger={true} />}
    </>
  );
}
