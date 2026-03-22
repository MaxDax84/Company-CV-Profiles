'use client'

import Link from 'next/link'
import { Orbitron, DM_Sans } from 'next/font/google'

const orbitron = Orbitron({ subsets: ['latin'], weight: ['400', '700', '900'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

const red = '#ef4444'
const gold = '#f59e0b'
const darkBg = '#030608'
const midBg = '#070e14'
const cardBg = 'rgba(239,68,68,0.04)'
const border = 'rgba(255,255,255,0.06)'
const borderRed = 'rgba(239,68,68,0.25)'

const roles = [
  {
    period: '1991 → Present',
    title: 'CEO & Chief Engineer',
    org: 'Stark Industries, Manhattan',
    color: red,
    tagline: 'The company that made weapons safe by putting them in the right hands.',
    points: [
      'Transformed global defense contractor into clean energy leader — $12.4B annual revenue',
      'Pivoted after 2008 Afghanistan incident: zero defense contracts, full renewable energy',
      'Developed ARC Reactor technology — unlimited clean energy output from palm-sized unit',
    ],
  },
  {
    period: '2008 → Present',
    title: 'Iron Man · Avengers Initiative',
    org: 'Classified / Global Operations',
    color: gold,
    tagline: 'The suit is the easy part. Wearing it is the job.',
    points: [
      'Designed and deployed Mark I through Mark LXXXV powered armor suits',
      'Co-founded the Avengers alongside Nick Fury — primary defense team for planet Earth',
      'Battle of New York: contained Chitauri invasion, redirected nuclear warhead through wormhole',
    ],
  },
  {
    period: '2018–2023',
    title: 'Lead Researcher · Time Architect',
    org: 'Upstate New York — Private R&D',
    color: '#8b5cf6',
    tagline: 'Five years off the grid. Still the smartest person in the room.',
    points: [
      'Solved quantum realm time navigation — the time heist that reversed the Snap',
      'Designed the Nano Gauntlet capable of housing all six Infinity Stones simultaneously',
      'Final act: used the Gauntlet to eliminate Thanos and his entire army. Permanently.',
    ],
  },
]

export default function TonyStarkPage() {
  return (
    <div className={dmSans.className} style={{ background: darkBg, color: '#e2e8f0', overflowX: 'hidden' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(3,6,8,0.88)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={orbitron.className} style={{ fontSize: 13, color: red, letterSpacing: '0.1em', fontWeight: 700 }}>TS</span>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[['#about', 'Profile'], ['#roles', 'Career'], ['#skills', 'Tech'], ['#education', 'Education']].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none', letterSpacing: '0.1em' }}>{label}</a>
            ))}
            <Link href="/showcase" style={{ fontSize: 12, color: '#374151', textDecoration: 'none' }}>← Showcase</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: `radial-gradient(ellipse at 65% 35%, rgba(239,68,68,0.1), transparent 55%), ${darkBg}` }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px)`, backgroundSize: '80px 80px', opacity: 0.6 }} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgba(239,68,68,0.08)', border: `1px solid ${borderRed}`, borderRadius: 99, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: red, display: 'inline-block' }} />
            <span className={orbitron.className} style={{ fontSize: 10, color: red, letterSpacing: '0.25em' }}>STARK INDUSTRIES // PERSONNEL FILE</span>
          </div>
          <h1 className={orbitron.className} style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 900, lineHeight: 0.92, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            ANTHONY E.<br />
            <span style={{ color: red }}>STARK</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: '#9ca3af', maxWidth: 540, lineHeight: 1.75, marginBottom: 48, fontWeight: 300 }}>
            Genius. Billionaire. The man who built a suit of armor in a cave — and never stopped improving it.
            There is no version of this story where Tony Stark is not the smartest person in the room.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['ARC REACTOR', '100%', red], ['SUIT MARK', 'LXXXV', gold], ['IQ', '270+', '#8b5cf6'], ['NET WORTH', '$12.4B', '#10b981']].map(([k, v, c]) => (
              <div key={k} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}`, borderRadius: 10, minWidth: 110 }}>
                <p className={orbitron.className} style={{ fontSize: 20, fontWeight: 700, color: c as string, margin: 0, lineHeight: 1 }}>{v}</p>
                <p className={orbitron.className} style={{ fontSize: 9, color: '#4b5563', margin: '4px 0 0', letterSpacing: '0.15em' }}>{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFILE */}
      <section id="about" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={orbitron.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.3em', marginBottom: 20 }}>// 01 BIOGRAPHICAL DATA</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <h2 className={orbitron.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 32px' }}>
                I AM<br /><span style={{ color: red }}>IRON MAN.</span>
              </h2>
              <blockquote style={{ borderLeft: `3px solid ${red}`, paddingLeft: 20 }}>
                <p style={{ fontSize: 17, color: '#e2e8f0', fontStyle: 'italic', margin: 0, lineHeight: 1.65, fontWeight: 300 }}>
                  &ldquo;Genius, billionaire, playboy, philanthropist. In that order. The philanthropy came later — after I nearly died in a cave in Afghanistan.&rdquo;
                </p>
              </blockquote>
            </div>
            <div>
              <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.85, marginBottom: 20, fontWeight: 300 }}>
                Born May 29, 1970 in Manhattan. Enrolled at MIT at 15, graduating summa cum laude in Electrical
                Engineering and Physics. Inherited Stark Industries at 21 — turning a weapons empire into a
                $12.4B clean energy company.
              </p>
              <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.85, marginBottom: 28, fontWeight: 300 }}>
                The 2008 Afghanistan capture changed everything. Returning with an ARC reactor in his chest,
                Stark dismantled the weapons division overnight — then walked into a press conference and said
                four words that changed the world.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Born', 'May 29, 1970'], ['Alma Mater', 'MIT, Class of 1987'], ['Enrolled', 'Age 15'], ['Partner', 'Virginia Potts']].map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 14px', background: cardBg, border: `1px solid ${borderRed}`, borderRadius: 8 }}>
                    <p className={orbitron.className} style={{ fontSize: 9, color: '#4b5563', margin: '0 0 2px', letterSpacing: '0.12em' }}>{k}</p>
                    <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER */}
      <section id="roles" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={orbitron.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.3em', marginBottom: 20 }}>// 02 OPERATIONAL HISTORY</p>
          <h2 className={orbitron.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 56px' }}>
            Three chapters.<br /><span style={{ color: red }}>All classified.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {roles.map((r) => (
              <div key={r.title} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: '28px 32px', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = r.color + '40'; el.style.boxShadow = `0 12px 40px ${r.color}10`; el.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = border; el.style.boxShadow = 'none'; el.style.transform = 'translateX(0)' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
                  <div>
                    <p className={orbitron.className} style={{ fontSize: 10, color: r.color, margin: '0 0 6px', letterSpacing: '0.1em' }}>{r.period}</p>
                    <p className={orbitron.className} style={{ fontSize: 14, fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>{r.title}</p>
                    <p style={{ fontSize: 12, color: '#4b5563', margin: '0 0 12px' }}>{r.org}</p>
                    <p style={{ fontSize: 13, color: r.color, fontStyle: 'italic', margin: 0 }}>&ldquo;{r.tagline}&rdquo;</p>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {r.points.map(pt => (
                      <li key={pt} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: r.color, fontSize: 10, marginTop: 4, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={orbitron.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.3em', marginBottom: 20 }}>// 03 TECHNICAL CAPABILITIES</p>
          <h2 className={orbitron.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, margin: '0 0 48px' }}>
            Off the charts.<br /><span style={{ color: gold }}>Literally.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {[['Mechanical Engineering', 100, red], ['Quantum Physics', 94, gold], ['AI Development', 98, '#8b5cf6'], ['Armor Combat', 88, red], ['Clean Energy Systems', 97, '#10b981'], ['Business Strategy', 85, gold], ['Materials Science', 96, '#06b6d4'], ['Weapons Engineering', 99, red]].map(([skill, pct, color]) => (
              <div key={skill as string} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className={orbitron.className} style={{ fontSize: 10, color: '#9ca3af' }}>{skill}</span>
                  <span className={orbitron.className} style={{ fontSize: 10, color: color as string, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color as string, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={orbitron.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.3em', marginBottom: 20 }}>// 04 EDUCATION</p>
          <div style={{ padding: '32px', background: cardBg, border: `1px solid ${borderRed}`, borderRadius: 16 }}>
            <p className={orbitron.className} style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>Massachusetts Institute of Technology</p>
            <p style={{ fontSize: 14, color: red, margin: '0 0 4px', fontWeight: 500 }}>B.Sc. Electrical Engineering & Physics — Summa Cum Laude</p>
            <p style={{ fontSize: 13, color: '#4b5563', margin: 0 }}>Enrolled age 15 · Class of 1987 · Youngest department graduate in history</p>
          </div>
        </div>
      </section>

      <footer style={{ background: midBg, borderTop: `1px solid ${border}`, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={orbitron.className} style={{ fontSize: 10, color: '#1f2937', letterSpacing: '0.2em' }}>STARK INDUSTRIES CONFIDENTIAL</span>
          <p style={{ fontSize: 12, color: '#374151' }}>Designed by <Link href="/" style={{ color: red, textDecoration: 'none' }}>BeOnWeb</Link></p>
        </div>
      </footer>
    </div>
  )
}
