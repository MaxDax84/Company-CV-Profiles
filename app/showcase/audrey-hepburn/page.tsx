'use client'

import Link from 'next/link'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'], style: ['normal', 'italic'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '600'], style: ['normal', 'italic'] })

const gold = '#c9a84c'
const darkBg = '#0a0907'
const parchment = 'rgba(201,168,76,0.07)'
const borderGold = 'rgba(201,168,76,0.3)'

const films = [
  { year: '1953', title: 'Roman Holiday', role: 'Princess Ann', award: 'Academy Award · Best Actress', note: 'Her debut leading role. Overnight global icon. Shot on location in Rome with Gregory Peck.' },
  { year: '1954', title: 'Sabrina', role: 'Sabrina Fairchild', award: 'Oscar Nomination · BAFTA Award', note: 'Hubert de Givenchy designed her wardrobe for the first time. A lifelong partnership began.' },
  { year: '1961', title: "Breakfast at Tiffany's", role: 'Holly Golightly', award: 'Grammy Award — Moon River', note: "The role that defined a generation's idea of New York elegance. Holly Golightly, forever." },
  { year: '1964', title: 'My Fair Lady', role: 'Eliza Doolittle', award: 'One of her most beloved roles', note: 'Musical adaptation. Dubbed by Marni Nixon — a controversy that followed her for years.' },
  { year: '1967', title: 'Wait Until Dark', role: 'Susy Hendrix', award: 'Academy Award Nomination', note: 'Playing blind against a professional killer. Broadway-trained psychological tension at its finest.' },
]

export default function AudreyHepburnPage() {
  return (
    <div className={cormorant.className} style={{ background: darkBg, color: '#e8e0d0', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .ah-pull-quote {
          margin: 0 -80px;
          padding: 0 80px;
        }
        .ah-header {
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .ah-header-date { display: block; }
        .ah-back-mobile { display: none; font-size: 13px; color: #4b3e2e; text-decoration: none; letter-spacing: 0.15em; font-style: italic; }
        .ah-film-grid { display: grid; grid-template-columns: 48px 1fr; gap: 32; }
        .ah-footer-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }

        @media (max-width: 900px) {
          .ah-pull-quote { margin: 0; padding: 0; }
        }
        .ah-content-col { padding: 0 40px 100px; }
        .ah-hero { padding: 100px 0 80px; }

        @media (max-width: 600px) {
          .ah-pull-quote { margin: 0 !important; padding: 0 !important; }
          .ah-header { padding: 12px 20px !important; }
          .ah-header-date { display: none; }
          .ah-back-mobile { display: block; }
          .ah-content-col { padding: 0 20px 60px !important; }
          .ah-hero { padding: 56px 0 40px !important; }
        }
      `}</style>

      {/* Top strip */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />

      {/* Minimal header */}
      <div className="ah-header">
        <Link href="/showcase" className={cormorant.className} style={{ fontSize: 13, color: '#4b3e2e', textDecoration: 'none', letterSpacing: '0.15em', fontStyle: 'italic' }}>← Showcase</Link>
        <p className={cormorant.className} style={{ fontSize: 11, color: '#4b3e2e', letterSpacing: '0.4em', margin: 0, textTransform: 'uppercase' }}>BeOnWeb · Style Showcase</p>
        <p className={`ah-header-date ${cormorant.className}`} style={{ fontSize: 12, color: '#4b3e2e', margin: 0, fontStyle: 'italic' }}>4 May 1929 – 20 January 1993</p>
      </div>

      {/* ── OPENING — full-bleed typographic title ── */}
      <section className="ah-hero" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.06), transparent 60%)`, pointerEvents: 'none' }} />
        <p className={cormorant.className} style={{ fontSize: 12, letterSpacing: '0.6em', color: gold, textTransform: 'uppercase', margin: '0 0 32px' }}>
          Actress · Humanitarian · Style Icon
        </p>
        <h1 className={playfair.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.9, margin: '0 0 0', color: '#ffffff', letterSpacing: '-0.02em' }}>
          Audrey
        </h1>
        <h1 className={playfair.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 0.9, color: gold, letterSpacing: '-0.01em', margin: '0 0 48px' }}>
          Hepburn
        </h1>
        <div style={{ width: 1, height: 80, background: `linear-gradient(to bottom, ${gold}, transparent)`, margin: '0 auto' }} />
      </section>

      {/* ── MAGAZINE CONTENT COLUMN ── */}
      <div className="ah-content-col" style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* Opening quote — editorial pull style */}
        <div className="ah-pull-quote" style={{ borderTop: `1px solid ${borderGold}`, borderBottom: `1px solid ${borderGold}`, padding: '40px 80px', margin: '0 -80px 64px', textAlign: 'center' }}>
          <p className={playfair.className} style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 400, fontStyle: 'italic', color: '#e8e0d0', margin: 0, lineHeight: 1.5 }}>
            &ldquo;Nothing is impossible — the word itself says I&rsquo;m possible.&rdquo;
          </p>
        </div>

        {/* Biography — drop cap first paragraph */}
        <section id="biography">
          <p className={cormorant.className} style={{ fontSize: 11, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 28px' }}>Biography</p>

          {/* Drop cap effect */}
          <p className={cormorant.className} style={{ fontSize: 21, lineHeight: 1.85, color: '#9c8870', marginBottom: 24, fontWeight: 300 }}>
            <span className={playfair.className} style={{ float: 'left', fontSize: '4.5em', lineHeight: 0.75, paddingRight: 12, paddingTop: 10, color: gold, fontWeight: 900 }}>B</span>
            orn Audrey Kathleen Ruston in Brussels on 4 May 1929, she survived the Nazi occupation of the Netherlands as a child — an experience that permanently shaped her profound empathy for those the world had abandoned. She came of age in wartime, watching, hungry, and learning.
          </p>
          <p className={cormorant.className} style={{ fontSize: 21, lineHeight: 1.85, color: '#9c8870', marginBottom: 24, fontWeight: 300 }}>
            She trained in ballet — Amsterdam first, then London — before the theatre claimed her. A chance encounter in Monte Carlo, where novelist Colette spotted her and insisted she play the lead in the Broadway production of <em>Gigi</em>, changed everything. By 1953, Roman Holiday had made her the most luminous face in Hollywood.
          </p>

          {/* Pull quote mid-article */}
          <div className="ah-pull-quote" style={{ margin: '40px -80px', padding: '36px 80px', background: parchment, borderLeft: `3px solid ${gold}` }}>
            <p className={playfair.className} style={{ fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontStyle: 'italic', color: '#e8e0d0', margin: 0, lineHeight: 1.55 }}>
              &ldquo;She survived a war. Then she conquered Hollywood. Then she gave it all up — for children she would never meet.&rdquo;
            </p>
          </div>

          <p className={cormorant.className} style={{ fontSize: 21, lineHeight: 1.85, color: '#9c8870', marginTop: 40, marginBottom: 0, fontWeight: 300 }}>
            In her final years, Hepburn devoted herself entirely to UNICEF. She traveled to Ethiopia, Sudan, Bangladesh, Vietnam, and Somalia — places that the cameras had left. She sat with dying children, held their hands, and put her face to their suffering until the world was forced to look.
          </p>
        </section>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '64px 0' }}>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
          <span style={{ color: gold, fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
        </div>

        {/* Filmography — editorial numbered list */}
        <section id="films">
          <p className={cormorant.className} style={{ fontSize: 11, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 48px' }}>Selected Filmography</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {films.map((f, i) => (
              <div key={f.title} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 32, paddingBottom: 40, marginBottom: 40, borderBottom: i < films.length - 1 ? `1px solid rgba(201,168,76,0.12)` : 'none' }}>
                {/* Number */}
                <div style={{ paddingTop: 6 }}>
                  <p className={playfair.className} style={{ fontSize: 36, fontWeight: 900, color: 'rgba(201,168,76,0.2)', margin: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</p>
                </div>
                {/* Content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
                    <p className={playfair.className} style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: 0 }}>{f.title}</p>
                    <p className={cormorant.className} style={{ fontSize: 14, color: gold, margin: 0, fontStyle: 'italic', letterSpacing: '0.1em' }}>{f.year}</p>
                  </div>
                  <p className={cormorant.className} style={{ fontSize: 16, color: 'rgba(201,168,76,0.6)', margin: '0 0 10px', fontStyle: 'italic' }}>as {f.role}</p>
                  <p className={cormorant.className} style={{ fontSize: 19, color: '#9c8870', margin: '0 0 10px', lineHeight: 1.7, fontWeight: 300 }}>{f.note}</p>
                  <p className={cormorant.className} style={{ fontSize: 14, color: gold, margin: 0, letterSpacing: '0.05em' }}>{f.award}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '64px 0' }}>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
          <span style={{ color: gold, fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
        </div>

        {/* Awards — inline editorial block, not cards */}
        <section id="awards">
          <p className={cormorant.className} style={{ fontSize: 11, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 28px' }}>Awards & Honours</p>
          <p className={playfair.className} style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 28 }}>
            One of only 17 people in history to achieve the EGOT.
          </p>
          <p className={cormorant.className} style={{ fontSize: 20, color: '#9c8870', lineHeight: 1.85, marginBottom: 32, fontWeight: 300 }}>
            Academy Award (1953, <em>Roman Holiday</em>) · Tony Award (1954, <em>Ondine</em>) · Grammy Award (1993) · Emmy Award (1993) — and the Presidential Medal of Freedom, awarded just months before her death. She received the Jean Hersholt Humanitarian Award from the Academy of Motion Picture Arts and Sciences. The EGOT arrived as an afterthought. Hepburn had long since stopped counting.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['Academy Award', 'Tony Award', 'Grammy Award', 'Emmy Award', 'BAFTA Award', 'Presidential Medal of Freedom'].map(a => (
              <span key={a} className={cormorant.className} style={{ fontSize: 14, padding: '6px 16px', border: `1px solid ${borderGold}`, borderRadius: 99, color: gold, letterSpacing: '0.08em', fontStyle: 'italic' }}>{a}</span>
            ))}
          </div>
        </section>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '64px 0' }}>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
          <span style={{ color: gold, fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
        </div>

        {/* Humanitarian — full-width pull quote + text */}
        <section id="humanitarian">
          <p className={cormorant.className} style={{ fontSize: 11, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 28px' }}>Humanitarian Legacy</p>

          <div className="ah-pull-quote" style={{ margin: '0 -80px 48px', padding: '40px 80px', borderTop: `1px solid ${borderGold}`, borderBottom: `1px solid ${borderGold}` }}>
            <p className={playfair.className} style={{ fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontStyle: 'italic', color: '#e8e0d0', margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
              &ldquo;She gave up cinema to save children. And she never once looked back.&rdquo;
            </p>
          </div>

          <p className={cormorant.className} style={{ fontSize: 21, color: '#9c8870', lineHeight: 1.85, marginBottom: 24, fontWeight: 300 }}>
            UNICEF Goodwill Ambassador from 1988 until her death on 20 January 1993. Ethiopia, Sudan, El Salvador, Bangladesh, Vietnam, Somalia. She sat with children no headline would cover and brought the world's cameras after her. The Presidential Medal of Freedom followed in 1992 — her last year of strength.
          </p>
          <p className={cormorant.className} style={{ fontSize: 21, color: '#9c8870', lineHeight: 1.85, fontWeight: 300 }}>
            The Audrey Hepburn Children's Fund continues her work. She left no memoir, no autobiography. She left only the photographs of the places she went — and the faces of the children she refused to forget.
          </p>
        </section>

        {/* Footer */}
        <div className="ah-footer-row" style={{ marginTop: 80, paddingTop: 32, borderTop: `1px solid rgba(201,168,76,0.15)` }}>
          <p className={cormorant.className} style={{ fontSize: 13, color: '#4b3e2e', fontStyle: 'italic', margin: 0 }}>4 May 1929 – 20 January 1993</p>
          <p className={cormorant.className} style={{ fontSize: 13, color: '#4b3e2e', fontStyle: 'italic', margin: 0 }}>
            Designed by <Link href="/" style={{ color: gold, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
