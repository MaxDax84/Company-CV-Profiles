'use client'

import Link from 'next/link'
import { Space_Grotesk, DM_Sans, DM_Mono } from 'next/font/google'

const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'] })

const blue = '#3b82f6'
const darkBg = '#040810'
const sidebarBg = '#06091a'
const border = 'rgba(255,255,255,0.07)'
const borderBlue = 'rgba(59,130,246,0.22)'
const cardBg = 'rgba(255,255,255,0.03)'

const ventures = [
  { emoji: '🚗', name: 'Tesla', role: 'CEO & Chief Designer', period: '2004→', color: '#ef4444', tagline: 'Reinvented the car. Twice.', points: ['Scaled 0→1.8M vehicles/year without a single TV ad', 'Supercharger network: 50,000+ stations across 50 countries', 'Market cap exceeded $800B — every legacy automaker combined'] },
  { emoji: '🚀', name: 'SpaceX', role: 'Founder, CEO & Chief Engineer', period: '2002→', color: '#8b5cf6', tagline: 'Made rockets land themselves.', points: ['First private company to orbit, ISS-dock, and reuse orbital boosters', 'Falcon 9: 250+ launches, 90%+ booster recovery rate', 'Starlink: 5,000+ satellites, 2M+ global subscribers'] },
  { emoji: '🧠', name: 'xAI · Grok', role: 'Founder & CEO', period: '2015→', color: '#06b6d4', tagline: 'Built an AI that argues back.', points: ['Developing AI to accelerate scientific discovery', 'Grok LLM integrated into X — 600M+ potential users', 'Raised $6B Series B at $50B valuation (2024)'] },
  { emoji: '💳', name: 'PayPal (X.com)', role: 'Co-Founder & CEO', period: '1999–2002', color: '#10b981', tagline: 'Broke the bank. Then sold it.', points: ['First mainstream online payment platform', 'Merged with Confinity to form PayPal; sold to eBay for $1.5B', '$165M payout — seed capital for SpaceX and Tesla'] },
  { emoji: '🧬', name: 'Neuralink', role: 'Co-Founder', period: '2016→', color: '#f59e0b', tagline: 'Merging humans with computers.', points: ['Brain-computer interface for paralysis and neurological disorders', 'First human N1 chip implant successfully demonstrated (2024)', 'Goal: full-bandwidth brain-to-AI communication'] },
  { emoji: '🌐', name: 'X (Twitter)', role: 'Owner & CTO', period: '2022→', color: '#6b7280', tagline: 'Bought the internet. Renamed it.', points: ['Acquired for $44B — most controversial tech deal of the decade', 'Reduced headcount 8,000→1,500 while maintaining uptime', 'Transforming into an "everything app" with payments, video, AI'] },
]

const navItems = [['#overview', 'Overview'], ['#ventures', 'Ventures'], ['#skills', 'Skills'], ['#education', 'Education']]

const metrics = [['6', 'Companies founded'], ['$400B+', 'Peak net worth'], ['250+', 'Orbital launches'], ['2B+', 'Users reached']]

export default function ElonMuskPage() {
  return (
    <div className={dmSans.className} style={{ minHeight: '100vh', background: darkBg, color: '#e2e8f0', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(59,130,246,0.3); border-radius: 2px; }

        .em-layout { display: flex; }
        .em-sidebar {
          position: fixed; left: 0; top: 0; width: 256px; height: 100vh;
          background: ${sidebarBg}; border-right: 1px solid ${border};
          display: flex; flex-direction: column; padding: 36px 28px 28px;
          z-index: 100; overflow-y: auto;
        }
        .em-main { margin-left: 256px; flex: 1; }
        .em-info-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-width: 680px; }
        .em-ventures-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .em-skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; }
        .em-edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
        .em-back-mobile { display: none; font-size: 10px; color: #374151; text-decoration: none; letter-spacing: 0.15em; margin-bottom: 44px; }

        @media (max-width: 860px) {
          .em-sidebar { position: static; width: 100%; height: auto; border-right: none; border-bottom: 1px solid ${border}; flex-direction: row; flex-wrap: wrap; padding: 20px 24px; gap: 20px; }
          .em-main { margin-left: 0; }
          .em-layout { flex-direction: column; }
          .em-ventures-grid { grid-template-columns: 1fr !important; }
          .em-skills-grid { grid-template-columns: 1fr 1fr !important; gap: 24px !important; }
          .em-edu-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .em-back-mobile { display: block; }
        }
        .em-section { padding: 60px 64px; }
        .em-section-first { padding: 72px 64px 60px; }

        @media (max-width: 860px) {
          .em-section { padding: 48px 32px !important; }
          .em-section-first { padding: 48px 32px !important; }
        }
        @media (max-width: 600px) {
          .em-info-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .em-skills-grid { grid-template-columns: 1fr !important; }
          .em-sidebar { padding: 16px 20px !important; }
          .em-section { padding: 36px 20px !important; }
          .em-section-first { padding: 36px 20px !important; }
        }
      `}</style>

      <div className="em-layout">

        {/* ── SIDEBAR ── */}
        <aside className="em-sidebar">
          <Link href="/showcase" className={`em-back-mobile ${dmMono.className}`} style={{ fontSize: 10, color: '#374151', textDecoration: 'none', letterSpacing: '0.15em' }}>← SHOWCASE</Link>

          {/* Identity */}
          <div style={{ marginBottom: 44 }}>
            <p className={dmMono.className} style={{ fontSize: 9, color: blue, letterSpacing: '0.25em', margin: '0 0 6px' }}>ELON REEVE</p>
            <p className={grotesk.className} style={{ fontSize: 30, fontWeight: 700, lineHeight: 1, color: '#ffffff', letterSpacing: '-0.02em', margin: '0 0 8px' }}>MUSK</p>
            <p className={dmMono.className} style={{ fontSize: 9, color: '#374151', letterSpacing: '0.15em', margin: 0 }}>CEO · ENGINEER · FOUNDER</p>
          </div>

          {/* Nav */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 44 }}>
            <p className={dmMono.className} style={{ fontSize: 9, color: '#1f2937', letterSpacing: '0.2em', margin: '0 0 10px' }}>NAVIGATION</p>
            {navItems.map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: '#4b5563', textDecoration: 'none', padding: '7px 10px', borderRadius: 6, fontWeight: 500 }}
                onMouseEnter={e => { e.currentTarget.style.color = '#e2e8f0'; e.currentTarget.style.background = 'rgba(59,130,246,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#4b5563'; e.currentTarget.style.background = 'transparent' }}
              >{label}</a>
            ))}
          </nav>

          {/* Metrics */}
          <div style={{ marginBottom: 'auto' }}>
            <p className={dmMono.className} style={{ fontSize: 9, color: '#1f2937', letterSpacing: '0.2em', margin: '0 0 14px' }}>KEY METRICS</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {metrics.map(([val, label]) => (
                <div key={label} style={{ padding: '12px 0', borderBottom: `1px solid ${border}` }}>
                  <p className={grotesk.className} style={{ fontSize: 22, fontWeight: 700, color: blue, margin: '0 0 2px', lineHeight: 1 }}>{val}</p>
                  <p style={{ fontSize: 11, color: '#374151', margin: 0 }}>{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 20, marginTop: 24 }}>
            <p style={{ fontSize: 11, color: '#1f2937', margin: 0, lineHeight: 1.6 }}>
              Austin, Texas<br />x.com/@elonmusk
            </p>
            <p style={{ fontSize: 11, color: '#1f2937', margin: '12px 0 0' }}>
              Designed by <Link href="/" style={{ color: blue, textDecoration: 'none' }}>BeOnWeb</Link>
            </p>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="em-main">

          {/* Overview */}
          <section id="overview" className="em-section-first" style={{ borderBottom: `1px solid ${border}`, background: `radial-gradient(ellipse at 80% 30%, rgba(59,130,246,0.06), transparent 55%)` }}>
            <p className={dmMono.className} style={{ fontSize: 10, color: blue, letterSpacing: '0.3em', margin: '0 0 28px' }}>// OVERVIEW</p>
            <h1 className={grotesk.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.05, margin: '0 0 28px', letterSpacing: '-0.03em', maxWidth: 700 }}>
              Born in Pretoria.<br />
              <span style={{ color: blue }}>Raised by curiosity.</span>
            </h1>
            <blockquote style={{ borderLeft: `2px solid ${borderBlue}`, paddingLeft: 20, margin: '0 0 28px' }}>
              <p className={grotesk.className} style={{ fontSize: 18, color: '#9ca3af', fontStyle: 'italic', margin: 0, lineHeight: 1.55 }}>
                &ldquo;When something is important enough, you do it even if the odds are not in your favour.&rdquo;
              </p>
            </blockquote>
            <p style={{ fontSize: 16, color: '#6b7280', lineHeight: 1.85, maxWidth: 680, fontWeight: 300, marginBottom: 40 }}>
              Born in Pretoria in 1971, self-taught coder at 10, first startup co-founder at 24.
              From suburban South Africa to running six companies, owning a social network,
              and personally engineering orbital rockets — not a career path. A force of nature.
              He operates by first principles: strip to physics, ignore convention, rebuild from scratch.
            </p>
            <div className="em-info-grid">
              {[['Born', 'June 28, 1971'], ['Origin', 'Pretoria, SA'], ['Based in', 'Austin, TX'], ['Languages', 'EN · AF']].map(([k, v]) => (
                <div key={k} style={{ padding: '12px 16px', background: cardBg, border: `1px solid ${border}`, borderRadius: 8 }}>
                  <p className={dmMono.className} style={{ fontSize: 9, color: '#374151', margin: '0 0 3px', letterSpacing: '0.12em' }}>{k}</p>
                  <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, fontWeight: 500 }}>{v}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Ventures */}
          <section id="ventures" className="em-section" style={{ borderBottom: `1px solid ${border}` }}>
            <p className={dmMono.className} style={{ fontSize: 10, color: blue, letterSpacing: '0.3em', margin: '0 0 10px' }}>// VENTURES</p>
            <h2 className={grotesk.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 700, margin: '0 0 40px', letterSpacing: '-0.02em' }}>
              Six companies. One theme: <span style={{ color: blue }}>the impossible.</span>
            </h2>
            <div className="em-ventures-grid">
              {ventures.map((v) => (
                <div key={v.name}
                  style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '22px 24px', transition: 'all 0.25s ease', cursor: 'default' }}
                  onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = v.color + '44'; el.style.boxShadow = `0 16px 40px ${v.color}10`; el.style.transform = 'translateY(-3px)'; el.style.background = 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = border; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; el.style.background = cardBg }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ fontSize: 22 }}>{v.emoji}</span>
                      <div>
                        <p className={grotesk.className} style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: 0 }}>{v.name}</p>
                        <p style={{ fontSize: 11, color: v.color, margin: '2px 0 0', fontWeight: 500 }}>{v.role}</p>
                      </div>
                    </div>
                    <span className={dmMono.className} style={{ fontSize: 10, color: '#374151' }}>{v.period}</span>
                  </div>
                  <p style={{ fontSize: 13, color: '#9ca3af', fontStyle: 'italic', margin: '0 0 12px', paddingBottom: 12, borderBottom: `1px solid ${border}` }}>&ldquo;{v.tagline}&rdquo;</p>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {v.points.map(pt => (
                      <li key={pt} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <span style={{ color: v.color, fontSize: 9, marginTop: 4, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 12, color: '#6b7280', lineHeight: 1.55 }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section id="skills" className="em-section" style={{ borderBottom: `1px solid ${border}`, background: 'rgba(255,255,255,0.01)' }}>
            <p className={dmMono.className} style={{ fontSize: 10, color: blue, letterSpacing: '0.3em', margin: '0 0 10px' }}>// SKILLS</p>
            <h2 className={grotesk.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 700, margin: '0 0 40px', letterSpacing: '-0.02em' }}>
              Self-taught in most of it. <span style={{ color: '#6b7280' }}>Extraordinarily good at all of it.</span>
            </h2>
            <div className="em-skills-grid">
              {([['Engineering', ['Rocket propulsion', 'Battery tech', 'Autonomous driving (FSD)', 'Orbital mechanics', 'Neural interfaces']], ['Software', ['C++ (self-taught)', 'Python', 'AI / ML systems', 'Platform architecture', 'OS-level optimization']], ['Leadership', ['First-principles thinking', 'Vertical integration', 'Rapid iteration', 'Public narrative', 'Capital allocation']]] as [string, string[]][]).map(([cat, items]) => (
                <div key={cat}>
                  <p className={dmMono.className} style={{ fontSize: 10, color: blue, letterSpacing: '0.2em', margin: '0 0 16px' }}>{cat.toUpperCase()}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {items.map(s => (
                      <span key={s} style={{ fontSize: 12, padding: '6px 12px', background: cardBg, border: `1px solid ${border}`, borderRadius: 99, color: '#9ca3af' }}>{s}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education & Recognition */}
          <section id="education" className="em-section" style={{ paddingBottom: 80 }}>
            <p className={dmMono.className} style={{ fontSize: 10, color: blue, letterSpacing: '0.3em', margin: '0 0 10px' }}>// EDUCATION & RECOGNITION</p>
            <h2 className={grotesk.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 700, margin: '0 0 40px', letterSpacing: '-0.02em' }}>
              Dropped out of Stanford. <span style={{ color: blue }}>After two days.</span>
            </h2>
            <div className="em-edu-grid">
              <div>
                <p className={dmMono.className} style={{ fontSize: 9, color: '#374151', letterSpacing: '0.15em', margin: '0 0 16px' }}>ACADEMIC</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { inst: 'University of Pennsylvania', deg: 'B.Sc. Economics (Wharton) & B.Sc. Physics', note: 'Dual degree · 1995' },
                    { inst: 'Stanford University', deg: 'Ph.D. Energy Physics', note: 'Enrolled 1995 — withdrew after 2 days to co-found Zip2' },
                    { inst: "Queen's University, Ontario", deg: 'Transfer studies — Physics & Economics', note: '1992–1994' },
                  ].map(({ inst, deg, note }) => (
                    <div key={inst} style={{ padding: '16px 18px', background: cardBg, border: `1px solid ${border}`, borderRadius: 10 }}>
                      <p className={grotesk.className} style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: '0 0 3px' }}>{inst}</p>
                      <p style={{ fontSize: 12, color: blue, margin: '0 0 3px' }}>{deg}</p>
                      <p className={dmMono.className} style={{ fontSize: 10, color: '#374151', margin: 0 }}>{note}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className={dmMono.className} style={{ fontSize: 9, color: '#374151', letterSpacing: '0.15em', margin: '0 0 16px' }}>RECOGNITION</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[['Time Person of the Year', '2021'], ['Forbes #1 Richest Person', '2022–23'], ['Royal Aeronautical Society Gold Medal', '2012'], ['Heinlein Prize for Commercial Space', '2011'], ['FAA Commercial Space Award', '2010'], ['Axel Springer CEO of the Year', '2020']].map(([award, year]) => (
                    <div key={award} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: cardBg, border: `1px solid ${border}`, borderRadius: 8 }}>
                      <span style={{ fontSize: 13, color: '#9ca3af' }}>{award}</span>
                      <span className={dmMono.className} style={{ fontSize: 10, color: blue, flexShrink: 0, marginLeft: 12 }}>{year}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}
