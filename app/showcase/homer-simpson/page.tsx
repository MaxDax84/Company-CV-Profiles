'use client'

import Link from 'next/link'
import { Lilita_One, Nunito } from 'next/font/google'

const lilita = Lilita_One({ subsets: ['latin'], weight: ['400'] })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'] })

const yellow = '#fbbf24'
const blue = '#1d4ed8'
const orange = '#f97316'
const red = '#dc2626'
const panelBorder = '3px solid #111827'
const panelRadius = 0

export default function HomerSimpsonPage() {
  return (
    <div className={nunito.className} style={{ background: '#f8fafc', color: '#111827', minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .panel {
          border: ${panelBorder};
          border-radius: ${panelRadius}px;
          overflow: hidden;
          position: relative;
        }
        .panel-num {
          position: absolute;
          top: 8px;
          left: 10px;
          font-size: 10px;
          font-weight: 800;
          color: rgba(0,0,0,0.25);
          letter-spacing: 0.1em;
          font-family: sans-serif;
        }
        .speech {
          display: inline-block;
          background: white;
          border: 2.5px solid #111827;
          border-radius: 16px;
          padding: 10px 16px;
          position: relative;
          font-weight: 700;
        }
        .speech::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 20px;
          width: 0; height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid #111827;
        }
        .speech::before {
          content: '';
          position: absolute;
          bottom: -9px;
          left: 21px;
          width: 0; height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 11px solid white;
          z-index: 1;
        }

        /* Layout grids */
        .hs-row1 { display: grid; grid-template-columns: 2fr 1fr; border-bottom: ${panelBorder}; }
        .hs-bio-panel { padding: 36px 40px; border-right: ${panelBorder}; }
        .hs-stats-panel { padding: 36px 28px; }
        .hs-adventures-outer { padding: 36px 40px; }
        .hs-adventures-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        .hs-row3 { display: grid; grid-template-columns: 1fr 2fr; border-bottom: ${panelBorder}; }
        .hs-skills-panel { padding: 36px 28px; border-right: ${panelBorder}; }
        .hs-family-panel { padding: 36px 40px; }
        .hs-family-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .hs-footer { padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }

        @media (max-width: 768px) {
          .hs-row1 { grid-template-columns: 1fr !important; }
          .hs-bio-panel { border-right: none !important; border-bottom: ${panelBorder} !important; }
          .hs-row3 { grid-template-columns: 1fr !important; }
          .hs-skills-panel { border-right: none !important; border-bottom: ${panelBorder} !important; }
          .hs-adventures-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .hs-adventures-grid { grid-template-columns: 1fr !important; }
          .hs-family-grid { grid-template-columns: 1fr !important; }
          .hs-footer { padding: 16px 20px !important; flex-direction: column !important; gap: 8px; text-align: center; }
          .hs-bio-panel { padding: 24px 20px !important; }
          .hs-stats-panel { padding: 24px 16px !important; }
          .hs-adventures-outer { padding: 24px 20px !important; }
          .hs-skills-panel { padding: 24px 16px !important; }
          .hs-family-panel { padding: 24px 20px !important; }
        }
      `}</style>

      {/* ── PANEL 01: TITLE BANNER ── */}
      <div className="panel" style={{ background: yellow, borderBottom: panelBorder }}>
        <span className="panel-num">01</span>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ fontSize: 64, lineHeight: 1 }}>🍩</div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: blue, letterSpacing: '0.25em', margin: '0 0 4px' }}>SPRINGFIELD NUCLEAR POWER PLANT · EMPLOYEE PROFILE</p>
              <h1 className={lilita.className} style={{ fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: blue, margin: 0, lineHeight: 1, letterSpacing: '-0.01em' }}>
                HOMER J. SIMPSON
              </h1>
              <p style={{ fontWeight: 800, color: '#92400e', margin: '4px 0 0', fontSize: 15 }}>Nuclear Safety Inspector · Sector 7-G · Springfield, USA</p>
            </div>
          </div>
          <Link href="/showcase" style={{ fontSize: 13, color: blue, fontWeight: 800, textDecoration: 'none', border: `2px solid ${blue}`, padding: '8px 16px', background: 'white' }}>
            ← Back
          </Link>
        </div>
      </div>

      {/* ── MAIN COMIC GRID ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ROW 1: Bio (2/3) + Stats (1/3) */}
        <div className="hs-row1">

          {/* Bio panel */}
          <div className="panel hs-bio-panel" style={{ background: 'white', borderRadius: 0, border: 'none' }}>
            <span className="panel-num">02</span>
            <h2 className={lilita.className} style={{ fontSize: 26, color: blue, marginBottom: 16, marginTop: 8 }}>The Springfield Story</h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#374151', marginBottom: 16 }}>
              Born <strong>May 12, 1956</strong> in Springfield — a city in a state nobody can identify. Son of Abe and Mona Simpson. Attended Springfield High School and graduated, somewhat miraculously, despite losing significant brain function to a crayon lodged in his nasal cavity.
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#374151', marginBottom: 24 }}>
              Met Marge Bouvier at a detention in 1974. Has been inseparable from her — and never fully understood why she chose him — ever since. They have three children, a dog, a cat, and a car that shouldn&apos;t still be running.
            </p>
            <div style={{ marginTop: 8 }}>
              <div className="speech" style={{ fontSize: 20, marginBottom: 16 }}>
                &ldquo;D&apos;oh!&rdquo;
              </div>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 20, fontWeight: 700 }}>— Homer, approximately 4,000× per season</p>
            </div>
          </div>

          {/* Stats panel */}
          <div className="panel hs-stats-panel" style={{ background: yellow, border: 'none' }}>
            <span className="panel-num">03</span>
            <h2 className={lilita.className} style={{ fontSize: 22, color: blue, marginBottom: 20, marginTop: 8 }}>By the Numbers</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                ['🍩', '∞', 'Donuts consumed'],
                ['🍺', '∞', 'Duff beers'],
                ['💥', '17', 'Near-meltdowns'],
                ['😴', '3/day', 'Naps at work'],
                ['🚀', '1', 'Space missions'],
                ['❤️', '3', 'Children'],
                ['🏆', '1', 'Employee of the Month'],
              ].map(([icon, val, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', border: `2px solid ${blue}`, padding: '8px 12px' }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span className={lilita.className} style={{ fontSize: 20, color: blue, minWidth: 36 }}>{val}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: Adventures (full width, 3 cols) */}
        <div className="panel hs-adventures-outer" style={{ border: 'none', borderBottom: panelBorder, background: '#fff7ed' }}>
          <span className="panel-num">04</span>
          <h2 className={lilita.className} style={{ fontSize: 26, color: orange, marginBottom: 28, marginTop: 8 }}>Adventures & Side Jobs</h2>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#9a3412', letterSpacing: '0.1em', marginBottom: 20 }}>
            HOMER HAS DONE IT ALL. USUALLY BY ACCIDENT.
          </p>
          <div className="hs-adventures-grid">
            {[
              { emoji: '☢️', title: 'Nuclear Safety Inspector', org: 'Springfield Nuclear Power Plant · 1989→Now', desc: 'Sector 7-G. Responsible for preventing meltdown. Has caused 3. Fired 27 times. Still employed.' },
              { emoji: '🚀', title: 'NASA Astronaut', org: 'Kennedy Space Center · 1994', desc: 'Selected as the average American for a mission. Ate all the food in zero gravity. Counts it on his resume.' },
              { emoji: '🥊', title: 'Professional Boxer', org: 'Springfield Boxing Commission · 1997', desc: 'Managed by Moe Szyslak. Won by sheer ability to absorb punishment. Did not defeat Drederick Tatum. Did not quit.' },
              { emoji: '🎤', title: 'Country Music Singer', org: 'Capitol Records · "Homer in the House"', desc: 'Brief but passionate. One hit single. Briefly famous. Immediately forgotten. No regrets.' },
              { emoji: '🍔', title: 'Food Critic', org: 'Springfield Shopper', desc: 'Positive reviews only. Ate every dish in Springfield. Gained 8 lbs on assignment. Called it "fieldwork."' },
              { emoji: '🌐', title: 'Grease Recycling Entrepreneur', org: 'Homer\'s Can Do Corp · 1998', desc: 'Founded Homer\'s Can Do Corp. Business model: collect and resell cooking grease. Genuinely profitable for six days.' },
            ].map((a) => (
              <div key={a.title} style={{ padding: '20px', border: panelBorder, margin: '-1px 0 0 -1px', background: 'white' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{a.emoji}</div>
                <p className={lilita.className} style={{ fontSize: 15, color: blue, margin: '0 0 4px' }}>{a.title}</p>
                <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 800, letterSpacing: '0.08em', margin: '0 0 8px' }}>{a.org}</p>
                <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: Skills (1/3) + Family (2/3) */}
        <div className="hs-row3">

          {/* Skills */}
          <div className="panel hs-skills-panel" style={{ background: blue, border: 'none' }}>
            <span className="panel-num" style={{ color: 'rgba(255,255,255,0.3)' }}>05</span>
            <h2 className={lilita.className} style={{ fontSize: 22, color: yellow, marginBottom: 24, marginTop: 8 }}>Skill Assessment</h2>
            {[['Eating', 99, yellow], ['Sleeping', 97, yellow], ['TV Watching', 95, yellow], ['Bowling', 63, orange], ['Parenting', 52, orange], ['Nuclear Safety', 8, red]].map(([skill, pct, color]) => (
              <div key={skill as string} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{skill}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color: color as string }}>{pct}</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color as string }} />
                </div>
              </div>
            ))}
          </div>

          {/* Family */}
          <div className="panel hs-family-panel" style={{ background: 'white', border: 'none' }}>
            <span className="panel-num">06</span>
            <h2 className={lilita.className} style={{ fontSize: 26, color: blue, marginBottom: 28, marginTop: 8 }}>742 Evergreen Terrace</h2>
            <div className="hs-family-grid">
              {[
                { emoji: '💙', name: 'Marge Simpson', tag: 'WIFE', desc: 'The heart of the family. Impossibly patient. Still in love with Homer after 35 years — nobody knows how.', color: blue },
                { emoji: '😈', name: 'Bart Simpson', tag: 'SON', desc: '4th grade. Underachiever and proud of it. Expert slingshot operator. Homer\'s son in every way.', color: orange },
                { emoji: '📚', name: 'Lisa Simpson', tag: 'DAUGHTER', desc: '8 years old. Future president. Saxophone prodigy. The most evolved moral being in all of Springfield.', color: '#7c3aed' },
                { emoji: '🍼', name: 'Maggie Simpson', tag: 'DAUGHTER', desc: 'Baby. Never speaks. Shot Mr. Burns once. May be the most competent Simpson alive.', color: '#db2777' },
              ].map(m => (
                <div key={m.name} style={{ border: `2.5px solid ${m.color}`, padding: '16px', background: `${m.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{m.emoji}</span>
                    <div>
                      <p className={lilita.className} style={{ fontSize: 14, color: m.color, margin: 0 }}>{m.name}</p>
                      <p style={{ fontSize: 9, fontWeight: 800, color: '#9ca3af', letterSpacing: '0.2em', margin: 0 }}>{m.tag}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 4: Full-width quote panel */}
        <div className="panel" style={{ background: yellow, padding: '48px 40px', border: 'none', borderBottom: panelBorder, textAlign: 'center' }}>
          <span className="panel-num">07</span>
          <p className={lilita.className} style={{ fontSize: 'clamp(1.5rem, 5vw, 4rem)', color: blue, margin: '0 0 16px', lineHeight: 1.1 }}>
            &ldquo;To alcohol! The cause of — and solution to — all of life&apos;s problems.&rdquo;
          </p>
          <p style={{ fontSize: 14, color: '#92400e', fontWeight: 800, margin: 0, letterSpacing: '0.1em' }}>— HOMER J. SIMPSON</p>
        </div>

        {/* Footer */}
        <div className="hs-footer" style={{ background: blue }}>
          <span className={lilita.className} style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>🍩 SPRINGFIELD, USA</span>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 800 }}>
            Designed by <Link href="/" style={{ color: yellow, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
