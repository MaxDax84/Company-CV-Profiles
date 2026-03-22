import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { LanguageProvider } from '@/components/language-provider'
import './globals.css'

const _geist = Geist({ subsets: ['latin'] })
const _geistMono = Geist_Mono({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BeOnWeb | Professional Web CV Creation',
  description:
    'BeOnWeb crafts elegant, fully personalized web CVs — a modern alternative to the traditional résumé. Custom design, domain setup, and ongoing maintenance.',
  icons: {
    icon: '/icon.svg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  )
}
