import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Audrey Hepburn — BeOnWeb Showcase' }
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
