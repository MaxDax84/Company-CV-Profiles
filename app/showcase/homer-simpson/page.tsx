'use client'

import Link from 'next/link'
import { Lilita_One, Nunito } from 'next/font/google'

const lilita = Lilita_One({ subsets: ['latin'], weight: ['400'] })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'] })

const yellow = '#fbbf24'
const blue = '#1d4ed8'
const orange = '#f97316'
const darkBlue = '#1e3a8a'

const adventures = [
  {
    emoji: '☢️',
    title: 'Nuclear Safety Inspector',
    org: 'Springfield Nuclear Power Plant · 1989 → Now',
    color: orange,
    desc: 'Sector 7-G. Responsible for preventing meltdown. Has caused 3 near-meltdowns. Fired 27 times. Rehired 27 times. Mr. Burns gave up.',
  },
  {
    emoji: '🚀',
    title: 'NASA Astronaut',
    org: 'Kennedy Space Center · 1994',
    color: blue,
    desc: 'Selected as the average American for a space mission. Caused chaos in zero gravity. Ate all the food. Still counts it on his resume.',
  },
  {
    emoji: '🎤',
    title: 'Country Music Singer',
    org: 'Capitol Records · "Homer in the House"',
    color: yellow,
    desc: 'Brief but passionate music career. One hit single. Briefly famous. Immediately forgotten. No regrets.',
  },
  {
    emoji: '🥊',
    title: 'Professional Boxer',
    org: 'Springfield Boxing Commission · 1997',
    color: orange,
    desc: 'Managed by Moe Szyslak. Won by sheer ability to absorb punishment. Faced Drederick Tatum. Did not win. Did not quit.',
  },
  {
    emoji: '🎮',
    title: 'Food Critic & Various',
    org: 'Springfield Shopper / Multiple Employers',
    color: blue,
    desc: 'Positive reviews only. Grease recycling entrepreneur. Snowplow operator. Mayor\'s aide. The list goes on. It always goes on.',
  },
]

export default function HomerSimpsonPage() {
  return (
    <div className={nunito.className} style={{ background: '#fffbeb', color: '#1e293b', overflowX: 'hidden' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: yellow, borderBottom: `3px solid ${blue}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={lilita.className} style={{ fontSize: 18, color: blue, letterSpacing: '0.05em' }}>HJ</span>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {[['#story', 'The Story'], ['#adventures', 'Adventures'], ['#family', 'Family'], ['#passions', 'Passions']].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: darkBlue, textDecoration: 'none', fontWeight: 700 }}
                onMouseEnter={e => (e.currentTarget.style.color = blue)}
                onMouseLeave={e => (e.currentTarget.style.color = darkBlue)}
              >{label}</a>
            ))}
            <Link href="/showcase" style={{ fontSize: 13, color: '#92400e', textDecoration: 'none', fontWeight: 700 }}>← Showcase</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ background: yellow, minHeight: '80vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', borderBottom: `4px solid ${blue}` }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `radial-gradient(circle at 80% 50%, rgba(29,78,216,0.08), transparent 50%)` }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: 'rgba(29,78,216,0.1)', border: `2px solid ${blue}`, borderRadius: 99, marginBottom: 28 }}>
            <span>🍩</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: blue, letterSpacing: '0.2em' }}>SPRINGFIELD NUCLEAR POWER PLANT · EMPLOYEE OF THE MONTH (ONCE)</span>
          </div>
          <h1 className={lilita.className} style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', color: blue, lineHeight: 0.88, margin: '0 0 24px', letterSpacing: '-0.01em' }}>
            HOMER J.<br />SIMPSON
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.25rem)', color: darkBlue, maxWidth: 540, lineHeight: 1.75, marginBottom: 48, fontWeight: 600 }}>
            Nuclear safety inspector. Amateur astronaut. Part-time genius.
            Full-time husband and father. Springfield&apos;s most loveable disaster —
            and the heart of the best family on television.
          </p>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {[['🍩', 'DONUTS TODAY', '∞'], ['🍺', 'DUFF BEERS', '∞'], ['💥', 'NEAR MELTDOWNS', '17'], ['❤️', 'KIDS', '3']].map(([icon, k, v]) => (
              <div key={k} style={{ padding: '14px 20px', background: 'white', border: `3px solid ${blue}`, borderRadius: 16, boxShadow: `4px 4px 0 ${blue}`, minWidth: 110, textAlign: 'center' }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{icon}</div>
                <p className={lilita.className} style={{ fontSize: 22, color: blue, margin: 0, lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 9, color: '#94a3b8', margin: '4px 0 0', fontWeight: 800, letterSpacing: '0.12em' }}>{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE STORY */}
      <section id="story" style={{ background: 'white', borderBottom: `3px solid ${yellow}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: orange, letterSpacing: '0.25em', marginBottom: 16 }}>// 01 THE SPRINGFIELD STORY</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <h2 className={lilita.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: blue, lineHeight: 1.05, margin: '0 0 28px' }}>
                Not the smartest.<br />
                <span style={{ color: orange }}>But the most alive.</span>
              </h2>
              <div style={{ background: yellow, borderRadius: 16, padding: 24, border: `3px solid ${blue}`, boxShadow: `4px 4px 0 ${blue}` }}>
                <p className={lilita.className} style={{ fontSize: 20, color: blue, margin: '0 0 8px' }}>&ldquo;D&apos;oh!&rdquo;</p>
                <p style={{ fontSize: 13, color: '#92400e', margin: 0, fontWeight: 700 }}>— Homer J. Simpson, approximately 4,000 times per season</p>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.85, marginBottom: 16, fontWeight: 400 }}>
                Born May 12, 1956 in Springfield — a city with no confirmed state. Raised by Mona and Abraham Simpson,
                Homer attended Springfield High School and graduated despite losing a significant portion of his brain function
                to a crayon lodged in his nasal cavity.
              </p>
              <p style={{ fontSize: 15, color: '#475569', lineHeight: 1.85, fontWeight: 400 }}>
                He met Marge Bouvier at a school detention. They have been inseparable ever since —
                a love story that has survived unemployment, alien abductions, a brief stint as a mafia boss,
                and one too many trips to Moe&apos;s Tavern. Homer is, against all odds, irreplaceable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ADVENTURES */}
      <section id="adventures" style={{ background: '#fef9c3', borderBottom: `3px solid ${yellow}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: orange, letterSpacing: '0.25em', marginBottom: 16 }}>// 02 ADVENTURES & CAREERS</p>
          <h2 className={lilita.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: blue, lineHeight: 1.05, margin: '0 0 48px' }}>
            He has done it all.<br />
            <span style={{ color: orange }}>Usually by accident.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {adventures.map((a) => (
              <div key={a.title}
                style={{ background: 'white', border: `3px solid ${yellow}`, borderRadius: 16, padding: '24px 28px', display: 'grid', gridTemplateColumns: '64px 1fr', gap: 20, alignItems: 'center', transition: 'all 0.2s ease', cursor: 'default', boxShadow: `3px 3px 0 ${yellow}` }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = a.color; el.style.boxShadow = `4px 4px 0 ${a.color}`; el.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = yellow; el.style.boxShadow = `3px 3px 0 ${yellow}`; el.style.transform = 'translateY(0)' }}
              >
                <div style={{ fontSize: 36, textAlign: 'center' }}>{a.emoji}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 4 }}>
                    <p className={lilita.className} style={{ fontSize: 16, color: blue, margin: 0 }}>{a.title}</p>
                    <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700 }}>{a.org}</p>
                  </div>
                  <p style={{ fontSize: 14, color: '#475569', margin: 0, lineHeight: 1.6 }}>{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAMILY */}
      <section id="family" style={{ background: 'white', borderBottom: `3px solid ${yellow}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: orange, letterSpacing: '0.25em', marginBottom: 16 }}>// 03 THE SIMPSONS</p>
          <h2 className={lilita.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: blue, lineHeight: 1.05, margin: '0 0 48px' }}>
            742 Evergreen Terrace.<br />
            <span style={{ color: orange }}>The best address in Springfield.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
            {[
              { emoji: '💙', name: 'Marge Simpson', desc: 'The heart of the family. Extraordinarily patient. Somehow still in love with Homer after 35 years.', color: blue },
              { emoji: '😈', name: 'Bart Simpson', desc: 'Underachiever and proud of it. 4th grade. Expert slingshot operator. Homer\'s son in every way.', color: orange },
              { emoji: '📚', name: 'Lisa Simpson', desc: '8 years old. Saxophone virtuoso. Future president. Morally the most evolved person in Springfield.', color: '#7c3aed' },
              { emoji: '🍼', name: 'Maggie Simpson', desc: 'Baby. Pacifier. Shot Mr. Burns once. Has never spoken. May be the most competent Simpson.', color: '#ec4899' },
            ].map(m => (
              <div key={m.name} style={{ background: '#fffbeb', border: `3px solid ${yellow}`, borderRadius: 20, padding: 24, textAlign: 'center', boxShadow: `4px 4px 0 ${yellow}` }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>{m.emoji}</div>
                <p className={lilita.className} style={{ fontSize: 16, color: m.color, margin: '0 0 8px' }}>{m.name}</p>
                <p style={{ fontSize: 13, color: '#475569', margin: 0, lineHeight: 1.6 }}>{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PASSIONS */}
      <section id="passions" style={{ background: yellow, borderTop: `3px solid ${blue}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: darkBlue, letterSpacing: '0.25em', marginBottom: 16 }}>// 04 CORE PASSIONS</p>
          <h2 className={lilita.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: blue, lineHeight: 1.05, margin: '0 0 48px' }}>
            Simple pleasures.<br />
            <span style={{ color: darkBlue }}>Infinite enthusiasm.</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
            {[
              { icon: '🍩', label: 'Donuts', note: 'Pink frosted, sprinkles' },
              { icon: '🍺', label: 'Duff Beer', note: "Moe's Tavern, booth #2" },
              { icon: '📺', label: 'Television', note: 'Any channel, any time' },
              { icon: '🎳', label: 'Bowling', note: 'Pin Pals team captain' },
              { icon: '🛋️', label: 'Napping', note: '3x daily, incl. at work' },
              { icon: '🥩', label: 'BBQ', note: 'Host of the year, always' },
            ].map(p => (
              <div key={p.label} style={{ background: 'white', border: `3px solid ${blue}`, borderRadius: 16, padding: '20px 16px', textAlign: 'center', boxShadow: `4px 4px 0 ${blue}` }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>{p.icon}</div>
                <p className={lilita.className} style={{ fontSize: 15, color: blue, margin: '0 0 4px' }}>{p.label}</p>
                <p style={{ fontSize: 12, color: '#94a3b8', margin: 0, fontWeight: 700 }}>{p.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer style={{ background: blue, borderTop: `3px solid ${darkBlue}`, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={lilita.className} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em' }}>🍩 SPRINGFIELD, USA</span>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 700 }}>Designed by <Link href="/" style={{ color: yellow, textDecoration: 'none' }}>BeOnWeb</Link></p>
        </div>
      </footer>
    </div>
  )
}
