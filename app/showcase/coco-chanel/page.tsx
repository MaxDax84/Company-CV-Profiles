'use client'

import Link from 'next/link'
import { Cormorant_Garamond, Montserrat } from 'next/font/google'

const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'], style: ['normal', 'italic'] })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export default function CocoChannelPage() {
  const black = '#0a0a0a'
  const offwhite = '#f7f3ef'
  const warmgray = '#8c8279'
  const accent = '#2c2420'

  return (
    <div className={montserrat.className} style={{ minHeight: '100vh', background: offwhite, color: black, overflowX: 'hidden' }}>
      <style>{`
        .cc-main-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 52px; margin-bottom: 52px; }
        .cc-timeline-grid { display: grid; grid-template-columns: 52px 1fr; gap: 16px; }
        .cc-header-meta { display: flex; gap: 32px; flex-wrap: wrap; }
        .cc-header-top { display: flex; justify-content: space-between; align-items: flex-end; }
        .cc-back-mobile { display: none; font-size: 11px; color: #3a3a3a; text-decoration: none; letter-spacing: 0.15em; }

        @media (max-width: 700px) {
          .cc-main-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .cc-header-top { flex-direction: column; align-items: flex-start; gap: 16px; }
          .cc-back-mobile { display: block; }
        }
        @media (max-width: 480px) {
          .cc-timeline-grid { grid-template-columns: 44px 1fr !important; gap: 10px !important; }
          .cc-header-meta { gap: 16px !important; }
        }
      `}</style>

      {/* Black header band */}
      <div style={{ background: black, color: offwhite, padding: '0' }}>
        <div style={{ maxWidth: 840, margin: '0 auto', padding: '48px 40px 44px' }}>
          <div className="cc-header-top">
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.5em', color: warmgray, textTransform: 'uppercase', margin: '0 0 16px', fontWeight: 500 }}>
                Couturière · Parfumeur · Icône de la Mode
              </p>
              <h1 className={cormorant.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 700, margin: 0, lineHeight: 0.9, letterSpacing: '-0.02em', color: offwhite }}>
                Gabrielle<br />
                <em style={{ fontStyle: 'italic', fontWeight: 300, color: warmgray }}>&ldquo;Coco&rdquo;</em><br />
                Chanel
              </h1>
            </div>
            <Link href="/showcase" className="cc-back-mobile" style={{ fontSize: 11, color: '#3a3a3a', textDecoration: 'none', letterSpacing: '0.15em', marginBottom: 4 }}>
              ← SHOWCASE
            </Link>
          </div>
          <div className="cc-header-meta" style={{ marginTop: 28 }}>
            {[['Born', '19 August 1883 · Saumur, France'], ['Died', '10 January 1971 · Paris, France'], ['House', 'Maison Chanel · est. 1910']].map(([k, v]) => (
              <div key={k}>
                <p style={{ fontSize: 9, color: '#3a3a3a', margin: '0 0 3px', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 600 }}>{k}</p>
                <p className={cormorant.className} style={{ fontSize: 15, color: warmgray, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 840, margin: '0 auto', padding: '52px 40px 80px' }}>

        {/* Biography */}
        <section style={{ marginBottom: 52, borderBottom: '1px solid #e5e0da', paddingBottom: 52 }}>
          <p style={{ fontSize: 10, letterSpacing: '0.3em', color: warmgray, textTransform: 'uppercase', fontWeight: 600, marginBottom: 20 }}>Biography</p>
          <p className={cormorant.className} style={{ fontSize: 20, lineHeight: 1.85, color: '#3d3028', fontWeight: 300 }}>
            Born to humble origins in Saumur, raised in the orphanage of Aubazine by nuns who taught her to sew,
            Gabrielle Bonheur Chanel transcended circumstance to become the most influential fashion designer of
            the twentieth century. She liberated women from the corset, introduced jersey to haute couture,
            conceived the concept of the &ldquo;little black dress&rdquo;, and created the most iconic fragrance
            in history. She did not dress women — she transformed them.
          </p>
        </section>

        <div className="cc-main-grid">
          {/* Career timeline */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.3em', color: warmgray, textTransform: 'uppercase', fontWeight: 600, marginBottom: 24 }}>Maison — Career</p>
            {[
              ['1910', 'Millinery boutique', 'Opened first hat shop at 21 rue Cambon, Paris.'],
              ['1913', 'Deauville boutique', 'Introduced sportswear. Jersey fabrics for women — revolutionary.'],
              ['1915', 'Haute Couture, Biarritz', 'First true couture house. Dressed women liberated by WWI roles.'],
              ['1921', 'Chanel N°5', 'Created with Ernest Beaux. First perfume to use aldehydes. Changed perfumery forever.'],
              ['1926', 'La Petite Robe Noire', 'The little black dress. Vogue called it "the Ford of fashion".'],
              ['1955', 'The 2.55 bag', 'Quilted shoulder bag. Named for its creation date: February 1955.'],
              ['1983 →', 'Karl Lagerfeld', 'Appointed Creative Director. Preserved and reimagined the legacy.'],
            ].map(([year, title, desc]) => (
              <div key={title} className="cc-timeline-grid" style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #e8e3dd' }}>
                <span className={cormorant.className} style={{ fontSize: 13, color: warmgray, fontStyle: 'italic', paddingTop: 2 }}>{year}</span>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 13, color: black, margin: '0 0 2px' }}>{title}</p>
                  <p className={cormorant.className} style={{ fontSize: 15, color: '#6b5e54', margin: 0, lineHeight: 1.5, fontWeight: 300 }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Innovations & Legacy */}
          <div>
            <p style={{ fontSize: 10, letterSpacing: '0.3em', color: warmgray, textTransform: 'uppercase', fontWeight: 600, marginBottom: 24 }}>Innovations</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 40 }}>
              {[
                ['Costume Jewellery', 'Made fake jewellery fashionable — revolutionary in 1920s Paris.'],
                ['Jersey Fabric', 'Borrowed mens\' sportswear fabric. Freedom of movement for women.'],
                ['The Suit', 'Chanel suit — 1923. Collarless, braid-trimmed. Copied worldwide.'],
                ['Suntanning', 'Popularised the suntan after accidentally tanning in Cannes (1923).'],
                ['Trousers for Women', 'Wore trousers publicly decades before accepted — a scandal, then a norm.'],
              ].map(([title, desc]) => (
                <div key={title} style={{ borderLeft: '2px solid #c8bdb6', paddingLeft: 14 }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: black, margin: '0 0 2px' }}>{title}</p>
                  <p className={cormorant.className} style={{ fontSize: 15, color: '#8c8279', margin: 0, lineHeight: 1.4, fontWeight: 300 }}>{desc}</p>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 10, letterSpacing: '0.3em', color: warmgray, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16 }}>Recognition</p>
            {['Time 100 Most Important People of the Century', 'Légion d\'Honneur (declined)', 'Fragrance Hall of Fame — N°5', 'Forbes Most Influential Women of the Century'].map(a => (
              <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 4, height: 4, background: warmgray, borderRadius: '50%', flexShrink: 0 }} />
                <p className={cormorant.className} style={{ fontSize: 16, color: '#6b5e54', margin: 0 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div style={{ textAlign: 'center', padding: '40px', background: black, borderRadius: 4 }}>
          <p className={cormorant.className} style={{ fontSize: 24, color: offwhite, fontStyle: 'italic', margin: 0, lineHeight: 1.6, fontWeight: 300 }}>
            &ldquo;In order to be irreplaceable, one must always be different.&rdquo;
          </p>
          <div style={{ width: 40, height: 1, background: warmgray, margin: '20px auto 0' }} />
        </div>

        <div style={{ textAlign: 'center', marginTop: 48 }}>
          <p className={cormorant.className} style={{ fontSize: 14, color: '#c8bdb6', fontStyle: 'italic' }}>
            Designed by <Link href="/" style={{ color: accent, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
