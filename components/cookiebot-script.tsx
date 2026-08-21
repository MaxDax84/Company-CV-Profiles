import Script from "next/script";

// Loaded only when NEXT_PUBLIC_COOKIE_CMP=cookiebot (see app/layout.tsx) —
// this is the Cookiebot-by-Usercentrics trial. Cookiebot requires its own
// script to be the very first thing in <head>, which `beforeInteractive`
// guarantees regardless of where this component sits in the tree (Next.js
// hoists it into the server-rendered <head>). "Auto" blocking mode means
// Cookiebot scans the page itself for known trackers (GA included) and
// blocks/unblocks them without us marking each script by hand.
export default function CookiebotScript() {
  const cbid = process.env.NEXT_PUBLIC_COOKIEBOT_ID;
  if (!cbid) return null;

  return (
    <Script
      id="Cookiebot"
      src="https://consent.cookiebot.com/uc.js"
      data-cbid={cbid}
      data-blockingmode="auto"
      strategy="beforeInteractive"
    />
  );
}
