'use client'

import Link from 'next/link'
import { professionalItems, boldItems, showcaseCount } from '@/lib/showcase-items'
import { useLanguage } from '@/components/language-provider'

// Hidden from grid — not deleted, under evaluation:
// leonardo-dicaprio, sherlock-holmes, marie-curie, sailor-moon, walter-white, son-goku, forrest-gump

const content = {
  en: {
    backLabel: '← Back to Jobli',
    eyebrow: 'Style Showcase',
    title: 'Every Story Has Its Own Style',
    subtitle: (n: number) => `${n} designs across two worlds — from polished professional CVs to bold creative statements. All built from scratch by Jobli.`,
    section1Label: 'Section 01',
    section1Title: 'Serious & Professional',
    section1Desc: 'Real people, real achievements — styled as professional web CVs that are polished, structured, and ready to make an impression.',
    section2Label: 'Section 02',
    section2Title: 'Bold & Exuberant',
    section2Desc: 'Three iconic characters, three completely different creative styles — imperial darkness, cartoon energy, magical academia.',
    footer: (jobli: React.ReactNode) => <>All designs are original works. Characters are fictional, historical, or public figures. Designs by{' '}{jobli}.</>,
  },
  it: {
    backLabel: '← Torna a Jobli',
    eyebrow: 'Vetrina di stile',
    title: 'Ogni storia ha il suo stile',
    subtitle: (n: number) => `${n} design in due mondi — da CV web professionali e curati a dichiarazioni creative audaci. Tutti costruiti da zero da Jobli.`,
    section1Label: 'Sezione 01',
    section1Title: 'Serio & Professionale',
    section1Desc: 'Persone vere, risultati veri — trasformati in CV web professionali, curati, strutturati e pronti a fare colpo.',
    section2Label: 'Sezione 02',
    section2Title: 'Audace & Esuberante',
    section2Desc: 'Tre personaggi iconici, tre stili creativi completamente diversi — oscurità imperiale, energia da cartone animato, accademia magica.',
    footer: (jobli: React.ReactNode) => <>Tutti i design sono opere originali. I personaggi sono figure di fantasia, storiche o pubbliche. Design a cura di{' '}{jobli}.</>,
  },
}

function ShowcaseCard({ item, lang }: { item: typeof professionalItems[0]; lang: 'en' | 'it' }) {
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
            {lang === 'en' ? item.styleEn : item.styleIt}
          </div>
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#f9fafb', margin: '0 0 3px' }}>
            {item.name}
          </h2>
          <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{lang === 'en' ? item.roleEn : item.roleIt}</p>
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
  const { lang } = useLanguage()
  const t = content[lang]

  return (
    <div style={{ minHeight: '100vh', background: '#080c14', color: '#f0f0f5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 24px 80px' }}>

        {/* Back link */}
        <Link
          href="/"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 14,
            color: '#6b7280', textDecoration: 'none', marginBottom: 56 }}
        >
          {t.backLabel}
        </Link>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <p style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.2em',
            textTransform: 'uppercase', color: '#5b9cf6', marginBottom: 16 }}>
            {t.eyebrow}
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 800,
            letterSpacing: '-0.02em', marginBottom: 16, lineHeight: 1.1 }}>
            {t.title}
          </h1>
          <p style={{ fontSize: 18, color: '#9ca3af', maxWidth: 600, margin: '0 auto', lineHeight: 1.65 }}>
            {t.subtitle(showcaseCount)}
          </p>
        </div>

        {/* ── Section 1: Serious & Professional ── */}
        <div style={{ marginBottom: 80 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#5b9cf6', marginBottom: 8 }}>
                {t.section1Label}
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.1 }}>
                {t.section1Title}
              </h2>
              <p style={{ fontSize: 15, color: '#6b7280', margin: 0, maxWidth: 480 }}>
                {t.section1Desc}
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
              <ShowcaseCard key={item.slug} item={item} lang={lang} />
            ))}
          </div>
        </div>

        {/* ── Section 2: Bold & Exuberant ── */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 40 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#f59e0b', marginBottom: 8 }}>
                {t.section2Label}
              </p>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 8px', lineHeight: 1.1 }}>
                {t.section2Title}
              </h2>
              <p style={{ fontSize: 15, color: '#6b7280', margin: 0, maxWidth: 480 }}>
                {t.section2Desc}
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
              <ShowcaseCard key={item.slug} item={item} lang={lang} />
            ))}
          </div>
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: '#4b5563', fontSize: 13, marginTop: 72 }}>
          {t.footer(<Link href="/" style={{ color: '#5b9cf6', textDecoration: 'none' }}>Jobli</Link>)}
        </p>
      </div>
    </div>
  )
}
