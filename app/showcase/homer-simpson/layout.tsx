import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Homer Simpson (showcase)' }

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
