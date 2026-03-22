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
  {
    period: '1878 – 1887',
    title: 'Independent Consulting Detective',
    client: 'Self-employed · 221B Baker Street, London',
    outcome: 'ESTABLISHED',
    bullets: [
      'Created the world\'s first and only consulting detective practice — a profession invented from scratch',
      'Developed proprietary methods in observation, deduction, and forensic chemistry adopted later by Scotland Yard',
      'Established intelligence network across London: informants, street urchins, and professional contacts',
      'Published monographs on tobacco ash, footprints, and cipher-breaking — cited by law enforcement internationally',
    ],
  },
  {
    period: '1887 – 1891',
    title: 'Lead Investigator · Watson Partnership',
    client: 'Holmes & Watson · Baker Street Consultancy',
    outcome: 'PEAK YEARS',
    bullets: [
      'A Study in Scarlet: first documented case — Jefferson Hope murder solved via deductive reconstruction',
      'The Sign of Four: Agra treasure recovered, Jonathan Small apprehended on the Thames after river pursuit',
      'Closed 73 cases in this period; zero wrongful arrests attributed to Holmes\'s evidence',
      'Defeated the Irene Adler operation — the only adversary to successfully outmanoeuvre him on record',
    ],
  },
  {
    period: '1891 – 1894',
    title: 'The Great Hiatus · Undercover Operations',
    client: 'British Government (covert) · Mycroft Holmes, liaison',
    outcome: 'CLASSIFIED',
    bullets: [
      'Defeated Professor Moriarty at Reichenbach Falls — dismantling the largest criminal network in Europe',
      'Operated in Tibet, Persia, Mecca, and France under the alias "Sigerson"',
      'Conducted intelligence work on behalf of the Crown during absence — nature of missions still classified',
      'Returned to London 1894 to apprehend Colonel Moran, Moriarty\'s remaining top operative',
    ],
  },
  {
    period: '1894 – 1903',
    title: 'Senior Consulting Detective · Post-Hiatus',
    client: 'Holmes & Watson · Scotland Yard · Crown',
    outcome: 'PROLIFIC',
    bullets: [
      'The Hound of the Baskervilles: solved the mystery of Grimpen Mire; Stapleton exposed and eliminated',
      'Closed over 200 cases in this nine-year period — highest output of career',
      'Consulted directly for the Prime Minister on three occasions of national importance',
      'Trained a generation of Scotland Yard inspectors in observational methodology',
    ],
  },
  {
    period: '1903 – 1914',
    title: 'Retirement & Final Assignment',
    client: 'Sussex Beekeeping · British Intelligence (1914)',
    outcome: 'LEGACY',
    bullets: [
      'Retired to Sussex Downs to study philosophy and keep bees — published "Practical Handbook of Bee Culture"',
      'Came out of retirement in 1914 at Mycroft\'s request: His Last Bow — German spy ring dismantled on eve of WWI',
      'Delivered Von Bork, Kaiser\'s top British intelligence asset, to Scotland Yard personally',
      'Final recorded words: "There\'s an east wind coming, Watson." Country saved. Case closed.',
    ],
  },
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

      {/* NOTABLE CASES — work experience timeline */}
      <section id="cases" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <p className={sourceSerif.className} style={{ fontSize: 11, color: amber, letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 20 }}>02 · Career</p>
          <h2 className={baskerville.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 64px', color: '#f0ece4' }}>
            From the casebooks<br /><em style={{ color: amber, fontWeight: 400 }}>of Dr. Watson.</em>
          </h2>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{ position: 'absolute', left: 159, top: 0, bottom: 0, width: 1, background: `linear-gradient(180deg, ${amber}60, ${amber}20, transparent)` }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {cases.map((c, i) => (
                <div key={c.title} style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 40, paddingBottom: 52 }}>

                  {/* Left: period + dot */}
                  <div style={{ textAlign: 'right', paddingTop: 4, position: 'relative' }}>
                    <p className={sourceSerif.className} style={{ fontSize: 13, color: amber, margin: '0 0 4px', fontStyle: 'italic', lineHeight: 1.4 }}>{c.period}</p>
                    {/* Timeline dot */}
                    <div style={{ position: 'absolute', right: -46, top: 6, width: 10, height: 10, borderRadius: '50%', background: amber, border: `2px solid ${darkBg}`, boxShadow: `0 0 0 3px ${amber}30` }} />
                  </div>

                  {/* Right: content card */}
                  <div
                    style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 14, padding: '24px 28px', transition: 'all 0.3s ease' }}
                    onMouseEnter={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = borderAmber
                      el.style.background = 'rgba(184,134,11,0.06)'
                      el.style.transform = 'translateX(4px)'
                    }}
                    onMouseLeave={e => {
                      const el = e.currentTarget as HTMLDivElement
                      el.style.borderColor = border
                      el.style.background = cardBg
                      el.style.transform = 'translateX(0)'
                    }}
                  >
                    {/* Card header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4, gap: 12 }}>
                      <p className={baskerville.className} style={{ fontSize: 19, fontWeight: 700, color: '#f0ece4', margin: 0, lineHeight: 1.2 }}>{c.title}</p>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: '0.18em',
                        color: c.outcome === 'PEAK YEARS' || c.outcome === 'PROLIFIC' ? '#10b981' : c.outcome === 'CLASSIFIED' ? '#8b5cf6' : amber,
                        padding: '3px 10px',
                        border: `1px solid ${c.outcome === 'PEAK YEARS' || c.outcome === 'PROLIFIC' ? '#10b98140' : c.outcome === 'CLASSIFIED' ? '#8b5cf640' : borderAmber}`,
                        borderRadius: 99, whiteSpace: 'nowrap', flexShrink: 0,
                      }}>{c.outcome}</span>
                    </div>
                    <p className={sourceSerif.className} style={{ fontSize: 13, color: '#4a6050', margin: '0 0 18px', fontStyle: 'italic', letterSpacing: '0.06em' }}>{c.client}</p>

                    {/* Bullet points */}
                    <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {c.bullets.map(pt => (
                        <li key={pt} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                          <span style={{ color: amber, fontSize: 10, marginTop: 5, flexShrink: 0, opacity: 0.7 }}>◆</span>
                          <span className={sourceSerif.className} style={{ fontSize: 15, color: '#7a9070', lineHeight: 1.65, fontWeight: 300 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
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
