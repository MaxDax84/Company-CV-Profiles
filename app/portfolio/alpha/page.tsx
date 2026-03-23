'use client'

import Link from 'next/link'
import { Playfair_Display, Inter } from 'next/font/google'
import { useLanguage } from '@/components/language-provider'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  style: ['normal', 'italic'],
})
const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

const gold = '#c9a84c'
const goldBorder = 'rgba(201,168,76,0.22)'
const navy = '#0a1628'
const navyCard = '#0d1f3c'
const cream = '#f4f0e8'
const creamBorder = 'rgba(0,0,0,0.09)'
const inkDark = '#1a2332'
const inkMid = '#3d4f63'
const inkLight = '#6b7d93'
const onDark = '#ddd8cc'
const onDarkMuted = '#7a8ca0'

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
    contactHeading: "Let's talk",
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
    about2: "Oggi come CFO il mio lavoro è tradurre l'ambizione del business in numeri che reggono — davanti a un board, a una banca, o a un acquirente. E costruire team che fanno lo stesso anche quando non ci sono io.",
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
    <div className={inter.className} style={{ background: navy, color: onDark, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }

        /* ── Navbar ── */
        .mb-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(10,22,40,0.96); backdrop-filter: blur(14px);
          border-bottom: 1px solid ${goldBorder};
        }
        .mb-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 40px;
          height: 64px; display: flex; align-items: center; justify-content: space-between;
        }
        .mb-nav-links { display: flex; gap: 28px; align-items: center; }
        .mb-nav-link { font-size: 13px; color: ${onDarkMuted}; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .mb-nav-link:hover { color: ${gold}; }
        .mb-nav-cta {
          font-size: 13px; font-weight: 700; color: ${navy};
          background: ${gold}; text-decoration: none;
          padding: 9px 20px; border-radius: 5px; transition: opacity 0.15s;
        }
        .mb-nav-cta:hover { opacity: 0.85; }

        /* ── Sections ── */
        .mb-section-dark { padding: 96px 40px; }
        .mb-section-card { padding: 96px 40px; background: ${navyCard}; }
        .mb-section-cream { padding: 80px 40px; background: ${cream}; color: ${inkDark}; }
        .mb-container { max-width: 1200px; margin: 0 auto; }

        /* ── Hero inner ── */
        .mb-hero-inner { padding: 80px 40px 0; max-width: 1200px; margin: 0 auto; position: relative; z-index: 1; }

        /* ── Stats strip ── */
        .mb-stats-strip { display: grid; grid-template-columns: repeat(4, 1fr); }

        /* ── About ── */
        .mb-about-grid { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 72px; align-items: start; }

        /* ── Metrics ── */
        .mb-metrics-grid {
          display: grid; grid-template-columns: repeat(4, 1fr);
          border: 1px solid ${creamBorder}; border-radius: 10px; overflow: hidden;
        }

        /* ── Experience ── */
        .mb-exp-item { padding: 52px 0; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .mb-exp-item:last-child { border-bottom: none; }
        .mb-exp-header { display: flex; align-items: baseline; gap: 20px; margin-bottom: 10px; flex-wrap: wrap; }
        .mb-exp-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 28px; flex-wrap: wrap; }
        .mb-exp-points { display: grid; grid-template-columns: 1fr 1fr; gap: 10px 36px; }

        /* ── Skills ── */
        .mb-skill-row {
          display: flex; align-items: baseline; gap: 24px;
          padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .mb-skill-row:last-child { border-bottom: none; }
        .mb-skill-label {
          font-size: 10px; font-weight: 700; color: ${gold};
          letter-spacing: 0.18em; text-transform: uppercase;
          min-width: 190px; flex-shrink: 0;
        }
        .mb-skill-pills { display: flex; flex-wrap: wrap; gap: 8px; }
        .mb-pill {
          font-size: 12px; font-weight: 500; color: ${onDarkMuted};
          background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.09);
          border-radius: 4px; padding: 5px 13px;
        }

        /* ── Education ── */
        .mb-edu-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

        /* ── Responsive 960px ── */
        @media (max-width: 960px) {
          .mb-about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .mb-metrics-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .mb-exp-points { grid-template-columns: 1fr !important; }
          .mb-skill-row { flex-direction: column !important; gap: 12px !important; }
          .mb-skill-label { min-width: unset !important; }
          .mb-edu-grid { grid-template-columns: 1fr !important; }
          .mb-stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .mb-back-mobile { display: none; font-size: 13px; color: ${onDarkMuted}; text-decoration: none; font-weight: 500; }
        .mb-back-mobile:hover { color: ${gold}; }

        /* ── Responsive 600px ── */
        @media (max-width: 600px) {
          .mb-nav-links { display: none; }
          .mb-back-mobile { display: block; }
          .mb-nav-inner { padding: 0 20px !important; }
          .mb-section-dark, .mb-section-card { padding: 72px 20px !important; }
          .mb-section-cream { padding: 60px 20px !important; }
          .mb-hero-inner { padding: 60px 20px 0 !important; }
          .mb-stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
          .mb-hero-ctas { flex-direction: column !important; }
          .mb-hero-ctas a { text-align: center !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className="mb-nav">
        <div className="mb-nav-inner">
          <span className={playfair.className} style={{ fontSize: 18, fontWeight: 700, color: gold, letterSpacing: '0.04em' }}>MB</span>
          <div className="mb-nav-links">
            {c.navLinks.map(([href, label]) => (
              <a key={href} href={href} className="mb-nav-link">{label}</a>
            ))}
            <Link href="/#portfolio" className="mb-nav-link" style={{ fontSize: 12 }}>{c.backLabel}</Link>
          </div>
          <Link href="/#portfolio" className="mb-back-mobile">{c.backLabel}</Link>
          <a href="#contact" className="mb-nav-cta">{c.navCta}</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" style={{ paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
        {/* Diagonal line texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(135deg, ${goldBorder} 0, ${goldBorder} 1px, transparent 0, transparent 50%)`, backgroundSize: '60px 60px', opacity: 0.12, pointerEvents: 'none' }} />
        {/* Large decorative label */}
        <div style={{ position: 'absolute', right: '3%', top: '44%', transform: 'translateY(-50%)', fontSize: 'clamp(8rem, 20vw, 18rem)', fontWeight: 900, color: `rgba(201,168,76,0.04)`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none', fontFamily: playfair.style.fontFamily }}>CFO</div>

        <div className="mb-hero-inner">
          {/* Disclaimer */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.04)', border: `1px solid ${goldBorder}`, marginBottom: 32 }}>
            <span style={{ fontSize: 11 }}>🎭</span>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500, letterSpacing: '0.05em' }}>{c.disclaimer}</span>
          </div>

          {/* Name — two-line typographic treatment, no whiteSpace:nowrap needed */}
          <div className={playfair.className} style={{ margin: '0 0 24px', lineHeight: 1 }}>
            <div style={{ fontSize: 'clamp(2.4rem, 6vw, 5.2rem)', fontWeight: 400, color: onDark, marginBottom: 4, letterSpacing: '-0.01em' }}>Marco</div>
            <div style={{ fontSize: 'clamp(4rem, 11vw, 9rem)', fontWeight: 900, color: gold, letterSpacing: '-0.03em', lineHeight: 0.88 }}>Bianchi</div>
          </div>

          <p style={{ fontSize: 12, fontWeight: 600, color: onDarkMuted, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 28px' }}>{c.role}</p>

          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: onDarkMuted, maxWidth: 680, lineHeight: 1.85, margin: '0 0 48px', fontWeight: 300 }}>{c.heroSubtitle}</p>

          <div className="mb-hero-ctas" style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 72 }}>
            <a href="#experience" style={{ padding: '13px 28px', background: gold, color: navy, fontWeight: 700, fontSize: 14, borderRadius: 5, textDecoration: 'none' }}>{c.ctaPrimary}</a>
            <a href="#contact" style={{ padding: '12px 28px', border: `1.5px solid ${goldBorder}`, color: onDarkMuted, fontWeight: 600, fontSize: 14, borderRadius: 5, textDecoration: 'none' }}>{c.ctaContact}</a>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{ background: navyCard, borderTop: `1px solid ${goldBorder}` }}>
          <div className="mb-container" style={{ padding: '0 40px' }}>
            <div className="mb-stats-strip">
              {c.statsRow.map(({ value, unit, label }, i, arr) => (
                <div key={label} style={{ padding: '28px 32px', borderRight: i < arr.length - 1 ? `1px solid ${goldBorder}` : 'none' }}>
                  <p style={{ fontSize: 28, fontWeight: 700, color: '#fff', margin: '0 0 4px', lineHeight: 1, fontFamily: playfair.style.fontFamily }}>
                    {value}<span style={{ fontSize: 13, color: gold, fontFamily: inter.style.fontFamily }}>{unit}</span>
                  </p>
                  <p style={{ fontSize: 11, color: onDarkMuted, margin: 0, letterSpacing: '0.05em' }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="mb-section-cream">
        <div className="mb-container">
          <p style={{ fontSize: 11, fontWeight: 700, color: inkLight, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 16px' }}>{c.aboutLabel}</p>
          <div className="mb-about-grid">
            <div>
              <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', fontWeight: 700, color: inkDark, lineHeight: 1.15, margin: '0 0 28px', letterSpacing: '-0.01em' }}>
                {c.aboutHeading}<br /><em style={{ color: gold }}>{c.aboutHeadingAccent}</em>
              </h2>
              <p style={{ fontSize: 16, color: inkMid, lineHeight: 1.88, margin: '0 0 20px' }}>{c.about1}</p>
              <p style={{ fontSize: 16, color: inkMid, lineHeight: 1.88 }}>{c.about2}</p>
            </div>
            <div>
              <div style={{ background: '#fff', border: `1px solid ${creamBorder}`, borderRadius: 10, padding: '8px 0', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
                {c.infoRows.map(([icon, val], i, arr) => (
                  <div key={val as string} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '13px 22px', borderBottom: i < arr.length - 1 ? `1px solid ${creamBorder}` : 'none' }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 14, color: inkMid }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {c.languages.map(l => (
                  <span key={l} style={{ fontSize: 12, fontWeight: 500, color: inkDark, background: 'rgba(201,168,76,0.12)', border: `1px solid rgba(201,168,76,0.28)`, borderRadius: 4, padding: '5px 12px' }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="mb-section-dark">
        <div className="mb-container">
          <p style={{ fontSize: 11, fontWeight: 700, color: gold, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 14px', opacity: 0.8 }}>{c.expLabel}</p>
          <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: '0 0 64px', letterSpacing: '-0.01em' }}>
            {c.expHeading} <em style={{ color: gold }}>{c.expHeadingAccent}</em>
          </h2>

          {c.experience.map((e) => (
            <div key={e.index} className="mb-exp-item">
              <div className="mb-exp-header">
                <span style={{ fontSize: 11, fontWeight: 700, color: gold, opacity: 0.45, letterSpacing: '0.15em' }}>{e.index}</span>
                <h3 className={playfair.className} style={{ fontSize: 'clamp(1.3rem, 2.8vw, 2rem)', fontWeight: 700, color: '#fff', margin: 0, letterSpacing: '-0.01em' }}>{e.company}</h3>
                {e.current && <span style={{ fontSize: 10, fontWeight: 700, background: gold, color: navy, borderRadius: 3, padding: '2px 8px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Now</span>}
              </div>
              <div className="mb-exp-meta">
                <span style={{ fontSize: 15, fontWeight: 600, color: gold }}>{e.role}</span>
                <span style={{ fontSize: 12, color: onDarkMuted }}>{e.type}</span>
                <span style={{ fontSize: 12, fontWeight: 500, color: onDarkMuted, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 4, padding: '3px 10px' }}>{e.period}</span>
              </div>
              <div className="mb-exp-points">
                {e.points.map((pt, j) => (
                  <div key={j} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ width: 4, height: 4, borderRadius: '50%', background: gold, flexShrink: 0, marginTop: 9, opacity: 0.65 }} />
                    <span style={{ fontSize: 14, color: onDarkMuted, lineHeight: 1.72 }}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── METRICS BAND ── */}
      <section style={{ background: cream }}>
        <div className="mb-container" style={{ padding: '0 40px' }}>
          <div className="mb-metrics-grid">
            {c.numbersRow.map(({ value, label }) => (
              <div key={label} style={{ padding: '48px 32px', textAlign: 'center', background: '#fff' }}>
                <p className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 900, color: inkDark, margin: '0 0 8px', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
                <p style={{ fontSize: 12, color: inkLight, margin: 0, fontWeight: 500, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" className="mb-section-card">
        <div className="mb-container">
          <p style={{ fontSize: 11, fontWeight: 700, color: gold, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 14px', opacity: 0.8 }}>{c.skillsLabel}</p>
          <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: '#fff', lineHeight: 1.15, margin: '0 0 48px', letterSpacing: '-0.01em' }}>
            {c.skillsHeading} <em style={{ color: gold }}>{c.skillsHeadingAccent}</em>
          </h2>

          <div style={{ marginBottom: 56 }}>
            {c.skillGroups.map(({ label, items }) => (
              <div key={label} className="mb-skill-row">
                <span className="mb-skill-label">{label}</span>
                <div className="mb-skill-pills">
                  {items.map(item => <span key={item} className="mb-pill">{item}</span>)}
                </div>
              </div>
            ))}
          </div>

          <div className="mb-edu-grid" style={{ marginBottom: 24 }}>
            {c.education.map(ed => (
              <div key={ed.degree} style={{ padding: '22px 26px', background: navy, border: `1px solid ${goldBorder}`, borderRadius: 8 }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: '#fff', margin: '0 0 4px' }}>{ed.degree}</p>
                <p style={{ fontSize: 13, color: gold, margin: '0 0 4px', opacity: 0.85 }}>{ed.school}</p>
                <p style={{ fontSize: 12, color: onDarkMuted, margin: 0 }}>{ed.year}{ed.note ? ` · ${ed.note}` : ''}</p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {c.certs.map(cert => (
              <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: navy, border: `1px solid ${goldBorder}`, borderRadius: 5 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: gold, opacity: 0.7 }} />
                <span style={{ fontSize: 13, color: onDarkMuted }}>{cert}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="mb-section-cream" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: inkLight, letterSpacing: '0.22em', textTransform: 'uppercase', margin: '0 0 20px' }}>{c.contactLabel}</p>
          <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 700, color: inkDark, lineHeight: 1.15, margin: '0 0 16px', letterSpacing: '-0.01em' }}>
            {c.contactHeading} <em style={{ color: gold }}>{c.contactHeadingAccent}</em>
          </h2>
          <p style={{ fontSize: 16, color: inkMid, margin: '0 0 48px', lineHeight: 1.75 }}>{c.contactSub}</p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <a href="mailto:marco.bianchi@mail.com" style={{ padding: '13px 28px', background: gold, color: navy, fontWeight: 700, fontSize: 14, borderRadius: 5, textDecoration: 'none' }}>
              ✉ marco.bianchi@mail.com
            </a>
            <a href="https://linkedin.com/in/marcobianchi" style={{ padding: '12px 28px', border: `1.5px solid rgba(0,0,0,0.16)`, color: inkMid, fontWeight: 600, fontSize: 14, borderRadius: 5, textDecoration: 'none' }}>
              LinkedIn →
            </a>
          </div>
          <div style={{ borderTop: `1px solid ${creamBorder}`, paddingTop: 32 }}>
            <p style={{ fontSize: 12, color: inkLight, margin: '0 0 8px', fontStyle: 'italic' }}>{c.footerDisclaimer}</p>
            <p style={{ fontSize: 12, color: inkLight, margin: '0 0 6px' }}>© 2025 Marco Bianchi · Milano</p>
            <p style={{ fontSize: 12, color: inkLight, margin: 0 }}>
              {c.footerBy} <Link href="/" style={{ color: gold, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
