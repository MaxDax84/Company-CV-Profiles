'use client'

import Link from 'next/link'
// Self-hosted (see app/layout.tsx)
import '@fontsource/orbitron/400.css'
import '@fontsource/orbitron/700.css'
import '@fontsource/orbitron/900.css'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/dm-sans/600.css'
import '@fontsource/dm-sans/700.css'
import { useLanguage } from '@/components/language-provider'

const ORBITRON_FONT = "'Orbitron', sans-serif"
const DM_SANS_FONT = "'DM Sans', sans-serif"

const red = '#ef4444'
const gold = '#f59e0b'
const darkBg = '#030608'
const midBg = '#070e14'
const cardBg = 'rgba(239,68,68,0.04)'
const border = 'rgba(255,255,255,0.06)'
const borderRed = 'rgba(239,68,68,0.25)'

const content = {
  en: {
    logo: 'TS',
    navItems: [['#about', 'Profile'], ['#roles', 'Career'], ['#skills', 'Tech'], ['#education', 'Education']],
    backLabel: '← Showcase',
    heroTag: 'STARK INDUSTRIES // PERSONNEL FILE',
    heroTitle1: 'ANTHONY E.',
    heroTitle2: 'STARK',
    heroBio: 'Genius. Billionaire. The man who built a suit of armor in a cave — and never stopped improving it. There is no version of this story where Tony Stark is not the smartest person in the room.',
    stats: [['ARC REACTOR', '100%', red], ['SUIT MARK', 'LXXXV', gold], ['IQ', '270+', '#8b5cf6'], ['NET WORTH', '$12.4B', '#10b981']] as [string, string, string][],
    aboutEyebrow: '// 01 BIOGRAPHICAL DATA',
    aboutTitle1: 'I AM',
    aboutTitle2: 'IRON MAN.',
    aboutQuote: 'Genius, billionaire, playboy, philanthropist. In that order. The philanthropy came later — after I nearly died in a cave in Afghanistan.',
    about1: 'Born May 29, 1970 in Manhattan. Enrolled at MIT at 15, graduating summa cum laude in Electrical Engineering and Physics. Inherited Stark Industries at 21 — turning a weapons empire into a $12.4B clean energy company.',
    about2: 'The 2008 Afghanistan capture changed everything. Returning with an ARC reactor in his chest, Stark dismantled the weapons division overnight — then walked into a press conference and said four words that changed the world.',
    infoGrid: [['Born', 'May 29, 1970'], ['Alma Mater', 'MIT, Class of 1987'], ['Enrolled', 'Age 15'], ['Partner', 'Virginia Potts']],
    rolesEyebrow: '// 02 OPERATIONAL HISTORY',
    rolesTitle1: 'Three chapters.',
    rolesTitle2: 'All classified.',
    roles: [
      {
        period: '1991 → Present',
        title: 'CEO & Chief Engineer',
        org: 'Stark Industries, Manhattan',
        color: red,
        tagline: 'The company that made weapons safe by putting them in the right hands.',
        points: [
          'Transformed global defense contractor into clean energy leader — $12.4B annual revenue',
          'Pivoted after 2008 Afghanistan incident: zero defense contracts, full renewable energy',
          'Developed ARC Reactor technology — unlimited clean energy output from palm-sized unit',
        ],
      },
      {
        period: '2008 → Present',
        title: 'Iron Man · Avengers Initiative',
        org: 'Classified / Global Operations',
        color: gold,
        tagline: 'The suit is the easy part. Wearing it is the job.',
        points: [
          'Designed and deployed Mark I through Mark LXXXV powered armor suits',
          'Co-founded the Avengers alongside Nick Fury — primary defense team for planet Earth',
          'Battle of New York: contained Chitauri invasion, redirected nuclear warhead through wormhole',
        ],
      },
      {
        period: '2018–2023',
        title: 'Lead Researcher · Time Architect',
        org: 'Upstate New York — Private R&D',
        color: '#8b5cf6',
        tagline: 'Five years off the grid. Still the smartest person in the room.',
        points: [
          'Solved quantum realm time navigation — the time heist that reversed the Snap',
          'Designed the Nano Gauntlet capable of housing all six Infinity Stones simultaneously',
          'Final act: used the Gauntlet to eliminate Thanos and his entire army. Permanently.',
        ],
      },
    ],
    skillsEyebrow: '// 03 TECHNICAL CAPABILITIES',
    skillsTitle1: 'Off the charts.',
    skillsTitle2: 'Literally.',
    skills: [['Mechanical Engineering', 100, red], ['Quantum Physics', 94, gold], ['AI Development', 98, '#8b5cf6'], ['Armor Combat', 88, red], ['Clean Energy Systems', 97, '#10b981'], ['Business Strategy', 85, gold], ['Materials Science', 96, '#06b6d4'], ['Weapons Engineering', 99, red]] as [string, number, string][],
    eduEyebrow: '// 04 EDUCATION',
    eduInst: 'Massachusetts Institute of Technology',
    eduDeg: 'B.Sc. Electrical Engineering & Physics — Summa Cum Laude',
    eduNote: 'Enrolled age 15 · Class of 1987 · Youngest department graduate in history',
    footerLeft: 'STARK INDUSTRIES CONFIDENTIAL',
    designedBy: 'Designed by',
  },
  it: {
    logo: 'TS',
    navItems: [['#about', 'Profilo'], ['#roles', 'Carriera'], ['#skills', 'Tecnologia'], ['#education', 'Formazione']],
    backLabel: '← Showcase',
    heroTag: 'STARK INDUSTRIES // FASCICOLO PERSONALE',
    heroTitle1: 'ANTHONY E.',
    heroTitle2: 'STARK',
    heroBio: 'Genio. Miliardario. L\'uomo che ha costruito un\'armatura in una grotta — e non ha mai smesso di migliorarla. Non esiste una versione di questa storia in cui Tony Stark non sia la persona più intelligente della stanza.',
    stats: [['ARC REACTOR', '100%', red], ['SUIT MARK', 'LXXXV', gold], ['QI', '270+', '#8b5cf6'], ['PATRIMONIO', '12,4Mld$', '#10b981']] as [string, string, string][],
    aboutEyebrow: '// 01 DATI BIOGRAFICI',
    aboutTitle1: 'SONO',
    aboutTitle2: 'IRON MAN.',
    aboutQuote: 'Genio, miliardario, playboy, filantropo. In quest\'ordine. La filantropia è arrivata dopo — dopo essere quasi morto in una grotta in Afghanistan.',
    about1: 'Nato il 29 maggio 1970 a Manhattan. Ammesso al MIT a 15 anni, laureato summa cum laude in Ingegneria Elettrica e Fisica. Ha ereditato la Stark Industries a 21 anni — trasformando un impero di armi in un\'azienda di energia pulita da 12,4 miliardi di dollari.',
    about2: 'La cattura in Afghanistan del 2008 ha cambiato tutto. Tornato con un reattore ARC nel petto, Stark ha smantellato la divisione armi nel giro di una notte — poi si è presentato a una conferenza stampa e ha pronunciato quattro parole che hanno cambiato il mondo.',
    infoGrid: [['Nato il', '29 maggio 1970'], ['Alma Mater', 'MIT, classe 1987'], ['Iscritto a', '15 anni'], ['Compagna', 'Virginia Potts']],
    rolesEyebrow: '// 02 STORICO OPERATIVO',
    rolesTitle1: 'Tre capitoli.',
    rolesTitle2: 'Tutti riservati.',
    roles: [
      {
        period: '1991 → Presente',
        title: 'CEO & Chief Engineer',
        org: 'Stark Industries, Manhattan',
        color: red,
        tagline: 'L\'azienda che ha reso le armi sicure mettendole nelle mani giuste.',
        points: [
          'Ha trasformato un appaltatore della difesa globale in un leader dell\'energia pulita — 12,4Mld$ di ricavi annui',
          'Svolta dopo l\'incidente in Afghanistan del 2008: zero contratti di difesa, energia rinnovabile al 100%',
          'Ha sviluppato la tecnologia ARC Reactor — energia pulita illimitata da un\'unità grande quanto un palmo',
        ],
      },
      {
        period: '2008 → Presente',
        title: 'Iron Man · Avengers Initiative',
        org: 'Riservato / Operazioni globali',
        color: gold,
        tagline: 'La tuta è la parte facile. Indossarla è il lavoro.',
        points: [
          'Progettate e schierate le armature dal Mark I al Mark LXXXV',
          'Co-fondatore degli Avengers insieme a Nick Fury — squadra di difesa principale del pianeta Terra',
          'Battaglia di New York: contenuta l\'invasione Chitauri, deviata una testata nucleare attraverso un wormhole',
        ],
      },
      {
        period: '2018–2023',
        title: 'Ricercatore Capo · Time Architect',
        org: 'Upstate New York — R&D privata',
        color: '#8b5cf6',
        tagline: 'Cinque anni lontano dai riflettori. Sempre la persona più intelligente della stanza.',
        points: [
          'Risolta la navigazione temporale nel regno quantico — il colpo nel tempo che ha annullato lo Schiocco',
          'Progettato il Nano Guanto capace di contenere tutte e sei le Gemme dell\'Infinito insieme',
          'Atto finale: ha usato il Guanto per eliminare Thanos e il suo intero esercito. Permanentemente.',
        ],
      },
    ],
    skillsEyebrow: '// 03 CAPACITÀ TECNICHE',
    skillsTitle1: 'Fuori scala.',
    skillsTitle2: 'Letteralmente.',
    skills: [['Ingegneria Meccanica', 100, red], ['Fisica Quantistica', 94, gold], ['Sviluppo AI', 98, '#8b5cf6'], ['Combattimento in armatura', 88, red], ['Sistemi di energia pulita', 97, '#10b981'], ['Strategia aziendale', 85, gold], ['Scienza dei materiali', 96, '#06b6d4'], ['Ingegneria delle armi', 99, red]] as [string, number, string][],
    eduEyebrow: '// 04 FORMAZIONE',
    eduInst: 'Massachusetts Institute of Technology',
    eduDeg: 'Laurea in Ingegneria Elettrica e Fisica — Summa Cum Laude',
    eduNote: 'Iscritto a 15 anni · Classe del 1987 · Laureato più giovane nella storia del dipartimento',
    footerLeft: 'STARK INDUSTRIES RISERVATO',
    designedBy: 'Progettato da',
  },
}

export default function TonyStarkPage() {
  const { lang } = useLanguage()
  const t = content[lang]

  return (
    <div style={{ fontFamily: DM_SANS_FONT, background: darkBg, color: '#e2e8f0', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }

        /* ── Navbar ── */
        .ts-nav-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 32px;
          height: 56px; display: flex; align-items: center; justify-content: space-between;
        }
        .ts-nav-links { display: flex; gap: 32px; align-items: center; }
        .ts-back-mobile { display: none; font-size: 12px; color: #6b7280; text-decoration: none; }
        .ts-back-mobile:hover { color: ${red}; }

        /* ── Sections ── */
        .ts-section { max-width: 1100px; margin: 0 auto; padding: 96px 32px; }

        /* ── About ── */
        .ts-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; }
        .ts-info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 28px; }

        /* ── Role card inner ── */
        .ts-role-grid { display: grid; grid-template-columns: 260px 1fr; gap: 32px; }

        /* ── Footer ── */
        .ts-footer-inner {
          max-width: 1100px; margin: 0 auto;
          display: flex; justify-content: space-between; align-items: center;
        }

        @media (max-width: 768px) {
          .ts-about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .ts-role-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
        @media (max-width: 600px) {
          .ts-nav-links { display: none !important; }
          .ts-back-mobile { display: block !important; }
          .ts-section { padding: 64px 20px !important; }
          .ts-footer-inner { flex-direction: column !important; gap: 8px !important; text-align: center; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(3,6,8,0.88)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${border}` }}>
        <div className="ts-nav-inner">
          <span style={{ fontFamily: ORBITRON_FONT, fontSize: 13, color: red, letterSpacing: '0.1em', fontWeight: 700 }}>{t.logo}</span>
          <div className="ts-nav-links">
            {t.navItems.map(([href, label]) => (
              <a key={href} href={href} style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none', letterSpacing: '0.1em' }}>{label}</a>
            ))}
            <Link href="/showcase" style={{ fontSize: 12, color: '#374151', textDecoration: 'none' }}>{t.backLabel}</Link>
          </div>
          <Link href="/showcase" className="ts-back-mobile">{t.backLabel}</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: `radial-gradient(ellipse at 65% 35%, rgba(239,68,68,0.1), transparent 55%), ${darkBg}` }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(239,68,68,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.04) 1px, transparent 1px)`, backgroundSize: '80px 80px', opacity: 0.6 }} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', background: 'rgba(239,68,68,0.08)', border: `1px solid ${borderRed}`, borderRadius: 99, marginBottom: 32 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: red, display: 'inline-block' }} />
            <span style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color: red, letterSpacing: '0.25em' }}>{t.heroTag}</span>
          </div>
          <h1 style={{ fontFamily: ORBITRON_FONT, fontSize: 'clamp(2.5rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 0.92, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            {t.heroTitle1}<br />
            <span style={{ color: red }}>{t.heroTitle2}</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: '#9ca3af', maxWidth: 540, lineHeight: 1.75, marginBottom: 48, fontWeight: 300 }}>
            {t.heroBio}
          </p>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {t.stats.map(([k, v, c]) => (
              <div key={k} style={{ padding: '14px 20px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}`, borderRadius: 10, minWidth: 100 }}>
                <p style={{ fontFamily: ORBITRON_FONT, fontSize: 20, fontWeight: 700, color: c, margin: 0, lineHeight: 1 }}>{v}</p>
                <p style={{ fontFamily: ORBITRON_FONT, fontSize: 9, color: '#4b5563', margin: '4px 0 0', letterSpacing: '0.15em' }}>{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROFILE */}
      <section id="about" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div className="ts-section">
          <p style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color: gold, letterSpacing: '0.3em', marginBottom: 20 }}>{t.aboutEyebrow}</p>
          <div className="ts-about-grid">
            <div>
              <h2 style={{ fontFamily: ORBITRON_FONT, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 32px' }}>
                {t.aboutTitle1}<br /><span style={{ color: red }}>{t.aboutTitle2}</span>
              </h2>
              <blockquote style={{ borderLeft: `3px solid ${red}`, paddingLeft: 20 }}>
                <p style={{ fontSize: 17, color: '#e2e8f0', fontStyle: 'italic', margin: 0, lineHeight: 1.65, fontWeight: 300 }}>
                  &ldquo;{t.aboutQuote}&rdquo;
                </p>
              </blockquote>
            </div>
            <div>
              <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.85, marginBottom: 20, fontWeight: 300 }}>
                {t.about1}
              </p>
              <p style={{ fontSize: 15, color: '#9ca3af', lineHeight: 1.85, marginBottom: 0, fontWeight: 300 }}>
                {t.about2}
              </p>
              <div className="ts-info-grid">
                {t.infoGrid.map(([k, v]) => (
                  <div key={k} style={{ padding: '10px 14px', background: cardBg, border: `1px solid ${borderRed}`, borderRadius: 8 }}>
                    <p style={{ fontFamily: ORBITRON_FONT, fontSize: 9, color: '#4b5563', margin: '0 0 2px', letterSpacing: '0.12em' }}>{k}</p>
                    <p style={{ fontSize: 13, color: '#e2e8f0', margin: 0, fontWeight: 500 }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CAREER */}
      <section id="roles" style={{ background: darkBg }}>
        <div className="ts-section">
          <p style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color: gold, letterSpacing: '0.3em', marginBottom: 20 }}>{t.rolesEyebrow}</p>
          <h2 style={{ fontFamily: ORBITRON_FONT, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 56px' }}>
            {t.rolesTitle1}<br /><span style={{ color: red }}>{t.rolesTitle2}</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {t.roles.map((r) => (
              <div key={r.title}
                style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 16, padding: '28px 32px', transition: 'all 0.3s ease' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = r.color + '40'; el.style.boxShadow = `0 12px 40px ${r.color}10`; el.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = border; el.style.boxShadow = 'none'; el.style.transform = 'translateX(0)' }}
              >
                <div className="ts-role-grid">
                  <div>
                    <p style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color: r.color, margin: '0 0 6px', letterSpacing: '0.1em' }}>{r.period}</p>
                    <p style={{ fontFamily: ORBITRON_FONT, fontSize: 14, fontWeight: 700, color: '#ffffff', margin: '0 0 4px' }}>{r.title}</p>
                    <p style={{ fontSize: 12, color: '#4b5563', margin: '0 0 12px' }}>{r.org}</p>
                    <p style={{ fontSize: 13, color: r.color, fontStyle: 'italic', margin: 0 }}>&ldquo;{r.tagline}&rdquo;</p>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {r.points.map(pt => (
                      <li key={pt} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: r.color, fontSize: 10, marginTop: 4, flexShrink: 0 }}>▸</span>
                        <span style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div className="ts-section">
          <p style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color: gold, letterSpacing: '0.3em', marginBottom: 20 }}>{t.skillsEyebrow}</p>
          <h2 style={{ fontFamily: ORBITRON_FONT, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, margin: '0 0 48px' }}>
            {t.skillsTitle1}<br /><span style={{ color: gold }}>{t.skillsTitle2}</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
            {t.skills.map(([skill, pct, color]) => (
              <div key={skill} style={{ background: 'rgba(255,255,255,0.02)', border: `1px solid ${border}`, borderRadius: 10, padding: '16px 18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color: '#9ca3af' }}>{skill}</span>
                  <span style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color, fontWeight: 700 }}>{pct}%</span>
                </div>
                <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDUCATION */}
      <section id="education" style={{ background: darkBg }}>
        <div className="ts-section">
          <p style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color: gold, letterSpacing: '0.3em', marginBottom: 20 }}>{t.eduEyebrow}</p>
          <div style={{ padding: '32px', background: cardBg, border: `1px solid ${borderRed}`, borderRadius: 16 }}>
            <p style={{ fontFamily: ORBITRON_FONT, fontSize: 18, fontWeight: 900, color: '#ffffff', margin: '0 0 6px' }}>{t.eduInst}</p>
            <p style={{ fontSize: 14, color: red, margin: '0 0 4px', fontWeight: 500 }}>{t.eduDeg}</p>
            <p style={{ fontSize: 13, color: '#4b5563', margin: 0 }}>{t.eduNote}</p>
          </div>
        </div>
      </section>

      <footer style={{ background: midBg, borderTop: `1px solid ${border}`, padding: '24px 32px' }}>
        <div className="ts-footer-inner">
          <span style={{ fontFamily: ORBITRON_FONT, fontSize: 10, color: '#1f2937', letterSpacing: '0.2em' }}>{t.footerLeft}</span>
          <p style={{ fontSize: 12, color: '#374151', margin: 0 }}>{t.designedBy} <Link href="/" style={{ color: red, textDecoration: 'none' }}>Jobli</Link></p>
        </div>
      </footer>
    </div>
  )
}
