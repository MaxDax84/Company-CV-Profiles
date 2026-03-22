'use client'

import Link from 'next/link'
import { Space_Grotesk } from 'next/font/google'
import { useLanguage } from '@/components/language-provider'

const grotesk = Space_Grotesk({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

const gold = '#d4a843'
const goldFaint = 'rgba(212,168,67,0.07)'
const goldBorder = 'rgba(212,168,67,0.18)'
const dark = '#07090e'
const darkCard = '#0c0f16'
const text = '#dde4ef'
const sub = '#64748b'
const softText = '#94a3b8'
const border = 'rgba(255,255,255,0.06)'

const content = {
  en: {
    role: 'Chief Financial Officer · Milan, Italy',
    disclaimer: 'Demo project · Fictional character',
    navLinks: [['#about', 'About'], ['#experience', 'Experience'], ['#skills', 'Skills'], ['#contact', 'Contact']],
    navCta: 'Contact me',
    backLabel: '← Portfolio',
    heroSubtitle: '14 years across investment banking, manufacturing, and tech. From analyst to CFO, I\'ve built Finance functions from scratch and guided companies through Series C rounds, M&A deals, and debt renegotiations.',
    ctaPrimary: 'View career',
    ctaContact: 'Contact me',
    statsRow: [
      { value: '14', unit: ' yrs', label: 'of experience' },
      { value: '€280M', unit: '', label: 'portfolio managed' },
      { value: '3×', unit: '', label: 'M&A transactions' },
      { value: '4', unit: ' firms', label: '4 different sectors' },
    ],
    aboutLabel: 'About',
    aboutHeading: 'Finance isn\'t a cost.',
    aboutHeadingAccent: 'It\'s a strategic lever.',
    about1: 'I started in an M&A boutique, where I learned that numbers alone aren\'t enough — it\'s the stories they tell that matter. From there, each role added a layer: industrial controlling, the complexity of tech scale-ups, the pressure of LP reporting.',
    about2: 'Today as CFO my job is to translate business ambition into numbers that hold up — in front of a board, a bank, or a buyer. And to build teams that can do the same, even when I\'m not in the room.',
    infoRows: [
      ['📍', 'Milan, Italy'],
      ['🏢', 'CFO · Meridian Capital (current)'],
      ['🎓', 'MSc Finance · Bocconi · Summa cum laude'],
      ['✉', 'marco.bianchi@mail.com'],
      ['🔗', 'linkedin.com/in/marcobianchi'],
    ],
    languages: ['🇮🇹 Italian · Native', '🇬🇧 English · C1', '🇩🇪 German · B1'],
    expLabel: 'Career',
    expHeading: 'Four chapters.',
    expHeadingAccent: 'One direction.',
    experience: [
      {
        index: '01',
        period: '2020 → Present',
        company: 'Meridian Capital',
        type: 'Private equity portfolio company · 1,200 employees',
        role: 'Chief Financial Officer',
        current: true,
        points: [
          'Financial oversight of a €280M portfolio — direct reporting to the Board and LP investors.',
          'Managed three budget and forecast cycles with an average variance below 2% of actual revenue.',
          'Coordinated two buy-side M&A transactions: due diligence, deal structuring, post-closing integration.',
          'Reduced cost of debt by 18% by renegotiating bank facilities in a rising-rate environment.',
        ],
      },
      {
        index: '02',
        period: '2016 – 2020',
        company: 'Volta Technologies',
        type: 'Tech scale-up · Series C · 320 employees',
        role: 'Head of Finance & Control',
        current: false,
        points: [
          'Built the Finance function from scratch — team of 6, processes, ERP (SAP S/4HANA), IFRS reporting.',
          'Implemented FP&A model with quarterly rolling forecast; monthly board presentations.',
          'Supported the €45M Series C close — data room preparation, investor deck, due diligence.',
          'Reduced operating costs by 22% through supplier renegotiation and working capital optimisation.',
        ],
      },
      {
        index: '03',
        period: '2012 – 2016',
        company: 'Orion Manufacturing',
        type: 'Manufacturing · 2,500 employees',
        role: 'Finance Manager',
        current: false,
        points: [
          'Industrial controlling for 3 plants — €180M budget, team of 4.',
          'Introduced a product-line cost accounting system; per-product margins visible for the first time.',
          'Treasury and international payments in 8 currencies; implemented FX hedging.',
        ],
      },
      {
        index: '04',
        period: '2009 – 2012',
        company: 'Crespi & Partners',
        type: 'Boutique M&A advisory',
        role: 'Financial Analyst',
        current: false,
        points: [
          'Financial analysis and support on mid-market M&A transactions (deal size €10M–€80M).',
          'Produced financial models, DCF, LBO analysis, and information memoranda for corporate clients.',
        ],
      },
    ],
    numbersRow: [
      { value: '€280M', label: 'Portfolio managed' },
      { value: '-22%', label: 'Operating cost reduction' },
      { value: '3×', label: 'M&A transactions' },
      { value: '<2%', label: 'Avg. forecast variance' },
    ],
    skillsLabel: 'Skills',
    skillsHeading: 'Finance end-to-end.',
    skillsHeadingAccent: 'From model to signature.',
    skillGroups: [
      {
        label: 'FP&A & Controlling',
        items: ['Budget & Forecast', 'Rolling Forecast', 'Variance Analysis', 'KPI Design', 'Cost Controlling'],
      },
      {
        label: 'M&A & Capital Markets',
        items: ['Due Diligence', 'DCF & LBO Analysis', 'Deal Structuring', 'Investor Relations', 'Data Room Mgmt'],
      },
      {
        label: 'Treasury & Risk',
        items: ['Cash Management', 'FX Hedging', 'Debt Renegotiation', 'Working Capital Opt.', 'Risk Assessment'],
      },
      {
        label: 'Systems & Reporting',
        items: ['SAP S/4HANA', 'Oracle Hyperion', 'IFRS / ITA GAAP', 'Power BI', 'Excel VBA'],
      },
    ],
    education: [
      { degree: 'MSc Finance & Banking', school: 'Università Bocconi', year: '2007 – 2009', note: 'Summa cum laude' },
      { degree: 'BSc Business Administration', school: 'Università degli Studi di Milano', year: '2004 – 2007', note: '' },
    ],
    certs: ['CFA Level II · 2014', 'IFRS Specialist Cert. · 2013', 'SAP FI/CO Certified · 2017'],
    contactLabel: 'Contact',
    contactHeading: 'Let\'s talk',
    contactHeadingAccent: 'strategic finance.',
    contactSub: 'Available for CFO roles, financial advisory, and M&A projects.',
    footerDisclaimer: '🎭 This is a demo page. Marco Bianchi is a fictional character created by BeOnWeb for illustrative purposes.',
    footerBy: 'Designed by',
  },
  it: {
    role: 'Chief Financial Officer · Milano, Italia',
    disclaimer: 'Progetto dimostrativo · Personaggio di fantasia',
    navLinks: [['#about', 'About'], ['#experience', 'Esperienza'], ['#skills', 'Competenze'], ['#contact', 'Contatti']],
    navCta: 'Contattami',
    backLabel: '← Portfolio',
    heroSubtitle: '14 anni tra investment banking, manifatturiero e tech. Da analyst a CFO, ho costruito funzioni Finance dove non esistevano e guidato aziende attraverso Serie C, M&A e rinegoziazioni del debito.',
    ctaPrimary: 'Vedi il percorso',
    ctaContact: 'Contattami',
    statsRow: [
      { value: '14', unit: ' anni', label: 'di esperienza' },
      { value: '€280M', unit: '', label: 'portfolio gestito' },
      { value: '3×', unit: '', label: 'operazioni M&A' },
      { value: '4', unit: ' aziende', label: '4 settori diversi' },
    ],
    aboutLabel: 'About',
    aboutHeading: 'La finanza non è un costo.',
    aboutHeadingAccent: 'È una leva strategica.',
    about1: 'Ho iniziato in una boutique M&A, dove ho imparato che i numeri da soli non bastano — contano le storie che raccontano. Da lì in poi, ogni ruolo ha aggiunto uno strato: il controlling industriale, la complessità delle scale-up tech, la pressione degli LP.',
    about2: 'Oggi come CFO il mio lavoro è tradurre l\'ambizione del business in numeri che reggono — davanti a un board, a una banca, o a un acquirente. E costruire team che fanno lo stesso anche quando non ci sono io.',
    infoRows: [
      ['📍', 'Milano, Italia'],
      ['🏢', 'CFO · Meridian Capital (attuale)'],
      ['🎓', 'MSc Finance · Bocconi · 110L'],
      ['✉', 'marco.bianchi@mail.com'],
      ['🔗', 'linkedin.com/in/marcobianchi'],
    ],
    languages: ['🇮🇹 Italiano · Madrelingua', '🇬🇧 English · C1', '🇩🇪 Deutsch · B1'],
    expLabel: 'Percorso',
    expHeading: 'Quattro capitoli.',
    expHeadingAccent: 'Una direzione sola.',
    experience: [
      {
        index: '01',
        period: '2020 → Presente',
        company: 'Meridian Capital',
        type: 'Private equity portfolio company · 1.200 dipendenti',
        role: 'Chief Financial Officer',
        current: true,
        points: [
          'Supervisione finanziaria di un portafoglio da €280M — reporting diretto a CDA e LP investor.',
          'Gestito tre cicli di budget e forecast con scarto medio inferiore al 2% sul fatturato effettivo.',
          'Coordinato due operazioni di M&A buy-side: due diligence, strutturazione del deal, integrazione post-closing.',
          'Ridotto il costo del debito del 18% rinegoziando le facilities bancarie in un contesto di rialzo dei tassi.',
        ],
      },
      {
        index: '02',
        period: '2016 – 2020',
        company: 'Volta Technologies',
        type: 'Scale-up tech · Serie C · 320 dipendenti',
        role: 'Head of Finance & Control',
        current: false,
        points: [
          'Costruita da zero la funzione Finance — team di 6, processi, ERP (SAP S/4HANA), reportistica IFRS.',
          'Implementato il modello FP&A con rolling forecast trimestrale; presentazioni mensili al board.',
          'Supportato la chiusura della Serie C da €45M — preparazione data room, investor deck, due diligence.',
          'Riduzione del 22% dei costi operativi grazie a rinegoziazione fornitori e ottimizzazione del working capital.',
        ],
      },
      {
        index: '03',
        period: '2012 – 2016',
        company: 'Orion Manufacturing',
        type: 'Manifatturiero · 2.500 dipendenti',
        role: 'Finance Manager',
        current: false,
        points: [
          'Responsabile del controlling industriale per 3 stabilimenti — budget €180M, team di 4 persone.',
          'Introdotto sistema di cost accounting per linea prodotto; margini per prodotto visibili per la prima volta.',
          'Gestione tesoreria e pagamenti internazionali in 8 valute; implementato hedging su FX.',
        ],
      },
      {
        index: '04',
        period: '2009 – 2012',
        company: 'Crespi & Partners',
        type: 'Boutique M&A advisory',
        role: 'Financial Analyst',
        current: false,
        points: [
          'Analisi finanziaria e supporto alle operazioni di M&A mid-market (deal size €10M–€80M).',
          'Produzione di financial models, DCF, LBO analysis e information memoranda per clienti corporate.',
        ],
      },
    ],
    numbersRow: [
      { value: '€280M', label: 'Portfolio gestito' },
      { value: '-22%', label: 'Riduzione costi op.' },
      { value: '3×', label: 'Operazioni M&A' },
      { value: '<2%', label: 'Scarto medio forecast' },
    ],
    skillsLabel: 'Competenze',
    skillsHeading: 'Finance end-to-end.',
    skillsHeadingAccent: 'Dal modello alla firma.',
    skillGroups: [
      {
        label: 'FP&A & Controlling',
        items: ['Budget & Forecast', 'Rolling Forecast', 'Variance Analysis', 'KPI Design', 'Cost Controlling'],
      },
      {
        label: 'M&A & Capital Markets',
        items: ['Due Diligence', 'DCF & LBO Analysis', 'Deal Structuring', 'Investor Relations', 'Data Room Mgmt'],
      },
      {
        label: 'Treasury & Risk',
        items: ['Cash Management', 'FX Hedging', 'Debt Renegotiation', 'Working Capital Opt.', 'Risk Assessment'],
      },
      {
        label: 'Sistemi & Reporting',
        items: ['SAP S/4HANA', 'Oracle Hyperion', 'IFRS / ITA GAAP', 'Power BI', 'Excel VBA'],
      },
    ],
    education: [
      { degree: 'MSc Finance & Banking', school: 'Università Bocconi', year: '2007 – 2009', note: '110/110 cum laude' },
      { degree: 'Laurea Triennale in Economia Aziendale', school: 'Università degli Studi di Milano', year: '2004 – 2007', note: '' },
    ],
    certs: ['CFA Level II · 2014', 'IFRS Specialist Cert. · 2013', 'SAP FI/CO Certified · 2017'],
    contactLabel: 'Contatti',
    contactHeading: 'Parliamo di',
    contactHeadingAccent: 'finanza strategica.',
    contactSub: 'Disponibile per ruoli CFO, advisory finanziario e progetti di M&A.',
    footerDisclaimer: '🎭 Questa è una pagina dimostrativa. Marco Bianchi è un personaggio di fantasia creato da BeOnWeb a scopo illustrativo.',
    footerBy: 'Progettato da',
  },
}

export default function AlphaPage() {
  const { lang } = useLanguage()
  const c = content[lang]

  return (
    <div className={grotesk.className} style={{ background: dark, color: text, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }

        /* Navbar */
        .mb-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(7,9,14,0.92); backdrop-filter: blur(14px);
          border-bottom: 1px solid ${goldBorder};
        }
        .mb-nav-inner {
          max-width: 1100px; margin: 0 auto; padding: 0 32px;
          height: 60px; display: flex; align-items: center; justify-content: space-between;
        }
        .mb-nav-links { display: flex; gap: 28px; align-items: center; }
        .mb-nav-link { font-size: 13px; color: ${sub}; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .mb-nav-link:hover { color: ${gold}; }
        .mb-nav-cta {
          font-size: 13px; font-weight: 700; color: ${dark};
          background: ${gold}; text-decoration: none;
          padding: 8px 18px; border-radius: 6px; transition: opacity 0.15s;
        }
        .mb-nav-cta:hover { opacity: 0.85; }

        /* Experience rows */
        .exp-row {
          padding: 40px 0;
          border-bottom: 1px solid ${border};
        }
        .exp-row:last-child { border-bottom: none; }
        .exp-grid {
          display: grid; grid-template-columns: 300px 1fr; gap: 48px; align-items: start;
        }

        /* Skills grid */
        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }

        /* Numbers grid */
        .numbers-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }

        /* Responsive */
        @media (max-width: 960px) {
          .exp-grid { grid-template-columns: 1fr !important; gap: 20px !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-stats { flex-direction: column !important; gap: 20px !important; }
        }
        @media (max-width: 600px) {
          .mb-nav-links { display: none; }
          .mb-section { padding: 72px 20px !important; }
          .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .hero-ctas { flex-direction: column; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="mb-nav">
        <div className="mb-nav-inner">
          <a href="#top" style={{ fontSize: 16, fontWeight: 700, color: gold, textDecoration: 'none', letterSpacing: '0.06em' }}>MB</a>
          <div className="mb-nav-links">
            {c.navLinks.map(([href, label]) => (
              <a key={href} href={href} className="mb-nav-link">{label}</a>
            ))}
            <Link href="/#portfolio" className="mb-nav-link" style={{ color: sub, fontSize: 12 }}>{c.backLabel}</Link>
          </div>
          <a href="#contact" className="mb-nav-cta">{c.navCta}</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 60, position: 'relative', overflow: 'hidden' }}>
        {/* Background gold grid lines */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(${goldBorder} 1px, transparent 1px), linear-gradient(90deg, ${goldBorder} 1px, transparent 1px)`, backgroundSize: '80px 80px', opacity: 0.3, pointerEvents: 'none' }} />
        {/* Large decorative index */}
        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(10rem, 25vw, 22rem)', fontWeight: 700, color: 'rgba(212,168,67,0.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>CFO</div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '80px 32px 96px', width: '100%', position: 'relative', zIndex: 1 }}>

          {/* Disclaimer */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: `1px solid ${border}`, marginBottom: 20 }}>
            <span style={{ fontSize: 11 }}>🎭</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500, letterSpacing: '0.05em' }}>{c.disclaimer}</span>
          </div>

          <p style={{ fontSize: 12, fontWeight: 600, color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 24px', opacity: 0.8 }}>
            {c.role}
          </p>

          <h1 style={{ fontSize: 'clamp(3.5rem, 9vw, 8rem)', fontWeight: 700, color: '#fff', lineHeight: 0.9, margin: '0 0 36px', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            Marco <span style={{ color: gold }}>Bianchi</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 1.6vw, 1.15rem)', color: softText, maxWidth: 620, lineHeight: 1.8, margin: '0 0 48px', fontWeight: 300 }}>
            {c.heroSubtitle}
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 72 }}>
            <a href="#experience" style={{ padding: '13px 28px', background: gold, color: dark, fontWeight: 700, fontSize: 14, borderRadius: 6, textDecoration: 'none' }}>
              {c.ctaPrimary}
            </a>
            <a href="#contact" style={{ padding: '12px 28px', border: `1.5px solid ${goldBorder}`, color: softText, fontWeight: 600, fontSize: 14, borderRadius: 6, textDecoration: 'none' }}>
              {c.ctaContact}
            </a>
          </div>

          {/* Stats — horizontal row */}
          <div className="hero-stats" style={{ display: 'flex', gap: 0 }}>
            {c.statsRow.map(({ value, unit, label }, i, arr) => (
              <div key={label} style={{ padding: '24px 32px', borderLeft: i > 0 ? `1px solid ${goldBorder}` : 'none', borderTop: `1px solid ${goldBorder}`, borderBottom: `1px solid ${goldBorder}`, borderRight: i === arr.length - 1 ? `1px solid ${goldBorder}` : 'none', flex: 1 }}>
                <p style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1 }}>
                  {value}<span style={{ fontSize: 14, color: gold }}>{unit}</span>
                </p>
                <p style={{ fontSize: 11, color: sub, margin: 0, letterSpacing: '0.05em' }}>{label}</p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mb-section" style={{ padding: '100px 32px', background: darkCard }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px', opacity: 0.8 }}>{c.aboutLabel}</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80 }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.12, margin: '0 0 28px', letterSpacing: '-0.02em' }}>
                {c.aboutHeading}<br /><span style={{ color: gold }}>{c.aboutHeadingAccent}</span>
              </h2>
              <p style={{ fontSize: 16, color: softText, lineHeight: 1.85, margin: '0 0 20px', fontWeight: 300 }}>{c.about1}</p>
              <p style={{ fontSize: 16, color: softText, lineHeight: 1.85, fontWeight: 300 }}>{c.about2}</p>
            </div>
            <div>
              <div style={{ background: dark, border: `1px solid ${goldBorder}`, borderRadius: 12, padding: '8px 0', marginBottom: 24 }}>
                {c.infoRows.map(([icon, val], i, arr) => (
                  <div key={val as string} style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '14px 24px', borderBottom: i < arr.length - 1 ? `1px solid ${border}` : 'none' }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 14, color: softText }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {c.languages.map(l => (
                  <span key={l} style={{ fontSize: 12, fontWeight: 500, color: gold, background: goldFaint, border: `1px solid ${goldBorder}`, borderRadius: 4, padding: '5px 12px' }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="mb-section" style={{ padding: '100px 32px', background: dark }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px', opacity: 0.8 }}>{c.expLabel}</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.12, margin: '0 0 56px', letterSpacing: '-0.02em' }}>
            {c.expHeading}<br /><span style={{ color: gold }}>{c.expHeadingAccent}</span>
          </h2>

          {c.experience.map((e) => (
            <div key={e.index} className="exp-row">
              <div className="exp-grid">
                {/* Left */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: gold, opacity: 0.4, letterSpacing: '0.1em' }}>{e.index}</span>
                    <div style={{ flex: 1, height: 1, background: goldBorder }} />
                    {e.current && <span style={{ fontSize: 10, fontWeight: 700, background: gold, color: dark, borderRadius: 3, padding: '2px 7px' }}>Now</span>}
                  </div>
                  <p style={{ fontSize: 22, fontWeight: 700, color: '#fff', margin: '0 0 4px', letterSpacing: '-0.01em' }}>{e.company}</p>
                  <p style={{ fontSize: 14, fontWeight: 600, color: gold, margin: '0 0 6px' }}>{e.role}</p>
                  <p style={{ fontSize: 12, color: sub, margin: '0 0 12px' }}>{e.type}</p>
                  <span style={{ fontSize: 12, fontWeight: 600, color: softText, background: darkCard, border: `1px solid ${border}`, borderRadius: 4, padding: '4px 10px', display: 'inline-block' }}>{e.period}</span>
                </div>
                {/* Right */}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {e.points.map((pt, j) => (
                    <li key={j} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 14 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: gold, flexShrink: 0, marginTop: 8, opacity: 0.7 }} />
                      <span style={{ fontSize: 15, color: softText, lineHeight: 1.72 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NUMBERS */}
      <section style={{ background: gold }}>
        <div className="numbers-grid" style={{ maxWidth: 1100, margin: '0 auto' }}>
          {c.numbersRow.map(({ value, label }) => (
            <div key={label} style={{ padding: '40px 32px', textAlign: 'center', background: 'rgba(0,0,0,0.08)' }}>
              <p style={{ fontSize: 40, fontWeight: 700, color: dark, margin: '0 0 6px', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
              <p style={{ fontSize: 13, color: 'rgba(7,9,14,0.6)', margin: 0, fontWeight: 500 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="mb-section" style={{ padding: '100px 32px', background: darkCard }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px', opacity: 0.8 }}>{c.skillsLabel}</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.12, margin: '0 0 48px', letterSpacing: '-0.02em' }}>
            {c.skillsHeading}<br /><span style={{ color: gold }}>{c.skillsHeadingAccent}</span>
          </h2>
          <div className="skills-grid">
            {c.skillGroups.map(({ label, items }) => (
              <div key={label} style={{ padding: '28px', background: dark, border: `1px solid ${goldBorder}`, borderRadius: 10, borderLeft: `3px solid ${gold}` }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: gold, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 16px', opacity: 0.9 }}>{label}</p>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${border}` }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: gold, flexShrink: 0, opacity: 0.6 }} />
                    <span style={{ fontSize: 14, color: softText }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Education + certs */}
          <div style={{ marginTop: 48, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {c.education.map(ed => (
              <div key={ed.degree} style={{ padding: '24px 28px', background: dark, border: `1px solid ${goldBorder}`, borderRadius: 10 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{ed.degree}</p>
                <p style={{ fontSize: 13, color: gold, margin: '0 0 4px', opacity: 0.8 }}>{ed.school}</p>
                <p style={{ fontSize: 12, color: sub, margin: 0 }}>{ed.year}{ed.note ? ` · ${ed.note}` : ''}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {c.certs.map(cert => (
              <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 16px', background: dark, border: `1px solid ${goldBorder}`, borderRadius: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: gold, opacity: 0.7 }} />
                <span style={{ fontSize: 13, color: softText }}>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mb-section" style={{ padding: '100px 32px', background: dark, textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: gold, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 24px', opacity: 0.8 }}>{c.contactLabel}</p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, color: '#fff', lineHeight: 1.12, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {c.contactHeading}<br /><span style={{ color: gold }}>{c.contactHeadingAccent}</span>
          </h2>
          <p style={{ fontSize: 16, color: softText, margin: '0 0 48px', lineHeight: 1.75, fontWeight: 300 }}>{c.contactSub}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <a href="mailto:marco.bianchi@mail.com" style={{ padding: '13px 28px', background: gold, color: dark, fontWeight: 700, fontSize: 14, borderRadius: 6, textDecoration: 'none' }}>
              ✉ marco.bianchi@mail.com
            </a>
            <a href="https://linkedin.com/in/marcobianchi" style={{ padding: '12px 28px', border: `1.5px solid ${goldBorder}`, color: softText, fontWeight: 600, fontSize: 14, borderRadius: 6, textDecoration: 'none' }}>
              LinkedIn →
            </a>
          </div>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 32 }}>
            <p style={{ fontSize: 12, color: sub, margin: '0 0 8px', fontStyle: 'italic' }}>{c.footerDisclaimer}</p>
            <p style={{ fontSize: 12, color: sub, margin: '0 0 6px' }}>© 2025 Marco Bianchi · Milano</p>
            <p style={{ fontSize: 12, color: sub, margin: 0 }}>
              {c.footerBy} <Link href="/" style={{ color: gold, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
