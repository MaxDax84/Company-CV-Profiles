'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import { useLanguage } from '@/components/language-provider'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

// ── Design tokens (Alessandro Marcello inspired) ──────────────────────────
const v = 'oklch(0.72 0.18 280)'       // violet accent
const vFaint = 'oklch(0.72 0.18 280 / 0.10)'
const vBorder = 'oklch(0.72 0.18 280 / 0.20)'
const bg = 'oklch(0.14 0.005 270)'     // near-black bg
const bgAlt = 'oklch(0.18 0.005 270)'  // secondary bg
const card = 'oklch(0.20 0.007 270)'   // card bg
const bdr = 'oklch(0.28 0.007 270)'    // border
const fg = 'oklch(0.95 0.01 270)'      // foreground text
const mut = 'oklch(0.60 0.01 270)'     // muted text

// ── Content ───────────────────────────────────────────────────────────────
const content = {
  en: {
    role: 'Product & Growth Leader · Milan, Italy',
    disclaimer: 'Demo project · Fictional character',
    heroSubtitle: '11 years building digital products from zero to scale. From founding engineer to CPO, I turn user problems into revenue-driving features — and teams into the kind of people who can do it without me.',
    ctaPrimary: 'View career',
    ctaContact: 'Contact me',
    stats: [
      { value: '11', unit: ' yrs', label: 'in product & growth' },
      { value: '4×', unit: '', label: 'products launched' },
      { value: '€60M', unit: '', label: 'ARR under ownership' },
      { value: '3', unit: ' exits', label: 'M&A & strategic sale' },
    ],
    aboutLabel: 'Profile',
    aboutHeading: 'Products don\'t ship themselves.',
    aboutHeadingAccent: 'Teams do.',
    about1: 'I started as a full-stack developer because I wanted to understand how things actually worked — not just what users said they wanted. That instinct never left. Every product decision I\'ve made since has been grounded in the belief that the best ideas come from people who are both curious and accountable.',
    about2: 'Today I lead product and growth orgs — usually in the 50–250 FTE range, usually mid-Series B to pre-IPO. I care about velocity, clarity of ownership, and shipping things that matter. Less about methodology, more about momentum.',
    infoRows: [
      ['📍', 'Milan, Italy'],
      ['🏢', 'CPO · Meridio (current)'],
      ['🎓', 'MSc Computer Engineering · Politecnico di Milano'],
      ['✉', 'luca.romano@mail.com'],
      ['🔗', 'linkedin.com/in/lucaromano'],
    ],
    languages: ['🇮🇹 Italian · Native', '🇬🇧 English · C2', '🇪🇸 Spanish · B1'],
    expLabel: 'Experience',
    expHeading: 'Where I\'ve been.',
    expHeadingAccent: 'What I\'ve built.',
    experiences: [
      {
        period: '2022 → Present',
        company: 'Meridio',
        type: 'SaaS · Series B · 180 FTEs',
        role: 'Chief Product Officer',
        current: true,
        points: [
          'Ownership of the full product surface — 4 PMs, 1 Head of Design, 3 squads, dual-track agile.',
          'Rebuilt the growth loop: activation → expansion → referral. ARR from €18M to €60M in 24 months.',
          'Launched AI-assisted contract analysis feature; adopted by 68% of enterprise accounts in first quarter.',
          'Reduced time-to-value from 45 days to 11 days through a redesigned onboarding track.',
        ],
      },
      {
        period: '2019 – 2022',
        company: 'Novaflow',
        type: 'B2B SaaS · acquired by EQT Ventures · 2022',
        role: 'VP Product',
        current: false,
        points: [
          'Led product through Series A and B rounds — prepared product narrative, metrics deck, and investor Q&A.',
          'Grew the product team from 3 to 14. Introduced dual-track discovery and quarterly OKR reviews.',
          "Shipped the platform's flagship analytics module, which became the primary acquisition hook post-launch.",
          'Supported M&A process as product lead during due diligence and post-close integration.',
        ],
      },
      {
        period: '2016 – 2019',
        company: 'Helios Digital',
        type: 'Digital agency · 80 FTEs',
        role: 'Head of Product',
        current: false,
        points: [
          'First product hire. Built the discovery-to-delivery process for a 12-person engineering team.',
          'Launched 4 client-facing digital products across fintech, logistics, and media verticals.',
          'Introduced continuous delivery and reduced release cycles from 6 weeks to 10 days.',
        ],
      },
      {
        period: '2013 – 2016',
        company: 'Freelance & early-stage',
        type: 'Founding engineer · 2 ventures',
        role: 'Co-founder / Lead Developer',
        current: false,
        points: [
          'Co-founded two early-stage startups: one e-commerce SaaS (exited 2016), one logistics tool (sunset).',
          'Full-stack development: React, Node.js, PostgreSQL, AWS. Team of 3–5.',
        ],
      },
    ],
    skillsLabel: 'Skills',
    skillsHeading: 'The toolkit.',
    skillGroups: [
      {
        label: 'Product Strategy',
        items: ['Product Vision', 'Roadmap Planning', 'OKR Framework', 'Dual-Track Agile', 'Jobs-to-be-Done'],
      },
      {
        label: 'Growth & Metrics',
        items: ['PLG Loops', 'Funnel Optimisation', 'Cohort Analysis', 'Activation / Retention', 'A/B Testing'],
      },
      {
        label: 'Leadership',
        items: ['Team Building', 'Cross-functional Alignment', 'Hiring & Mentoring', 'Stakeholder Mgmt', 'M&A Support'],
      },
      {
        label: 'Technical',
        items: ['React / TypeScript', 'Node.js', 'SQL & dbt', 'AWS / GCP', 'API Design'],
      },
    ],
    education: [
      { degree: 'MSc Computer Engineering', school: 'Politecnico di Milano', year: '2011 – 2013', note: '110/110 cum laude' },
      { degree: 'BSc Computer Engineering', school: 'Politecnico di Milano', year: '2008 – 2011', note: '' },
    ],
    certs: ['AWS Certified Solutions Architect · 2021', 'Reforge Growth Series · 2020', 'CSPO · Scrum Alliance · 2018'],
    numbersLabel: 'Impact',
    numbers: [
      { value: '€60M', label: 'ARR under ownership', note: 'Meridio · 2024' },
      { value: '×3.3', label: 'ARR growth in 24 months', note: '€18M → €60M' },
      { value: '11 d', label: 'Time-to-value', note: 'down from 45 days' },
      { value: '68%', label: 'Enterprise AI adoption', note: 'first quarter post-launch' },
    ],
    contactLabel: 'Contact',
    contactHeading: 'Let\'s build',
    contactHeadingAccent: 'something that scales.',
    contactSub: 'Available for CPO / VP Product roles, advisory, and fractional product leadership.',
    footerDisclaimer: '🎭 This is a demo page. Luca Romano is a fictional character created by BeOnWeb for illustrative purposes.',
    footerBy: 'Designed by',
    backLabel: '← Portfolio',
    navLinks: [['#about', 'Profile'], ['#experience', 'Experience'], ['#skills', 'Skills'], ['#contact', 'Contact']],
    navCta: 'Get in touch',
  },
  it: {
    role: 'Product & Growth Leader · Milano, Italia',
    disclaimer: 'Progetto dimostrativo · Personaggio di fantasia',
    heroSubtitle: '11 anni a costruire prodotti digitali da zero alla scala. Da sviluppatore fondatore a CPO, trasformo i problemi degli utenti in funzionalità che generano fatturato — e i team in persone capaci di farlo anche senza di me.',
    ctaPrimary: 'Vedi il percorso',
    ctaContact: 'Contattami',
    stats: [
      { value: '11', unit: ' anni', label: 'in product & growth' },
      { value: '4×', unit: '', label: 'prodotti lanciati' },
      { value: '€60M', unit: '', label: 'ARR gestito' },
      { value: '3', unit: ' exit', label: 'M&A & cessione strategica' },
    ],
    aboutLabel: 'Profilo',
    aboutHeading: 'I prodotti non si spediscono da soli.',
    aboutHeadingAccent: 'Lo fanno i team.',
    about1: 'Ho iniziato come sviluppatore full-stack perché volevo capire come funzionavano davvero le cose — non solo cosa dicevano di voler gli utenti. Quell\'istinto non mi ha mai abbandonato. Ogni decisione di prodotto che ho preso da allora è radicata nella convinzione che le migliori idee vengano da persone che sono sia curiose che responsabili.',
    about2: 'Oggi guido organizzazioni di prodotto e crescita — di solito tra 50 e 250 FTE, di solito da metà Series B al pre-IPO. Mi importa la velocità, la chiarezza nella ownership e spedire cose che contano. Meno metodologia, più momentum.',
    infoRows: [
      ['📍', 'Milano, Italia'],
      ['🏢', 'CPO · Meridio (attuale)'],
      ['🎓', 'MSc Ingegneria Informatica · Politecnico di Milano'],
      ['✉', 'luca.romano@mail.com'],
      ['🔗', 'linkedin.com/in/lucaromano'],
    ],
    languages: ['🇮🇹 Italiano · Madrelingua', '🇬🇧 English · C2', '🇪🇸 Español · B1'],
    expLabel: 'Esperienza',
    expHeading: 'Dove sono stato.',
    expHeadingAccent: 'Cosa ho costruito.',
    experiences: [
      {
        period: '2022 → Presente',
        company: 'Meridio',
        type: 'SaaS · Series B · 180 dipendenti',
        role: 'Chief Product Officer',
        current: true,
        points: [
          'Ownership dell\'intera superficie prodotto — 4 PM, 1 Head of Design, 3 squad, dual-track agile.',
          'Ricostruito il growth loop: attivazione → espansione → referral. ARR da €18M a €60M in 24 mesi.',
          'Lanciata la feature di analisi contratti assistita da AI; adottata dal 68% degli account enterprise nel primo trimestre.',
          'Ridotto il time-to-value da 45 a 11 giorni grazie a un onboarding completamente ridisegnato.',
        ],
      },
      {
        period: '2019 – 2022',
        company: 'Novaflow',
        type: 'B2B SaaS · acquisita da EQT Ventures · 2022',
        role: 'VP Product',
        current: false,
        points: [
          'Guidato il prodotto nei round Series A e B — narrativa di prodotto, deck metriche e Q&A investor.',
          'Crescita del team prodotto da 3 a 14 persone. Introdotto dual-track discovery e OKR review trimestrali.',
          'Lanciato il modulo analytics flagship della piattaforma, diventato il principale acquisition hook.',
          'Supporto al processo M&A come product lead durante la due diligence e l\'integrazione post-closing.',
        ],
      },
      {
        period: '2016 – 2019',
        company: 'Helios Digital',
        type: 'Agenzia digitale · 80 dipendenti',
        role: 'Head of Product',
        current: false,
        points: [
          'Prima risorsa prodotto. Costruito il processo discovery-to-delivery per un team di 12 ingegneri.',
          'Lanciati 4 prodotti digitali per clienti in fintech, logistica e media.',
          'Introdotta la continuous delivery: cicli di rilascio ridotti da 6 settimane a 10 giorni.',
        ],
      },
      {
        period: '2013 – 2016',
        company: 'Freelance & early-stage',
        type: 'Founding engineer · 2 ventures',
        role: 'Co-founder / Lead Developer',
        current: false,
        points: [
          'Co-fondato due startup: un SaaS e-commerce (exit 2016) e uno strumento logistico (chiuso).',
          'Sviluppo full-stack: React, Node.js, PostgreSQL, AWS. Team da 3 a 5 persone.',
        ],
      },
    ],
    skillsLabel: 'Competenze',
    skillsHeading: 'Il toolkit.',
    skillGroups: [
      {
        label: 'Product Strategy',
        items: ['Product Vision', 'Roadmap Planning', 'OKR Framework', 'Dual-Track Agile', 'Jobs-to-be-Done'],
      },
      {
        label: 'Growth & Metriche',
        items: ['PLG Loops', 'Ottimizzazione Funnel', 'Cohort Analysis', 'Attivazione / Retention', 'A/B Testing'],
      },
      {
        label: 'Leadership',
        items: ['Team Building', 'Allineamento Cross-funzionale', 'Hiring & Mentoring', 'Gestione Stakeholder', 'M&A Support'],
      },
      {
        label: 'Tecnico',
        items: ['React / TypeScript', 'Node.js', 'SQL & dbt', 'AWS / GCP', 'API Design'],
      },
    ],
    education: [
      { degree: 'MSc Ingegneria Informatica', school: 'Politecnico di Milano', year: '2011 – 2013', note: '110/110 cum laude' },
      { degree: 'BSc Ingegneria Informatica', school: 'Politecnico di Milano', year: '2008 – 2011', note: '' },
    ],
    certs: ['AWS Certified Solutions Architect · 2021', 'Reforge Growth Series · 2020', 'CSPO · Scrum Alliance · 2018'],
    numbersLabel: 'Impatto',
    numbers: [
      { value: '€60M', label: 'ARR gestito', note: 'Meridio · 2024' },
      { value: '×3.3', label: 'Crescita ARR in 24 mesi', note: '€18M → €60M' },
      { value: '11 g', label: 'Time-to-value', note: 'da 45 giorni' },
      { value: '68%', label: 'Adozione AI enterprise', note: 'primo trimestre post-lancio' },
    ],
    contactLabel: 'Contatti',
    contactHeading: 'Costruiamo',
    contactHeadingAccent: 'qualcosa che scala.',
    contactSub: 'Disponibile per ruoli CPO / VP Product, advisory e product leadership frazionale.',
    footerDisclaimer: '🎭 Questa è una pagina dimostrativa. Luca Romano è un personaggio di fantasia creato da BeOnWeb a scopo illustrativo.',
    footerBy: 'Progettato da',
    backLabel: '← Portfolio',
    navLinks: [['#about', 'Profilo'], ['#experience', 'Esperienza'], ['#skills', 'Competenze'], ['#contact', 'Contatti']],
    navCta: 'Scrivimi',
  },
}

// ── Scroll-aware hook ─────────────────────────────────────────────────────
function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])
  return scrolled
}

function useInView() {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return { ref, inView }
}

// ── Section header (Alessandro Marcello style) ────────────────────────────
function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${bdr}, transparent)` }} />
      <h2 style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: v, fontWeight: 500, margin: 0 }}>{label}</h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${bdr}, transparent)` }} />
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────
export default function DeltaPage() {
  const { lang } = useLanguage()
  const c = content[lang]
  const scrolled = useScrolled()
  const heroIn = useInView()
  const aboutIn = useInView()
  const expIn = useInView()
  const skillsIn = useInView()
  const numbersIn = useInView()
  const contactIn = useInView()

  return (
    <div className={inter.className} style={{ background: bg, color: fg, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }

        .lr-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.3s, backdrop-filter 0.3s, border-color 0.3s;
        }
        .lr-nav.scrolled {
          background: oklch(0.14 0.005 270 / 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid oklch(0.28 0.007 270);
        }
        .lr-nav-inner {
          max-width: 960px; margin: 0 auto; padding: 0 24px;
          height: 64px; display: flex; align-items: center; justify-content: space-between;
        }
        .lr-nav-links { display: flex; gap: 28px; align-items: center; }
        .lr-nav-link { font-size: 13px; color: ${mut}; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .lr-nav-link:hover { color: ${fg}; }
        .lr-nav-cta {
          font-size: 13px; font-weight: 600; color: ${bg};
          background: ${v}; text-decoration: none;
          padding: 8px 18px; border-radius: 8px; transition: opacity 0.15s;
        }
        .lr-nav-cta:hover { opacity: 0.85; }

        .lr-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

        /* Experience timeline */
        .exp-item {
          position: relative; padding-left: 32px;
          border-left: 2px solid ${bdr};
          padding-bottom: 48px;
          transition: border-color 0.2s;
        }
        .exp-item:last-child { padding-bottom: 0; }
        .exp-item:hover { border-left-color: oklch(0.72 0.18 280 / 0.5); }
        .exp-dot {
          position: absolute; left: -9px; top: 4px;
          width: 16px; height: 16px; border-radius: 50%;
          background: ${bg}; border: 2px solid ${v};
          display: flex; align-items: center; justify-content: center;
        }
        .exp-dot-inner { width: 6px; height: 6px; border-radius: 50%; background: ${v}; }

        /* Skills grid */
        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }

        /* Numbers grid */
        .numbers-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

        /* Edu grid */
        .edu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        /* About grid */
        .about-grid { display: grid; grid-template-columns: 1fr 320px; gap: 64px; align-items: start; }

        /* Stats row */
        .stats-row { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }

        @media (max-width: 900px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .numbers-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .edu-grid { grid-template-columns: 1fr !important; }
          .stats-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
        .lr-back-mobile { display: none; font-size: 13px; color: ${mut}; text-decoration: none; font-weight: 500; }
        .lr-back-mobile:hover { color: ${fg}; }

        @media (max-width: 600px) {
          .lr-nav-links { display: none; }
          .lr-back-mobile { display: block; }
          .numbers-grid { grid-template-columns: 1fr 1fr !important; }
          .stats-row { grid-template-columns: 1fr 1fr !important; }
          .hero-ctas { flex-direction: column !important; }
        }
        @media (max-width: 480px) {
          .lr-hero-h1 { white-space: normal !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`lr-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="lr-nav-inner">
          <a href="#top" style={{ fontSize: 16, fontWeight: 700, color: fg, textDecoration: 'none', letterSpacing: '0.04em' }}>LR</a>
          <div className="lr-nav-links">
            {c.navLinks.map(([href, label]) => (
              <a key={href} href={href} className="lr-nav-link">{label}</a>
            ))}
            <Link href="/#portfolio" className="lr-nav-link" style={{ color: mut, fontSize: 12 }}>{c.backLabel}</Link>
          </div>
          <Link href="/#portfolio" className="lr-back-mobile">{c.backLabel}</Link>
          <a href="#contact" className="lr-nav-cta">{c.navCta}</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
        {/* Subtle violet glow */}
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: `${v.replace(')', ' / 0.06)')}`, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: `${v.replace(')', ' / 0.04)')}`, filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div
          ref={heroIn.ref}
          className="lr-container"
          style={{ padding: '80px 24px 96px', width: '100%', textAlign: 'center', transition: 'opacity 0.8s, transform 0.8s', opacity: heroIn.inView ? 1 : 0, transform: heroIn.inView ? 'translateY(0)' : 'translateY(32px)' }}
        >
          {/* Disclaimer */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '4px 14px', borderRadius: 999, background: vFaint, border: `1px solid ${vBorder}`, marginBottom: 24 }}>
            <span style={{ fontSize: 11 }}>🎭</span>
            <span style={{ fontSize: 11, color: mut, fontWeight: 500, letterSpacing: '0.05em' }}>{c.disclaimer}</span>
          </div>

          <p style={{ fontSize: 12, fontWeight: 600, color: v, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px', opacity: 0.85 }}>
            {c.role}
          </p>

          <h1 className="lr-hero-h1" style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', fontWeight: 700, color: fg, lineHeight: 0.92, margin: '0 0 36px', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            Luca <span style={{ color: v }}>Romano</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.12rem)', color: mut, maxWidth: 700, lineHeight: 1.8, margin: '0 auto 48px', fontWeight: 300 }}>
            {c.heroSubtitle}
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 80, justifyContent: 'center' }}>
            <a href="#experience" style={{ padding: '12px 26px', background: v, color: bg, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              {c.ctaPrimary}
            </a>
            <a href="#contact" style={{ padding: '11px 26px', border: `1.5px solid ${bdr}`, color: mut, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              {c.ctaContact}
            </a>
          </div>

          {/* Stats row */}
          <div className="stats-row" style={{ border: `1px solid ${bdr}`, borderRadius: 12, overflow: 'hidden' }}>
            {c.stats.map(({ value, unit, label }, i, arr) => (
              <div key={label} style={{ padding: '24px 20px', background: card, borderRight: i < arr.length - 1 ? `1px solid ${bdr}` : 'none' }}>
                <p style={{ fontSize: 26, fontWeight: 700, color: fg, margin: '0 0 4px', lineHeight: 1 }}>
                  {value}<span style={{ fontSize: 13, color: v, fontWeight: 500 }}>{unit}</span>
                </p>
                <p style={{ fontSize: 11, color: mut, margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '96px 0', background: bgAlt }}>
        <div
          ref={aboutIn.ref}
          className="lr-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: aboutIn.inView ? 1 : 0, transform: aboutIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <SectionHeader label={c.aboutLabel} />
          <div className="about-grid">
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: fg, lineHeight: 1.15, margin: '0 0 28px', letterSpacing: '-0.02em' }}>
                {c.aboutHeading}<br /><span style={{ color: v }}>{c.aboutHeadingAccent}</span>
              </h2>
              <p style={{ fontSize: 15, color: mut, lineHeight: 1.85, margin: '0 0 20px', fontWeight: 300 }}>{c.about1}</p>
              <p style={{ fontSize: 15, color: mut, lineHeight: 1.85, fontWeight: 300 }}>{c.about2}</p>
            </div>
            <div>
              <div style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 12, padding: '8px 0', marginBottom: 20 }}>
                {c.infoRows.map(([icon, val], i, arr) => (
                  <div key={val as string} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '13px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${bdr}` : 'none' }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: mut }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {c.languages.map(l => (
                  <span key={l} style={{ fontSize: 12, fontWeight: 500, color: v, background: vFaint, border: `1px solid ${vBorder}`, borderRadius: 4, padding: '4px 10px' }}>{l}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: '96px 0' }}>
        <div
          ref={expIn.ref}
          className="lr-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: expIn.inView ? 1 : 0, transform: expIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <SectionHeader label={c.expLabel} />
          <div style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, color: fg, lineHeight: 1.15, margin: '0 0 56px', letterSpacing: '-0.02em' }}>
              {c.expHeading}<br /><span style={{ color: v }}>{c.expHeadingAccent}</span>
            </h3>
          </div>
          <div>
            {c.experiences.map((exp) => (
              <div key={exp.company + exp.role} className="exp-item">
                <div className="exp-dot"><div className="exp-dot-inner" /></div>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                      <h4 style={{ fontSize: 18, fontWeight: 600, color: fg, margin: 0, letterSpacing: '-0.01em' }}>{exp.company}</h4>
                      {exp.current && <span style={{ fontSize: 10, fontWeight: 700, background: v, color: bg, borderRadius: 4, padding: '2px 7px' }}>Now</span>}
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500, color: v, margin: '0 0 4px' }}>{exp.role}</p>
                    <p style={{ fontSize: 12, color: mut, margin: 0 }}>{exp.type}</p>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: mut, fontFamily: 'monospace', background: card, border: `1px solid ${bdr}`, borderRadius: 4, padding: '3px 9px', whiteSpace: 'nowrap' }}>{exp.period}</span>
                </div>
                <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
                  {exp.points.map((pt, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: v, marginTop: 3, flexShrink: 0 }}>›</span>
                      <span style={{ fontSize: 14, color: mut, lineHeight: 1.7 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── NUMBERS ── */}
      <section style={{ background: bgAlt, padding: '64px 0' }}>
        <div
          ref={numbersIn.ref}
          className="lr-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: numbersIn.inView ? 1 : 0, transform: numbersIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <SectionHeader label={c.numbersLabel} />
          <div className="numbers-grid">
            {c.numbers.map(({ value, label, note }) => (
              <div key={label} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 12, padding: '28px 24px' }}>
                <p style={{ fontSize: 36, fontWeight: 700, color: v, margin: '0 0 6px', lineHeight: 1, letterSpacing: '-0.02em' }}>{value}</p>
                <p style={{ fontSize: 13, color: fg, fontWeight: 500, margin: '0 0 4px', lineHeight: 1.3 }}>{label}</p>
                <p style={{ fontSize: 11, color: mut, margin: 0 }}>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ padding: '96px 0' }}>
        <div
          ref={skillsIn.ref}
          className="lr-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: skillsIn.inView ? 1 : 0, transform: skillsIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <SectionHeader label={c.skillsLabel} />
          <h3 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, color: fg, lineHeight: 1.15, margin: '0 0 48px', letterSpacing: '-0.02em' }}>
            {c.skillsHeading}
          </h3>
          <div className="skills-grid">
            {c.skillGroups.map(({ label, items }) => (
              <div key={label} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 10, padding: '24px', borderLeft: `2px solid ${v}` }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: v, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 16px' }}>{label}</p>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '7px 0', borderBottom: `1px solid ${bdr}` }}>
                    <span style={{ fontSize: 12, color: v }}>›</span>
                    <span style={{ fontSize: 13, color: mut }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Education */}
          <div style={{ marginTop: 40 }}>
            <div className="edu-grid">
              {c.education.map(ed => (
                <div key={ed.degree} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 10, padding: '20px 24px' }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: fg, margin: '0 0 4px' }}>{ed.degree}</p>
                  <p style={{ fontSize: 13, color: v, margin: '0 0 4px', fontWeight: 500 }}>{ed.school}</p>
                  <p style={{ fontSize: 12, color: mut, margin: 0 }}>{ed.year}{ed.note ? ` · ${ed.note}` : ''}</p>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {c.certs.map(cert => (
                <div key={cert} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: card, border: `1px solid ${bdr}`, borderRadius: 6 }}>
                  <span style={{ fontSize: 10, color: v }}>●</span>
                  <span style={{ fontSize: 12, color: mut }}>{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '96px 0', background: bgAlt, textAlign: 'center' }}>
        <div
          ref={contactIn.ref}
          style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px', transition: 'opacity 0.7s, transform 0.7s', opacity: contactIn.inView ? 1 : 0, transform: contactIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <SectionHeader label={c.contactLabel} />
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 700, color: fg, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {c.contactHeading}<br /><span style={{ color: v }}>{c.contactHeadingAccent}</span>
          </h2>
          <p style={{ fontSize: 15, color: mut, margin: '0 0 48px', lineHeight: 1.75, fontWeight: 300 }}>{c.contactSub}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <a href="mailto:luca.romano@mail.com" style={{ padding: '13px 26px', background: v, color: bg, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              ✉ luca.romano@mail.com
            </a>
            <a href="https://linkedin.com/in/lucaromano" style={{ padding: '12px 26px', border: `1.5px solid ${bdr}`, color: mut, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              LinkedIn →
            </a>
          </div>
          <div style={{ borderTop: `1px solid ${bdr}`, paddingTop: 28 }}>
            <p style={{ fontSize: 11, color: mut, margin: '0 0 8px', fontStyle: 'italic', opacity: 0.7 }}>{c.footerDisclaimer}</p>
            <p style={{ fontSize: 12, color: mut, margin: '0 0 4px', opacity: 0.5 }}>© 2025 Luca Romano · Milano</p>
            <p style={{ fontSize: 12, color: mut, margin: 0, opacity: 0.5 }}>
              {c.footerBy} <Link href="/" style={{ color: v, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
