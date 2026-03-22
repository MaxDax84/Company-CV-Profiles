import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Darth Vader — BeOnWeb Showcase' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
