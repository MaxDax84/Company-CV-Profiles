'use client'

import Link from 'next/link'
import { Oswald, DM_Sans } from 'next/font/google'

const oswald = Oswald({ subsets: ['latin'], weight: ['300', '400', '700'] })
const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500'] })

const red = '#dc2626'
const darkBg = '#000000'
const midBg = '#0a0101'
const cardBg = 'rgba(220,38,38,0.04)'
const border = 'rgba(255,255,255,0.05)'
const borderRed = 'rgba(220,38,38,0.3)'

const chapters = [
  {
    period: '41–22 BBY',
    title: 'The Chosen One',
    org: 'Jedi Order · Coruscant',
    color: '#6366f1',
    tagline: 'A slave boy from Tatooine. The highest midichlorian count ever recorded.',
    points: [
      'Discovered on Tatooine at age 9 by Jedi Master Qui-Gon Jinn — midichlorian count beyond any known Force-user',
      'Trained under Obi-Wan Kenobi, rising to Jedi Knight; led the Republic as a General during the Clone Wars',
      'Haunted by visions of loss — feared the death of those he loved above all else',
    ],
  },
  {
    period: '19 BBY',
    title: 'The Fall',
    org: 'Galactic Senate · Order 66',
    color: red,
    tagline: 'One choice. One night. The Jedi Order ended.',
    points: [
      'Pledged himself to Emperor Palpatine — the Sith lord who had manipulated him for years',
      'Executed Order 66 and led the 501st Legion into the Jedi Temple, killing even the younglings',
      'Reborn as Darth Vader in a suit of black armor — kept alive by life support, rage, and the dark side',
    ],
  },
  {
    period: '19 BBY → 4 ABY',
    title: 'Supreme Commander',
    org: 'Galactic Empire · Imperial Navy',
    color: '#374151',
    tagline: 'Two decades of iron rule. No mercy. No hesitation.',
    points: [
      'Served as the Emperor\'s enforcer — hunting survivors of the Jedi purge across the galaxy',
      'Commanded the Imperial Military with absolute authority; no admiral questioned him twice',
      'Destroyed the planet Alderaan on the Emperor\'s orders. Pursued the Rebel Alliance to the edge of extinction.',
    ],
  },
  {
    period: '4 ABY',
    title: 'The Redemption',
    org: 'Death Star II · Battle of Endor',
    color: '#f59e0b',
    tagline: 'In the end, he was still Anakin Skywalker.',
    points: [
      'Discovered the Rebel Alliance had a son — Luke Skywalker, his own child',
      'Refused to kill him on the Emperor\'s command; struck down Palpatine to save his son',
      'Died in Luke\'s arms as Anakin Skywalker, redeemed — the prophecy fulfilled at last',
    ],
  },
]

const powers = [
  ['Force Choke', 100, red],
  ['Telekinesis', 98, red],
  ['Lightsaber Mastery', 99, '#f59e0b'],
  ['Force Push / Pull', 96, red],
  ['Mind Probe', 94, '#6366f1'],
  ['Precognition', 90, '#6366f1'],
  ['Force Sense', 97, red],
  ['Mechanical Engineering', 88, '#374151'],
]

export default function DarthVaderPage() {
  return (
    <div className={dmSans.className} style={{ background: darkBg, color: '#e5e7eb', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${borderRed}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={oswald.className} style={{ fontSize: 13, color: red, letterSpacing: '0.15em', fontWeight: 700 }}>DV</span>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[['#origins', 'Origins'], ['#chapters', 'Rise & Fall'], ['#power', 'The Force'], ['#legacy', 'Legacy']].map(([href, label]) => (
              <a key={href} href={href} className={oswald.className} style={{ fontSize: 12, color: '#4b5563', textDecoration: 'none', letterSpacing: '0.15em' }}
                onMouseEnter={e => (e.currentTarget.style.color = red)}
                onMouseLeave={e => (e.currentTarget.style.color = '#4b5563')}
              >{label}</a>
            ))}
            <Link href="/showcase" className={oswald.className} style={{ fontSize: 12, color: '#1f2937', textDecoration: 'none', letterSpacing: '0.1em' }}>← SHOWCASE</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* Scanlines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(220,38,38,0.015) 3px, rgba(220,38,38,0.015) 4px)`, pointerEvents: 'none' }} />
        {/* Grid */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(220,38,38,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.04) 1px, transparent 1px)`, backgroundSize: '90px 90px' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: 500, height: 500, background: 'radial-gradient(circle, rgba(220,38,38,0.12), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgba(220,38,38,0.08)', border: `1px solid ${borderRed}`, borderRadius: 99, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: red, display: 'inline-block', animation: 'pulse 2s ease-in-out infinite' }} />
            <span className={oswald.className} style={{ fontSize: 10, color: red, letterSpacing: '0.35em' }}>GALACTIC EMPIRE · IMPERIAL DOSSIER · EYES ONLY</span>
          </div>

          <h1 className={oswald.className} style={{ fontSize: 'clamp(4rem, 12vw, 10rem)', fontWeight: 700, lineHeight: 0.88, margin: '0 0 32px', letterSpacing: '0.05em' }}>
            DARTH<br />
            <span style={{ color: red }}>VADER</span>
          </h1>

          <p className={dmSans.className} style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: '#6b7280', maxWidth: 520, lineHeight: 1.75, marginBottom: 48, fontWeight: 300 }}>
            Once the greatest Jedi who ever lived. Then the monster who hunted them to extinction.
            The same man — separated only by one night, one choice, and the infinite weight of fear.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['MIDI-CHLORIANS', '20,000+', red], ['JEDI KILLED', '50+', '#374151'], ['YEARS OF DARKNESS', '23', '#4b5563'], ['FINAL ACT', 'REDEMPTION', '#f59e0b']].map(([k, v, c]) => (
              <div key={k} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, borderRadius: 8, minWidth: 120 }}>
                <p className={oswald.className} style={{ fontSize: 18, fontWeight: 700, color: c as string, margin: 0, lineHeight: 1, letterSpacing: '0.05em' }}>{v}</p>
                <p className={oswald.className} style={{ fontSize: 9, color: '#374151', margin: '4px 0 0', letterSpacing: '0.2em' }}>{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ORIGINS */}
      <section id="origins" style={{ background: midBg, borderTop: `1px solid ${borderRed}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={oswald.className} style={{ fontSize: 10, color: red, letterSpacing: '0.4em', marginBottom: 20 }}>// 01 ORIGINS</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <h2 className={oswald.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.05, margin: '0 0 32px', letterSpacing: '0.04em' }}>
                BORN A SLAVE.<br /><span style={{ color: red }}>DIED A LEGEND.</span>
              </h2>
              <blockquote style={{ borderLeft: `3px solid ${red}`, paddingLeft: 20 }}>
                <p className={dmSans.className} style={{ fontSize: 17, color: '#d1d5db', fontStyle: 'italic', margin: 0, lineHeight: 1.7, fontWeight: 300 }}>
                  &ldquo;I am not the Jedi I should be. I want more — and I know I shouldn&apos;t.&rdquo;
                </p>
                <p className={dmSans.className} style={{ fontSize: 12, color: '#4b5563', marginTop: 12 }}>— Anakin Skywalker, before the fall</p>
              </blockquote>
            </div>
            <div>
              <p className={dmSans.className} style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.85, marginBottom: 20, fontWeight: 300 }}>
                Born into slavery on Tatooine, Anakin Skywalker was a child prodigy —
                the Force flowing through him at a density never before measured. Discovered by Qui-Gon Jinn,
                he was believed to be the Chosen One, destined to bring balance to the Force.
              </p>
              <p className={dmSans.className} style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.85, fontWeight: 300 }}>
                He became the greatest warrior of his generation. And then, in a single night of terror and grief,
                he became the monster that haunted the galaxy for two decades.
                The prophecy was never wrong — just misunderstood.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RISE & FALL */}
      <section id="chapters" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={oswald.className} style={{ fontSize: 10, color: red, letterSpacing: '0.4em', marginBottom: 20 }}>// 02 RISE & FALL</p>
          <h2 className={oswald.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.05, margin: '0 0 56px', letterSpacing: '0.04em' }}>
            Four chapters.<br /><span style={{ color: red }}>One soul.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {chapters.map((c) => (
              <div key={c.title}
                style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '28px 32px', transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = c.color + '40'; el.style.boxShadow = `0 12px 40px ${c.color}10`; el.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = border; el.style.boxShadow = 'none'; el.style.transform = 'translateX(0)' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
                  <div>
                    <p className={oswald.className} style={{ fontSize: 10, color: c.color, margin: '0 0 6px', letterSpacing: '0.15em' }}>{c.period}</p>
                    <p className={oswald.className} style={{ fontSize: 15, fontWeight: 700, color: '#ffffff', margin: '0 0 4px', letterSpacing: '0.05em' }}>{c.title}</p>
                    <p className={dmSans.className} style={{ fontSize: 12, color: '#374151', margin: '0 0 14px' }}>{c.org}</p>
                    <p className={dmSans.className} style={{ fontSize: 13, color: c.color, fontStyle: 'italic', margin: 0, lineHeight: 1.5 }}>&ldquo;{c.tagline}&rdquo;</p>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {c.points.map(pt => (
                      <li key={pt} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: c.color, fontSize: 10, marginTop: 4, flexShrink: 0 }}>▸</span>
                        <span className={dmSans.className} style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE FORCE */}
      <section id="power" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={oswald.className} style={{ fontSize: 10, color: red, letterSpacing: '0.4em', marginBottom: 20 }}>// 03 FORCE CAPABILITIES</p>
          <h2 className={oswald.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, margin: '0 0 48px', letterSpacing: '0.04em' }}>
            Beyond any<br /><span style={{ color: red }}>known measurement.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {powers.map(([skill, pct, color]) => (
              <div key={skill as string} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, borderRadius: 8, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span className={oswald.className} style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.1em' }}>{skill}</span>
                  <span className={oswald.className} style={{ fontSize: 11, color: color as string, fontWeight: 700 }}>{pct}</span>
                </div>
                <div style={{ height: 2, background: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color as string, borderRadius: 1 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGACY */}
      <section id="legacy" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={oswald.className} style={{ fontSize: 10, color: red, letterSpacing: '0.4em', marginBottom: 20 }}>// 04 LEGACY</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>
            <div>
              <blockquote style={{ borderLeft: `4px solid ${red}`, paddingLeft: 28, margin: 0 }}>
                <p className={oswald.className} style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)', color: '#e5e7eb', margin: 0, lineHeight: 1.4, letterSpacing: '0.03em', fontWeight: 300 }}>
                  &ldquo;I find your lack of faith disturbing.&rdquo;
                </p>
                <p className={dmSans.className} style={{ fontSize: 13, color: '#4b5563', marginTop: 16 }}>— Darth Vader</p>
              </blockquote>
            </div>
            <div>
              <p className={dmSans.className} style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.85, fontWeight: 300 }}>
                Twenty-three years of darkness. Then a single act of love that undid all of it.
                Anakin Skywalker&apos;s legacy is not the millions of deaths he caused —
                it is the prophecy he fulfilled: balance restored, Emperor destroyed,
                a son saved, the Force finally at peace.
              </p>
              <p className={dmSans.className} style={{ fontSize: 15, color: '#6b7280', lineHeight: 1.85, marginTop: 16, fontWeight: 300 }}>
                His name echoes across the galaxy not as Vader, but as the ghost of Anakin
                standing beside Obi-Wan and Yoda — finally free.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: midBg, borderTop: `1px solid ${borderRed}`, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={oswald.className} style={{ fontSize: 10, color: '#1a0000', letterSpacing: '0.25em' }}>IMPERIAL INTELLIGENCE · CLASSIFIED</span>
          <p className={dmSans.className} style={{ fontSize: 12, color: '#374151', margin: 0 }}>Designed by <Link href="/" style={{ color: red, textDecoration: 'none' }}>BeOnWeb</Link></p>
        </div>
      </footer>
    </div>
  )
}
