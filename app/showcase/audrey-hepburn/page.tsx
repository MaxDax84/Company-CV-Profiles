'use client'

import Link from 'next/link'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'], style: ['normal', 'italic'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '600'], style: ['normal', 'italic'] })

const gold = '#c9a84c'
const goldLight = '#e0bc6e'
const darkBg = '#0a0907'
const midBg = '#0f0d0b'
const cardBg = 'rgba(201,168,76,0.04)'
const border = 'rgba(255,255,255,0.06)'
const borderGold = 'rgba(201,168,76,0.25)'

const films = [
  { year: '1953', title: 'Roman Holiday', role: 'Princess Ann', award: '★ Academy Award, Best Actress', note: 'Her debut leading role. Overnight global icon.' },
  { year: '1954', title: 'Sabrina', role: 'Sabrina Fairchild', award: 'Oscar Nomination · BAFTA Award', note: 'Hubert de Givenchy designed her wardrobe. A lifelong partnership began.' },
  { year: '1961', title: "Breakfast at Tiffany's", role: 'Holly Golightly', award: 'Grammy Award · Moon River', note: "The role that defined a generation's idea of New York elegance." },
  { year: '1964', title: 'My Fair Lady', role: 'Eliza Doolittle', award: 'One of her most beloved roles', note: 'Musical adaptation. Hepburn dubbed by Marni Nixon — a controversy that followed her.' },
  { year: '1967', title: 'Wait Until Dark', role: 'Susy Hendrix', award: 'Oscar Nomination', note: 'Playing blind against a professional killer. Broadway-trained tension at its finest.' },
]

export default function AudreyHepburnPage() {
  return (
    <div className={cormorant.className} style={{ background: darkBg, color: '#e8e0d0', overflowX: 'hidden' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(10,9,7,0.9)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 40px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={playfair.className} style={{ fontSize: 14, color: gold, fontStyle: 'italic' }}>AH</span>
          <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
            {[['#biography', 'Biography'], ['#films', 'Filmography'], ['#awards', 'Awards'], ['#humanitarian', 'Legacy']].map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 13, color: '#6b5e4a', textDecoration: 'none', letterSpacing: '0.12em', fontFamily: cormorant.style.fontFamily }}>{label}</a>
            ))}
            <Link href="/showcase" style={{ fontSize: 12, color: '#3d3020', textDecoration: 'none', letterSpacing: '0.1em' }}>← Showcase</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', background: `radial-gradient(ellipse at 30% 60%, rgba(201,168,76,0.07), transparent 55%), ${darkBg}`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, transparent 60%, ${darkBg} 100%)` }} />
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '80px 40px' }}>
          <p className={cormorant.className} style={{ fontSize: 13, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 24px' }}>Actress · Humanitarian · Style Icon</p>
          <h1 className={playfair.className} style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 900, margin: '0 0 8px', lineHeight: 0.9, letterSpacing: '-0.02em', color: '#ffffff' }}>
            Audrey
          </h1>
          <h1 className={playfair.className} style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 400, fontStyle: 'italic', margin: '0 0 36px', lineHeight: 0.9, color: gold }}>
            Hepburn
          </h1>
          <p className={cormorant.className} style={{ fontSize: 20, color: '#9c8870', marginBottom: 48, fontStyle: 'italic', maxWidth: 480, lineHeight: 1.6, fontWeight: 300 }}>
            &ldquo;The most elegant performer of her century — and its most compassionate humanitarian.&rdquo;
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['Born', '4 May 1929, Brussels'], ['Career', '1948–1993'], ['Awards', 'EGOT + Presidential Medal'], ['Legacy', 'UNICEF Goodwill Ambassador']].map(([k, v]) => (
              <div key={k} style={{ padding: '14px 20px', background: cardBg, border: `1px solid ${borderGold}`, borderRadius: 8 }}>
                <p style={{ fontSize: 10, color: '#6b5e4a', margin: '0 0 2px', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{k}</p>
                <p className={playfair.className} style={{ fontSize: 14, color: '#e8e0d0', margin: 0, fontWeight: 700 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BIOGRAPHY */}
      <section id="biography" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <p className={cormorant.className} style={{ fontSize: 12, letterSpacing: '0.4em', color: gold, textTransform: 'uppercase', marginBottom: 20 }}>01 · Biography</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 32px', color: '#ffffff' }}>
                She survived a war.<br />
                <em style={{ color: gold, fontWeight: 400 }}>Then conquered Hollywood.</em>
              </h2>
              <blockquote style={{ borderLeft: `2px solid ${gold}`, paddingLeft: 24, margin: 0 }}>
                <p className={cormorant.className} style={{ fontSize: 22, color: '#e8e0d0', fontStyle: 'italic', margin: 0, lineHeight: 1.65, fontWeight: 300 }}>
                  &ldquo;Nothing is impossible, the word itself says I&rsquo;m possible.&rdquo;
                </p>
              </blockquote>
            </div>
            <div>
              <p className={cormorant.className} style={{ fontSize: 19, lineHeight: 1.85, color: '#9c8870', marginBottom: 24, fontWeight: 300 }}>
                Born Audrey Kathleen Ruston in Brussels, she survived the Nazi occupation of the Netherlands as a child — an experience that permanently shaped her profound empathy for the world&apos;s most vulnerable.
              </p>
              <p className={cormorant.className} style={{ fontSize: 19, lineHeight: 1.85, color: '#9c8870', marginBottom: 28, fontWeight: 300 }}>
                She trained in ballet in Amsterdam before pivoting to acting — a decision that would make her one of the most luminous presences in the history of cinema. In her final years, she devoted herself entirely to humanitarian work.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[['Birth Name', 'Audrey Kathleen Ruston'], ['Born', '4 May 1929, Brussels'], ['Died', '20 January 1993, Tolochenaz'], ['Training', 'Ballet · London & Amsterdam']].map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 14px', background: cardBg, border: `1px solid ${borderGold}`, borderRadius: 6 }}>
                    <p className={cormorant.className} style={{ fontSize: 11, color: '#6b5e4a', margin: '0 0 2px', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{k}</p>
                    <p className={playfair.className} style={{ fontSize: 13, color: '#e8e0d0', margin: 0, fontWeight: 700 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FILMOGRAPHY */}
      <section id="films" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <p className={cormorant.className} style={{ fontSize: 12, letterSpacing: '0.4em', color: gold, textTransform: 'uppercase', marginBottom: 20 }}>02 · Selected Filmography</p>
          <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 56px', color: '#ffffff' }}>
            Five films.<br /><em style={{ color: gold, fontWeight: 400 }}>Five lifetimes of performance.</em>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {films.map((f) => (
              <div key={f.title} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 12, padding: '24px 28px', display: 'grid', gridTemplateColumns: '64px 1fr auto', gap: 24, alignItems: 'center', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = borderGold; el.style.transform = 'translateX(6px)'; el.style.background = 'rgba(201,168,76,0.06)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = border; el.style.transform = 'translateX(0)'; el.style.background = cardBg }}
              >
                <p className={cormorant.className} style={{ fontSize: 22, color: gold, fontStyle: 'italic', margin: 0, fontWeight: 300 }}>{f.year}</p>
                <div>
                  <p className={playfair.className} style={{ fontSize: 18, fontWeight: 700, color: '#e8e0d0', margin: '0 0 2px' }}>{f.title}</p>
                  <p className={cormorant.className} style={{ fontSize: 15, color: '#6b5e4a', margin: '0 0 4px' }}>as {f.role}</p>
                  <p className={cormorant.className} style={{ fontSize: 15, color: '#9c8870', margin: 0, lineHeight: 1.5, fontWeight: 300 }}>{f.note}</p>
                </div>
                <span className={cormorant.className} style={{ fontSize: 13, color: gold, fontStyle: 'italic', textAlign: 'right', minWidth: 180, lineHeight: 1.4 }}>{f.award}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AWARDS & HUMANITARIAN */}
      <section id="awards" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <p className={cormorant.className} style={{ fontSize: 12, letterSpacing: '0.4em', color: gold, textTransform: 'uppercase', marginBottom: 20 }}>03 · Awards</p>
          <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 56px', color: '#ffffff' }}>
            One of only 17 people in history<br /><em style={{ color: gold, fontWeight: 400 }}>to achieve the EGOT.</em>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
            {[
              { award: 'Academy Award', detail: 'Best Actress — Roman Holiday (1953)', color: '#f59e0b' },
              { award: 'Tony Award', detail: 'Best Actress — Ondine (1954)', color: '#8b5cf6' },
              { award: 'Grammy Award', detail: 'Spoken Word Recording (1993)', color: '#10b981' },
              { award: 'Emmy Award', detail: 'Outstanding Individual Performance (1993)', color: '#3b82f6' },
              { award: 'Presidential Medal of Freedom', detail: 'Awarded posthumously (1994)', color: gold },
              { award: 'BAFTA Award', detail: 'Best British Actress (1955, 1960)', color: '#ef4444' },
            ].map(({ award, detail, color }) => (
              <div key={award} style={{ padding: '20px', background: cardBg, border: `1px solid ${border}`, borderRadius: 12, borderTop: `3px solid ${color}`, transition: 'all 0.25s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(-4px)'; el.style.boxShadow = `0 12px 32px ${color}18` }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = 'none' }}
              >
                <p className={playfair.className} style={{ fontSize: 16, fontWeight: 700, color: '#e8e0d0', margin: '0 0 6px' }}>{award}</p>
                <p className={cormorant.className} style={{ fontSize: 15, color: '#6b5e4a', margin: 0, lineHeight: 1.4 }}>{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HUMANITARIAN LEGACY */}
      <section id="humanitarian" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 40px' }}>
          <p className={cormorant.className} style={{ fontSize: 12, letterSpacing: '0.4em', color: gold, textTransform: 'uppercase', marginBottom: 20 }}>04 · Humanitarian Legacy</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
            <div>
              <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontWeight: 700, lineHeight: 1.1, margin: '0 0 28px', color: '#ffffff' }}>
                She gave up cinema<br /><em style={{ color: gold, fontWeight: 400 }}>to save children.</em>
              </h2>
              <p className={cormorant.className} style={{ fontSize: 19, lineHeight: 1.85, color: '#9c8870', fontWeight: 300 }}>
                UNICEF Goodwill Ambassador from 1988 until her death in 1993. Audrey Hepburn traveled to Ethiopia,
                Sudan, El Salvador, Bangladesh, Vietnam, and Somalia — bringing global attention to children suffering
                from poverty and famine. She received the Presidential Medal of Freedom in 1992, the year before she died.
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[['1988–1993', 'UNICEF Goodwill Ambassador', 'Visited 6 countries across Africa, Asia, and Latin America'],['1992', 'Presidential Medal of Freedom', 'Awarded by President George H.W. Bush for humanitarian service'], ['1993', 'Jean Hersholt Humanitarian Award', 'Academy of Motion Picture Arts and Sciences'], ['Posthumous', 'Audrey Hepburn Children\'s Fund', 'Foundation continuing her UNICEF work worldwide']].map(([year, title, desc]) => (
                <div key={title} style={{ padding: '18px 22px', background: cardBg, border: `1px solid ${borderGold}`, borderRadius: 10 }}>
                  <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <p className={cormorant.className} style={{ fontSize: 13, color: gold, margin: '2px 0 0', minWidth: 90, fontStyle: 'italic' }}>{year}</p>
                    <div>
                      <p className={playfair.className} style={{ fontSize: 14, fontWeight: 700, color: '#e8e0d0', margin: '0 0 3px' }}>{title}</p>
                      <p className={cormorant.className} style={{ fontSize: 15, color: '#6b5e4a', margin: 0, lineHeight: 1.4 }}>{desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <footer style={{ background: midBg, borderTop: `1px solid ${border}`, padding: '24px 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className={cormorant.className} style={{ fontSize: 13, color: '#3d3020', fontStyle: 'italic' }}>4 May 1929 – 20 January 1993</p>
          <p className={cormorant.className} style={{ fontSize: 13, color: '#3d3020', fontStyle: 'italic' }}>
            Designed by <Link href="/" style={{ color: gold, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
