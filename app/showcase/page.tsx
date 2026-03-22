'use client'

import Link from 'next/link'

const professionalItems = [
  {
    slug: 'leonardo-dicaprio',
    name: 'Leonardo DiCaprio',
    role: 'Actor & Producer',
    style: 'Modern Dark Teal',
    bg: '#0d1c24',
    accent: '#0d9488',
    emoji: '🎬',
  },
  {
    slug: 'elon-musk',
    name: 'Elon Musk',
    role: 'CEO & Entrepreneur',
    style: 'Ultra-Clean White',
    bg: '#f9fafb',
    accent: '#2563eb',
    emoji: '🚀',
  },
  {
    slug: 'cristiano-ronaldo',
    name: 'Cristiano Ronaldo',
    role: 'Professional Footballer',
    style: 'Dark Navy & Gold',
    bg: '#0a0f1e',
    accent: '#c9a84c',
    emoji: '⚽',
  },
  {
    slug: 'coco-chanel',
    name: 'Coco Chanel',
    role: 'Fashion Designer & Couturière',
    style: 'Parisian Black & White',
    bg: '#0a0a0a',
    accent: '#8c8279',
    emoji: '✂️',
  },
  {
    slug: 'marie-curie',
    name: 'Marie Curie',
    role: 'Physicist & Chemist',
    style: 'Academic Bordeaux',
    bg: '#7c1e35',
    accent: '#f7f3ef',
    emoji: '⚗️',
  },
]

const boldItems = [
  {
    slug: 'tony-stark',
    name: 'Tony Stark',
    role: 'CEO, Stark Industries',
    style: 'Futuristic HUD',
    bg: '#000814',
    accent: '#ef4444',
    emoji: '🤖',
  },
  {
    slug: 'audrey-hepburn',
    name: 'Audrey Hepburn',
    role: 'Actress & Humanitarian',
    style: 'Vintage Elegance',
    bg: '#0f0e0c',
    accent: '#d4af37',
    emoji: '🎭',
  },
  {
    slug: 'sailor-moon',
    name: 'Sailor Moon',
    role: 'Guardian of Love & Justice',
    style: 'Kawaii Pastel',
    bg: '#ffeef8',
    accent: '#e91e8c',
    emoji: '🌙',
  },
  {
    slug: 'darth-vader',
    name: 'Darth Vader',
    role: 'Dark Lord of the Sith',
    style: 'Imperial Minimal',
    bg: '#000000',
    accent: '#dc2626',
    emoji: '⚫',
  },
  {
    slug: 'homer-simpson',
    name: 'Homer Simpson',
    role: 'Safety Inspector, Sector 7-G',
    style: 'Fun & Colorful',
    bg: '#fbbf24',
    accent: '#1d4ed8',
    emoji: '🍩',
  },
  {
    slug: 'hermione-granger',
    name: 'Hermione Granger',
    role: 'Witch & Minister for Magic',
    style: 'Magical Academic',
    bg: '#3b0a14',
    accent: '#c9993f',
    emoji: '⚡',
  },
  {
    slug: 'walter-white',
    name: 'Walter White',
    role: 'Chemistry Teacher',
    style: 'Clinical & Clean',
    bg: '#f9fafb',
    accent: '#374151',
    emoji: '🧪',
  },
  {
    slug: 'sherlock-holmes',
    name: 'Sherlock Holmes',
    role: 'Consulting Detective',
    style: 'Victorian Dark',
    bg: '#0d1a15',
    accent: '#b8860b',
    emoji: '🔍',
  },
  {
    slug: 'son-goku',
    name: 'Son Goku',
    role: "Z Fighter, Earth's Protector",
    style: 'Manga Energy',
    bg: '#ea580c',
    accent: '#1d4ed8',
    emoji: '💥',
  },
  {
    slug: 'forrest-gump',
    name: 'Forrest Gump',
    role: 'Captain, Bubba Gump Shrimp Co.',
    style: 'Warm Americana',
    bg: '#fdf3e3',
    accent: '#92400e',
    emoji: '🏃',
  },
]

function ShowcaseCard({ item }: { item: typeof professionalItems[0] }) {
  return (
    <Link
      key={item.slug}
      href={`/showcase/${item.slug}`}
      style={{ textDecoration: 'none', display: 'block' }}
    >
      <div
        style={{
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
          height: 130,
          background: item.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
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
        <div style={{ padding: '18px 20px 22px', background: '#111827' }}>
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
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f9fafb', margin: '0 0 3px' }}>
            {item.name}
          </h2>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{item.role}</p>
        </div>
      </div>
    </Link>
  )
}

function SectionHeader({ label, title, description }: { label: string; title: string; description: string }) {
  return (
    <div style={{ marginBottom: 40 }}>
      <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5b9cf6', marginBottom: 12 }}>
        {label}
      </p>
      <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.1 }}>
        {title}
      </h2>
      <p style={{ fontSize: 16, color: '#9ca3af', maxWidth: 540, lineHeight: 1.65 }}>
        {description}
      </p>
    </div>
  )
}

export default function ShowcasePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#080c14', color: '#f0f0f5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14,
            color: '#6b7280', textDecoration: 'none', marginBottom: 56 }}
        >
          ← Back to GoOnWeb
        </Link>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#5b9cf6', marginBottom: 16 }}>
            Style Showcase
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
            letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.1 }}>
            Every Story Has Its Own Style
          </h1>
          <p style={{ fontSize: 18, color: '#9ca3af', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
            15 designs across two worlds — from polished professional CVs
            to bold creative statements. All built from scratch by GoOnWeb.
          </p>
        </div>

        {/* ── Section 1: Serious & Professional ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5b9cf6', marginBottom: 8 }}>
                Section 01
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.1 }}>
                Serious & Professional
              </h2>
              <p style={{ fontSize: 15, color: '#6b7280', margin: 0, maxWidth: 480 }}>
                Real-world CV layouts for real people — polished, structured, and ready to impress.
                The kind of web CV you&apos;d hand a recruiter at a Fortune 500.
              </p>
            </div>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 24,
          }}>
            {professionalItems.map((item) => (
              <ShowcaseCard key={item.slug} item={item} />
            ))}
          </div>
        </div>

        {/* ── Section 2: Bold & Exuberant ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 8 }}>
                Section 02
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.1 }}>
                Bold & Exuberant
              </h2>
              <p style={{ fontSize: 15, color: '#6b7280', margin: 0, maxWidth: 480 }}>
                Ten iconic characters, ten completely different creative styles — futuristic HUDs,
                kawaii pastels, manga energy, imperial darkness and beyond.
              </p>
            </div>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
            gap: 24,
          }}>
            {boldItems.map((item) => (
              <ShowcaseCard key={item.slug} item={item} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: '#4b5563', fontSize: 13, marginTop: 72 }}>
          All designs are original works. Characters are fictional, historical, or public figures. Designs by{' '}
          <Link href="/" style={{ color: '#5b9cf6', textDecoration: 'none' }}>GoOnWeb</Link>.
        </p>
      </div>
    </div>
  )
}
