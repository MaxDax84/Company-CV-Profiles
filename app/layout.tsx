import type { Metadata } from 'next'
import { Space_Grotesk, Inter } from 'next/font/google'
import { LanguageProvider } from '@/components/language-provider'
import ScrollToTop from '@/components/scroll-to-top'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
})
const inter = Inter({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = {
  title: 'BeOnWeb | Più colloqui, con il CV che hai già',
  description:
    'BeOnWeb usa l\'AI per trasformare il tuo CV in un profilo pronto per candidarti: lo ottimizza per gli ATS, lo adatta a ogni annuncio e non inventa mai nulla che non hai fatto.',
  icons: {
    icon: '/icon.svg',
  },
}

// Runs before hydration so the .dark class is already set on first paint —
// without this the page would flash light mode for a returning dark-mode
// user, then flip once React mounts.
const THEME_INIT_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();`

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}>
        <ScrollToTop />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
