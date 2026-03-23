'use client'

import Link from 'next/link'
import { Space_Mono } from 'next/font/google'

const mono = Space_Mono({ subsets: ['latin'], weight: ['400', '700'] })

const red = '#dc2626'
const dim = '#374151'
const mid = '#4b5563'

export default function DarthVaderPage() {
  return (
    <div className={mono.className} style={{ minHeight: '100vh', background: '#000000', color: '#9ca3af', padding: '0 0 80px', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .redact { background: #374151; color: transparent; border-radius: 2px; display: inline-block; user-select: none; }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:0.96} 93%{opacity:0.85} 94%{opacity:0.96} }

        .dv-identity-row { display: grid; grid-template-columns: 200px 1fr; gap: 20px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .dv-service-inner { display: grid; grid-template-columns: 130px 1fr; gap: 20px; }
        .dv-force-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .dv-force-row { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); display: grid; grid-template-columns: 180px 1fr; gap: 12px; }

        .dv-separator { overflow: hidden; white-space: nowrap; max-width: 100%; }

        @media (max-width: 600px) {
          .dv-identity-row { grid-template-columns: 1fr !important; gap: 4px !important; }
          .dv-service-inner { grid-template-columns: 1fr !important; gap: 6px !important; }
          .dv-force-grid { grid-template-columns: 1fr !important; }
          .dv-force-row { grid-template-columns: 1fr !important; gap: 4px !important; }
        }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)', pointerEvents: 'none', zIndex: 0, animation: 'flicker 8s infinite' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '48px 32px 0' }}>

        {/* Back */}
        <Link href="/showcase" style={{ fontSize: 11, color: dim, textDecoration: 'none', letterSpacing: '0.2em', display: 'block', marginBottom: 40 }}>← SHOWCASE</Link>

        {/* Classification header */}
        <div style={{ borderTop: `1px solid ${dim}`, borderBottom: `1px solid ${dim}`, padding: '28px 0', marginBottom: 48, textAlign: 'center' }}>
          <p className="dv-separator" style={{ fontSize: 10, color: dim, letterSpacing: '0.35em', margin: '0 0 12px' }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </p>
          <p style={{ fontSize: 11, color: mid, letterSpacing: '0.3em', margin: '0 0 6px' }}>IMPERIAL INTELLIGENCE SERVICE</p>
          <p style={{ fontSize: 11, color: mid, letterSpacing: '0.3em', margin: '0 0 6px' }}>OFFICE OF DARK SIDE AFFAIRS</p>
          <p style={{ fontSize: 11, color: red, letterSpacing: '0.4em', fontWeight: 700, margin: '0 0 6px' }}>CLASSIFICATION: MAXIMUM</p>
          <p style={{ fontSize: 10, color: dim, letterSpacing: '0.2em', margin: '0 0 12px' }}>DOCUMENT REF: IIS-DV-0001 / CLEARANCE: EYES ONLY</p>
          <p style={{ fontSize: 10, color: dim, letterSpacing: '0.35em', margin: 0 }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', lineHeight: 1, margin: '0 0 12px' }}>
            DARTH VADER
          </h1>
          <p style={{ fontSize: 11, color: red, letterSpacing: '0.3em', margin: 0 }}>
            DARK LORD OF THE SITH · SUPREME COMMANDER · GALACTIC EMPIRE
          </p>
        </div>

        {/* ── SECTION I: IDENTITY ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            [ SECTION I · IDENTITY ]
          </p>
          {[
            ['BIRTH NAME', 'Anakin Skywalker'],
            ['DATE OF BIRTH', '41.9 BBY'],
            ['PLACE OF ORIGIN', 'Tatooine, Outer Rim'],
            ['CURRENT DESIGNATION', 'Lord Vader / Darth Vader'],
            ['ALLEGIANCE', 'Galactic Empire'],
            ['DIRECT SUPERIOR', <span key="sup">Emperor <span className="redact">████████████</span> Palpatine</span>],
            ['BIOLOGICAL STATUS', 'Life-support dependent. 92% prosthetic.'],
            ['MIDI-CHLORIAN COUNT', <span key="midi"><span className="redact">████</span> /mL (highest on record — UNVERIFIED)</span>],
          ].map(([label, value], i) => (
            <div key={i} className="dv-identity-row">
              <p style={{ fontSize: 10, color: dim, margin: 0, letterSpacing: '0.15em' }}>{label}</p>
              <p style={{ fontSize: 13, color: '#d1d5db', margin: 0, lineHeight: 1.5 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── SECTION II: SERVICE RECORD ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            [ SECTION II · SERVICE RECORD ]
          </p>
          {[
            {
              date: '41–19 BBY',
              org: 'JEDI ORDER',
              text: 'Padawan to Obi-Wan Kenobi. Attained rank of Jedi Knight (21 BBY). General, Clone Wars. Decorated for valor at Christophsis, Teth, and the Outer Rim Sieges. Performance evaluated: EXCEPTIONAL. Loyalty status at this time: COMPLIANT.',
            },
            {
              date: '19 BBY',
              org: 'TRANSITION / ORDER 66',
              text: 'Pledged to Emperor Palpatine. Led 501st Legion assault on Jedi Temple, Coruscant. All Jedi encountered: neutralized. This event designated OPERATION KNIGHTFALL. All records of operative conduct during this period: ██ CLASSIFIED ██.',
            },
            {
              date: '19 BBY → 4 ABY',
              org: 'GALACTIC EMPIRE',
              text: 'Supreme Commander of Imperial Military. Primary enforcer of Imperial will. Oversaw construction of Death Star I and II. Hunted Jedi survivors across galaxy for two decades. Zero confirmed escapes from direct custody. NB: Jedi survivor identified as son — see Appendix DV-17 (SEALED).',
            },
            {
              date: '4 ABY',
              org: 'BATTLE OF ENDOR',
              text: 'Killed Emperor Palpatine to protect Luke Skywalker (son — relationship CLASSIFIED per DV-17). Sustained fatal injuries. Died aboard Death Star II, Endor system. Final status: REDEEMED. Prophecy of the Chosen One: FULFILLED.',
            },
          ].map((r, i) => (
            <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
              <div className="dv-service-inner">
                <div>
                  <p style={{ fontSize: 10, color: red, margin: '0 0 4px', letterSpacing: '0.1em' }}>{r.date}</p>
                  <p style={{ fontSize: 10, color: dim, margin: 0, fontWeight: 700, letterSpacing: '0.12em' }}>{r.org}</p>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.75, fontWeight: 400 }}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION III: FORCE CAPABILITIES ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            [ SECTION III · FORCE CAPABILITIES ]
          </p>
          <p style={{ fontSize: 12, color: dim, margin: '0 0 20px', lineHeight: 1.6, letterSpacing: '0.03em' }}>
            Assessment based on field observation and intercepted Jedi Council records (pre-purge). Proficiency ratings classified 0–10. Lord Vader's profile has been truncated at analyst discretion.
          </p>
          <div className="dv-force-grid">
            {[
              ['Force Choke', '██████████ 10/10'],
              ['Telekinesis', '█████████░ 09/10'],
              ['Lightsaber Combat (Form V)', '██████████ 10/10'],
              ['Force Push / Pull', '█████████░ 09/10'],
              ['Precognition', '████████░░ 08/10'],
              ['Mind Probe', '█████████░ 09/10'],
              ['Force Barrier', '████████░░ 08/10'],
              ['Mechanical Engineering', <span key="eng"><span className="redact">████████</span> [REDACTED]</span>],
            ].map(([skill, rating], i) => (
              <div key={i} className="dv-force-row">
                <p style={{ fontSize: 11, color: mid, margin: 0 }}>{skill}</p>
                <p style={{ fontSize: 11, color: red, margin: 0 }}>{rating}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION IV: PSYCHOLOGICAL ASSESSMENT ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            [ SECTION IV · PSYCHOLOGICAL ASSESSMENT ]
          </p>
          <div style={{ border: `1px solid rgba(220,38,38,0.15)`, padding: '20px', background: 'rgba(220,38,38,0.03)' }}>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px', lineHeight: 1.75 }}>
              Subject exhibits extreme attachment behavior, profound grief response, and deep fear of loss — identified as primary psychological leverage point exploited during recruitment. Loyalty to Emperor <span className="redact">████████████</span> is performance-based, not ideological.
            </p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px', lineHeight: 1.75 }}>
              Note filed <span className="redact">██████</span>, Year 19 BBY: analyst flagged residual attachment to biological offspring (identity: <span className="redact">████████████████████</span>). Recommendation: immediate termination. Action taken: <span className="redact">████████</span>. Outcome: SEE BATTLE OF ENDOR.
            </p>
            <p style={{ fontSize: 11, color: red, margin: 0, letterSpacing: '0.15em' }}>
              ⚠ ANALYST NOTE: DO NOT UNDERESTIMATE THE SKYWALKER VARIABLE.
            </p>
          </div>
        </div>

        {/* ── SECTION V: NOTABLE QUOTE ── */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            [ SECTION V · RECORDED STATEMENTS ]
          </p>
          <div style={{ paddingLeft: 20, borderLeft: `3px solid ${red}` }}>
            <p style={{ fontSize: 16, color: '#e5e7eb', fontStyle: 'italic', margin: '0 0 8px', lineHeight: 1.6 }}>
              &ldquo;I find your lack of faith disturbing.&rdquo;
            </p>
            <p style={{ fontSize: 10, color: dim, margin: 0, letterSpacing: '0.15em' }}>— Lord Vader, Death Star I, 0 BBY</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid rgba(220,38,38,0.2)`, paddingTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: '#1f2937', letterSpacing: '0.3em', margin: '0 0 8px' }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </p>
          <p style={{ fontSize: 9, color: '#1f2937', letterSpacing: '0.25em', margin: '0 0 4px' }}>
            IMPERIAL INTELLIGENCE SERVICE · ALL RIGHTS RESERVED TO THE EMPIRE
          </p>
          <p style={{ fontSize: 9, color: dim, margin: '0 0 8px', letterSpacing: '0.1em' }}>
            Unauthorised access to this document is a capital offence.
          </p>
          <p style={{ fontSize: 11, color: dim, margin: 0 }}>
            Designed by <Link href="/" style={{ color: red, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
