'use client'

import Link from 'next/link'
// Self-hosted (see app/layout.tsx)
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
import { useLanguage } from '@/components/language-provider'

const MONO_FONT = "'Space Mono', monospace"

const red = '#dc2626'
const dim = '#374151'
const mid = '#4b5563'

const content = {
  en: {
    backLabel: '← SHOWCASE',
    orgLine1: 'IMPERIAL INTELLIGENCE SERVICE',
    orgLine2: 'OFFICE OF DARK SIDE AFFAIRS',
    classification: 'CLASSIFICATION: MAXIMUM',
    docRef: 'DOCUMENT REF: IIS-DV-0001 / CLEARANCE: EYES ONLY',
    title: 'DARTH VADER',
    subtitle: 'DARK LORD OF THE SITH · SUPREME COMMANDER · GALACTIC EMPIRE',
    sectionI: '[ SECTION I · IDENTITY ]',
    identity: [
      ['BIRTH NAME', 'Anakin Skywalker'],
      ['DATE OF BIRTH', '41.9 BBY'],
      ['PLACE OF ORIGIN', 'Tatooine, Outer Rim'],
      ['CURRENT DESIGNATION', 'Lord Vader / Darth Vader'],
      ['ALLEGIANCE', 'Galactic Empire'],
      ['DIRECT SUPERIOR', <span key="sup">Emperor <span className="redact">████████████</span> Palpatine</span>],
      ['BIOLOGICAL STATUS', 'Life-support dependent. 92% prosthetic.'],
      ['MIDI-CHLORIAN COUNT', <span key="midi"><span className="redact">████</span> /mL (highest on record — UNVERIFIED)</span>],
    ] as [string, React.ReactNode][],
    sectionII: '[ SECTION II · SERVICE RECORD ]',
    service: [
      {
        date: '41–19 BBY',
        org: 'JEDI ORDER',
        text: 'Padawan to Obi-Wan Kenobi. Attained rank of Jedi Knight (21 BBY). General, Clone Wars. Decorated for valor at Christophsis, Teth, and the Outer Rim Sieges. Performance evaluated: EXCEPTIONAL. Loyalty status at this time: COMPLIANT.',
      },
      {
        date: '19 BBY',
        org: 'TRANSITION / ORDER 66',
        text: 'Pledged to Emperor Palpatine. Led 501st Legion assault on Jedi Temple, Coruscant. All Jedi encountered: neutralized. This event designated OPERATION KNIGHTFALL. All records of operative conduct during this period: ██ CLASSIFIED ██.',
      },
      {
        date: '19 BBY → 4 ABY',
        org: 'GALACTIC EMPIRE',
        text: 'Supreme Commander of Imperial Military. Primary enforcer of Imperial will. Oversaw construction of Death Star I and II. Hunted Jedi survivors across galaxy for two decades. Zero confirmed escapes from direct custody. NB: Jedi survivor identified as son — see Appendix DV-17 (SEALED).',
      },
      {
        date: '4 ABY',
        org: 'BATTLE OF ENDOR',
        text: 'Killed Emperor Palpatine to protect Luke Skywalker (son — relationship CLASSIFIED per DV-17). Sustained fatal injuries. Died aboard Death Star II, Endor system. Final status: REDEEMED. Prophecy of the Chosen One: FULFILLED.',
      },
    ],
    sectionIII: '[ SECTION III · FORCE CAPABILITIES ]',
    forceIntro: "Assessment based on field observation and intercepted Jedi Council records (pre-purge). Proficiency ratings classified 0–10. Lord Vader's profile has been truncated at analyst discretion.",
    forceSkills: [
      ['Force Choke', '██████████ 10/10'],
      ['Telekinesis', '█████████░ 09/10'],
      ['Lightsaber Combat (Form V)', '██████████ 10/10'],
      ['Force Push / Pull', '█████████░ 09/10'],
      ['Precognition', '████████░░ 08/10'],
      ['Mind Probe', '█████████░ 09/10'],
      ['Force Barrier', '████████░░ 08/10'],
      ['Mechanical Engineering', <span key="eng"><span className="redact">████████</span> [REDACTED]</span>],
    ] as [string, React.ReactNode][],
    sectionIV: '[ SECTION IV · PSYCHOLOGICAL ASSESSMENT ]',
    psych1: <>Subject exhibits extreme attachment behavior, profound grief response, and deep fear of loss — identified as primary psychological leverage point exploited during recruitment. Loyalty to Emperor <span className="redact">████████████</span> is performance-based, not ideological.</>,
    psych2: <>Note filed <span className="redact">██████</span>, Year 19 BBY: analyst flagged residual attachment to biological offspring (identity: <span className="redact">████████████████████</span>). Recommendation: immediate termination. Action taken: <span className="redact">████████</span>. Outcome: SEE BATTLE OF ENDOR.</>,
    psychNote: '⚠ ANALYST NOTE: DO NOT UNDERESTIMATE THE SKYWALKER VARIABLE.',
    sectionV: '[ SECTION V · RECORDED STATEMENTS ]',
    quote: 'I find your lack of faith disturbing.',
    quoteAttribution: '— Lord Vader, Death Star I, 0 BBY',
    footer1: 'IMPERIAL INTELLIGENCE SERVICE · ALL RIGHTS RESERVED TO THE EMPIRE',
    footer2: 'Unauthorised access to this document is a capital offence.',
    designedBy: 'Designed by',
  },
  it: {
    backLabel: '← SHOWCASE',
    orgLine1: "SERVIZIO DI INTELLIGENCE IMPERIALE",
    orgLine2: 'UFFICIO AFFARI DEL LATO OSCURO',
    classification: 'CLASSIFICAZIONE: MASSIMA',
    docRef: 'RIF. DOCUMENTO: IIS-DV-0001 / LIVELLO: SOLI OCCHI AUTORIZZATI',
    title: 'DARTH VADER',
    subtitle: "SIGNORE OSCURO DEI SITH · COMANDANTE SUPREMO · IMPERO GALATTICO",
    sectionI: '[ SEZIONE I · IDENTITÀ ]',
    identity: [
      ['NOME DI NASCITA', 'Anakin Skywalker'],
      ['DATA DI NASCITA', '41,9 BBY'],
      ['LUOGO DI ORIGINE', "Tatooine, Orlo Esterno"],
      ['DESIGNAZIONE ATTUALE', 'Lord Vader / Darth Vader'],
      ['FEDELTÀ', 'Impero Galattico'],
      ['SUPERIORE DIRETTO', <span key="sup">Imperatore <span className="redact">████████████</span> Palpatine</span>],
      ['STATO BIOLOGICO', 'Dipendente da supporto vitale. 92% protesico.'],
      ['CONTEGGIO MIDI-CHLORIAN', <span key="midi"><span className="redact">████</span> /mL (il più alto mai registrato — NON VERIFICATO)</span>],
    ] as [string, React.ReactNode][],
    sectionII: '[ SEZIONE II · STATO DI SERVIZIO ]',
    service: [
      {
        date: '41–19 BBY',
        org: "ORDINE JEDI",
        text: "Padawan di Obi-Wan Kenobi. Raggiunto il grado di Cavaliere Jedi (21 BBY). Generale, Guerre dei Cloni. Decorato al valore a Christophsis, Teth e negli Assedi dell'Orlo Esterno. Valutazione delle prestazioni: ECCEZIONALE. Stato di fedeltà in questo periodo: CONFORME.",
      },
      {
        date: '19 BBY',
        org: 'TRANSIZIONE / ORDINE 66',
        text: "Giurata fedeltà all'Imperatore Palpatine. Ha guidato l'assalto della 501ª Legione al Tempio Jedi, Coruscant. Tutti i Jedi incontrati: neutralizzati. Evento designato OPERAZIONE CADUTA DELLA NOTTE. Tutti i verbali sulla condotta operativa in questo periodo: ██ CLASSIFICATO ██.",
      },
      {
        date: '19 BBY → 4 ABY',
        org: 'IMPERO GALATTICO',
        text: "Comandante Supremo delle Forze Armate Imperiali. Principale esecutore della volontà imperiale. Ha supervisionato la costruzione della Morte Nera I e II. Ha dato la caccia ai Jedi sopravvissuti in tutta la galassia per due decenni. Zero fughe confermate dalla custodia diretta. NB: sopravvissuto Jedi identificato come figlio — vedi Appendice DV-17 (SIGILLATA).",
      },
      {
        date: '4 ABY',
        org: 'BATTAGLIA DI ENDOR',
        text: "Ha ucciso l'Imperatore Palpatine per proteggere Luke Skywalker (figlio — relazione CLASSIFICATA secondo DV-17). Ha riportato ferite fatali. Morto a bordo della Morte Nera II, sistema di Endor. Stato finale: REDENTO. Profezia del Prescelto: COMPIUTA.",
      },
    ],
    sectionIII: '[ SEZIONE III · CAPACITÀ NELLA FORZA ]',
    forceIntro: "Valutazione basata su osservazione sul campo e registri intercettati del Consiglio Jedi (pre-epurazione). Valutazioni di competenza classificate 0–10. Il profilo di Lord Vader è stato troncato a discrezione dell'analista.",
    forceSkills: [
      ['Soffocamento della Forza', '██████████ 10/10'],
      ['Telecinesi', '█████████░ 09/10'],
      ['Combattimento con la spada laser (Forma V)', '██████████ 10/10'],
      ['Spinta / Trazione della Forza', '█████████░ 09/10'],
      ['Precognizione', '████████░░ 08/10'],
      ['Sonda mentale', '█████████░ 09/10'],
      ['Barriera della Forza', '████████░░ 08/10'],
      ['Ingegneria meccanica', <span key="eng"><span className="redact">████████</span> [OSCURATO]</span>],
    ] as [string, React.ReactNode][],
    sectionIV: '[ SEZIONE IV · VALUTAZIONE PSICOLOGICA ]',
    psych1: <>Il soggetto mostra un comportamento di attaccamento estremo, una profonda risposta al lutto e una forte paura della perdita — identificato come principale leva psicologica sfruttata durante il reclutamento. La fedeltà all&apos;Imperatore <span className="redact">████████████</span> è basata sulle prestazioni, non sull&apos;ideologia.</>,
    psych2: <>Nota archiviata <span className="redact">██████</span>, Anno 19 BBY: l&apos;analista ha segnalato un attaccamento residuo verso la prole biologica (identità: <span className="redact">████████████████████</span>). Raccomandazione: eliminazione immediata. Azione intrapresa: <span className="redact">████████</span>. Esito: VEDI BATTAGLIA DI ENDOR.</>,
    psychNote: '⚠ NOTA DELL\'ANALISTA: NON SOTTOVALUTARE LA VARIABILE SKYWALKER.',
    sectionV: '[ SEZIONE V · DICHIARAZIONI REGISTRATE ]',
    quote: 'Trovo la tua mancanza di fede inquietante.',
    quoteAttribution: '— Lord Vader, Morte Nera I, 0 BBY',
    footer1: "SERVIZIO DI INTELLIGENCE IMPERIALE · TUTTI I DIRITTI RISERVATI ALL'IMPERO",
    footer2: "L'accesso non autorizzato a questo documento è un reato capitale.",
    designedBy: 'Progettato da',
  },
}

export default function DarthVaderPage() {
  const { lang } = useLanguage()
  const t = content[lang]

  return (
    <div style={{ fontFamily: MONO_FONT, minHeight: '100vh', background: '#000000', color: '#9ca3af', padding: '0 0 80px', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .redact { background: #374151; color: transparent; border-radius: 2px; display: inline-block; user-select: none; }
        @keyframes flicker { 0%,100%{opacity:1} 92%{opacity:0.96} 93%{opacity:0.85} 94%{opacity:0.96} }

        .dv-identity-row { display: grid; grid-template-columns: 200px 1fr; gap: 20px; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
        .dv-service-inner { display: grid; grid-template-columns: 130px 1fr; gap: 20px; }
        .dv-force-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0; }
        .dv-force-row { padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.04); display: grid; grid-template-columns: 180px 1fr; gap: 12px; }

        .dv-separator { overflow: hidden; white-space: nowrap; max-width: 100%; }

        @media (max-width: 600px) {
          .dv-identity-row { grid-template-columns: 1fr !important; gap: 4px !important; }
          .dv-service-inner { grid-template-columns: 1fr !important; gap: 6px !important; }
          .dv-force-grid { grid-template-columns: 1fr !important; }
          .dv-force-row { grid-template-columns: 1fr !important; gap: 4px !important; }
        }
      `}</style>

      {/* Scanline overlay */}
      <div style={{ position: 'fixed', inset: 0, backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)', pointerEvents: 'none', zIndex: 0, animation: 'flicker 8s infinite' }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto', padding: '48px 32px 0' }}>

        {/* Back */}
        <Link href="/showcase" style={{ fontSize: 11, color: dim, textDecoration: 'none', letterSpacing: '0.2em', display: 'block', marginBottom: 40 }}>{t.backLabel}</Link>

        {/* Classification header */}
        <div style={{ borderTop: `1px solid ${dim}`, borderBottom: `1px solid ${dim}`, padding: '28px 0', marginBottom: 48, textAlign: 'center' }}>
          <p className="dv-separator" style={{ fontSize: 10, color: dim, letterSpacing: '0.35em', margin: '0 0 12px' }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </p>
          <p style={{ fontSize: 11, color: mid, letterSpacing: '0.3em', margin: '0 0 6px' }}>{t.orgLine1}</p>
          <p style={{ fontSize: 11, color: mid, letterSpacing: '0.3em', margin: '0 0 6px' }}>{t.orgLine2}</p>
          <p style={{ fontSize: 11, color: red, letterSpacing: '0.4em', fontWeight: 700, margin: '0 0 6px' }}>{t.classification}</p>
          <p style={{ fontSize: 10, color: dim, letterSpacing: '0.2em', margin: '0 0 12px' }}>{t.docRef}</p>
          <p style={{ fontSize: 10, color: dim, letterSpacing: '0.35em', margin: 0 }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </p>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 56, textAlign: 'center' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', lineHeight: 1, margin: '0 0 12px' }}>
            {t.title}
          </h1>
          <p style={{ fontSize: 11, color: red, letterSpacing: '0.3em', margin: 0 }}>
            {t.subtitle}
          </p>
        </div>

        {/* ── SECTION I: IDENTITY ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            {t.sectionI}
          </p>
          {t.identity.map(([label, value], i) => (
            <div key={i} className="dv-identity-row">
              <p style={{ fontSize: 10, color: dim, margin: 0, letterSpacing: '0.15em' }}>{label}</p>
              <p style={{ fontSize: 13, color: '#d1d5db', margin: 0, lineHeight: 1.5 }}>{value}</p>
            </div>
          ))}
        </div>

        {/* ── SECTION II: SERVICE RECORD ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            {t.sectionII}
          </p>
          {t.service.map((r, i) => (
            <div key={i} style={{ padding: '16px 0', borderBottom: `1px solid rgba(255,255,255,0.04)` }}>
              <div className="dv-service-inner">
                <div>
                  <p style={{ fontSize: 10, color: red, margin: '0 0 4px', letterSpacing: '0.1em' }}>{r.date}</p>
                  <p style={{ fontSize: 10, color: dim, margin: 0, fontWeight: 700, letterSpacing: '0.12em' }}>{r.org}</p>
                </div>
                <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.75, fontWeight: 400 }}>{r.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION III: FORCE CAPABILITIES ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            {t.sectionIII}
          </p>
          <p style={{ fontSize: 12, color: dim, margin: '0 0 20px', lineHeight: 1.6, letterSpacing: '0.03em' }}>
            {t.forceIntro}
          </p>
          <div className="dv-force-grid">
            {t.forceSkills.map(([skill, rating], i) => (
              <div key={i} className="dv-force-row">
                <p style={{ fontSize: 11, color: mid, margin: 0 }}>{skill}</p>
                <p style={{ fontSize: 11, color: red, margin: 0 }}>{rating}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── SECTION IV: PSYCHOLOGICAL ASSESSMENT ── */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            {t.sectionIV}
          </p>
          <div style={{ border: `1px solid rgba(220,38,38,0.15)`, padding: '20px', background: 'rgba(220,38,38,0.03)' }}>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px', lineHeight: 1.75 }}>
              {t.psych1}
            </p>
            <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 16px', lineHeight: 1.75 }}>
              {t.psych2}
            </p>
            <p style={{ fontSize: 11, color: red, margin: 0, letterSpacing: '0.15em' }}>
              {t.psychNote}
            </p>
          </div>
        </div>

        {/* ── SECTION V: NOTABLE QUOTE ── */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 10, color: red, letterSpacing: '0.35em', margin: '0 0 20px', borderBottom: `1px solid rgba(220,38,38,0.2)`, paddingBottom: 12 }}>
            {t.sectionV}
          </p>
          <div style={{ paddingLeft: 20, borderLeft: `3px solid ${red}` }}>
            <p style={{ fontSize: 16, color: '#e5e7eb', fontStyle: 'italic', margin: '0 0 8px', lineHeight: 1.6 }}>
              &ldquo;{t.quote}&rdquo;
            </p>
            <p style={{ fontSize: 10, color: dim, margin: 0, letterSpacing: '0.15em' }}>{t.quoteAttribution}</p>
          </div>
        </div>

        {/* Footer */}
        <div style={{ borderTop: `1px solid rgba(220,38,38,0.2)`, paddingTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 9, color: '#1f2937', letterSpacing: '0.3em', margin: '0 0 8px' }}>
            ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
          </p>
          <p style={{ fontSize: 9, color: '#1f2937', letterSpacing: '0.25em', margin: '0 0 4px' }}>
            {t.footer1}
          </p>
          <p style={{ fontSize: 9, color: dim, margin: '0 0 8px', letterSpacing: '0.1em' }}>
            {t.footer2}
          </p>
          <p style={{ fontSize: 11, color: dim, margin: 0 }}>
            {t.designedBy} <Link href="/" style={{ color: red, textDecoration: 'none' }}>Jobli</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
