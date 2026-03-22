'use client'

import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { useLanguage } from '@/components/language-provider'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
})

const em = '#10b981'
const emDark = '#059669'
const dark = '#0b1f14'
const ink = '#111827'
const sub = '#4b5563'
const muted = '#9ca3af'
const bgAlt = '#f9fafb'
const bgGreen = '#f0fdf4'
const border = '#e5e7eb'

const content = {
  en: {
    role: 'Head of People & Culture · Milan, Italy',
    disclaimer: 'Demo project · Fictional character',
    navLinks: [['#about', 'About'], ['#experience', 'Experience'], ['#skills', 'Skills'], ['#contact', 'Contact']],
    navCta: 'Contact me',
    backLabel: '← Portfolio',
    heroSubtitle: '12 years building company cultures that actually work. From HR Coordinator to Head of People, I\'ve guided start-ups, agencies, and manufacturing companies through growth, crisis, and change.',
    ctaPrimary: 'View career',
    ctaContact: 'Contact me',
    stats: [
      { value: '12', unit: ' yrs', label: 'in HR' },
      { value: '3', unit: ' sectors', label: 'manufacturing · digital · tech' },
      { value: '250+', unit: '', label: 'people managed' },
      { value: '96%', unit: '', label: 'retention during COVID' },
    ],
    aboutLabel: 'About',
    aboutHeading: 'People aren\'t a resource.',
    aboutHeadingAccent: 'They\'re the work.',
    about1: 'I came to HR through occupational psychology, and that lens never left me. I believe truly effective People functions don\'t just administer — they design. They build the conditions in which people give their best.',
    about2: 'In twelve years I\'ve built HR from scratch twice, scaled a team during a Series B, managed a full remote transition, and integrated two acquired teams. Each experience taught me that process matters less than trust — and that trust is built one conversation at a time.',
    infoRows: [
      ['📍', 'Milan, Italy'],
      ['🏢', 'Head of People & Culture · Arca Systems'],
      ['🎓', 'MSc Work & Organisational Psychology · UniMi · Summa cum laude'],
      ['✉', 'maria.rossi@mail.com'],
      ['🔗', 'linkedin.com/in/mariarossi'],
    ],
    languages: ['🇮🇹 Italian · Native', '🇬🇧 English · C1', '🇫🇷 French · B1'],
    expSectionLabel: 'Career path',
    expHeading: 'Every role, a leap.',
    expHeadingAccent: 'Not a step.',
    currentLabel: 'Current',
    experience: [
      {
        period: '2021 → Present',
        company: 'Arca Systems',
        type: 'Tech scale-up · Series B · 250 employees',
        role: 'Head of People & Culture',
        current: true,
        achievements: [
          'Built the People function from scratch during a Series B growth phase — from 80 to 250 employees in 30 months.',
          'Designed and launched a company-wide performance review framework, reducing manager prep time by 40%.',
          'Led the cultural integration post-acquisition of two teams; Employee NPS went from 32 to 61 in 18 months.',
          'Introduced a structured L&D programme with 12 mentoring pairs and an annual training budget of €150k.',
        ],
      },
      {
        period: '2017 – 2021',
        company: 'Vela Digital',
        type: 'Digital agency · 65 employees',
        role: 'Head of HR',
        current: false,
        achievements: [
          'First dedicated HR resource — built all processes, templates, and onboarding from scratch.',
          'Reduced time-to-hire from 47 to 22 days by restructuring the selection pipeline and introducing structured interviews.',
          'Managed the remote work transition in 2020 — retained 96% of staff, best result in the peer group.',
          'Renegotiated contracts and benefits packages, saving €38k annually while increasing perceived value.',
        ],
      },
      {
        period: '2014 – 2017',
        company: 'Nexo Group',
        type: 'Manufacturing · 800 employees',
        role: 'HR Manager',
        current: false,
        achievements: [
          'Promoted from HR Generalist after 18 months; responsible for a team of 3 HR coordinators.',
          'Full employee cycle management for two production sites — recruitment, contracts, disciplinary, offboarding.',
          'Implemented HRIS (Zucchetti) across both sites, digitalising a fully paper-based process.',
        ],
      },
      {
        period: '2012 – 2014',
        company: 'Nexo Group',
        type: 'First role post-graduation',
        role: 'HR Coordinator',
        current: false,
        achievements: [
          'HR admin management, payroll coordination, and recruitment support.',
          'Organised the company\'s first employer branding initiative at two local universities.',
        ],
      },
    ],
    quote: '"Good HR process is invisible. You feel it in the office atmosphere, in conversations between teams, in people\'s desire to stay."',
    skillsLabel: 'Skills',
    skillsHeading: 'What I bring',
    skillsHeadingAccent: 'to every company.',
    skillGroups: [
      {
        label: 'Strategy & Leadership',
        skills: ['People Strategy', 'Change Management', 'Workforce Planning', 'OKR Framework', 'Executive Coaching'],
      },
      {
        label: 'Talent & Recruitment',
        skills: ['Talent Acquisition', 'Employer Branding', 'Structured Interviewing', 'Onboarding Design', 'Succession Planning'],
      },
      {
        label: 'Culture & Engagement',
        skills: ['Culture Building', 'Employee NPS', 'DEI Initiatives', 'Internal Comms', 'Team Design'],
      },
      {
        label: 'Learning & Development',
        skills: ['L&D Design', 'Mentoring Programs', 'Performance Management', 'Feedback Systems'],
      },
      {
        label: 'Systems & Analytics',
        skills: ['HRIS · Zucchetti', 'HR Analytics', 'Payroll Coordination', 'Contract Management', 'Compliance'],
      },
    ],
    certsLabel: 'Certifications',
    certs: ['SHRM-CP · 2019', 'Coaching Fundamentals · ICF · 2020', 'Zucchetti HRIS Certified · 2015'],
    numbersLabel: 'Impact',
    numbersHeading: 'The numbers speak.',
    numbersHeadingAccent: 'I listen to them.',
    numbers: [
      { value: '250+', label: 'People managed at peak', note: 'Arca Systems · 2023' },
      { value: '×2.1', label: 'Time-to-hire improvement', note: '47 days → 22 days' },
      { value: '96%', label: 'Retention during COVID', note: 'Vela Digital · 2020' },
      { value: '+29pt', label: 'Employee NPS increase', note: '32 → 61 in 18 months' },
    ],
    eduLabel: 'Education',
    education: [
      { degree: 'MSc Work & Organisational Psychology', school: 'Università degli Studi di Milano', year: '2010 – 2012', note: 'Summa cum laude' },
      { degree: 'BSc Psychology', school: 'Università degli Studi di Torino', year: '2007 – 2010', note: '' },
    ],
    contactLabel: 'Contact',
    contactHeading: 'Let\'s build something',
    contactHeadingAccent: 'together.',
    contactSub: 'Available for senior HR roles, advisory, and company culture projects.',
    footerDisclaimer: '🎭 This is a demo page. Maria Rossi is a fictional character created by BeOnWeb for illustrative purposes.',
    footerBy: 'Designed by',
  },
  it: {
    role: 'Head of People & Culture · Milano, Italia',
    disclaimer: 'Progetto dimostrativo · Personaggio di fantasia',
    navLinks: [['#about', 'About'], ['#experience', 'Esperienza'], ['#skills', 'Competenze'], ['#contact', 'Contatti']],
    navCta: 'Scrivimi',
    backLabel: '← Portfolio',
    heroSubtitle: '12 anni a costruire culture aziendali che funzionano davvero. Da HR Coordinator a Head of People, ho accompagnato start-up, agenzie e aziende manifatturiere attraverso crescita, crisi e cambiamento.',
    ctaPrimary: 'Vedi il percorso',
    ctaContact: 'Contattami',
    stats: [
      { value: '12', unit: ' anni', label: 'di esperienza HR' },
      { value: '3', unit: ' settori', label: 'manifatturiero · digitale · tech' },
      { value: '250+', unit: '', label: 'persone gestite' },
      { value: '96%', unit: '', label: 'retention durante COVID' },
    ],
    aboutLabel: 'About',
    aboutHeading: 'Le persone non sono una risorsa.',
    aboutHeadingAccent: 'Sono il lavoro.',
    about1: 'Sono arrivata all\'HR attraverso la psicologia del lavoro, e quella lente non mi ha mai abbandonata. Credo che le funzioni People davvero efficaci non si limitino ad amministrare — progettano. Costruiscono le condizioni in cui le persone danno il meglio.',
    about2: 'In dodici anni ho costruito l\'HR da zero due volte, scalato un team durante una Series B, gestito una transizione al remoto completa e integrato due team acquisiti. Ogni esperienza mi ha insegnato che il processo conta meno della fiducia — e che la fiducia si costruisce una conversazione alla volta.',
    infoRows: [
      ['📍', 'Milano, Italia'],
      ['🏢', 'Head of People & Culture · Arca Systems'],
      ['🎓', 'MSc Psicologia del Lavoro · UniMi · 110/110L'],
      ['✉', 'maria.rossi@mail.com'],
      ['🔗', 'linkedin.com/in/mariarossi'],
    ],
    languages: ['🇮🇹 Italiano · Madrelingua', '🇬🇧 English · C1', '🇫🇷 Français · B1'],
    expSectionLabel: 'Percorso professionale',
    expHeading: 'Ogni ruolo, un salto.',
    expHeadingAccent: 'Non un passo.',
    currentLabel: 'Attuale',
    experience: [
      {
        period: '2021 → Presente',
        company: 'Arca Systems',
        type: 'Scale-up tech · Serie B · 250 dipendenti',
        role: 'Head of People & Culture',
        current: true,
        achievements: [
          'Costruito la funzione People da zero durante una fase di crescita Series B — da 80 a 250 dipendenti in 30 mesi.',
          'Progettato e lanciato un framework di performance review aziendale, riducendo del 40% il tempo di preparazione dei manager.',
          'Guidato l\'integrazione culturale post-acquisizione di due team; Employee NPS passato da 32 a 61 in 18 mesi.',
          'Introdotto un programma L&D strutturato con 12 coppie di mentoring e budget formazione annuale di €150k.',
        ],
      },
      {
        period: '2017 – 2021',
        company: 'Vela Digital',
        type: 'Agenzia digitale · 65 dipendenti',
        role: 'Head of HR',
        current: false,
        achievements: [
          'Prima risorsa HR dedicata — costruiti tutti i processi, template e onboarding da zero.',
          'Ridotto il time-to-hire da 47 a 22 giorni ristrutturando la pipeline di selezione e introducendo interviste strutturate.',
          'Gestita la transizione al lavoro da remoto nel 2020 — ritenuto il 96% del personale, miglior risultato nel peer group.',
          'Rinegoziati contratti e pacchetti benefit, risparmiando €38k annui aumentando il valore percepito.',
        ],
      },
      {
        period: '2014 – 2017',
        company: 'Nexo Group',
        type: 'Manifatturiero · 800 dipendenti',
        role: 'HR Manager',
        current: false,
        achievements: [
          'Promossa da HR Generalist dopo 18 mesi; responsabile di un team di 3 HR coordinator.',
          'Gestione del ciclo completo del dipendente per due stabilimenti produttivi — selezione, contratti, disciplinare, offboarding.',
          'Implementato HRIS (Zucchetti) in entrambi i siti, digitalizzando un processo completamente cartaceo.',
        ],
      },
      {
        period: '2012 – 2014',
        company: 'Nexo Group',
        type: 'Primo ruolo post-laurea',
        role: 'HR Coordinator',
        current: false,
        achievements: [
          'Gestione HR amministrativa, coordinamento payroll e supporto alla selezione del personale.',
          'Organizzata la prima iniziativa di employer branding aziendale in due università locali.',
        ],
      },
    ],
    quote: '«Un buon processo HR non si vede. Si sente nell\'atmosfera dell\'ufficio, nelle conversazioni tra i team, nella voglia delle persone di restare.»',
    skillsLabel: 'Competenze',
    skillsHeading: 'Quello che porto',
    skillsHeadingAccent: 'in ogni azienda.',
    skillGroups: [
      {
        label: 'Strategia & Leadership',
        skills: ['People Strategy', 'Change Management', 'Workforce Planning', 'OKR Framework', 'Executive Coaching'],
      },
      {
        label: 'Talent & Selezione',
        skills: ['Talent Acquisition', 'Employer Branding', 'Structured Interviewing', 'Onboarding Design', 'Succession Planning'],
      },
      {
        label: 'Cultura & Engagement',
        skills: ['Culture Building', 'Employee NPS', 'DEI Initiatives', 'Internal Comms', 'Team Design'],
      },
      {
        label: 'Formazione & Sviluppo',
        skills: ['L&D Design', 'Mentoring Programs', 'Performance Management', 'Feedback Systems'],
      },
      {
        label: 'Sistemi & Analytics',
        skills: ['HRIS · Zucchetti', 'HR Analytics', 'Payroll Coordination', 'Contract Management', 'Compliance'],
      },
    ],
    certsLabel: 'Certificazioni',
    certs: ['SHRM-CP · 2019', 'Coaching Fundamentals · ICF · 2020', 'Zucchetti HRIS Certified · 2015'],
    numbersLabel: 'Impatto',
    numbersHeading: 'I numeri parlano.',
    numbersHeadingAccent: 'Io li ascolto.',
    numbers: [
      { value: '250+', label: 'Persone gestite al picco', note: 'Arca Systems · 2023' },
      { value: '×2.1', label: 'Miglioramento time-to-hire', note: '47 gg → 22 gg' },
      { value: '96%', label: 'Retention durante COVID', note: 'Vela Digital · 2020' },
      { value: '+29pt', label: 'Incremento Employee NPS', note: '32 → 61 in 18 mesi' },
    ],
    eduLabel: 'Formazione',
    education: [
      { degree: 'MSc Psicologia del Lavoro e delle Organizzazioni', school: 'Università degli Studi di Milano', year: '2010 – 2012', note: '110/110 cum laude' },
      { degree: 'Laurea Triennale in Psicologia', school: 'Università degli Studi di Torino', year: '2007 – 2010', note: '' },
    ],
    contactLabel: 'Contatti',
    contactHeading: 'Costruiamo qualcosa',
    contactHeadingAccent: 'insieme.',
    contactSub: 'Disponibile a conversazioni su ruoli HR senior, advisory e progetti di cultura aziendale.',
    footerDisclaimer: '🎭 Questa è una pagina dimostrativa. Maria Rossi è un personaggio di fantasia creato da BeOnWeb a scopo illustrativo.',
    footerBy: 'Progettato da',
  },
}

export default function GammaPage() {
  const { lang } = useLanguage()
  const c = content[lang]

  return (
    <div className={jakarta.className} style={{ background: '#fff', color: ink, overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }

        /* ── Navbar ── */
        .gf-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.93);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid ${border};
        }
        .gf-nav-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 32px;
          height: 60px; display: flex; align-items: center; justify-content: space-between;
        }
        .gf-nav-links { display: flex; gap: 28px; align-items: center; }
        .gf-nav-link {
          font-size: 13px; color: ${sub}; text-decoration: none;
          font-weight: 500; transition: color 0.15s;
        }
        .gf-nav-link:hover { color: ${ink}; }
        .gf-nav-cta {
          font-size: 13px; font-weight: 700; color: #fff;
          background: ${em}; text-decoration: none;
          padding: 8px 18px; border-radius: 8px; transition: background 0.15s;
        }
        .gf-nav-cta:hover { background: ${emDark}; }

        /* ── Sections ── */
        .gf-section { padding: 100px 32px; }
        .gf-container { max-width: 1100px; margin: 0 auto; }
        .gf-label {
          font-size: 11px; font-weight: 700; color: ${em};
          letter-spacing: 0.22em; text-transform: uppercase; margin: 0 0 16px;
        }
        .gf-h2 {
          font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 800;
          color: ${ink}; line-height: 1.12; margin: 0 0 56px; letter-spacing: -0.02em;
        }
        .gf-h2 span { color: ${em}; }

        /* ── Experience ── */
        .exp-row {
          display: grid; grid-template-columns: 260px 1fr;
          gap: 48px; padding: 44px 0;
          border-bottom: 1px solid ${border};
          align-items: start;
        }
        .exp-row:last-child { border-bottom: none; }

        /* ── Skills ── */
        .skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 36px; }
        .skill-chip {
          display: inline-block; padding: 6px 14px; border-radius: 999px;
          font-size: 13px; font-weight: 500;
          background: ${bgGreen}; color: ${emDark};
          border: 1px solid rgba(16,185,129,0.2);
          margin: 0 6px 8px 0;
        }

        /* ── Numbers ── */
        .numbers-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }

        /* ── Edu grid ── */
        .edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }

        /* ── About grid ── */
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }

        /* ── Stats strip ── */
        .stats-strip {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border-radius: 14px; overflow: hidden;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.04);
        }

        /* ── Responsive ── */
        @media (max-width: 960px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .exp-row { grid-template-columns: 1fr !important; gap: 20px !important; }
          .skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .edu-grid { grid-template-columns: 1fr !important; }
          .stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .gf-nav-links { display: none; }
          .gf-section { padding: 72px 20px; }
          .gf-nav-inner { padding: 0 20px; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .numbers-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-strip { grid-template-columns: 1fr 1fr !important; }
          .hero-ctas { flex-direction: column !important; }
          .hero-ctas a { text-align: center; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="gf-nav">
        <div className="gf-nav-inner">
          <a href="#top" style={{ fontSize: 17, fontWeight: 800, color: ink, textDecoration: 'none', letterSpacing: '-0.02em' }}>MR</a>
          <div className="gf-nav-links">
            {c.navLinks.map(([href, label]) => (
              <a key={href} href={href} className="gf-nav-link">{label}</a>
            ))}
            <Link href="/#portfolio" className="gf-nav-link" style={{ color: muted, fontSize: 12 }}>{c.backLabel}</Link>
          </div>
          <a href="#contact" className="gf-nav-cta">{c.navCta}</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" style={{ background: dark, minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 60 }}>
        <div className="gf-container" style={{ padding: '80px 32px 96px', width: '100%', textAlign: 'center' }}>

          {/* Disclaimer badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', marginBottom: 20 }}>
            <span style={{ fontSize: 11 }}>🎭</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', fontWeight: 500, letterSpacing: '0.05em' }}>
              {c.disclaimer}
            </span>
          </div>

          <p style={{ fontSize: 12, fontWeight: 700, color: em, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 28px' }}>
            {c.role}
          </p>

          <h1 style={{ fontSize: 'clamp(3.5rem, 10vw, 7.5rem)', fontWeight: 800, color: '#fff', lineHeight: 0.9, margin: '0 0 40px', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            Maria <span style={{ color: em }}>Rossi</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(255,255,255,0.48)', maxWidth: 780, margin: '0 auto 56px', lineHeight: 1.8, fontWeight: 300 }}>
            {c.heroSubtitle}
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 80, justifyContent: 'center' }}>
            <a href="#experience" style={{ padding: '14px 28px', background: em, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              {c.ctaPrimary}
            </a>
            <a href="#contact" style={{ padding: '13px 28px', border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              {c.ctaContact}
            </a>
          </div>

          {/* Stats strip */}
          <div className="stats-strip" style={{ maxWidth: 780, margin: '0 auto' }}>
            {c.stats.map(({ value, unit, label }) => (
              <div key={label} style={{ padding: '28px 24px', background: 'rgba(0,0,0,0.18)' }}>
                <p style={{ fontSize: 30, fontWeight: 800, color: '#fff', margin: '0 0 4px', lineHeight: 1 }}>
                  {value}<span style={{ fontSize: 14, color: em, fontWeight: 600 }}>{unit}</span>
                </p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: 0, lineHeight: 1.4 }}>{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="gf-section" style={{ background: '#fff' }}>
        <div className="gf-container">
          <p className="gf-label">{c.aboutLabel}</p>
          <div className="about-grid">
            <div>
              <h2 className="gf-h2" style={{ margin: '0 0 28px' }}>
                {c.aboutHeading}<br /><span>{c.aboutHeadingAccent}</span>
              </h2>
              <p style={{ fontSize: 16, color: sub, lineHeight: 1.85, margin: '0 0 20px' }}>
                {c.about1}
              </p>
              <p style={{ fontSize: 16, color: sub, lineHeight: 1.85 }}>
                {c.about2}
              </p>
            </div>
            <div>
              <div style={{ background: bgAlt, borderRadius: 16, padding: '8px 0', marginBottom: 24 }}>
                {c.infoRows.map(([icon, txt], i, arr) => (
                  <div key={txt as string} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 24px', borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none' }}>
                    <span style={{ fontSize: 16, width: 22, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 14, color: sub }}>{txt}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {c.languages.map(l => (
                  <span key={l} style={{ fontSize: 12, fontWeight: 500, color: emDark, background: bgGreen, border: '1px solid rgba(16,185,129,0.18)', borderRadius: 6, padding: '5px 12px' }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="gf-section" style={{ background: bgAlt }}>
        <div className="gf-container">
          <p className="gf-label">{c.expSectionLabel}</p>
          <h2 className="gf-h2">
            {c.expHeading}<br /><span>{c.expHeadingAccent}</span>
          </h2>

          {c.experience.map((e) => (
            <div key={e.company + e.role} className="exp-row">
              {/* Left column */}
              <div>
                {e.current && (
                  <span style={{ fontSize: 11, fontWeight: 700, background: em, color: '#fff', borderRadius: 4, padding: '2px 8px', display: 'inline-block', marginBottom: 10 }}>
                    {c.currentLabel}
                  </span>
                )}
                <p style={{ fontSize: 22, fontWeight: 800, color: ink, margin: '0 0 4px', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{e.company}</p>
                <p style={{ fontSize: 15, fontWeight: 600, color: em, margin: '0 0 6px' }}>{e.role}</p>
                <p style={{ fontSize: 12, color: muted, margin: '0 0 12px' }}>{e.type}</p>
                <span style={{ fontSize: 12, fontWeight: 600, color: sub, background: '#fff', border: `1px solid ${border}`, borderRadius: 6, padding: '4px 10px', display: 'inline-block' }}>
                  {e.period}
                </span>
              </div>

              {/* Right column: bullets */}
              <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {e.achievements.map((a, j) => (
                  <li key={j} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: em, flexShrink: 0, marginTop: 9 }} />
                    <span style={{ fontSize: 15, color: sub, lineHeight: 1.72 }}>{a}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section style={{ background: dark, padding: '80px 32px', textAlign: 'center' }}>
        <div style={{ maxWidth: 740, margin: '0 auto' }}>
          <p style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2rem)', fontWeight: 300, color: '#fff', lineHeight: 1.65, fontStyle: 'italic', margin: '0 0 24px' }}>
            {c.quote}
          </p>
          <span style={{ fontSize: 14, color: em, fontWeight: 600, letterSpacing: '0.08em' }}>— Maria Rossi</span>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="gf-section" style={{ background: '#fff' }}>
        <div className="gf-container">
          <p className="gf-label">{c.skillsLabel}</p>
          <h2 className="gf-h2">
            {c.skillsHeading}<br /><span>{c.skillsHeadingAccent}</span>
          </h2>

          <div className="skills-grid">
            {c.skillGroups.map(({ label, skills }) => (
              <div key={label}>
                <p style={{ fontSize: 11, fontWeight: 700, color: ink, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 14px' }}>{label}</p>
                <div>
                  {skills.map(s => (
                    <span key={s} className="skill-chip">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div style={{ marginTop: 56, padding: '32px', background: bgAlt, borderRadius: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: ink, letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 20px' }}>{c.certsLabel}</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {c.certs.map(cert => (
                <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px', background: '#fff', border: `1px solid ${border}`, borderRadius: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: em, flexShrink: 0 }} />
                  <span style={{ fontSize: 14, color: sub, fontWeight: 500 }}>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section className="gf-section" style={{ background: bgGreen }}>
        <div className="gf-container">
          <p className="gf-label">{c.numbersLabel}</p>
          <h2 className="gf-h2">
            {c.numbersHeading}<br /><span>{c.numbersHeadingAccent}</span>
          </h2>
          <div className="numbers-grid">
            {c.numbers.map(({ value, label, note }) => (
              <div key={label} style={{ background: '#fff', borderRadius: 16, padding: '32px 28px', border: '1px solid rgba(16,185,129,0.15)' }}>
                <p style={{ fontSize: 42, fontWeight: 800, color: em, margin: '0 0 8px', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
                <p style={{ fontSize: 14, color: ink, fontWeight: 600, margin: '0 0 4px', lineHeight: 1.3 }}>{label}</p>
                <p style={{ fontSize: 12, color: muted, margin: 0 }}>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EDUCATION ── */}
      <section className="gf-section" style={{ background: '#fff', paddingTop: 80, paddingBottom: 80 }}>
        <div className="gf-container">
          <p className="gf-label">{c.eduLabel}</p>
          <div className="edu-grid">
            {c.education.map(ed => (
              <div key={ed.degree} style={{ padding: '28px 32px', background: bgAlt, borderRadius: 16, borderLeft: `3px solid ${em}` }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: ink, margin: '0 0 6px', lineHeight: 1.3 }}>{ed.degree}</p>
                <p style={{ fontSize: 14, color: em, fontWeight: 600, margin: '0 0 4px' }}>{ed.school}</p>
                <p style={{ fontSize: 13, color: muted, margin: 0 }}>{ed.year}{ed.note ? ` · ${ed.note}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / FOOTER ── */}
      <section id="contact" className="gf-section" style={{ background: dark, textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <p className="gf-label" style={{ margin: '0 0 24px' }}>{c.contactLabel}</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, color: '#fff', lineHeight: 1.12, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {c.contactHeading}<br /><span style={{ color: em }}>{c.contactHeadingAccent}</span>
          </h2>
          <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.38)', margin: '0 0 48px', lineHeight: 1.75, fontWeight: 300 }}>
            {c.contactSub}
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 60 }}>
            <a href="mailto:maria.rossi@mail.com" style={{ padding: '14px 28px', background: em, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              ✉ maria.rossi@mail.com
            </a>
            <a href="https://linkedin.com/in/mariarossi" style={{ padding: '13px 28px', border: '1.5px solid rgba(255,255,255,0.14)', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              LinkedIn →
            </a>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 32 }}>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: '0 0 8px', fontStyle: 'italic' }}>
              {c.footerDisclaimer}
            </p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.18)', margin: '0 0 6px' }}>© 2025 Maria Rossi · Milano</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.18)', margin: 0 }}>
              {c.footerBy} <Link href="/" style={{ color: em, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
