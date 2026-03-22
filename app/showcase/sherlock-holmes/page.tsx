'use client'

import Link from 'next/link'
import { Libre_Baskerville, Source_Serif_4 } from 'next/font/google'

const baskerville = Libre_Baskerville({ subsets: ['latin'], weight: ['400', '700'], style: ['normal', 'italic'] })
const sourceSerif = Source_Serif_4({ subsets: ['latin'], weight: ['300', '400', '600'], style: ['normal', 'italic'] })

const amber = '#b8860b'
const amberLight = '#d4a017'
const darkBg = '#080f0c'
const midBg = '#0d1710'
const cardBg = 'rgba(184,134,11,0.04)'
const border = 'rgba(255,255,255,0.06)'
const borderAmber = 'rgba(184,134,11,0.25)'

const cases = [
  { year: '1887', title: 'A Study in Scarlet', type: 'Murder Investigation', outcome: 'SOLVED', note: 'First published case. First meeting with Dr. Watson. Jefferson Hope arrested after ingenious trap at 221B.' },
  { year: '1888', title: 'The Sign of Four', type: 'Theft & Murder', outcome: 'SOLVED', note: 'The Agra treasure recovered. Jonathan Small apprehended on the Thames. Miss Mary Morstan engaged to Watson.' },
  { year: '1891', title: 'The Final Problem', type: 'Criminal Mastermind', outcome: 'PYRRHIC', note: 'Confrontation with Professor Moriarty at Reichenbach Falls. Both presumed dead. Holmes survived in secret.' },
  { year: '1893', title: 'The Empty House', type: 'Return & Murder', outcome: 'SOLVED', note: 'Return from the Great Hiatus. Colonel Moran — Moriarty\'s top assassin — apprehended at 221B.' },
  { year: '1902', title: 'The Hound of the Baskervilles', type: 'Supernatural / Murder', outcome: 'SOLVED', note: 'Solved the mystery of Grimpen Mire. Stapleton exposed. The hound was flesh, not legend.' },
]

export default function SherlockHolmesPage() {
  return (
    <div className={baskerville.className} style={{ background: darkBg, color: '#d4cec5', overflowX: 'hidden' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(8,15,12,0.92)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: amber, letterSpacing: '0.15em', fontStyle: 'italic' }}>S.H.</span>
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {[['#profile', 'Profile'], ['#cases', 'Cases'], ['#faculties', 'Faculties'], ['#network', 'Network']].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: '#4a6050', textDecoration: 'none', letterSpacing: '0.12em' }}>{label}</a>
            ))}
            <Link href="/showcase" style={{ fontSize: 12, color: '#2a3c30', textDecoration: 'none', letterSpacing: '0.1em' }}>← Showcase</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', background: `radial-gradient(ellipse at 70% 40%, rgba(184,134,11,0.07), transparent 55%), ${darkBg}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${amber}, transparent)` }} />
        <div style={{ position: 'absolute', top: 3, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${amber}60, transparent)` }} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '80px 40px' }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 32, flexWrap: 'wrap' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: `${amber}10`, border: `1px solid ${borderAmber}`, borderRadius: 99 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: amber, display: 'inline-block' }} />
              <span style={{ fontSize: 11, color: amber, letterSpacing: '0.3em', textTransform: 'uppercase' }}>221B Baker Street, London</span>
            </div>
          </div>
          <p style={{ fontSize: 13, letterSpacing: '0.3em', color: amber, textTransform: 'uppercase', margin: '0 0 20px' }}>Consulting Detective</p>
          <h1 className={baskerville.className} style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 700, lineHeight: 0.92, margin: '0 0 32px', letterSpacing: '-0.02em', color: '#f0ece4' }}>
            Sherlock<br />
            <em style={{ color: amber, fontWeight: 400 }}>Holmes</em>
          </h1>
          <p className={sourceSerif.className} style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: '#7a9070', maxWidth: 540, lineHeight: 1.75, marginBottom: 48, fontStyle: 'italic', fontWeight: 300 }}>
            &ldquo;Crime solved. Invoice to follow.&rdquo; — The world&apos;s only consulting detective has
            no interest in your feelings, your opinions, or your disbelief. Only in the facts. And the facts,
            as always, are his.
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['Cases', '500+'], ['Outcome', '99.7% solved'], ['Years Active', '1878–1914'], ['Enemies Neutralised', 'Moriarty (†)']].map(([k, v]) => (
              <div key={k} style={{ padding: '14px 20px', background: cardBg, border: `1px solid ${borderAmber}`, borderRadius: 8 }}>
                <p style={{ fontSize: 18, fontWeight: 700, color: amber, margin: 0, lineHeight: 1 }}>{v}</p>
                <p className={sourceSerif.className} style={{ fontSize: 11, color: '#4a6050', margin: '4px 0 0', letterSpacing: '0.1em' }}>{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFILE */}
      <section id="profile" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <p className={sourceSerif.className} style={{ fontSize: 11, color: amber, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 20 }}>01 · Profile</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <h2 className={baskerville.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 32px', color: '#f0ece4' }}>
                He doesn&apos;t observe.<br />
                <em style={{ color: amber, fontWeight: 400 }}>He deduces.</em>
              </h2>
              <blockquote style={{ borderLeft: `2px solid ${amber}`, paddingLeft: 24, margin: 0 }}>
                <p className={sourceSerif.className} style={{ fontSize: 20, color: '#d4cec5', fontStyle: 'italic', margin: 0, lineHeight: 1.65, fontWeight: 300 }}>
                  &ldquo;When you have eliminated the impossible, whatever remains, however improbable, must be the truth.&rdquo;
                </p>
              </blockquote>
            </div>
            <div>
              <p className={sourceSerif.className} style={{ fontSize: 16, lineHeight: 1.85, color: '#7a9070', marginBottom: 20, fontWeight: 300 }}>
                Born January 6, 1854, in Yorkshire. Self-educated in the sciences at Christ Church, Oxford. Created an entirely new profession — consulting detective — from nothing but intellect, observation, and the conviction that every crime leaves a trail, however invisible to ordinary minds.
              </p>
              <p className={sourceSerif.className} style={{ fontSize: 16, lineHeight: 1.85, color: '#7a9070', marginBottom: 28, fontWeight: 300 }}>
                Operates exclusively on the basis of logic. Has no patience for sentiment. Has, despite himself, a profound loyalty to those who earn his respect — Watson chief among them.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Born', '6 January 1854, Yorkshire'], ['Residence', '221B Baker Street'], ['Biographer', 'Dr. John H. Watson'], ['Nemesis', 'Prof. Moriarty (†)']].map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 14px', background: cardBg, border: `1px solid ${borderAmber}`, borderRadius: 6 }}>
                    <p className={sourceSerif.className} style={{ fontSize: 10, color: '#4a6050', margin: '0 0 2px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{k}</p>
                    <p style={{ fontSize: 13, color: '#d4cec5', margin: 0, fontWeight: 700 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NOTABLE CASES */}
      <section id="cases" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <p className={sourceSerif.className} style={{ fontSize: 11, color: amber, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 20 }}>02 · Notable Cases</p>
          <h2 className={baskerville.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 56px', color: '#f0ece4' }}>
            From the casebooks<br /><em style={{ color: amber, fontWeight: 400 }}>of Dr. Watson.</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {cases.map((c) => (
              <div key={c.title} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '22px 28px', display: 'grid', gridTemplateColumns: '64px 1fr 100px', gap: 24, alignItems: 'center', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = borderAmber; el.style.transform = 'translateX(6px)'; el.style.background = 'rgba(184,134,11,0.05)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = border; el.style.transform = 'translateX(0)'; el.style.background = cardBg }}
              >
                <p className={sourceSerif.className} style={{ fontSize: 18, color: amber, fontStyle: 'italic', margin: 0, fontWeight: 300 }}>{c.year}</p>
                <div>
                  <p className={baskerville.className} style={{ fontSize: 17, fontWeight: 700, color: '#f0ece4', margin: '0 0 2px' }}>{c.title}</p>
                  <p className={sourceSerif.className} style={{ fontSize: 13, color: '#4a6050', margin: '0 0 6px', letterSpacing: '0.08em' }}>{c.type}</p>
                  <p className={sourceSerif.className} style={{ fontSize: 14, color: '#7a9070', margin: 0, lineHeight: 1.5, fontWeight: 300 }}>{c.note}</p>
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: c.outcome === 'SOLVED' ? '#10b981' : amber, letterSpacing: '0.15em', textAlign: 'right' }}>{c.outcome}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FACULTIES & NETWORK */}
      <section id="faculties" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <p className={sourceSerif.className} style={{ fontSize: 11, color: amber, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 20 }}>03 · Faculties & Network</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <h3 className={baskerville.className} style={{ fontSize: 22, fontWeight: 700, color: '#f0ece4', marginBottom: 24 }}>Notable Faculties</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['Observation & Deduction', 'Can determine profession, travels, and character from a single glance.'],['Chemistry & Forensics', 'Expert in forensic chemistry; private laboratory maintained at Baker Street.'],['Disguise', 'Master of disguise; unrecognised by Watson on multiple occasions.'],['Violin', 'Accomplished violinist; composes original pieces during cogitation.'],['Boxing & Baritsu', 'Expert in the Japanese wrestling system; former bare-knuckle boxer.']].map(([title, desc]) => (
                  <div key={title as string} style={{ borderLeft: `2px solid ${amber}40`, paddingLeft: 16 }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#d4cec5', margin: '0 0 3px' }}>{title}</p>
                    <p className={sourceSerif.className} style={{ fontSize: 14, color: '#4a6050', margin: 0, lineHeight: 1.5, fontWeight: 300 }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div id="network">
              <h3 className={baskerville.className} style={{ fontSize: 22, fontWeight: 700, color: '#f0ece4', marginBottom: 24 }}>Known Associates</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[['Dr. John H. Watson', 'Colleague & Biographer', '#10b981'],['Mrs. Hudson', 'Landlady · 221B Baker Street', amber],['Inspector Lestrade', 'Scotland Yard · Frequently assisted', '#3b82f6'],['Mycroft Holmes', 'Elder brother · British Intelligence', '#8b5cf6'],['Irene Adler', 'The Woman · Only individual to outwit Holmes', '#ef4444'],['Baker Street Irregulars', 'Street intelligence network · Paid informants', amber]].map(([name, role, color]) => (
                  <div key={name as string} style={{ padding: '14px 18px', background: cardBg, border: `1px solid ${border}`, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, transition: 'border-color 0.2s ease' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = color as string + '50' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = border }}
                  >
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#d4cec5', margin: '0 0 2px' }}>{name}</p>
                      <p className={sourceSerif.className} style={{ fontSize: 13, color: '#4a6050', margin: 0, fontStyle: 'italic' }}>{role}</p>
                    </div>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: color as string, flexShrink: 0, marginTop: 4 }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: darkBg, borderTop: `1px solid ${border}`, padding: '24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className={sourceSerif.className} style={{ fontSize: 12, color: '#1a2820', fontStyle: 'italic' }}>221B Baker Street · London, England</p>
          <p className={sourceSerif.className} style={{ fontSize: 12, color: '#1a2820', fontStyle: 'italic' }}>
            Designed by <Link href="/" style={{ color: amber, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
