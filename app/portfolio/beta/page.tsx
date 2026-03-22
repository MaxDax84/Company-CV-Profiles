'use client'

import Link from 'next/link'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'

const serif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'], style: ['normal', 'italic'] })
const sans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

const indigo = '#4f46e5'
const indigoLight = '#818cf8'
const indigoDark = '#1e1b4b'
const indigoFaint = 'rgba(79,70,229,0.07)'
const indigoBorder = 'rgba(79,70,229,0.18)'
const ink = '#0f0e1a'
const sub = '#4b5563'
const muted = '#9ca3af'
const bg = '#ffffff'
const bgAlt = '#f8f7ff'
const border = '#e5e7eb'

const engagements = [
  {
    year: '2023 – Presente',
    sector: 'Healthcare & Pharma',
    type: 'Market Entry Strategy',
    client: 'Confidenziale · Multinazionale farmaceutica',
    description: 'Definita la strategia di ingresso sul mercato italiano per una linea diagnostica. Analisi competitiva, segmentazione, pricing strategy e piano go-to-market. Lancio completato in 14 mesi, sotto budget del 12%.',
    tags: ['Market Entry', 'Pricing', 'Go-to-Market'],
  },
  {
    year: '2021 – 2023',
    sector: 'Financial Services',
    type: 'Organizational Redesign',
    client: 'Atlas Advisory · Senior Manager',
    description: 'Guidato il redesign organizzativo di una società di asset management (€3.2B AUM) a seguito di una fusione. Ridefiniti 4 livelli gerarchici, introdotto sistema di governance per comitati. Progetto consegnato in 18 mesi.',
    tags: ['Org Design', 'Post-merger Integration', 'Governance'],
  },
  {
    year: '2019 – 2021',
    sector: 'Retail & Consumer',
    type: 'Digital Transformation',
    client: 'Vertex Consulting · Manager',
    description: 'Responsabile del work-stream "customer journey" per la trasformazione digitale di una catena retail con 220 punti vendita. Riduzione del churn del 18% e aumento del NPS da 31 a 54 in 24 mesi.',
    tags: ['Digital Transformation', 'Customer Journey', 'Change Mgmt'],
  },
  {
    year: '2017 – 2019',
    sector: 'Energy & Utilities',
    type: 'Revenue Growth Strategy',
    client: 'Vertex Consulting · Senior Consultant',
    description: 'Sviluppata la strategia di crescita per un utility player in transizione verso le rinnovabili. Identificate opportunità di revenue per €85M nel triennio. Piano presentato al CDA e approvato integralmente.',
    tags: ['Revenue Strategy', 'Energy Transition', 'Board Presentation'],
  },
  {
    year: '2013 – 2017',
    sector: 'Technology & Telco',
    type: 'Strategy & Operations',
    client: 'Archon Strategy · Analyst → Consultant',
    description: 'Primi anni in consulenza strategica: dal modelling finanziario ai project management su engagement multi-country. Specializzazione progressiva nel tech e telco.',
    tags: ['Strategy', 'Operations', 'Financial Modelling'],
  },
]

const expertise = [
  { icon: '🗺', title: 'Market Strategy', desc: 'Analisi competitiva, segmentazione, pricing e go-to-market per mercati complessi.' },
  { icon: '🏛', title: 'Org Design & Governance', desc: 'Redesign organizzativo, ridefinizione dei ruoli e strutture di governance post-M&A.' },
  { icon: '🔄', title: 'Digital Transformation', desc: 'Change management e customer journey per aziende in transizione digitale.' },
  { icon: '📈', title: 'Revenue Growth', desc: 'Identificazione di leve di crescita e costruzione di business case per il CDA.' },
  { icon: '🤝', title: 'M&A Integration', desc: 'Post-merger integration: processi, cultura, struttura operativa.' },
  { icon: '🌍', title: 'International Expansion', desc: 'Strategie di internazionalizzazione in Europa, MENA e Asia-Pacific.' },
]

export default function BetaPage() {
  return (
    <div className={sans.className} style={{ background: bg, color: ink, overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }

        /* Navbar */
        .sc-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.94); backdrop-filter: blur(14px);
          border-bottom: 1px solid ${border};
        }
        .sc-nav-inner {
          max-width: 1200px; margin: 0 auto; padding: 0 40px;
          height: 60px; display: flex; align-items: center; justify-content: space-between;
        }
        .sc-nav-links { display: flex; gap: 32px; align-items: center; }
        .sc-nav-link { font-size: 13px; color: ${sub}; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .sc-nav-link:hover { color: ${ink}; }
        .sc-nav-cta {
          font-size: 13px; font-weight: 700; color: #fff;
          background: ${indigo}; text-decoration: none;
          padding: 8px 18px; border-radius: 8px; transition: opacity 0.15s;
        }
        .sc-nav-cta:hover { opacity: 0.85; }

        /* Engagement rows */
        .eng-row {
          display: grid; grid-template-columns: 200px 1fr;
          gap: 40px; padding: 44px 0;
          border-bottom: 1px solid ${border};
          align-items: start;
        }
        .eng-row:last-child { border-bottom: none; }

        /* Expertise grid */
        .exp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }

        /* About split */
        .about-split { display: grid; grid-template-columns: 1fr 420px; gap: 0; min-height: 500px; }

        /* Responsive */
        @media (max-width: 960px) {
          .about-split { grid-template-columns: 1fr !important; }
          .eng-row { grid-template-columns: 1fr !important; gap: 16px !important; }
          .exp-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .numbers-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .sc-nav-links { display: none; }
          .exp-grid { grid-template-columns: 1fr !important; }
          .hero-inner { padding: 80px 20px 60px !important; }
          .numbers-row { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* NAVBAR */}
      <nav className="sc-nav">
        <div className="sc-nav-inner">
          <a href="#top" className={serif.className} style={{ fontSize: 18, color: ink, textDecoration: 'none', fontStyle: 'italic' }}>SC</a>
          <div className="sc-nav-links">
            {[['#about', 'About'], ['#work', 'Progetti'], ['#expertise', 'Expertise'], ['#contact', 'Contatti']].map(([href, label]) => (
              <a key={href} href={href} className="sc-nav-link">{label}</a>
            ))}
            <Link href="/#portfolio" className="sc-nav-link" style={{ color: muted, fontSize: 12 }}>← Portfolio</Link>
          </div>
          <a href="#contact" className="sc-nav-cta">Scrivimi</a>
        </div>
      </nav>

      {/* HERO */}
      <section id="top" style={{ paddingTop: 60, background: bg, overflow: 'hidden' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '100px 40px 80px' }}>

          {/* Disclaimer */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px', borderRadius: 999, background: indigoFaint, border: `1px solid ${indigoBorder}`, marginBottom: 24 }}>
            <span style={{ fontSize: 11 }}>🎭</span>
            <span style={{ fontSize: 11, color: indigo, fontWeight: 500, letterSpacing: '0.05em' }}>Progetto dimostrativo · Personaggio di fantasia</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 48, alignItems: 'end' }}>
            <div>
              <p style={{ fontSize: 12, fontWeight: 600, color: indigo, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px' }}>
                Strategy Advisor · Milano &amp; Remote
              </p>
              <h1 className={serif.className} style={{ fontSize: 'clamp(4rem, 10vw, 8.5rem)', color: ink, lineHeight: 0.88, margin: '0 0 36px', letterSpacing: '-0.02em' }}>
                Sofia<br /><em style={{ color: indigo }}>Conti</em>
              </h1>
              <p style={{ fontSize: 'clamp(1rem, 1.6vw, 1.18rem)', color: sub, maxWidth: 600, lineHeight: 1.8, margin: 0, fontWeight: 300 }}>
                12 anni a trasformare sfide strategiche in decisioni che il board approva. Dal tech all&rsquo;healthcare, dalla finanza al retail: ogni settore ha le sue regole — il metodo è sempre lo stesso.
              </p>
            </div>
            {/* Decorative accent block */}
            <div style={{ width: 160, height: 160, background: `linear-gradient(135deg, ${indigo}, ${indigoLight})`, borderRadius: 24, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 64 }}>
              🗺
            </div>
          </div>

          {/* CTA row */}
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginTop: 48, marginBottom: 64 }}>
            <a href="#work" style={{ padding: '13px 28px', background: indigo, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Vedi i progetti
            </a>
            <a href="#contact" style={{ padding: '12px 28px', border: `1.5px solid ${indigoBorder}`, color: sub, fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              Contattami
            </a>
          </div>

          {/* Horizontal divider with stats */}
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 32, display: 'flex', gap: 48, flexWrap: 'wrap' }}>
            {[
              ['40+', 'progetti consegnati'],
              ['12', 'settori diversi'],
              ['18', 'paesi di lavoro'],
              ['€2.4B+', 'fatturato clienti impattato'],
            ].map(([v, l]) => (
              <div key={l}>
                <p className={serif.className} style={{ fontSize: 28, color: indigo, margin: '0 0 2px', fontStyle: 'italic' }}>{v}</p>
                <p style={{ fontSize: 12, color: muted, margin: 0, fontWeight: 500 }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT — split dark/light */}
      <section id="about" style={{ overflow: 'hidden' }}>
        <div className="about-split">
          {/* Left: text on white */}
          <div style={{ padding: '80px 56px 80px 40px', background: bgAlt, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <p style={{ fontSize: 11, fontWeight: 600, color: indigo, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px' }}>About</p>
            <h2 className={serif.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.8rem)', color: ink, lineHeight: 1.2, margin: '0 0 28px' }}>
              La strategia non è<br /><em>un deliverable.</em><br />È una conversazione.
            </h2>
            <p style={{ fontSize: 15, color: sub, lineHeight: 1.85, margin: '0 0 20px', fontWeight: 300 }}>
              Ho lavorato in boutique di strategia, mid-size firm e come advisor indipendente. Quello che non cambia è il metodo: capire prima i vincoli reali — di tempo, di politica interna, di budget — e poi costruire soluzioni che il cliente riesce davvero a implementare.
            </p>
            <p style={{ fontSize: 15, color: sub, lineHeight: 1.85, fontWeight: 300 }}>
              Sono specializzata in progetti che richiedono sia la profondità dell&rsquo;analisi che la capacità di stare in sala con il board e far decidere.
            </p>
          </div>
          {/* Right: dark indigo panel with info */}
          <div style={{ background: indigoDark, padding: '80px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ marginBottom: 32 }}>
              {[
                ['📍', 'Milano, Italia (disponibile in tutta Europa)'],
                ['🏛', 'Strategy Advisor Indipendente (attuale)'],
                ['🎓', 'MSc Management Consulting · SDA Bocconi'],
                ['✉', 'sofia.conti@mail.com'],
                ['🔗', 'linkedin.com/in/sofiaconti'],
              ].map(([icon, val], i, arr) => (
                <div key={val as string} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none' }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5 }}>{val}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['🇮🇹 Italiano', '🇬🇧 English · C2', '🇪🇸 Español · B2', '🇫🇷 Français · B1'].map(l => (
                <span key={l} style={{ fontSize: 11, fontWeight: 600, color: indigoLight, background: 'rgba(129,140,248,0.12)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: 4, padding: '4px 10px' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section id="work" style={{ padding: '100px 40px', background: bg }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: indigo, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px' }}>Lavori selezionati</p>
          <h2 className={serif.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: ink, lineHeight: 1.1, margin: '0 0 8px' }}>
            Progetti che hanno fatto
          </h2>
          <h2 className={serif.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: ink, lineHeight: 1.1, margin: '0 0 52px' }}>
            <em style={{ color: indigo }}>la differenza.</em>
          </h2>

          {engagements.map((e) => (
            <div key={e.type + e.year} className="eng-row">
              {/* Left: meta */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: indigo, letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px' }}>{e.sector}</p>
                <p style={{ fontSize: 13, fontWeight: 600, color: ink, margin: '0 0 6px' }}>{e.type}</p>
                <p style={{ fontSize: 11, color: muted, margin: '0 0 12px', lineHeight: 1.4 }}>{e.client}</p>
                <span style={{ fontSize: 11, fontWeight: 600, color: sub, background: bgAlt, border: `1px solid ${border}`, borderRadius: 4, padding: '3px 8px', display: 'inline-block' }}>{e.year}</span>
              </div>
              {/* Right: description + tags */}
              <div>
                <p style={{ fontSize: 15, color: sub, lineHeight: 1.75, margin: '0 0 16px', fontWeight: 300 }}>{e.description}</p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {e.tags.map(tag => (
                    <span key={tag} style={{ fontSize: 12, fontWeight: 500, color: indigo, background: indigoFaint, border: `1px solid ${indigoBorder}`, borderRadius: 999, padding: '4px 12px' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="expertise" style={{ padding: '100px 40px', background: bgAlt }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: indigo, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>Expertise</p>
          <h2 className={serif.className} style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', color: ink, lineHeight: 1.1, margin: '0 0 52px' }}>
            Sei aree. <em style={{ color: indigo }}>Un approccio.</em>
          </h2>
          <div className="exp-grid">
            {expertise.map(({ icon, title, desc }) => (
              <div key={title} style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: '28px 28px', transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = indigoBorder}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = border}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{icon}</div>
                <p style={{ fontSize: 15, fontWeight: 700, color: ink, margin: '0 0 8px' }}>{title}</p>
                <p style={{ fontSize: 13, color: sub, margin: 0, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Education */}
          <div style={{ marginTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {[
              { degree: 'MSc Management Consulting', school: 'SDA Bocconi School of Management', year: '2011 – 2013', note: 'Distinction' },
              { degree: 'Laurea in Economia e Management', school: 'Università Commerciale Luigi Bocconi', year: '2008 – 2011', note: '108/110' },
            ].map(ed => (
              <div key={ed.degree} style={{ padding: '24px 28px', background: bg, border: `1px solid ${border}`, borderRadius: 12, borderLeft: `3px solid ${indigo}` }}>
                <p style={{ fontSize: 15, fontWeight: 600, color: ink, margin: '0 0 4px' }}>{ed.degree}</p>
                <p style={{ fontSize: 13, color: indigo, margin: '0 0 4px', fontWeight: 500 }}>{ed.school}</p>
                <p style={{ fontSize: 12, color: muted, margin: 0 }}>{ed.year} · {ed.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NUMBERS */}
      <section style={{ background: indigoDark, padding: '80px 40px' }}>
        <div className="numbers-row" style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 16, overflow: 'hidden' }}>
          {[
            { value: '40+', label: 'Progetti consegnati' },
            { value: '12', label: 'Settori serviti' },
            { value: '18', label: 'Paesi di lavoro' },
            { value: '€2.4B+', label: 'Fatturato clienti impattato' },
          ].map(({ value, label }) => (
            <div key={label} style={{ padding: '40px 32px', textAlign: 'center', background: 'rgba(0,0,0,0.12)' }}>
              <p className={serif.className} style={{ fontSize: 44, color: '#fff', margin: '0 0 8px', lineHeight: 1, fontStyle: 'italic' }}>{value}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: 0 }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ padding: '100px 40px', background: bg, textAlign: 'center' }}>
        <div style={{ maxWidth: 620, margin: '0 auto' }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: indigo, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 24px' }}>Contatti</p>
          <h2 className={serif.className} style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', color: ink, lineHeight: 1.1, margin: '0 0 16px' }}>
            Hai una sfida<br /><em style={{ color: indigo }}>che vale la pena risolvere?</em>
          </h2>
          <p style={{ fontSize: 16, color: sub, margin: '0 0 48px', lineHeight: 1.75, fontWeight: 300 }}>
            Disponibile per advisory, board advisory e progetti di strategia in Italia e all&rsquo;estero.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <a href="mailto:sofia.conti@mail.com" style={{ padding: '14px 28px', background: indigo, color: '#fff', fontWeight: 700, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              ✉ sofia.conti@mail.com
            </a>
            <a href="https://linkedin.com/in/sofiaconti" style={{ padding: '13px 28px', border: `1.5px solid ${indigoBorder}`, color: sub, fontWeight: 600, fontSize: 14, borderRadius: 10, textDecoration: 'none' }}>
              LinkedIn →
            </a>
          </div>
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: 28 }}>
            <p style={{ fontSize: 12, color: muted, margin: '0 0 8px', fontStyle: 'italic' }}>
              🎭 Questa è una pagina dimostrativa. Sofia Conti è un personaggio di fantasia creato da BeOnWeb a scopo illustrativo.
            </p>
            <p style={{ fontSize: 12, color: muted, margin: '0 0 4px' }}>© 2025 Sofia Conti · Milano</p>
            <p style={{ fontSize: 12, color: muted, margin: 0 }}>
              Progettato da <Link href="/" style={{ color: indigo, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
