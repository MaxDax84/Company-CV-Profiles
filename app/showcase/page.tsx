'use client'

import Link from 'next/link'

const items = [
  {
    slug: 'tony-stark',
    name: 'Tony Stark',
    role: 'CEO, Stark Industries',
    style: 'Futuristic HUD',
    bg: '#000814',
    accent: '#ef4444',
    emoji: '🤖',
    light: false,
  },
  {
    slug: 'audrey-hepburn',
    name: 'Audrey Hepburn',
    role: 'Actress & Humanitarian',
    style: 'Vintage Elegance',
    bg: '#0f0e0c',
    accent: '#d4af37',
    emoji: '🎬',
    light: false,
  },
  {
    slug: 'sailor-moon',
    name: 'Sailor Moon',
    role: 'Guardian of Love & Justice',
    style: 'Kawaii Pastel',
    bg: '#ffeef8',
    accent: '#e91e8c',
    emoji: '🌙',
    light: true,
  },
  {
    slug: 'darth-vader',
    name: 'Darth Vader',
    role: 'Dark Lord of the Sith',
    style: 'Imperial Minimal',
    bg: '#000000',
    accent: '#dc2626',
    emoji: '⚫',
    light: false,
  },
  {
    slug: 'homer-simpson',
    name: 'Homer Simpson',
    role: 'Safety Inspector, Sector 7-G',
    style: 'Fun & Colorful',
    bg: '#fbbf24',
    accent: '#1d4ed8',
    emoji: '🍩',
    light: true,
  },
  {
    slug: 'hermione-granger',
    name: 'Hermione Granger',
    role: 'Witch & Minister for Magic',
    style: 'Magical Academic',
    bg: '#3b0a14',
    accent: '#c9993f',
    emoji: '⚡',
    light: false,
  },
  {
    slug: 'walter-white',
    name: 'Walter White',
    role: 'Chemistry Teacher',
    style: 'Clinical & Clean',
    bg: '#f9fafb',
    accent: '#374151',
    emoji: '🧪',
    light: true,
  },
  {
    slug: 'sherlock-holmes',
    name: 'Sherlock Holmes',
    role: 'Consulting Detective',
    style: 'Victorian Dark',
    bg: '#0d1a15',
    accent: '#b8860b',
    emoji: '🔍',
    light: false,
  },
  {
    slug: 'son-goku',
    name: 'Son Goku',
    role: 'Z Fighter, Earth\'s Protector',
    style: 'Manga Energy',
    bg: '#ea580c',
    accent: '#1d4ed8',
    emoji: '💥',
    light: false,
  },
  {
    slug: 'forrest-gump',
    name: 'Forrest Gump',
    role: 'Captain, Bubba Gump Shrimp Co.',
    style: 'Warm Americana',
    bg: '#fdf3e3',
    accent: '#92400e',
    emoji: '🏃',
    light: true,
  },
]

export default function ShowcasePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080c14', color: '#f0f0f5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14,
            color: '#6b7280', textDecoration: 'none', marginBottom: 48 }}
        >
          ← Back to GoOnWeb
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#5b9cf6', marginBottom: 16 }}>
            Style Showcase
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
            letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.1 }}>
            Every Story Has Its Own Style
          </h1>
          <p style={{ fontSize: 18, color: '#9ca3af', maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            Ten iconic characters. Ten completely different designs.
            From futuristic HUDs to vintage elegance — this is what GoOnWeb can do for you.
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24,
        }}>
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`/showcase/${item.slug}`}
              style={{ textDecoration: 'none', display: 'block' }}
            >
              <div style={{
                borderRadius: 20,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                cursor: 'pointer',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 40px ${item.accent}30`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}
              >
                {/* Color preview */}
                <div style={{
                  height: 140,
                  background: item.bg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 56,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `radial-gradient(circle at 70% 30%, ${item.accent}30, transparent 60%)`,
                  }} />
                  <span style={{ position: 'relative', zIndex: 1 }}>{item.emoji}</span>
                </div>

                {/* Info */}
                <div style={{ padding: '20px 20px 24px', background: '#111827' }}>
                  <div style={{
                    display: 'inline-block',
                    fontSize: 10, fontWeight: 700,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: item.accent,
                    background: `${item.accent}15`,
                    border: `1px solid ${item.accent}30`,
                    borderRadius: 6,
                    padding: '3px 8px',
                    marginBottom: 10,
                  }}>
                    {item.style}
                  </div>
                  <h2 style={{ fontSize: 18, fontWeight: 700, color: '#f9fafb', margin: '0 0 4px' }}>
                    {item.name}
                  </h2>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>{item.role}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: '#4b5563', fontSize: 13, marginTop: 64 }}>
          All characters are fictional or historical public figures. Designs by{' '}
          <Link href="/" style={{ color: '#5b9cf6', textDecoration: 'none' }}>GoOnWeb</Link>.
        </p>
      </div>
    </div>
  )
}
