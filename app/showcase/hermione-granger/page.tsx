'use client'

import Link from 'next/link'
import { EB_Garamond, Cinzel } from 'next/font/google'

const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500', '700', '800'], style: ['normal', 'italic'] })
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '900'] })

const gold = '#c9993f'
const burgundy = '#7f1d1d'
const parchment = '#fdf6e3'
const ink = '#2c1810'
const darkBg = '#1a0508'

export default function HermioneGrangerPage() {
  return (
    <div style={{ background: darkBg, minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .page-bg {
          background: ${parchment};
          color: ${ink};
          box-shadow: 0 4px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,153,63,0.2);
        }
        .margin-note {
          position: absolute;
          right: -200px;
          width: 170px;
          font-style: italic;
          font-size: 12px;
          color: rgba(127,29,29,0.7);
          line-height: 1.65;
          border-left: 2px solid rgba(201,153,63,0.3);
          padding-left: 12px;
        }
        @media (max-width: 1100px) {
          .margin-note { display: none; }
        }
      `}</style>

      {/* Top stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${burgundy}, ${gold}, ${burgundy})` }} />

      {/* Running header */}
      <div style={{ padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/showcase" className={cinzel.className} style={{ fontSize: 10, color: 'rgba(201,153,63,0.4)', textDecoration: 'none', letterSpacing: '0.2em' }}>← SHOWCASE</Link>
        <p className={cinzel.className} style={{ fontSize: 10, color: 'rgba(201,153,63,0.3)', letterSpacing: '0.3em', margin: 0 }}>THE LIFE OF HERMIONE JEAN GRANGER</p>
        <p className={cinzel.className} style={{ fontSize: 10, color: 'rgba(201,153,63,0.3)', letterSpacing: '0.15em', margin: 0 }}>BeOnWeb · Style Showcase</p>
      </div>

      {/* Content: centered book column */}
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 40px 100px', position: 'relative' }}>

        {/* ── FRONTISPIECE ── */}
        <div className="page-bg" style={{ padding: '64px 56px', marginBottom: 48, textAlign: 'center' }}>
          <p className={cinzel.className} style={{ fontSize: 10, color: burgundy, letterSpacing: '0.5em', margin: '0 0 24px' }}>HOGWARTS · MINISTRY OF MAGIC · GRYFFINDOR</p>
          <div style={{ fontSize: 40, marginBottom: 16 }}>⚡</div>
          <h1 className={cinzel.className} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, lineHeight: 1, color: ink, margin: '0 0 16px' }}>
            Hermione<br />
            <span style={{ color: burgundy }}>Granger</span>
          </h1>
          <div style={{ width: 80, height: 2, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: '20px auto' }} />
          <p className={garamond.className} style={{ fontSize: 16, color: '#6b4226', fontStyle: 'italic', margin: '0 0 40px' }}>
            Witch · Scholar · Minister for Magic
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
            {[['Born', '19 September 1979'], ['House', 'Gryffindor'], ['O.W.L.s', '11 Outstanding'], ['Position', 'Minister for Magic']].map(([k, v]) => (
              <div key={k} style={{ textAlign: 'center' }}>
                <p className={cinzel.className} style={{ fontSize: 9, color: gold, letterSpacing: '0.2em', margin: '0 0 3px' }}>{k}</p>
                <p className={garamond.className} style={{ fontSize: 14, color: ink, margin: 0, fontWeight: 700 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CHAPTER I ── */}
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <p className={cinzel.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'rgba(201,153,63,0.15)', lineHeight: 1, margin: '0 0 -12px', fontWeight: 900 }}>I</p>
            <p className={cinzel.className} style={{ fontSize: 13, color: gold, letterSpacing: '0.3em', margin: 0 }}>THE MUGGLE-BORN PRODIGY</p>
          </div>

          <div className="page-bg" style={{ padding: '48px 56px', position: 'relative' }}>
            <span className="margin-note">She arrived knowing more than most third-years. The teachers noticed on day one.</span>

            {/* Drop cap */}
            <p className={garamond.className} style={{ fontSize: 19, lineHeight: 1.9, color: '#3d1f14', marginBottom: 20 }}>
              <span className={cinzel.className} style={{ float: 'left', fontSize: '4.2em', lineHeight: 0.75, paddingRight: 10, paddingTop: 8, color: burgundy, fontWeight: 900 }}>B</span>
              orn on 19 September 1979 to Jean and Robert Granger — two perfectly ordinary Muggle dentists from Hampstead — Hermione Jean Granger received her Hogwarts letter at the age of eleven. She had already read every book on the list twice.
            </p>
            <p className={garamond.className} style={{ fontSize: 19, lineHeight: 1.9, color: '#3d1f14', marginBottom: 20 }}>
              She arrived at Hogwarts knowing more spells than most third-years, having memorised <em>Magical Theory</em> by Adalbert Waffling, <em>A History of Magic</em> by Bathilda Bagshot, and <em>Hogwarts: A History</em> in its entirety. Her first words to Harry Potter and Ron Weasley were a correction.
            </p>

            <blockquote style={{ borderLeft: `3px solid ${gold}`, paddingLeft: 24, margin: '28px 0' }}>
              <p className={garamond.className} style={{ fontSize: 20, fontStyle: 'italic', color: ink, margin: 0, lineHeight: 1.75 }}>
                &ldquo;Books! And cleverness! There are more important things — friendship and bravery.&rdquo;
              </p>
              <p className={cinzel.className} style={{ fontSize: 11, color: gold, marginTop: 12, letterSpacing: '0.1em' }}>— Hermione Granger, 1997</p>
            </blockquote>

            <p className={garamond.className} style={{ fontSize: 19, lineHeight: 1.9, color: '#3d1f14', marginBottom: 0 }}>
              She made two friends that first year by helping them survive a mountain troll. The pattern was set: extraordinary competence deployed in service of people she cared about, at considerable personal risk.
            </p>
          </div>
        </div>

        {/* Ornamental divider */}
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <p className={cinzel.className} style={{ color: 'rgba(201,153,63,0.4)', letterSpacing: '0.5em', fontSize: 14 }}>✦ ✦ ✦</p>
        </div>

        {/* ── CHAPTER II ── */}
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <p className={cinzel.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'rgba(201,153,63,0.15)', lineHeight: 1, margin: '0 0 -12px', fontWeight: 900 }}>II</p>
            <p className={cinzel.className} style={{ fontSize: 13, color: gold, letterSpacing: '0.3em', margin: 0 }}>SEVEN YEARS AT HOGWARTS</p>
          </div>

          <div className="page-bg" style={{ padding: '48px 56px', position: 'relative' }}>
            <span className="margin-note" style={{ top: 80 }}>She achieved 11 O.W.L.s — the highest marks in Hogwarts history for her year.</span>

            <p className={garamond.className} style={{ fontSize: 19, lineHeight: 1.9, color: '#3d1f14', marginBottom: 28 }}>
              Over seven years, Hermione Granger accumulated a record that Hogwarts had not seen in a generation: 11 O.W.L.s Outstanding, 10 N.E.W.T.s, Prefect and Head Girl, founder of S.P.E.W. (the Society for the Promotion of Elfish Welfare), and the only student known to have used a Time-Turner to attend classes — not to bend time, but to read more books.
            </p>

            {/* Academic record — inline table style */}
            <div style={{ marginBottom: 28, borderTop: `1px solid rgba(127,29,29,0.2)`, borderBottom: `1px solid rgba(127,29,29,0.2)` }}>
              {[
                ['O.W.L.s Achieved', '11 Outstanding'],
                ['N.E.W.T.s Achieved', '7 Outstanding · 3 Exceeds Expectations'],
                ['House', 'Gryffindor'],
                ['Positions Held', 'Prefect · Head Girl'],
                ['Distinctions', 'Time-Turner usage approved, Ministry of Magic · 1993'],
              ].map(([k, v], i) => (
                <div key={k} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', padding: '10px 0', borderBottom: i < 4 ? `1px solid rgba(127,29,29,0.1)` : 'none' }}>
                  <p className={cinzel.className} style={{ fontSize: 11, color: burgundy, margin: 0, letterSpacing: '0.1em' }}>{k}</p>
                  <p className={garamond.className} style={{ fontSize: 16, color: ink, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>

            <p className={garamond.className} style={{ fontSize: 19, lineHeight: 1.9, color: '#3d1f14', marginBottom: 0 }}>
              In her fifth year she co-founded Dumbledore&apos;s Army — an illegal student defence group operating beneath Dolores Umbridge&apos;s nose. In her seventh year she was tortured by Bellatrix Lestrange, did not break, and helped destroy Voldemort&apos;s soul fragments across Britain while camping in a tent and keeping everyone fed. She was eighteen years old.
            </p>
          </div>
        </div>

        {/* Ornamental divider */}
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <p className={cinzel.className} style={{ color: 'rgba(201,153,63,0.4)', letterSpacing: '0.5em', fontSize: 14 }}>✦ ✦ ✦</p>
        </div>

        {/* ── CHAPTER III ── */}
        <div style={{ position: 'relative', marginBottom: 48 }}>
          <div style={{ marginBottom: 32, textAlign: 'center' }}>
            <p className={cinzel.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', color: 'rgba(201,153,63,0.15)', lineHeight: 1, margin: '0 0 -12px', fontWeight: 900 }}>III</p>
            <p className={cinzel.className} style={{ fontSize: 13, color: gold, letterSpacing: '0.3em', margin: 0 }}>THE MINISTRY OF MAGIC</p>
          </div>

          <div className="page-bg" style={{ padding: '48px 56px', position: 'relative' }}>
            <span className="margin-note" style={{ top: 48 }}>Youngest Minister for Magic in recorded history. First Muggle-born to hold the office.</span>

            <p className={garamond.className} style={{ fontSize: 19, lineHeight: 1.9, color: '#3d1f14', marginBottom: 28 }}>
              After the war, Hermione returned to Hogwarts to sit her N.E.W.T.s. Nobody was surprised by the results. She joined the Ministry of Magic as a junior counsel in 1998 — and began dismantling, piece by piece, every piece of discriminatory legislation she had found unconscionable since the age of thirteen.
            </p>

            {/* Career entries */}
            <div style={{ marginBottom: 28 }}>
              {[
                { period: '1998–2000', role: 'Junior Counsel', dept: 'Department for Magical Law Enforcement', note: 'Helped rebuild wizarding legal framework shattered by Voldemort\'s regime.' },
                { period: '2000–2007', role: 'Senior Counsel → Head of Division', dept: 'Department for Regulation of Magical Creatures', note: 'Drafted and passed historic House-Elf Rights Legislation. Promoted three times.' },
                { period: '2007–2019', role: 'Deputy Minister for Magic', dept: 'Office of the Minister', note: 'Youngest Deputy in history. Wizengamot reform, Muggle Relations Act, Ministry transparency.' },
                { period: '2019→', role: 'Minister for Magic', dept: 'Ministry of Magic, London', note: 'Youngest ever. First Muggle-born. Still in office. Still reading every brief.' },
              ].map((c, i) => (
                <div key={c.role} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 24, paddingBottom: 20, marginBottom: 20, borderBottom: i < 3 ? `1px solid rgba(127,29,29,0.15)` : 'none' }}>
                  <p className={cinzel.className} style={{ fontSize: 11, color: gold, margin: 0, fontWeight: 600 }}>{c.period}</p>
                  <div>
                    <p className={cinzel.className} style={{ fontSize: 13, color: ink, margin: '0 0 2px', fontWeight: 900 }}>{c.role}</p>
                    <p className={garamond.className} style={{ fontSize: 14, color: burgundy, margin: '0 0 6px', fontStyle: 'italic' }}>{c.dept}</p>
                    <p className={garamond.className} style={{ fontSize: 17, color: '#5a3020', margin: 0, lineHeight: 1.65 }}>{c.note}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ornamental divider */}
        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <p className={cinzel.className} style={{ color: 'rgba(201,153,63,0.4)', letterSpacing: '0.5em', fontSize: 14 }}>✦ ✦ ✦</p>
        </div>

        {/* ── CLOSING — author's note style ── */}
        <div className="page-bg" style={{ padding: '48px 56px', marginBottom: 48, textAlign: 'center' }}>
          <p className={cinzel.className} style={{ fontSize: 10, color: burgundy, letterSpacing: '0.4em', margin: '0 0 24px' }}>A NOTE ON THE SUBJECT</p>
          <p className={garamond.className} style={{ fontSize: 20, lineHeight: 1.9, color: '#3d1f14', fontStyle: 'italic', marginBottom: 20 }}>
            &ldquo;The brightest witch of her age did not inherit the wizarding world. She earned every inch of it — and spent the rest of her life making it more just than she found it.&rdquo;
          </p>
          <div style={{ width: 60, height: 1, background: gold, margin: '24px auto' }} />
          <p className={cinzel.className} style={{ fontSize: 11, color: gold, letterSpacing: '0.2em', margin: 0 }}>HARRY POTTER · 2024</p>
        </div>

        {/* Bottom stripe + footer */}
        <div style={{ height: 3, background: `linear-gradient(90deg, ${burgundy}, ${gold}, ${burgundy})`, marginBottom: 24 }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className={cinzel.className} style={{ fontSize: 10, color: 'rgba(201,153,63,0.3)', margin: 0, letterSpacing: '0.2em' }}>MINISTRY OF MAGIC · OFFICIAL RECORD</p>
          <p className={garamond.className} style={{ fontSize: 13, color: 'rgba(201,153,63,0.4)', margin: 0, fontStyle: 'italic' }}>
            Designed by <Link href="/" style={{ color: gold, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
