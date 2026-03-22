import Link from 'next/link'
import { EB_Garamond, Cinzel } from 'next/font/google'
import type { Metadata } from 'next'

const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500', '700', '800'], style: ['normal', 'italic'] })
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '900'] })

export const metadata: Metadata = { title: 'Hermione Granger — BeOnWeb Showcase' }

export default function HermioneGrangerPage() {
  const burgundy = '#7f1d1d'
  const gold = '#c9993f'
  const parchment = '#fdf6e3'
  const ink = '#2c1810'

  return (
    <div style={{ minHeight: '100vh', background: '#3b0a14', color: parchment }}>
      {/* Parchment-style decorative top */}
      <div style={{ height: 6, background: `linear-gradient(90deg, ${burgundy}, ${gold}, ${burgundy})` }} />

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 32px 80px' }}>
        <Link href="/showcase" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none', fontFamily: garamond.style.fontFamily, letterSpacing: '0.1em' }}>
          ← Showcase
        </Link>

        {/* Crest-style header */}
        <div style={{ textAlign: 'center', padding: '48px 0 40px' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
          <p className={cinzel.className} style={{ fontSize: 11, letterSpacing: '0.4em', color: gold, textTransform: 'uppercase', marginBottom: 8 }}>
            Hogwarts School of Witchcraft and Wizardry
          </p>
          <p className={cinzel.className} style={{ fontSize: 11, letterSpacing: '0.3em', color: '#b45309', marginBottom: 24, textTransform: 'uppercase' }}>
            Gryffindor · Ministry of Magic
          </p>
          <h1 className={cinzel.className} style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontWeight: 900, margin: 0, lineHeight: 1.1, color: parchment }}>
            Hermione<br />
            <span style={{ color: gold }}>Granger</span>
          </h1>
          <div style={{ width: 80, height: 2, background: `linear-gradient(90deg, transparent, ${gold}, transparent)`, margin: '20px auto' }} />
          <p className={garamond.className} style={{ fontSize: 16, color: '#d4a574', fontStyle: 'italic' }}>
            Witch · Scholar · Minister for Magic
          </p>
        </div>

        {/* Parchment bio card */}
        <div style={{ background: parchment, borderRadius: 4, padding: 32, marginBottom: 28, color: ink, border: `2px solid ${gold}60`, boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 0 60px rgba(201,153,63,0.08)` }}>
          <h2 className={cinzel.className} style={{ fontSize: 16, color: burgundy, marginBottom: 16, letterSpacing: '0.1em' }}>Biography</h2>
          <p className={garamond.className} style={{ fontSize: 18, lineHeight: 1.85, fontWeight: 400, color: '#3d1f14' }}>
            Born 19 September 1979 to muggle parents Jean and Robert Granger. Received Hogwarts letter at age 11;
            excelled from first day. Achieved 11 O.W.L.s — highest marks in her year. Founded S.P.E.W. (Society for
            the Promotion of Elfish Welfare) in 1994. Essential participant in the defeat of Lord Voldemort in 1998.
            Went on to reform the Department for the Regulation and Control of Magical Creatures, then rose to
            become Minister for Magic — the youngest in history.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
          {/* Academic record */}
          <div style={{ background: 'rgba(253,246,227,0.06)', border: `1px solid ${gold}40`, borderRadius: 4, padding: 24 }}>
            <h2 className={cinzel.className} style={{ fontSize: 14, color: gold, marginBottom: 20, letterSpacing: '0.1em' }}>
              Academic Record
            </h2>
            {[
              ['O.W.L.s', '11 Outstanding'],
              ['N.E.W.T.s', '7 Outstanding, 3 Exceeds Expectations'],
              ['House', 'Gryffindor'],
              ['Positions', 'Prefect, Head Girl'],
              ['Year', '1991–1998'],
              ['Mentor', 'Prof. McGonagall'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '8px 0', borderBottom: `1px solid ${gold}20` }}>
                <p style={{ fontSize: 10, color: gold, margin: '0 0 2px', letterSpacing: '0.1em', fontFamily: cinzel.style.fontFamily }}>{k}</p>
                <p className={garamond.className} style={{ fontSize: 15, color: parchment, margin: 0 }}>{v}</p>
              </div>
            ))}
          </div>

          {/* Mastered subjects */}
          <div style={{ background: 'rgba(253,246,227,0.06)', border: `1px solid ${gold}40`, borderRadius: 4, padding: 24 }}>
            <h2 className={cinzel.className} style={{ fontSize: 14, color: gold, marginBottom: 20, letterSpacing: '0.1em' }}>
              Magical Proficiencies
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {['Transfiguration', 'Charms', 'Potions', 'Arithmancy', 'Ancient Runes', 'Legilimency Resistance', 'Apparition', 'Time-Turner Usage'].map(sub => (
                <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: gold, fontSize: 12 }}>✦</span>
                  <span className={garamond.className} style={{ fontSize: 15, color: parchment }}>{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Career */}
        <div style={{ background: 'rgba(253,246,227,0.06)', border: `1px solid ${gold}40`, borderRadius: 4, padding: 28, marginBottom: 28 }}>
          <h2 className={cinzel.className} style={{ fontSize: 14, color: gold, marginBottom: 20, letterSpacing: '0.1em' }}>Career</h2>
          {[
            ['1998', 'Department for Magical Law Enforcement', 'Junior Counsel. Helped rebuild Wizarding World post-Second Wizarding War.'],
            ['2000–2007', 'Department for Regulation of Magical Creatures', 'Spearheaded historic House-Elf rights legislation. Promoted three times.'],
            ['2007–2019', 'Deputy Minister, Ministry of Magic', 'Youngest Deputy in Ministry history. Wizengamot reform. Muggle Relations Act.'],
            ['2019 →', 'Minister for Magic', 'Historic appointment. Youngest and first Muggle-born Minister. Ongoing.'],
          ].map(([date, role, desc]) => (
            <div key={role} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: 20, paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${gold}20` }}>
              <div>
                <p className={cinzel.className} style={{ fontSize: 11, color: gold, margin: 0 }}>{date}</p>
              </div>
              <div>
                <p className={cinzel.className} style={{ fontWeight: 600, margin: '0 0 4px', fontSize: 13, color: parchment }}>{role}</p>
                <p className={garamond.className} style={{ color: '#c4a882', fontSize: 15, margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{ borderLeft: `4px solid ${gold}`, paddingLeft: 24, margin: '40px 0' }}>
          <p className={garamond.className} style={{ fontSize: 20, color: parchment, fontStyle: 'italic', margin: 0, lineHeight: 1.7 }}>
            &ldquo;Books! And cleverness! There are more important things — friendship and bravery.&rdquo;
          </p>
          <p className={garamond.className} style={{ fontSize: 13, color: gold, marginTop: 8 }}>— Hermione Granger, 1997</p>
        </div>

        <div style={{ textAlign: 'center', paddingTop: 32, borderTop: `1px solid ${gold}30` }}>
          <p className={garamond.className} style={{ fontSize: 12, color: '#6b5a3e', fontStyle: 'italic', letterSpacing: '0.1em' }}>
            Designed by <Link href="/" style={{ color: gold, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
