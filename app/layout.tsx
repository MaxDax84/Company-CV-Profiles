import type { Metadata } from 'next'
// Self-hosted (not next/font/google): fetching font files live from
// Google's CDN at build time turned out to be randomly unreliable — a
// different font would 404 on maybe 1 in 3 production builds (confirmed
// transient, not a real bug, but it kept forcing a manual redeploy retry).
// @fontsource ships the actual font files in the package, so the build
// never depends on Google's CDN being up. --font-body/--font-heading are
// set directly in globals.css now instead of via next/font's `variable`
// option.
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/inter/700.css'
import '@fontsource/space-grotesk/500.css'
import '@fontsource/space-grotesk/600.css'
import '@fontsource/space-grotesk/700.css'
import { LanguageProvider } from '@/components/language-provider'
import { ConsentProvider } from '@/components/consent-provider'
import CookieConsentBanner from '@/components/cookie-consent-banner'
import GoogleAnalytics from '@/components/google-analytics'
import PostHogProvider from '@/components/posthog-provider'
import ScrollToTop from '@/components/scroll-to-top'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import './globals.css'

const SITE_DESCRIPTION =
  'Jobli usa l\'AI per trasformare il tuo CV in un profilo pronto per candidarti: lo ottimizza per gli ATS, lo adatta a ogni annuncio e non inventa mai nulla che non hai fatto.'

export const metadata: Metadata = {
  // Required for every relative URL below (and in per-page metadata) to
  // resolve to an absolute one — without it Next.js errors on a relative
  // openGraph/alternates value. www, matching next.config.mjs's apex→www
  // redirect, so a canonical never points at a URL that 308s.
  metadataBase: new URL(SITE_URL),
  title: {
    // Applies to CHILD segments only: a page exporting `title: 'FAQ'` gets
    // "FAQ | Jobli", while this segment itself uses `default`. A page that
    // needs to opt out entirely can use `title.absolute`.
    template: '%s | Jobli',
    default: 'Jobli | Più colloqui, con il CV che hai già',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  // Root canonical. Every page below can override it with its own
  // `alternates: { canonical: '/its-path' }`, resolved against metadataBase.
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    siteName: SITE_NAME,
    locale: 'it_IT',
    url: '/',
    title: 'Jobli | Più colloqui, con il CV che hai già',
    description: SITE_DESCRIPTION,
    // The image itself comes from app/opengraph-image.tsx (Next.js file
    // convention) — declaring it here too would override that, not add to it.
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jobli | Più colloqui, con il CV che hai già',
    description: SITE_DESCRIPTION,
  },
  // No explicit `icons` field — app/icon.png (Next.js file convention) is
  // picked up and served automatically. An explicit icons entry here would
  // override that convention instead of complementing it.
}

// suppressHydrationWarning on <html> below: public/theme-init.js adds .dark
// before hydration to avoid a light-mode flash for dark-mode users — React
// correctly flags that as a client/server mismatch, but it's expected here,
// not a bug. Doesn't suppress mismatches deeper in the tree.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script src="/theme-init.js" />
      </head>
      <body className="font-sans antialiased">
        <ScrollToTop />
        <LanguageProvider>
          <ConsentProvider>
            {children}
            <CookieConsentBanner />
            <GoogleAnalytics />
            <PostHogProvider />
          </ConsentProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
