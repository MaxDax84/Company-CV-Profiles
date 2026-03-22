import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Hermione Granger — BeOnWeb Showcase' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
