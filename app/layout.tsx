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
import ScrollToTop from '@/components/scroll-to-top'
import './globals.css'

export const metadata: Metadata = {
  title: 'Jobli | Più colloqui, con il CV che hai già',
  description:
    'Jobli usa l\'AI per trasformare il tuo CV in un profilo pronto per candidarti: lo ottimizza per gli ATS, lo adatta a ogni annuncio e non inventa mai nulla che non hai fatto.',
  // No explicit `icons` field — app/icon.png (Next.js file convention) is
  // picked up and served automatically. An explicit icons entry here would
  // override that convention instead of complementing it.
}

// Runs before hydration so the .dark class is already set on first paint —
// without this the page would flash light mode for a returning dark-mode
// user, then flip once React mounts. Default is light: a first-time visitor
// with no saved choice gets light regardless of their OS preference: only
// an explicit 'dark' previously saved via the toggle (components/theme-toggle.tsx)
// turns dark mode on.
const THEME_INIT_SCRIPT = `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`

// suppressHydrationWarning on <html> below: THEME_INIT_SCRIPT adds .dark
// before hydration to avoid a light-mode flash for dark-mode users — React
// correctly flags that as a client/server mismatch, but it's expected here,
// not a bug. Doesn't suppress mismatches deeper in the tree.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="font-sans antialiased">
        <ScrollToTop />
        <LanguageProvider>
          <ConsentProvider>
            {children}
            <CookieConsentBanner />
            <GoogleAnalytics />
          </ConsentProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
