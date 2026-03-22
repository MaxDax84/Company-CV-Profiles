import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maria Rossi — Head of People & Culture | BeOnWeb Portfolio Demo',
  description: 'Project Gamma: a BeOnWeb demo showcasing a web CV for an HR professional with a realistic career progression. Maria Rossi is a fictional character.',
}

export default function GammaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
