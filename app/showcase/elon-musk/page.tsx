'use client'

import Link from 'next/link'
import { Space_Grotesk, DM_Sans, DM_Mono } from 'next/font/google'

const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'] })

const blue = '#3b82f6'
const blueGlow = 'rgba(59,130,246,0.15)'
const darkBg = '#040810'
const midBg = '#070d1a'
const cardBg = 'rgba(255,255,255,0.03)'
const border = 'rgba(255,255,255,0.07)'
const borderBlue = 'rgba(59,130,246,0.25)'

const ventures = [
  {
    emoji: '🚗',
    name: 'Tesla, Inc.',
    role: 'CEO & Chief Designer',
    period: '2004 → Present',
    color: '#ef4444',
    tagline: 'Reinvented the car. Twice.',
    points: [
      'Scaled from 0 to 1.8M vehicles/year — without a single TV ad',
      'Supercharger network: 50,000+ stations across 50 countries',
      'Market cap exceeded $800B, surpassing every legacy automaker combined',
    ],
  },
  {
    emoji: '🚀',
    name: 'SpaceX',
    role: 'Founder, CEO & Chief Engineer',
    period: '2002 → Present',
    color: '#8b5cf6',
    tagline: 'Made rockets land themselves.',
    points: [
      'First private company to reach orbit, dock with the ISS, and reuse orbital boosters',
      'Falcon 9: 250+ successful launches, 90%+ booster recovery rate',
      'Starlink: 5,000+ satellites, 2M+ global subscribers',
    ],
  },
  {
    emoji: '🧠',
    name: 'xAI · Grok',
    role: 'Co-Founder & CEO',
    period: '2015 → Present',
    color: '#06b6d4',
    tagline: 'Built an AI that argues back.',
    points: [
      'Founded to develop AI that accelerates scientific discovery',
      'Grok LLM: integrated into X (Twitter) with 600M+ potential users',
      'Raised $6B Series B in 2024 at $50B valuation',
    ],
  },
  {
    emoji: '💳',
    name: 'PayPal (X.com)',
    role: 'Co-Founder & CEO',
    period: '1999 → 2002',
    color: '#10b981',
    tagline: 'Broke the bank. Then sold it.',
    points: [
      'Co-founded the first mainstream online payment platform',
      'Merged with Confinity to form PayPal — sold to eBay for $1.5B',
      'Payout: $165M (Musk\'s cut). Seed capital for SpaceX and Tesla.',
    ],
  },
  {
    emoji: '🧬',
    name: 'Neuralink',
    role: 'Co-Founder',
    period: '2016 → Present',
    color: '#f59e0b',
    tagline: 'Merging humans with computers.',
    points: [
      'Brain-computer interface company targeting paralysis and neurological disorders',
      'First human implant (N1 chip) successfully demonstrated in 2024',
      'Long-term goal: full-bandwidth communication between human brain and AI',
    ],
  },
  {
    emoji: '🌐',
    name: 'X (Twitter)',
    role: 'Owner & CTO',
    period: '2022 → Present',
    color: '#6b7280',
    tagline: 'Bought the internet. Renamed it.',
    points: [
      'Acquired for $44B — most controversial tech deal of the decade',
      'Reduced headcount from 8,000 to ~1,500 while maintaining platform uptime',
      'Transforming into an "everything app" with payments, video, and AI',
    ],
  },
]

const skills = {
  Engineering: ['Rocket propulsion', 'Battery tech', 'Autonomous driving (FSD)', 'Orbital mechanics', 'Neural interfaces'],
  Software: ['C++ (self-taught)', 'Python', 'AI / ML systems', 'Platform architecture', 'OS-level optimization'],
  Leadership: ['First-principles thinking', 'Vertical integration', 'Rapid iteration', 'Public narrative', 'Capital allocation'],
}

export default function ElonMuskPage() {
  return (
    <div className={dmSans.className} style={{ background: darkBg, color: '#e2e8f0', overflowX: 'hidden' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* ── STICKY NAVBAR ── */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(4,8,16,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${border}`,
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={dmMono.className} style={{ fontSize: 13, color: blue, letterSpacing: '0.05em', fontWeight: 500 }}>EM</span>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[['#about', 'About'], ['#ventures', 'Ventures'], ['#skills', 'Skills'], ['#education', 'Education']].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', fontWeight: 500, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e2e8f0')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}
              >{label}</a>
            ))}
            <Link href="/showcase" style={{ fontSize: 12, color: '#374151', textDecoration: 'none' }}>← Showcase</Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center',
        background: `radial-gradient(ellipse at 60% 40%, ${blueGlow}, transparent 60%), ${darkBg}`,
        overflow: 'hidden',
      }}>
        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.4,
          backgroundImage: `linear-gradient(rgba(59,130,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.06) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />
        {/* Glow orb */}
        <div style={{ position: 'absolute', top: '20%', right: '5%', width: 600, height: 600, background: `radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%)`, borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 14px', background: `${blueGlow}`, border: `1px solid ${borderBlue}`, borderRadius: 99, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: blue, display: 'inline-block' }} />
            <span className={dmMono.className} style={{ fontSize: 11, color: blue, letterSpacing: '0.2em' }}>ENTREPRENEUR · ENGINEER · VISIONARY</span>
          </div>

          <h1 className={grotesk.className} style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 700, lineHeight: 0.9, margin: '0 0 32px', letterSpacing: '-0.04em' }}>
            Elon<br />
            <span style={{ color: blue }}>Musk</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 2vw, 1.3rem)', color: '#9ca3af', maxWidth: 560, lineHeight: 1.7, marginBottom: 48, fontWeight: 300 }}>
            He built the world&apos;s most valuable car company without running a single ad.
            Launched rockets that land themselves. Then bought the internet — just to see what would happen.
          </p>

          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[['6', 'Companies Founded'], ['$400B+', 'Peak Net Worth'], ['250+', 'Orbital Launches'], ['2B+', 'Users Reached']].map(([val, label]) => (
              <div key={label} style={{ padding: '16px 24px', background: cardBg, border: `1px solid ${border}`, borderRadius: 12, minWidth: 120 }}>
                <p className={grotesk.className} style={{ fontSize: 28, fontWeight: 700, color: blue, margin: 0, lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 11, color: '#6b7280', margin: '4px 0 0', fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={dmMono.className} style={{ fontSize: 11, color: blue, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 }}>01 / About</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <h2 className={grotesk.className} style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
                Born in Pretoria.<br />
                <span style={{ color: blue }}>Raised by curiosity.</span>
              </h2>
              <blockquote style={{ borderLeft: `3px solid ${blue}`, paddingLeft: 20, margin: '0 0 28px' }}>
                <p className={grotesk.className} style={{ fontSize: 20, color: '#e2e8f0', fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>
                  &ldquo;When something is important enough, you do it even if the odds are not in your favour.&rdquo;
                </p>
              </blockquote>
            </div>
            <div>
              <p style={{ fontSize: 16, color: '#9ca3af', lineHeight: 1.85, marginBottom: 24, fontWeight: 300 }}>
                Born in Pretoria, South Africa, in 1971, Elon Musk taught himself to code at age 10 and sold
                his first video game at 12. He moved to Canada at 17 to study, then to the US where, at 24,
                he co-founded Zip2 — his first startup. The path from suburban South Africa to running six
                companies, owning a social network, and personally engineering orbital rockets is not a
                career path. It&apos;s a force of nature.
              </p>
              <p style={{ fontSize: 16, color: '#9ca3af', lineHeight: 1.85, fontWeight: 300 }}>
                Musk operates by first principles: strip a problem to its physics, ignore convention, rebuild
                from scratch. Applied to rockets, it meant reducing launch costs by 10x. Applied to cars,
                it meant making EVs desirable before making them affordable.
              </p>
              <div style={{ marginTop: 32, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[['Born', 'June 28, 1971'], ['Origin', 'Pretoria, South Africa'], ['Based in', 'Austin, Texas'], ['Languages', 'English, Afrikaans']].map(([k, v]) => (
                  <div key={k} style={{ padding: '12px 16px', background: cardBg, border: `1px solid ${border}`, borderRadius: 8 }}>
                    <p className={dmMono.className} style={{ fontSize: 10, color: '#4b5563', margin: '0 0 2px', letterSpacing: '0.1em' }}>{k}</p>
                    <p style={{ fontSize: 14, color: '#e2e8f0', margin: 0, fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── VENTURES ── */}
      <section id="ventures" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={dmMono.className} style={{ fontSize: 11, color: blue, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 }}>02 / Ventures</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, flexWrap: 'wrap', gap: 16 }}>
            <h2 className={grotesk.className} style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, lineHeight: 1.1, margin: 0, letterSpacing: '-0.02em' }}>
              Six companies.<br />One recurring theme: <span style={{ color: blue }}>the impossible.</span>
            </h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
            {ventures.map((v) => (
              <div
                key={v.name}
                className="group"
                style={{
                  background: cardBg,
                  border: `1px solid ${border}`,
                  borderRadius: 16,
                  padding: '28px 28px 24px',
                  transition: 'all 0.3s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(-4px)'
                  el.style.borderColor = v.color + '50'
                  el.style.boxShadow = `0 20px 48px ${v.color}14`
                  el.style.background = `rgba(255,255,255,0.04)`
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLDivElement
                  el.style.transform = 'translateY(0)'
                  el.style.borderColor = border
                  el.style.boxShadow = 'none'
                  el.style.background = cardBg
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 28 }}>{v.emoji}</span>
                    <div>
                      <p className={grotesk.className} style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0', margin: 0 }}>{v.name}</p>
                      <p style={{ fontSize: 12, color: v.color, margin: '2px 0 0', fontWeight: 500 }}>{v.role}</p>
                    </div>
                  </div>
                  <span className={dmMono.className} style={{ fontSize: 10, color: '#4b5563', whiteSpace: 'nowrap' }}>{v.period}</span>
                </div>
                <p className={grotesk.className} style={{ fontSize: 14, color: '#9ca3af', fontStyle: 'italic', marginBottom: 16, borderBottom: `1px solid ${border}`, paddingBottom: 16 }}>
                  &ldquo;{v.tagline}&rdquo;
                </p>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {v.points.map(pt => (
                    <li key={pt} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                      <span style={{ color: v.color, fontSize: 10, marginTop: 4, flexShrink: 0 }}>▸</span>
                      <span style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.55 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={dmMono.className} style={{ fontSize: 11, color: blue, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 }}>03 / Skills</p>
          <h2 className={grotesk.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 56px', letterSpacing: '-0.02em' }}>
            Self-taught in most of what he does.<br />
            <span style={{ color: '#6b7280' }}>Extraordinarily good at all of it.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {Object.entries(skills).map(([category, items]) => (
              <div key={category}>
                <p className={dmMono.className} style={{ fontSize: 11, color: blue, letterSpacing: '0.2em', marginBottom: 16 }}>{category.toUpperCase()}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {items.map(skill => (
                    <div key={skill} style={{ padding: '10px 14px', background: cardBg, border: `1px solid ${border}`, borderRadius: 8, fontSize: 13, color: '#9ca3af', fontWeight: 400 }}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION & RECOGNITION ── */}
      <section id="education" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={dmMono.className} style={{ fontSize: 11, color: blue, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 20 }}>04 / Education & Recognition</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <h3 className={grotesk.className} style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>Education</h3>
              {[
                { inst: 'University of Pennsylvania', deg: 'B.Sc. Economics (Wharton) & B.Sc. Physics', note: 'Dual degree · Graduated 1995' },
                { inst: 'Stanford University', deg: 'Ph.D. Energy Physics', note: 'Enrolled 1995 — withdrew after 2 days to co-found Zip2' },
                { inst: "Queen's University, Ontario", deg: 'Undergraduate transfer studies', note: '1992–1994 · Physics & Economics' },
              ].map(({ inst, deg, note }) => (
                <div key={inst} style={{ padding: '20px', background: cardBg, border: `1px solid ${border}`, borderRadius: 12, marginBottom: 12 }}>
                  <p className={grotesk.className} style={{ fontSize: 15, fontWeight: 600, color: '#e2e8f0', margin: '0 0 4px' }}>{inst}</p>
                  <p style={{ fontSize: 13, color: blue, margin: '0 0 4px', fontWeight: 500 }}>{deg}</p>
                  <p className={dmMono.className} style={{ fontSize: 11, color: '#4b5563', margin: 0 }}>{note}</p>
                </div>
              ))}
            </div>
            <div>
              <h3 className={grotesk.className} style={{ fontSize: 22, fontWeight: 700, color: '#e2e8f0', marginBottom: 24 }}>Recognition</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  ['Time Person of the Year', '2021'],
                  ['Forbes #1 Richest Person', '2022–2023'],
                  ['Royal Aeronautical Society Gold Medal', '2012'],
                  ['Heinlein Prize for Commercial Space', '2011'],
                  ['FAA Commercial Space Transportation Award', '2010'],
                  ['Axel Springer CEO of the Year', '2020'],
                ].map(([award, year]) => (
                  <div key={award} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', background: cardBg, border: `1px solid ${border}`, borderRadius: 10 }}>
                    <span style={{ fontSize: 13, color: '#9ca3af' }}>{award}</span>
                    <span className={dmMono.className} style={{ fontSize: 11, color: blue }}>{year}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: midBg, borderTop: `1px solid ${border}`, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={dmMono.className} style={{ fontSize: 11, color: '#1f2937' }}>BEONWEB SHOWCASE</span>
          <p style={{ fontSize: 12, color: '#374151' }}>
            Designed by <Link href="/" style={{ color: blue, textDecoration: 'none', fontWeight: 500 }}>BeOnWeb</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
