import Link from 'next/link'
import { Orbitron } from 'next/font/google'
import type { Metadata } from 'next'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] })

export const metadata: Metadata = { title: 'Tony Stark — GoOnWeb Showcase' }

export default function TonyStarkPage() {
  const red = '#ef4444'
  const gold = '#f59e0b'

  return (
    <div className={orbitron.className} style={{ minHeight: '100vh', background: '#000814', color: '#e2e8f0' }}>
      {/* Grid overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `linear-gradient(${red}18 1px, transparent 1px), linear-gradient(90deg, ${red}18 1px, transparent 1px)`, backgroundSize: '60px 60px', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '20%', right: '10%', width: 400, height: 400, background: `${red}12`, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, margin: '0 auto', padding: '40px 24px' }}>

        <Link href="/showcase" style={{ fontSize: 11, color: '#4b5563', textDecoration: 'none', letterSpacing: '0.1em' }}>
          ← SHOWCASE INDEX
        </Link>

        {/* HUD Header */}
        <div style={{ borderLeft: `3px solid ${red}`, paddingLeft: 24, margin: '48px 0 16px' }}>
          <p style={{ fontSize: 11, color: red, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 8px' }}>
            STARK INDUSTRIES // PERSONNEL FILE // CLASSIFIED
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>
            ANTHONY E.<br />
            <span style={{ color: red }}>STARK</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: 14, marginTop: 12, letterSpacing: '0.2em' }}>
            CHIEF EXECUTIVE OFFICER · INVENTOR · IRON MAN
          </p>
        </div>

        {/* Status bar */}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', margin: '32px 0', padding: '16px 20px', background: 'rgba(239,68,68,0.06)', border: `1px solid ${red}30`, borderRadius: 8 }}>
          {[['ARC REACTOR', '100%', red], ['SUIT STATUS', 'ONLINE', gold], ['THREAT LEVEL', 'MANAGED', '#22c55e'], ['JARVIS', 'ACTIVE', '#3b82f6']].map(([k, v, c]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <span style={{ fontSize: 9, color: '#475569', letterSpacing: '0.2em' }}>{k}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: c as string }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Bio */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, color: gold, letterSpacing: '0.25em', borderBottom: `1px solid ${gold}30`, paddingBottom: 8, marginBottom: 20 }}>
            // BIOGRAPHICAL DATA
          </h2>
          <p style={{ color: '#94a3b8', lineHeight: 1.8, fontSize: 14 }}>
            Born May 29, 1970, Manhattan, New York. Billionaire, genius, philanthropist — and the most
            sophisticated weapons engineer on the planet. Enrolled at MIT at age 15, graduating summa cum laude
            in Electrical Engineering and Physics. Inherited Stark Industries at 21 following the death of
            Howard and Maria Stark. Survived capture in Afghanistan (2008), an event that redefined his mission.
          </p>
        </section>

        {/* Career */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, color: gold, letterSpacing: '0.25em', borderBottom: `1px solid ${gold}30`, paddingBottom: 8, marginBottom: 20 }}>
            // OPERATIONAL HISTORY
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              ['1991 → PRESENT', 'CEO, Stark Industries', 'Manhattan, NY', 'Led global defense and clean energy operations. Annual revenue: $12.4B.'],
              ['2008 → PRESENT', 'Iron Man', 'Global', 'Developed and deployed Mark I–LXXXV powered armor suits. Co-founded Avengers Initiative.'],
              ['2012', 'Avengers Initiative', 'New York / Global', 'Key operative in Battle of New York. Directed Chitauri containment.'],
              ['2018–2023', 'Retired / R&D', 'Upstate New York', 'Quantum realm research. Time heist architect. Infinity Gauntlet development.'],
            ].map(([date, title, loc, desc]) => (
              <div key={title} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 16, paddingBottom: 16, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                <div>
                  <p style={{ fontSize: 10, color: red, fontWeight: 700, margin: '0 0 4px', letterSpacing: '0.1em' }}>{date}</p>
                  <p style={{ fontSize: 10, color: '#475569', margin: 0 }}>{loc}</p>
                </div>
                <div>
                  <p style={{ fontWeight: 700, margin: '0 0 4px', fontSize: 14 }}>{title}</p>
                  <p style={{ color: '#64748b', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 11, color: gold, letterSpacing: '0.25em', borderBottom: `1px solid ${gold}30`, paddingBottom: 8, marginBottom: 20 }}>
            // TECHNICAL CAPABILITIES
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
            {[['Mechanical Engineering', 100], ['Quantum Physics', 94], ['AI Development', 98], ['Combat (Armor)', 88], ['Energy Systems', 97], ['Business Strategy', 85]].map(([skill, pct]) => (
              <div key={skill} style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.06)`, borderRadius: 8, padding: '12px 14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, letterSpacing: '0.05em' }}>{skill}</span>
                  <span style={{ fontSize: 11, color: red, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 3, background: '#1e293b', borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${red}, ${gold})`, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 style={{ fontSize: 11, color: gold, letterSpacing: '0.25em', borderBottom: `1px solid ${gold}30`, paddingBottom: 8, marginBottom: 20 }}>
            // EDUCATION
          </h2>
          <div style={{ background: 'rgba(239,68,68,0.04)', border: `1px solid ${red}20`, borderRadius: 8, padding: '16px 20px' }}>
            <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>Massachusetts Institute of Technology</p>
            <p style={{ color: '#94a3b8', fontSize: 13, margin: 0 }}>B.Sc. Electrical Engineering & Physics — Summa Cum Laude · Enrolled age 15 · Class of 1987</p>
          </div>
        </section>

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
          <p style={{ fontSize: 10, color: '#374151', letterSpacing: '0.2em' }}>
            STARK INDUSTRIES CONFIDENTIAL · DESIGNED BY{' '}
            <Link href="/" style={{ color: red, textDecoration: 'none' }}>GOONWEB</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
