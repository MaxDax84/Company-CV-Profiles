import Link from 'next/link'
import { Libre_Baskerville, Source_Serif_4 } from 'next/font/google'
import type { Metadata } from 'next'

const baskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'] })
const sourceSerif = Source_Serif_4({ subsets: ['latin'], weight: ['300', '400', '600'], style: ['normal', 'italic'] })

export const metadata: Metadata = { title: 'Sherlock Holmes — BeOnWeb Showcase' }

export default function SherlockHolmesPage() {
  const amber = '#b8860b'
  const green = '#1a3a2a'
  const cream = '#f5f0e8'

  return (
    <div className={baskerville.className} style={{ minHeight: '100vh', background: '#0d1a15', color: cream }}>
      {/* Decorative top */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${amber}, transparent)` }} />
      <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${amber}60, transparent)`, marginTop: 3 }} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 32px 80px' }}>
        <Link href="/showcase" style={{ fontSize: 12, color: '#5a7060', textDecoration: 'none', letterSpacing: '0.1em' }}>
          ← Showcase
        </Link>

        {/* Header */}
        <div style={{ padding: '56px 0 40px' }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 24 }}>
            <div style={{ flex: 1, height: 1, background: `${amber}40` }} />
            <span style={{ fontSize: 13, color: amber, letterSpacing: '0.4em', textTransform: 'uppercase' }}>221B Baker Street</span>
            <div style={{ flex: 1, height: 1, background: `${amber}40` }} />
          </div>
          <p style={{ fontSize: 12, letterSpacing: '0.3em', color: amber, marginBottom: 20, textTransform: 'uppercase' }}>
            Consulting Detective · London, England
          </p>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, margin: 0, lineHeight: 0.95, color: cream }}>
            Sherlock<br />
            <em style={{ color: amber, fontStyle: 'italic', fontWeight: 400 }}>Holmes</em>
          </h1>
          <p className={sourceSerif.className} style={{ fontSize: 16, color: '#7a9070', marginTop: 20, fontStyle: 'italic', fontWeight: 300 }}>
            &ldquo;The world's only consulting detective.&rdquo;
          </p>
        </div>

        <div style={{ borderTop: `1px solid ${amber}30`, borderBottom: `1px solid ${amber}30`, padding: '32px 0', marginBottom: 48 }}>
          <p className={sourceSerif.className} style={{ fontSize: 18, lineHeight: 1.9, color: '#c4bfb5', fontWeight: 300 }}>
            Born January 6, 1854, in Yorkshire. Educated at Christ Church, Oxford. The first and only
            consulting detective in the world — a self-invented profession. Possesses extraordinary
            powers of observation and logical deduction. Operates from lodgings at 221B Baker Street,
            London. Biographer and associate: Dr. John H. Watson, M.D. Arch-nemesis: Professor
            James Moriarty — deceased, Reichenbach Falls, 1891 (reportedly).
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 48 }}>
          {/* Faculties */}
          <div>
            <h2 style={{ fontSize: 13, letterSpacing: '0.25em', color: amber, marginBottom: 20, textTransform: 'uppercase' }}>
              Notable Faculties
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['Observation', 'Can determine a man\'s profession, travels, and character from a glance at his person.'],
                ['Deduction', 'Logical reasoning from evidence to conclusion with unparalleled precision.'],
                ['Disguise', 'Master of disguise; unrecognised by Watson on multiple occasions.'],
                ['Chemistry', 'Expert in forensic chemistry; maintains a private laboratory at Baker Street.'],
                ['Violin', 'Accomplished violinist; composes original pieces. Often plays during cogitation.'],
                ['Boxing & Baritsu', 'Expert in the Japanese system of wrestling; former bare-knuckle boxer.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ borderLeft: `2px solid ${amber}50`, paddingLeft: 16 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: cream, margin: '0 0 3px' }}>{title}</p>
                  <p className={sourceSerif.className} style={{ fontSize: 13, color: '#7a9070', margin: 0, lineHeight: 1.5, fontWeight: 300 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Notable Cases */}
          <div>
            <h2 style={{ fontSize: 13, letterSpacing: '0.25em', color: amber, marginBottom: 20, textTransform: 'uppercase' }}>
              Notable Cases
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                ['1887', 'A Study in Scarlet', 'First collaboration with Dr. Watson. Jefferson Hope case.'],
                ['1888', 'The Sign of Four', 'Agra treasure recovered. Jonathan Small apprehended.'],
                ['1891', 'The Final Problem', 'Confronted Moriarty at Reichenbach. Both presumed dead.'],
                ['1893', 'The Adventure of the Empty House', 'Return from the Great Hiatus. Colonel Moran arrested.'],
                ['1902', 'The Hound of the Baskervilles', 'Solved the mystery of Grimpen Mire. Stapleton exposed.'],
              ].map(([year, title, desc]) => (
                <div key={title} style={{ paddingBottom: 14, borderBottom: `1px solid ${green}` }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: amber, fontFamily: 'monospace' }}>{year}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: cream }}>{title}</span>
                  </div>
                  <p className={sourceSerif.className} style={{ fontSize: 13, color: '#7a9070', margin: 0, lineHeight: 1.4, fontWeight: 300 }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Known associates */}
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 13, letterSpacing: '0.25em', color: amber, marginBottom: 20, textTransform: 'uppercase' }}>
            Known Associates
          </h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[
              ['Dr. John H. Watson', 'Colleague & Biographer'],
              ['Mrs. Hudson', 'Landlady, 221B'],
              ['Inspector Lestrade', 'Scotland Yard'],
              ['Mycroft Holmes', 'Brother · Government'],
              ['Irene Adler', 'The Woman'],
              ['The Baker Street Irregulars', 'Intelligence Network'],
            ].map(([name, role]) => (
              <div key={name} style={{ padding: '10px 16px', background: `${green}60`, border: `1px solid ${amber}30`, borderRadius: 4 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: cream, margin: '0 0 2px' }}>{name}</p>
                <p className={sourceSerif.className} style={{ fontSize: 11, color: amber, margin: 0, fontStyle: 'italic' }}>{role}</p>
              </div>
            ))}
          </div>
        </section>

        <div style={{ borderTop: `1px solid ${amber}20`, paddingTop: 32, textAlign: 'center' }}>
          <p className={sourceSerif.className} style={{ fontSize: 12, color: '#3d5046', letterSpacing: '0.1em', fontStyle: 'italic' }}>
            Designed by <Link href="/" style={{ color: amber, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
