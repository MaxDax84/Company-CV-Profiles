import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Giulia Ferrara — Head of People & Culture | BeOnWeb Portfolio',
  description: 'Project Gamma: a warm, minimal web CV for an HR professional who grew from Coordinator to Head of People across three companies.',
}

export default function GammaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
