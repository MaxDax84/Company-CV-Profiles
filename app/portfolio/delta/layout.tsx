import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Luca Romano — Product & Growth Leader | Jobli Portfolio Demo',
  description: 'Project Delta: a Jobli demo showcasing a modern dark web CV for a Product & Growth professional. Luca Romano is a fictional character.',
}

export default function DeltaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
