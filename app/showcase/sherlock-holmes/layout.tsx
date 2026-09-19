import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Sherlock Holmes (showcase)' }
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
