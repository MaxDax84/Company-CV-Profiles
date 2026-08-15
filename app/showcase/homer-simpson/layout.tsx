import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Homer Simpson — Jobli Showcase' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
