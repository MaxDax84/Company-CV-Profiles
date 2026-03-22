import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sofia Conti — Strategy Advisor | BeOnWeb Portfolio Demo',
  description: 'Project Beta: a BeOnWeb demo showcasing an editorial web CV for a Strategy & Management Consulting professional. Sofia Conti is a fictional character.',
}

export default function BetaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
