import Link from 'next/link'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = { title: 'Leonardo DiCaprio — BeOnWeb Showcase' }

export default function LeonardoDiCaprioPage() {
  const teal = '#0d9488'
  const tealLight = '#14b8a6'
  const bg = '#0d1c24'
  const card = '#132230'
  const border = '#1e3545'

  return (
    <div className={inter.className} style={{ minHeight: '100vh', background: bg, color: '#e2ece9' }}>

      {/* Top accent bar */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${teal}, ${tealLight}, ${teal})` }} />

      {/* Hero */}
      <div style={{ background: card, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px 36px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
            {/* Avatar placeholder */}
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: `${teal}22`, border: `2px solid ${teal}60`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
              🎬
            </div>
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.25em', color: tealLight, textTransform: 'uppercase', margin: '0 0 6px', fontWeight: 500 }}>
                Actor · Producer · Philanthropist
              </p>
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 700, margin: 0, lineHeight: 1, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Leonardo DiCaprio
              </h1>
              <p style={{ margin: '8px 0 0', fontSize: 13, color: '#7a9e97', fontWeight: 400 }}>
                Los Angeles, CA · Born November 11, 1974
              </p>
            </div>
          </div>
          <Link href="/showcase" style={{ fontSize: 12, color: '#4a7060', textDecoration: 'none', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>
            ← Showcase
          </Link>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }}>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Contact */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: tealLight, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, borderBottom: `1px solid ${border}`, paddingBottom: 8 }}>
                Contact
              </p>
              {[
                ['✉', 'management@leodicaprio.com'],
                ['🌐', 'leonardodicaprio.com'],
                ['📍', 'Los Angeles, CA'],
              ].map(([icon, val]) => (
                <div key={val} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, flexShrink: 0 }}>{icon}</span>
                  <span style={{ fontSize: 12, color: '#7a9e97', wordBreak: 'break-all', lineHeight: 1.4 }}>{val}</span>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: tealLight, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, borderBottom: `1px solid ${border}`, paddingBottom: 8 }}>
                Core Skills
              </p>
              {[['Method Acting', 98], ['Character Research', 97], ['Dramatic Range', 99], ['Action Sequences', 85], ['Producing', 88], ['Languages (3)', 75]].map(([skill, pct]) => (
                <div key={skill as string} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: '#b0cfc7' }}>{skill}</span>
                    <span style={{ fontSize: 11, color: tealLight, fontWeight: 600 }}>{pct}%</span>
                  </div>
                  <div style={{ height: 3, background: border, borderRadius: 2 }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${teal}, ${tealLight})`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: tealLight, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, borderBottom: `1px solid ${border}`, paddingBottom: 8 }}>
                Languages
              </p>
              {[['English', 'Native'], ['Italian', 'Heritage'], ['German', 'Conversational']].map(([lang, level]) => (
                <div key={lang} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 12, color: '#b0cfc7' }}>{lang}</span>
                  <span style={{ fontSize: 11, color: '#4a7060', fontWeight: 500 }}>{level}</span>
                </div>
              ))}
            </div>

            {/* Awards summary */}
            <div style={{ background: `${teal}12`, border: `1px solid ${teal}30`, borderRadius: 8, padding: 16 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: tealLight, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
                Key Awards
              </p>
              {['Academy Award — Best Actor (2016)', 'Golden Globe × 3', 'BAFTA × 1', 'Screen Actors Guild × 1', 'Cannes — Best Actor'].map(a => (
                <p key={a} style={{ fontSize: 12, color: '#7a9e97', margin: '0 0 6px', lineHeight: 1.4 }}>{a}</p>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Profile */}
            <section style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: tealLight, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, borderBottom: `1px solid ${border}`, paddingBottom: 8 }}>
                Professional Profile
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#9bbfb5', fontWeight: 300 }}>
                Academy Award-winning actor and producer with over three decades of professional experience
                in Hollywood. Known for exceptional commitment to method acting and an unmatched ability
                to transform physically and psychologically for roles across every genre. Founder of the
                Leonardo DiCaprio Foundation (1998), a leading voice for environmental protection and
                climate action.
              </p>
            </section>

            {/* Selected filmography as experience */}
            <section style={{ marginBottom: 36 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: tealLight, textTransform: 'uppercase', fontWeight: 600, marginBottom: 20, borderBottom: `1px solid ${border}`, paddingBottom: 8 }}>
                Selected Filmography
              </p>
              {[
                { year: '2015', title: 'The Revenant', dir: 'Alejandro G. Iñárritu', note: 'Academy Award — Best Actor. Filmed entirely in natural light at -40°C.' },
                { year: '2013', title: 'The Wolf of Wall Street', dir: 'Martin Scorsese', note: 'Golden Globe — Best Actor (Comedy). 3-hour epic. 506 uses of profanity.' },
                { year: '2010', title: 'Inception', dir: 'Christopher Nolan', note: 'Worldwide gross: $836M. Complex psychological performance across dream layers.' },
                { year: '2008', title: 'Revolutionary Road', dir: 'Sam Mendes', note: 'Golden Globe nomination. Reunited with Kate Winslet after Titanic.' },
                { year: '2002', title: 'Catch Me If You Can', dir: 'Steven Spielberg', note: 'Playing real-life con artist Frank Abagnale Jr. Critical and commercial success.' },
                { year: '1997', title: 'Titanic', dir: 'James Cameron', note: 'Worldwide gross: $2.2B. Highest-grossing film of its era. Cultural phenomenon.' },
                { year: '1993', title: 'What\'s Eating Gilbert Grape', dir: 'Lasse Hallström', note: 'Oscar nomination — Best Supporting Actor. At age 19. Breakthrough performance.' },
              ].map(({ year, title, dir, note }) => (
                <div key={title} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: `1px solid ${border}` }}>
                  <span style={{ fontSize: 12, color: tealLight, fontWeight: 600, paddingTop: 2 }}>{year}</span>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#e2ece9', margin: '0 0 2px' }}>{title}</p>
                    <p style={{ fontSize: 12, color: '#4a7060', margin: '0 0 4px' }}>Dir. {dir}</p>
                    <p style={{ fontSize: 12, color: '#7a9e97', margin: 0, lineHeight: 1.5, fontWeight: 300 }}>{note}</p>
                  </div>
                </div>
              ))}
            </section>

            {/* Education & Training */}
            <section>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: tealLight, textTransform: 'uppercase', fontWeight: 600, marginBottom: 16, borderBottom: `1px solid ${border}`, paddingBottom: 8 }}>
                Training & Education
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  ['1988–1991', 'John Marshall High School, Los Angeles', 'Theatre & Arts program'],
                  ['1991–1993', 'Los Angeles Center for Enriched Studies', 'Performing Arts'],
                  ['Training', 'Actors Studio – Method Acting', 'Stanislavski system, Lee Strasberg tradition'],
                ].map(([date, inst, desc]) => (
                  <div key={inst} style={{ background: card, border: `1px solid ${border}`, borderRadius: 6, padding: '12px 16px', display: 'grid', gridTemplateColumns: '140px 1fr', gap: 12 }}>
                    <span style={{ fontSize: 11, color: tealLight, fontWeight: 500 }}>{date}</span>
                    <div>
                      <p style={{ fontSize: 13, fontWeight: 600, color: '#e2ece9', margin: '0 0 2px' }}>{inst}</p>
                      <p style={{ fontSize: 12, color: '#4a7060', margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${border}`, padding: '16px 40px', display: 'flex', justifyContent: 'center' }}>
        <p style={{ fontSize: 11, color: '#1e3545', letterSpacing: '0.15em' }}>
          Designed by <Link href="/" style={{ color: teal, textDecoration: 'none' }}>BeOnWeb</Link>
        </p>
      </div>
    </div>
  )
}
