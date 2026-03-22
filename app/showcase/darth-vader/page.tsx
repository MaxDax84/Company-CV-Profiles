import Link from 'next/link'
import { Oswald } from 'next/font/google'
import type { Metadata } from 'next'

const oswald = Oswald({ subsets: ['latin'], weight: ['300', '400', '700'] })

export const metadata: Metadata = { title: 'Darth Vader — BeOnWeb Showcase' }

export default function DarthVaderPage() {
  const red = '#dc2626'

  return (
    <div className={oswald.className} style={{ minHeight: '100vh', background: '#000000', color: '#cccccc' }}>
      <div style={{ position: 'fixed', inset: 0, backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(220,38,38,0.015) 2px, rgba(220,38,38,0.015) 4px)`, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto', padding: '48px 32px' }}>

        <Link href="/showcase" style={{ fontSize: 12, color: '#4b5563', textDecoration: 'none', letterSpacing: '0.2em' }}>
          ← SHOWCASE
        </Link>

        {/* Imperial header */}
        <div style={{ borderTop: `1px solid ${red}`, borderBottom: `1px solid ${red}`, padding: '40px 0', margin: '48px 0', textAlign: 'center' }}>
          <p style={{ fontSize: 11, letterSpacing: '0.5em', color: red, marginBottom: 24, textTransform: 'uppercase' }}>
            GALACTIC EMPIRE · IMPERIAL PERSONNEL DOSSIER · EYES ONLY
          </p>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, margin: 0, letterSpacing: '0.1em', lineHeight: 1, color: '#ffffff' }}>
            DARTH VADER
          </h1>
          <div style={{ width: 60, height: 2, background: red, margin: '24px auto' }} />
          <p style={{ fontSize: 16, letterSpacing: '0.3em', color: '#666', textTransform: 'uppercase' }}>
            Dark Lord of the Sith · Supreme Commander
          </p>
        </div>

        {/* Identity */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 12, letterSpacing: '0.4em', color: red, marginBottom: 24, borderLeft: `3px solid ${red}`, paddingLeft: 16, textTransform: 'uppercase' }}>
            Identity
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
            {[
              ['Birth Name', 'Anakin Skywalker'],
              ['Birth Date', '41.9 BBY'],
              ['Birthplace', 'Tatooine'],
              ['Current Title', 'Lord Vader'],
              ['Allegiance', 'Galactic Empire'],
              ['Master', 'Emperor Palpatine'],
            ].map(([label, value]) => (
              <div key={label} style={{ padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: 10, color: '#4b5563', letterSpacing: '0.2em', margin: '0 0 4px', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: 15, color: '#e5e7eb', margin: 0, fontWeight: 400 }}>{value}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Service record */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 12, letterSpacing: '0.4em', color: red, marginBottom: 24, borderLeft: `3px solid ${red}`, paddingLeft: 16, textTransform: 'uppercase' }}>
            Service Record
          </h2>
          {[
            ['41–19 BBY', 'Jedi Order', 'Padawan, then Knight, then General. Hero of the Clone Wars. Betrayed order by order of Emperor Palpatine.'],
            ['19 BBY → ABY', 'Galactic Empire', 'Supreme Commander of Imperial Military. Enforcer of the Emperor\'s will. Destroyer of the Jedi Order.'],
            ['0 ABY', 'Battle of Yavin', 'Nearly destroyed Rebel Alliance. Death Star operational. Lost due to Force-sensitive pilot — identified as son.'],
            ['4 ABY', 'Battle of Endor', 'Killed Emperor Palpatine to save son Luke Skywalker. Redeemed. Died shortly after.'],
          ].map(([date, org, desc]) => (
            <div key={org} style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 24, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <p style={{ fontSize: 11, color: red, margin: '0 0 4px', letterSpacing: '0.1em' }}>{date}</p>
                <p style={{ fontSize: 12, color: '#374151', margin: 0, fontWeight: 700, letterSpacing: '0.05em' }}>{org}</p>
              </div>
              <p style={{ fontSize: 14, color: '#6b7280', margin: 0, lineHeight: 1.7, fontWeight: 300 }}>{desc}</p>
            </div>
          ))}
        </section>

        {/* Force abilities */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 12, letterSpacing: '0.4em', color: red, marginBottom: 24, borderLeft: `3px solid ${red}`, paddingLeft: 16, textTransform: 'uppercase' }}>
            Force Capabilities
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {['Force Choke', 'Telekinesis', 'Force Push', 'Lightsaber Combat', 'Mind Probe', 'Foresight'].map(skill => (
              <div key={skill} style={{ padding: '10px 14px', border: `1px solid ${red}20`, background: `${red}05`, borderRadius: 4, fontSize: 12, letterSpacing: '0.05em', color: '#9ca3af', textAlign: 'center' }}>
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Quote */}
        <div style={{ borderLeft: `4px solid ${red}`, paddingLeft: 24, margin: '48px 0' }}>
          <p style={{ fontSize: 20, color: '#e5e7eb', fontWeight: 300, margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>
            &ldquo;I find your lack of faith disturbing.&rdquo;
          </p>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 32, borderTop: `1px solid rgba(255,255,255,0.05)` }}>
          <p style={{ fontSize: 10, color: '#1f2937', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Imperial Intelligence · Designed by <Link href="/" style={{ color: red, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
