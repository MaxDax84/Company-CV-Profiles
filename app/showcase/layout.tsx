import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Style Showcase | BeOnWeb',
  description: 'A showcase of web CV styles — futuristic, vintage, kawaii, dark, clinical and more.',
}

export default function ShowcaseLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
