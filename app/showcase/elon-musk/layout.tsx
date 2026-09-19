import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Elon Musk (showcase)' }
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
