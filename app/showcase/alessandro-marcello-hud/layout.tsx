import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Alessandro Marcello — HUD Style | BeOnWeb' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
