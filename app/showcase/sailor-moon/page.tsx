import Link from 'next/link'
import { Nunito } from 'next/font/google'
import type { Metadata } from 'next'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800', '900'] })

export const metadata: Metadata = { title: 'Sailor Moon — GoOnWeb Showcase' }

export default function SailorMoonPage() {
  const pink = '#e91e8c'
  const lightPink = '#ff69b4'
  const gold = '#ffd700'

  return (
    <div className={nunito.className} style={{ minHeight: '100vh', background: '#fff5fb', color: '#4a2040' }}>
      {/* Rainbow top border */}
      <div style={{ height: 5, background: `linear-gradient(90deg, #ff69b4, #ff99cc, #ffd700, #c9b8ff, #ff69b4)` }} />

      {/* Stars decoration */}
      <div style={{ textAlign: 'center', fontSize: 20, padding: '20px 0 0', color: lightPink, letterSpacing: 8 }}>
        ★ ✦ ✧ ★ ✦ ✧ ★ ✦ ✧ ★
      </div>

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '24px 24px 64px' }}>
        <Link href="/showcase" style={{ fontSize: 13, color: '#c078a0', textDecoration: 'none', fontWeight: 700 }}>
          ← Back to Showcase
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '32px 0 40px' }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>🌙</div>
          <p style={{ fontSize: 12, fontWeight: 800, letterSpacing: '0.25em', color: pink, textTransform: 'uppercase', marginBottom: 12 }}>
            Pretty Guardian
          </p>
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 900, margin: 0, color: pink, lineHeight: 1.1 }}>
            Sailor Moon
          </h1>
          <p style={{ fontSize: 18, color: '#c07898', marginTop: 8, fontWeight: 600 }}>
            Usagi &ldquo;Bunny&rdquo; Tsukino · Neo Queen Serenity
          </p>
          <div style={{ display: 'inline-block', margin: '16px auto 0', padding: '8px 20px', background: `${pink}15`, border: `2px solid ${pink}40`, borderRadius: 24, fontSize: 13, color: pink, fontWeight: 700 }}>
            ♋ Cancer · Born 30 June · Azabu-Juban, Tokyo
          </div>
        </div>

        {/* About */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 24, boxShadow: '0 4px 24px rgba(233,30,140,0.08)', border: `1px solid ${lightPink}30` }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: pink, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            ✨ About Me
          </h2>
          <p style={{ lineHeight: 1.8, color: '#6b4060', fontSize: 15 }}>
            Hi! I&apos;m Usagi Tsukino, a 14-year-old middle school student at Juban Municipal Junior High School
            in Tokyo — and secretly, I&apos;m Sailor Moon, the Pretty Guardian of Love and Justice! 🌙
            I was a normal crybaby girl until Luna appeared and told me my true destiny as protector of Earth.
            Together with my fellow Sailor Guardians and Tuxedo Mask, I fight to protect the world from evil forces.
            My dream is to become Neo Queen Serenity and bring about Crystal Tokyo — a utopia of peace and love 💫
          </p>
        </div>

        {/* Powers & Skills */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 24px rgba(233,30,140,0.08)', border: `1px solid ${lightPink}30` }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: pink, marginBottom: 16 }}>⚡ Powers</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                ['🌙', 'Moon Tiara Action'],
                ['🌸', 'Moon Prism Power'],
                ['💖', 'Moon Crystal Power'],
                ['⭐', 'Cosmic Heart'],
                ['🌟', 'Eternal Sailor Moon'],
              ].map(([icon, power]) => (
                <div key={power} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: `${pink}08`, borderRadius: 12 }}>
                  <span>{icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#7b3060' }}>{power}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: 20, padding: 24, boxShadow: '0 4px 24px rgba(233,30,140,0.08)', border: `1px solid ${lightPink}30` }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, color: pink, marginBottom: 16 }}>💕 Stats</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[['Courage', 92], ['Friendship', 100], ['Love', 100], ['Grades', 28], ['Punctuality', 12]].map(([stat, val]) => (
                <div key={stat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#7b3060' }}>{stat}</span>
                    <span style={{ fontSize: 12, color: pink, fontWeight: 700 }}>{val}</span>
                  </div>
                  <div style={{ height: 6, background: '#fce7f3', borderRadius: 3 }}>
                    <div style={{ width: `${val}%`, height: '100%', background: `linear-gradient(90deg, ${lightPink}, ${pink})`, borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Team */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 24, boxShadow: '0 4px 24px rgba(233,30,140,0.08)', border: `1px solid ${lightPink}30` }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: pink, marginBottom: 20 }}>👯 Sailor Team</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[['🔥', 'Sailor Mars', 'Rei Hino'], ['💧', 'Sailor Mercury', 'Ami Mizuno'], ['⚡', 'Sailor Jupiter', 'Makoto Kino'], ['💛', 'Sailor Venus', 'Minako Aino'], ['🌿', 'Sailor Pluto', 'Setsuna Meiou']].map(([icon, sailor, name]) => (
              <div key={sailor} style={{ padding: '10px 16px', background: `${pink}08`, border: `1px solid ${pink}20`, borderRadius: 14, textAlign: 'center' }}>
                <div style={{ fontSize: 20 }}>{icon}</div>
                <div style={{ fontSize: 12, fontWeight: 800, color: pink, marginTop: 4 }}>{sailor}</div>
                <div style={{ fontSize: 11, color: '#c078a0' }}>{name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div style={{ textAlign: 'center', padding: '24px', background: `linear-gradient(135deg, ${pink}15, ${gold}15)`, borderRadius: 20, border: `2px solid ${pink}25` }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: pink, margin: 0, lineHeight: 1.6 }}>
            &ldquo;In the name of the Moon, I will punish you!&rdquo; 🌙✨
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <p style={{ fontSize: 12, color: '#d4a0c0' }}>
            Designed with 💕 by <Link href="/" style={{ color: pink, textDecoration: 'none', fontWeight: 700 }}>GoOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
