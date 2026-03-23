'use client'

import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] })

export default function CristianoRonaldoPage() {
  const gold = '#c9a84c'
  const goldLight = '#e0bc6e'
  const navy = '#0a0f1e'
  const navyCard = '#0f1628'
  const navyBorder = '#1a2540'

  return (
    <div className={jakarta.className} style={{ minHeight: '100vh', background: navy, color: '#e8edf5', overflowX: 'hidden' }}>
      <style>{`
        .cr-stat-bar { display: grid; grid-template-columns: repeat(5, 1fr); gap: 1px; border-radius: 12px; overflow: hidden; background: ${navyBorder}; }
        .cr-main-grid { display: grid; grid-template-columns: 1fr 260px; gap: 40px; }
        .cr-club-row { display: grid; grid-template-columns: 100px 1fr 60px 60px; gap: 12px; align-items: center; }
        .cr-info-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; max-width: 680px; }
        .cr-hero-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
        .cr-back-mobile { display: none; font-size: 12px; color: #2a3c55; text-decoration: none; }

        @media (max-width: 900px) {
          .cr-main-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .cr-stat-bar { grid-template-columns: repeat(3, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .cr-stat-bar { grid-template-columns: repeat(2, 1fr) !important; }
          .cr-club-row { grid-template-columns: 1fr !important; gap: 4px !important; border-bottom: 1px solid ${navyBorder}; padding-bottom: 12px !important; }
          .cr-info-cards { grid-template-columns: repeat(2, 1fr) !important; }
          .cr-hero-top { flex-direction: column; gap: 12px; }
          .cr-back-mobile { display: block; }
        }
        @media (max-width: 480px) {
          .cr-info-cards { grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>

      {/* Gold top bar */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${gold}, ${goldLight}, ${gold})` }} />

      {/* Hero */}
      <div style={{ background: `linear-gradient(180deg, #0f1628 0%, ${navy} 100%)`, borderBottom: `1px solid ${navyBorder}` }}>
        <div style={{ maxWidth: 920, margin: '0 auto', padding: '48px 40px 40px' }}>
          <div className="cr-hero-top">
            <div>
              <p style={{ fontSize: 11, letterSpacing: '0.4em', color: gold, textTransform: 'uppercase', fontWeight: 600, margin: '0 0 12px' }}>
                Professional Athlete · Forward
              </p>
              <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)', fontWeight: 800, margin: 0, letterSpacing: '-0.03em', lineHeight: 0.95, color: '#ffffff' }}>
                Cristiano<br />
                <span style={{ color: gold }}>Ronaldo</span>
              </h1>
              <p style={{ margin: '16px 0 0', fontSize: 14, color: '#5a7090', letterSpacing: '0.08em' }}>
                CR7 · Funchal, Madeira · Born 5 February 1985
              </p>
            </div>
            <Link href="/showcase" className="cr-back-mobile" style={{ fontSize: 12, color: '#2a3c55', textDecoration: 'none' }}>
              ← Showcase
            </Link>
          </div>

          {/* Career stat bar */}
          <div className="cr-stat-bar">
            {[
              ['900+', 'Career Goals'],
              ['5×', 'Ballon d\'Or'],
              ['5×', 'Champions League'],
              ['35+', 'Trophies'],
              ['200+', 'International Caps'],
            ].map(([val, label]) => (
              <div key={label} style={{ background: navyCard, padding: '16px 12px', textAlign: 'center' }}>
                <p style={{ fontSize: 22, fontWeight: 800, color: gold, margin: 0, lineHeight: 1 }}>{val}</p>
                <p style={{ fontSize: 10, color: '#4a6080', margin: '4px 0 0', fontWeight: 600, letterSpacing: '0.05em' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 40px 80px' }}>
        <div className="cr-main-grid">

          {/* Main */}
          <div>
            {/* Profile */}
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 11, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, borderBottom: `1px solid ${navyBorder}`, paddingBottom: 8 }}>
                Professional Profile
              </h2>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#8aa0bc', fontWeight: 300 }}>
                One of the greatest footballers in history. Five-time Ballon d'Or winner, all-time top scorer
                in international football (200+ goals for Portugal), and the highest-scoring player in
                Champions League history. Renowned for elite physical conditioning, relentless work ethic,
                and unparalleled goal-scoring ability — in the air, from distance, and under pressure.
              </p>
            </section>

            {/* Club career */}
            <section style={{ marginBottom: 36 }}>
              <h2 style={{ fontSize: 11, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 20, borderBottom: `1px solid ${navyBorder}`, paddingBottom: 8 }}>
                Club Career
              </h2>
              {[
                { period: '2002–2003', club: 'Sporting CP', apps: '25', goals: '3', honors: 'Breakthrough season' },
                { period: '2003–2009', club: 'Manchester United', apps: '292', goals: '118', honors: 'PL × 3, FA Cup, Champions League, Ballon d\'Or' },
                { period: '2009–2018', club: 'Real Madrid', apps: '438', goals: '450', honors: 'La Liga × 2, Champions League × 4, Ballon d\'Or × 4' },
                { period: '2018–2021', club: 'Juventus', apps: '133', goals: '101', honors: 'Serie A × 2, Coppa Italia' },
                { period: '2021–2022', club: 'Manchester United', apps: '54', goals: '27', honors: 'Second stint — PL record scorer' },
                { period: '2023 – Now', club: 'Al-Nassr FC', apps: '85+', goals: '75+', honors: 'Arab Champions Cup' },
              ].map(({ period, club, apps, goals, honors }) => (
                <div key={club} className="cr-club-row" style={{ padding: '12px 0', borderBottom: `1px solid ${navyBorder}` }}>
                  <span style={{ fontSize: 11, color: gold, fontWeight: 600 }}>{period}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: '#e8edf5', margin: 0 }}>{club}</p>
                    <p style={{ fontSize: 11, color: '#4a6080', margin: '2px 0 0' }}>{honors}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#e8edf5', margin: 0 }}>{apps}</p>
                    <p style={{ fontSize: 9, color: '#4a6080', margin: '2px 0 0', letterSpacing: '0.1em' }}>APPS</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: gold, margin: 0 }}>{goals}</p>
                    <p style={{ fontSize: 9, color: '#4a6080', margin: '2px 0 0', letterSpacing: '0.1em' }}>GOALS</p>
                  </div>
                </div>
              ))}
            </section>

            {/* International */}
            <section>
              <h2 style={{ fontSize: 11, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, borderBottom: `1px solid ${navyBorder}`, paddingBottom: 8 }}>
                International Career — Portugal
              </h2>
              <p style={{ fontSize: 14, color: '#8aa0bc', lineHeight: 1.7, fontWeight: 300, marginBottom: 12 }}>
                Debut: June 20, 2003 · Caps: 200+ · Goals: 130+ (all-time world record)
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['UEFA Euro 2016 — Winner 🏆', 'UEFA Nations League 2019 — Winner 🏆', 'FIFA World Cup 2006 — 4th place', 'Euro 2004 — Runner-up', 'Euro 2008, 2012, 2016, 2020, 2024 — Participant'].map(h => (
                  <span key={h} style={{ fontSize: 12, padding: '5px 12px', background: `${gold}12`, border: `1px solid ${gold}30`, borderRadius: 6, color: '#8aa0bc' }}>{h}</span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            <div>
              <h2 style={{ fontSize: 11, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, borderBottom: `1px solid ${navyBorder}`, paddingBottom: 8 }}>
                Personal Info
              </h2>
              {[
                ['Full Name', 'Cristiano Ronaldo dos Santos Aveiro'],
                ['Position', 'Forward'],
                ['Height', '187 cm'],
                ['Nationality', 'Portuguese'],
                ['Club', 'Al-Nassr FC'],
                ['Number', '#7'],
                ['Agent', 'Jorge Mendes'],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 10, borderBottom: `1px solid ${navyBorder}`, paddingBottom: 10 }}>
                  <p style={{ fontSize: 10, color: '#2a3c55', margin: '0 0 2px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{k}</p>
                  <p style={{ fontSize: 13, color: '#8aa0bc', margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>

            <div>
              <h2 style={{ fontSize: 11, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 14, borderBottom: `1px solid ${navyBorder}`, paddingBottom: 8 }}>
                Key Attributes
              </h2>
              {[['Finishing', 99], ['Speed', 95], ['Headers', 97], ['Free Kicks', 94], ['Physical', 98], ['Mentality', 99]].map(([attr, val]) => (
                <div key={attr as string} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 12, color: '#8aa0bc' }}>{attr}</span>
                    <span style={{ fontSize: 11, color: gold, fontWeight: 700 }}>{val}</span>
                  </div>
                  <div style={{ height: 3, background: navyBorder, borderRadius: 2 }}>
                    <div style={{ width: `${val}%`, height: '100%', background: `linear-gradient(90deg, ${gold}, ${goldLight})`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: navyCard, border: `1px solid ${navyBorder}`, borderRadius: 8, padding: 16 }}>
              <h2 style={{ fontSize: 11, letterSpacing: '0.2em', color: gold, textTransform: 'uppercase', fontWeight: 600, marginBottom: 12 }}>
                Individual Awards
              </h2>
              {['Ballon d\'Or × 5', 'UEFA Best Player × 4', 'FIFA Best × 2', 'PFA Players\' Player', 'Serie A MVP × 2', 'Champions League Top Scorer × 7'].map(a => (
                <p key={a} style={{ fontSize: 12, color: '#4a6080', margin: '0 0 6px' }}>{a}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ borderTop: `1px solid ${navyBorder}`, padding: '16px 40px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: '#1a2540', letterSpacing: '0.1em' }}>
          Designed by <Link href="/" style={{ color: gold, textDecoration: 'none' }}>BeOnWeb</Link>
        </p>
      </div>
    </div>
  )
}
