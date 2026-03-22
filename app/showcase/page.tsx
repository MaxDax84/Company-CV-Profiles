'use client'

import Link from 'next/link'
import { professionalItems, boldItems, showcaseCount } from '@/lib/showcase-items'

// Hidden from grid — not deleted, under evaluation:
// leonardo-dicaprio, sherlock-holmes, cristiano-ronaldo, coco-chanel, marie-curie
// sailor-moon, walter-white, son-goku, forrest-gump

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
          ← Back to BeOnWeb
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
            {showcaseCount} designs across two worlds — from polished professional CVs
            to bold creative statements. All built from scratch by BeOnWeb.
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
                Real people, real achievements — styled as professional web CVs that are polished, structured, and ready to make an impression.
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
                Three iconic characters, three completely different creative styles — imperial darkness, cartoon energy, magical academia.
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
          <Link href="/" style={{ color: '#5b9cf6', textDecoration: 'none' }}>BeOnWeb</Link>.
        </p>
      </div>
    </div>
  )
}
