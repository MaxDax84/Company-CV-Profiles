import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marco Bianchi — CFO | BeOnWeb Portfolio Demo',
  description: 'Project Alpha: a BeOnWeb demo showcasing a dark, sophisticated web CV for a Finance & Management professional. Marco Bianchi is a fictional character.',
}

export default function AlphaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
