import Link from 'next/link'
import { Playfair_Display, Cormorant_Garamond } from 'next/font/google'
import type { Metadata } from 'next'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'], style: ['normal', 'italic'] })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '600'], style: ['normal', 'italic'] })

export const metadata: Metadata = { title: 'Audrey Hepburn — GoOnWeb Showcase' }

export default function AudreyHepburnPage() {
  const gold = '#c9a84c'

  return (
    <div style={{ minHeight: '100vh', background: '#0c0b09', color: '#e8e0d0' }}>
      {/* Decorative border top */}
      <div style={{ height: 4, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />

      <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 32px' }}>
        <Link href="/showcase" style={{ fontSize: 12, color: '#6b5e4a', textDecoration: 'none', letterSpacing: '0.15em', fontFamily: cormorant.style.fontFamily }}>
          ← Showcase
        </Link>

        {/* Header */}
        <div style={{ textAlign: 'center', padding: '64px 0 48px', borderBottom: `1px solid ${gold}30` }}>
          <p className={cormorant.className} style={{ fontSize: 13, letterSpacing: '0.35em', color: gold, textTransform: 'uppercase', marginBottom: 24 }}>
            Actress · Humanitarian · Icon
          </p>
          <h1 className={playfair.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: '-0.02em' }}>
            Audrey
          </h1>
          <h1 className={playfair.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 400, fontStyle: 'italic', margin: 0, lineHeight: 1, color: gold }}>
            Hepburn
          </h1>
          <div className={cormorant.className} style={{ marginTop: 24, fontSize: 14, color: '#9c8870', letterSpacing: '0.2em' }}>
            4 May 1929, Brussels · 20 January 1993, Tolochenaz
          </div>
        </div>

        {/* Biography */}
        <section style={{ padding: '48px 0', borderBottom: `1px solid rgba(201,168,76,0.15)` }}>
          <h2 className={playfair.className} style={{ fontSize: 22, fontWeight: 700, color: gold, marginBottom: 20 }}>Biography</h2>
          <p className={cormorant.className} style={{ fontSize: 19, lineHeight: 1.9, color: '#c8b99a', fontWeight: 300 }}>
            Born Audrey Kathleen Ruston in Brussels, Belgium, she survived the Nazi occupation of the Netherlands
            as a child — an experience that would shape her profound empathy for the world&apos;s most vulnerable.
            She trained in ballet in Amsterdam and London before pivoting to acting, a decision that would make her
            one of the most luminous presences in the history of cinema.
          </p>
        </section>

        {/* Filmography */}
        <section style={{ padding: '48px 0', borderBottom: `1px solid rgba(201,168,76,0.15)` }}>
          <h2 className={playfair.className} style={{ fontSize: 22, fontWeight: 700, color: gold, marginBottom: 28 }}>Selected Filmography</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              ['1953', 'Roman Holiday', 'Princess Ann', '★ Academy Award, Best Actress'],
              ['1954', 'Sabrina', 'Sabrina Fairchild', 'Oscar Nomination · BAFTA Award'],
              ['1957', 'Funny Face', 'Jo Stockton', 'Golden Globe Nomination'],
              ['1959', 'The Nun\'s Story', 'Sister Luke', 'Oscar Nomination'],
              ['1961', 'Breakfast at Tiffany\'s', 'Holly Golightly', 'Grammy Award · "Moon River"'],
              ['1963', 'Charade', 'Regina Lampert', 'Golden Globe Nomination'],
              ['1964', 'My Fair Lady', 'Eliza Doolittle', 'One of her most beloved roles'],
              ['1967', 'Wait Until Dark', 'Susy Hendrix', 'Oscar Nomination'],
            ].map(([year, film, role, note]) => (
              <div key={film} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 20, padding: '16px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className={cormorant.className} style={{ fontSize: 13, color: gold, fontStyle: 'italic', paddingTop: 2 }}>{year}</span>
                <div>
                  <span className={playfair.className} style={{ fontWeight: 700, fontSize: 15 }}>{film}</span>
                  <span className={cormorant.className} style={{ color: '#8b7355', fontSize: 14 }}> — {role}</span>
                  {note && <p className={cormorant.className} style={{ fontSize: 13, color: '#6b5a3e', margin: '2px 0 0', fontStyle: 'italic' }}>{note}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Awards & Humanitarian */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, padding: '48px 0' }}>
          <div>
            <h2 className={playfair.className} style={{ fontSize: 20, fontWeight: 700, color: gold, marginBottom: 20 }}>Awards</h2>
            {['Academy Award (1953)', 'Tony Award (1954)', 'Grammy Award (1993)', 'Emmy Award (1993)', 'Presidential Medal of Freedom'].map(a => (
              <div key={a} className={cormorant.className} style={{ fontSize: 16, color: '#c8b99a', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {a}
              </div>
            ))}
            <p className={cormorant.className} style={{ fontSize: 13, color: gold, fontStyle: 'italic', marginTop: 12 }}>
              One of only 17 EGOT recipients in history
            </p>
          </div>
          <div>
            <h2 className={playfair.className} style={{ fontSize: 20, fontWeight: 700, color: gold, marginBottom: 20 }}>Humanitarian</h2>
            <p className={cormorant.className} style={{ fontSize: 16, color: '#c8b99a', lineHeight: 1.7, fontWeight: 300 }}>
              UNICEF Goodwill Ambassador from 1988 until her death in 1993. Traveled to Ethiopia, Sudan, El Salvador,
              Bangladesh, Vietnam and Somalia bringing attention to children suffering from poverty and famine.
            </p>
            <div style={{ marginTop: 16, padding: '12px 16px', background: `${gold}10`, border: `1px solid ${gold}30`, borderRadius: 4 }}>
              <p className={cormorant.className} style={{ fontStyle: 'italic', fontSize: 17, color: gold, margin: 0 }}>
                &ldquo;Nothing is impossible, the word itself says I&rsquo;m possible.&rdquo;
              </p>
            </div>
          </div>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 32, borderTop: `1px solid ${gold}20` }}>
          <p className={cormorant.className} style={{ fontSize: 13, color: '#4b3e2a', letterSpacing: '0.15em', fontStyle: 'italic' }}>
            Designed by <Link href="/" style={{ color: gold, textDecoration: 'none' }}>GoOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
