"use client";

import Script from "next/script";
import { useConsent } from "@/components/consent-provider";

// Only ever renders gtag.js once the user has actively opted into the
// "statistics" cookie category — never loaded pre-consent, and unmounts
// immediately (stops sending events) if consent is later withdrawn from
// the "Cookie preferences" panel. NEXT_PUBLIC_GA_MEASUREMENT_ID must be set
// to a real GA4 Measurement ID (starts with "G-") for this to do anything;
// silently renders nothing if it isn't configured yet.
export default function GoogleAnalytics() {
  const { consent } = useConsent();
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  if (!measurementId) return null;
  if (!consent.statistics) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          // IP anonymization + no ad-personalization signals by default —
          // this is a statistics-consent grant, not a marketing one.
          gtag('config', '${measurementId}', { anonymize_ip: true, allow_ad_personalization_signals: false });
        `}
      </Script>
    </>
  );
}
