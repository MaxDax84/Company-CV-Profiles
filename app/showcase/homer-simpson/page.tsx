'use client'

import Link from 'next/link'
// Self-hosted (see app/layout.tsx)
import '@fontsource/lilita-one/400.css'
import '@fontsource/nunito/400.css'
import '@fontsource/nunito/600.css'
import '@fontsource/nunito/700.css'
import '@fontsource/nunito/800.css'
import { useLanguage } from '@/components/language-provider'

const LILITA_FONT = "'Lilita One', cursive, sans-serif"
const NUNITO_FONT = "'Nunito', sans-serif"

const yellow = '#fbbf24'
const blue = '#1d4ed8'
const orange = '#f97316'
const red = '#dc2626'
const panelBorder = '3px solid #111827'
const panelRadius = 0

const content = {
  en: {
    plantTag: 'SPRINGFIELD NUCLEAR POWER PLANT · EMPLOYEE PROFILE',
    name: 'HOMER J. SIMPSON',
    subline: 'Nuclear Safety Inspector · Sector 7-G · Springfield, USA',
    backLabel: '← Back',
    bioTitle: 'The Springfield Story',
    bio1: <>Born <strong>May 12, 1956</strong> in Springfield — a city in a state nobody can identify. Son of Abe and Mona Simpson. Attended Springfield High School and graduated, somewhat miraculously, despite losing significant brain function to a crayon lodged in his nasal cavity.</>,
    bio2: "Met Marge Bouvier at a detention in 1974. Has been inseparable from her — and never fully understood why she chose him — ever since. They have three children, a dog, a cat, and a car that shouldn't still be running.",
    catchphrase: 'D\'oh!',
    catchphraseNote: '— Homer, approximately 4,000× per season',
    statsTitle: 'By the Numbers',
    stats: [
      ['🍩', '∞', 'Donuts consumed'],
      ['🍺', '∞', 'Duff beers'],
      ['💥', '17', 'Near-meltdowns'],
      ['😴', '3/day', 'Naps at work'],
      ['🚀', '1', 'Space missions'],
      ['❤️', '3', 'Children'],
      ['🏆', '1', 'Employee of the Month'],
    ],
    adventuresTitle: 'Adventures & Side Jobs',
    adventuresSubtitle: 'HOMER HAS DONE IT ALL. USUALLY BY ACCIDENT.',
    adventures: [
      { emoji: '☢️', title: 'Nuclear Safety Inspector', org: 'Springfield Nuclear Power Plant · 1989→Now', desc: 'Sector 7-G. Responsible for preventing meltdown. Has caused 3. Fired 27 times. Still employed.' },
      { emoji: '🚀', title: 'NASA Astronaut', org: 'Kennedy Space Center · 1994', desc: 'Selected as the average American for a mission. Ate all the food in zero gravity. Counts it on his resume.' },
      { emoji: '🥊', title: 'Professional Boxer', org: 'Springfield Boxing Commission · 1997', desc: 'Managed by Moe Szyslak. Won by sheer ability to absorb punishment. Did not defeat Drederick Tatum. Did not quit.' },
      { emoji: '🎤', title: 'Country Music Singer', org: 'Capitol Records · "Homer in the House"', desc: 'Brief but passionate. One hit single. Briefly famous. Immediately forgotten. No regrets.' },
      { emoji: '🍔', title: 'Food Critic', org: 'Springfield Shopper', desc: 'Positive reviews only. Ate every dish in Springfield. Gained 8 lbs on assignment. Called it "fieldwork."' },
      { emoji: '🌐', title: 'Grease Recycling Entrepreneur', org: 'Homer\'s Can Do Corp · 1998', desc: 'Founded Homer\'s Can Do Corp. Business model: collect and resell cooking grease. Genuinely profitable for six days.' },
    ],
    skillsTitle: 'Skill Assessment',
    skills: [['Eating', 99, yellow], ['Sleeping', 97, yellow], ['TV Watching', 95, yellow], ['Bowling', 63, orange], ['Parenting', 52, orange], ['Nuclear Safety', 8, red]] as [string, number, string][],
    familyTitle: '742 Evergreen Terrace',
    family: [
      { emoji: '💙', name: 'Marge Simpson', tag: 'WIFE', desc: 'The heart of the family. Impossibly patient. Still in love with Homer after 35 years — nobody knows how.', color: blue },
      { emoji: '😈', name: 'Bart Simpson', tag: 'SON', desc: '4th grade. Underachiever and proud of it. Expert slingshot operator. Homer\'s son in every way.', color: orange },
      { emoji: '📚', name: 'Lisa Simpson', tag: 'DAUGHTER', desc: '8 years old. Future president. Saxophone prodigy. The most evolved moral being in all of Springfield.', color: '#7c3aed' },
      { emoji: '🍼', name: 'Maggie Simpson', tag: 'DAUGHTER', desc: 'Baby. Never speaks. Shot Mr. Burns once. May be the most competent Simpson alive.', color: '#db2777' },
    ],
    quote: 'To alcohol! The cause of — and solution to — all of life\'s problems.',
    quoteAttribution: '— HOMER J. SIMPSON',
    footerLeft: '🍩 SPRINGFIELD, USA',
    designedBy: 'Designed by',
  },
  it: {
    plantTag: 'CENTRALE NUCLEARE DI SPRINGFIELD · PROFILO DIPENDENTE',
    name: 'HOMER J. SIMPSON',
    subline: 'Ispettore di sicurezza nucleare · Settore 7-G · Springfield, USA',
    backLabel: '← Indietro',
    bioTitle: 'La storia di Springfield',
    bio1: <>Nato il <strong>12 maggio 1956</strong> a Springfield — una città in uno stato che nessuno sa identificare. Figlio di Abe e Mona Simpson. Ha frequentato la Springfield High School e si è diplomato, quasi miracolosamente, nonostante una significativa perdita di funzioni cerebrali causata da un pastello incastrato nella cavità nasale.</>,
    bio2: "Ha conosciuto Marge Bouvier durante una punizione nel 1974. Da allora è inseparabile da lei — senza mai capire davvero perché lei l'abbia scelto. Hanno tre figli, un cane, un gatto e un'auto che non dovrebbe più funzionare.",
    catchphrase: 'D\'oh!',
    catchphraseNote: '— Homer, circa 4.000 volte a stagione',
    statsTitle: 'In numeri',
    stats: [
      ['🍩', '∞', 'Ciambelle consumate'],
      ['🍺', '∞', 'Birre Duff'],
      ['💥', '17', 'Quasi-fusioni nucleari'],
      ['😴', '3/giorno', 'Pisolini al lavoro'],
      ['🚀', '1', 'Missioni spaziali'],
      ['❤️', '3', 'Figli'],
      ['🏆', '1', 'Impiegato del mese'],
    ],
    adventuresTitle: 'Avventure e lavori occasionali',
    adventuresSubtitle: 'HOMER LE HA PROVATE TUTTE. DI SOLITO PER SBAGLIO.',
    adventures: [
      { emoji: '☢️', title: 'Ispettore di sicurezza nucleare', org: 'Centrale nucleare di Springfield · 1989→Oggi', desc: 'Settore 7-G. Responsabile della prevenzione delle fusioni. Ne ha causate 3. Licenziato 27 volte. Ancora assunto.' },
      { emoji: '🚀', title: 'Astronauta NASA', org: 'Kennedy Space Center · 1994', desc: 'Selezionato come americano medio per una missione. Ha mangiato tutto il cibo in assenza di gravità. Lo conta nel curriculum.' },
      { emoji: '🥊', title: 'Pugile professionista', org: 'Commissione pugilistica di Springfield · 1997', desc: 'Gestito da Moe Szyslak. Ha vinto per pura capacità di incassare colpi. Non ha battuto Drederick Tatum. Non ha mai mollato.' },
      { emoji: '🎤', title: 'Cantante country', org: 'Capitol Records · "Homer in the House"', desc: 'Breve ma appassionata. Un singolo di successo. Brevemente famoso. Immediatamente dimenticato. Nessun rimpianto.' },
      { emoji: '🍔', title: 'Critico gastronomico', org: 'Springfield Shopper', desc: 'Solo recensioni positive. Ha assaggiato ogni piatto di Springfield. Ha preso 4 kg durante l\'incarico. Lo chiamava "lavoro sul campo".' },
      { emoji: '🌐', title: 'Imprenditore del riciclo di grasso', org: 'Homer\'s Can Do Corp · 1998', desc: 'Ha fondato la Homer\'s Can Do Corp. Modello di business: raccogliere e rivendere olio di cottura esausto. Genuinamente redditizio per sei giorni.' },
    ],
    skillsTitle: 'Valutazione competenze',
    skills: [['Mangiare', 99, yellow], ['Dormire', 97, yellow], ['Guardare la TV', 95, yellow], ['Bowling', 63, orange], ['Fare il genitore', 52, orange], ['Sicurezza nucleare', 8, red]] as [string, number, string][],
    familyTitle: 'Evergreen Terrace 742',
    family: [
      { emoji: '💙', name: 'Marge Simpson', tag: 'MOGLIE', desc: 'Il cuore della famiglia. Incredibilmente paziente. Ancora innamorata di Homer dopo 35 anni — nessuno sa come.', color: blue },
      { emoji: '😈', name: 'Bart Simpson', tag: 'FIGLIO', desc: 'Quarta elementare. Fannullone e orgoglioso di esserlo. Esperto di fionda. Il figlio di Homer in tutto e per tutto.', color: orange },
      { emoji: '📚', name: 'Lisa Simpson', tag: 'FIGLIA', desc: '8 anni. Futura presidente. Prodigio del sassofono. L\'essere moralmente più evoluto di tutta Springfield.', color: '#7c3aed' },
      { emoji: '🍼', name: 'Maggie Simpson', tag: 'FIGLIA', desc: 'Neonata. Non parla mai. Ha sparato al signor Burns una volta. Forse la Simpson più competente in vita.', color: '#db2777' },
    ],
    quote: 'All\'alcol! La causa — e la soluzione — di tutti i problemi della vita.',
    quoteAttribution: '— HOMER J. SIMPSON',
    footerLeft: '🍩 SPRINGFIELD, USA',
    designedBy: 'Progettato da',
  },
}

export default function HomerSimpsonPage() {
  const { lang } = useLanguage()
  const t = content[lang]

  return (
    <div style={{ fontFamily: NUNITO_FONT, background: '#f8fafc', color: '#111827', minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .panel {
          border: ${panelBorder};
          border-radius: ${panelRadius}px;
          overflow: hidden;
          position: relative;
        }
        .panel-num {
          position: absolute;
          top: 8px;
          left: 10px;
          font-size: 10px;
          font-weight: 800;
          color: rgba(0,0,0,0.25);
          letter-spacing: 0.1em;
          font-family: sans-serif;
        }
        .speech {
          display: inline-block;
          background: white;
          border: 2.5px solid #111827;
          border-radius: 16px;
          padding: 10px 16px;
          position: relative;
          font-weight: 700;
        }
        .speech::after {
          content: '';
          position: absolute;
          bottom: -12px;
          left: 20px;
          width: 0; height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-top: 12px solid #111827;
        }
        .speech::before {
          content: '';
          position: absolute;
          bottom: -9px;
          left: 21px;
          width: 0; height: 0;
          border-left: 7px solid transparent;
          border-right: 7px solid transparent;
          border-top: 11px solid white;
          z-index: 1;
        }

        /* Layout grids */
        .hs-row1 { display: grid; grid-template-columns: 2fr 1fr; border-bottom: ${panelBorder}; }
        .hs-bio-panel { padding: 36px 40px; border-right: ${panelBorder}; }
        .hs-stats-panel { padding: 36px 28px; }
        .hs-adventures-outer { padding: 36px 40px; }
        .hs-adventures-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0; }
        .hs-row3 { display: grid; grid-template-columns: 1fr 2fr; border-bottom: ${panelBorder}; }
        .hs-skills-panel { padding: 36px 28px; border-right: ${panelBorder}; }
        .hs-family-panel { padding: 36px 40px; }
        .hs-family-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .hs-footer { padding: 20px 40px; display: flex; justify-content: space-between; align-items: center; }

        @media (max-width: 768px) {
          .hs-row1 { grid-template-columns: 1fr !important; }
          .hs-bio-panel { border-right: none !important; border-bottom: ${panelBorder} !important; }
          .hs-row3 { grid-template-columns: 1fr !important; }
          .hs-skills-panel { border-right: none !important; border-bottom: ${panelBorder} !important; }
          .hs-adventures-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .hs-adventures-grid { grid-template-columns: 1fr !important; }
          .hs-family-grid { grid-template-columns: 1fr !important; }
          .hs-footer { padding: 16px 20px !important; flex-direction: column !important; gap: 8px; text-align: center; }
          .hs-bio-panel { padding: 24px 20px !important; }
          .hs-stats-panel { padding: 24px 16px !important; }
          .hs-adventures-outer { padding: 24px 20px !important; }
          .hs-skills-panel { padding: 24px 16px !important; }
          .hs-family-panel { padding: 24px 20px !important; }
        }
      `}</style>

      {/* ── PANEL 01: TITLE BANNER ── */}
      <div className="panel" style={{ background: yellow, borderBottom: panelBorder }}>
        <span className="panel-num">01</span>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div style={{ fontSize: 64, lineHeight: 1 }}>🍩</div>
            <div>
              <p style={{ fontSize: 10, fontWeight: 800, color: blue, letterSpacing: '0.25em', margin: '0 0 4px' }}>{t.plantTag}</p>
              <h1 style={{ fontFamily: LILITA_FONT, fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', color: blue, margin: 0, lineHeight: 1, letterSpacing: '-0.01em' }}>
                {t.name}
              </h1>
              <p style={{ fontWeight: 800, color: '#92400e', margin: '4px 0 0', fontSize: 15 }}>{t.subline}</p>
            </div>
          </div>
          <Link href="/showcase" style={{ fontSize: 13, color: blue, fontWeight: 800, textDecoration: 'none', border: `2px solid ${blue}`, padding: '8px 16px', background: 'white' }}>
            {t.backLabel}
          </Link>
        </div>
      </div>

      {/* ── MAIN COMIC GRID ── */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* ROW 1: Bio (2/3) + Stats (1/3) */}
        <div className="hs-row1">

          {/* Bio panel */}
          <div className="panel hs-bio-panel" style={{ background: 'white', borderRadius: 0, border: 'none' }}>
            <span className="panel-num">02</span>
            <h2 style={{ fontFamily: LILITA_FONT, fontSize: 26, color: blue, marginBottom: 16, marginTop: 8 }}>{t.bioTitle}</h2>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#374151', marginBottom: 16 }}>
              {t.bio1}
            </p>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: '#374151', marginBottom: 24 }}>
              {t.bio2}
            </p>
            <div style={{ marginTop: 8 }}>
              <div className="speech" style={{ fontSize: 20, marginBottom: 16 }}>
                &ldquo;{t.catchphrase}&rdquo;
              </div>
              <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 20, fontWeight: 700 }}>{t.catchphraseNote}</p>
            </div>
          </div>

          {/* Stats panel */}
          <div className="panel hs-stats-panel" style={{ background: yellow, border: 'none' }}>
            <span className="panel-num">03</span>
            <h2 style={{ fontFamily: LILITA_FONT, fontSize: 22, color: blue, marginBottom: 20, marginTop: 8 }}>{t.statsTitle}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {t.stats.map(([icon, val, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: 'white', border: `2px solid ${blue}`, padding: '8px 12px' }}>
                  <span style={{ fontSize: 18 }}>{icon}</span>
                  <span style={{ fontFamily: LILITA_FONT, fontSize: 20, color: blue, minWidth: 36 }}>{val}</span>
                  <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 700 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: Adventures (full width, 3 cols) */}
        <div className="panel hs-adventures-outer" style={{ border: 'none', borderBottom: panelBorder, background: '#fff7ed' }}>
          <span className="panel-num">04</span>
          <h2 style={{ fontFamily: LILITA_FONT, fontSize: 26, color: orange, marginBottom: 28, marginTop: 8 }}>{t.adventuresTitle}</h2>
          <p style={{ fontSize: 13, fontWeight: 800, color: '#9a3412', letterSpacing: '0.1em', marginBottom: 20 }}>
            {t.adventuresSubtitle}
          </p>
          <div className="hs-adventures-grid">
            {t.adventures.map((a) => (
              <div key={a.title} style={{ padding: '20px', border: panelBorder, margin: '-1px 0 0 -1px', background: 'white' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{a.emoji}</div>
                <p style={{ fontFamily: LILITA_FONT, fontSize: 15, color: blue, margin: '0 0 4px' }}>{a.title}</p>
                <p style={{ fontSize: 10, color: '#9ca3af', fontWeight: 800, letterSpacing: '0.08em', margin: '0 0 8px' }}>{a.org}</p>
                <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{a.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ROW 3: Skills (1/3) + Family (2/3) */}
        <div className="hs-row3">

          {/* Skills */}
          <div className="panel hs-skills-panel" style={{ background: blue, border: 'none' }}>
            <span className="panel-num" style={{ color: 'rgba(255,255,255,0.3)' }}>05</span>
            <h2 style={{ fontFamily: LILITA_FONT, fontSize: 22, color: yellow, marginBottom: 24, marginTop: 8 }}>{t.skillsTitle}</h2>
            {t.skills.map(([skill, pct, color]) => (
              <div key={skill} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 800, color: 'white' }}>{skill}</span>
                  <span style={{ fontSize: 12, fontWeight: 800, color }}>{pct}</span>
                </div>
                <div style={{ height: 8, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: color }} />
                </div>
              </div>
            ))}
          </div>

          {/* Family */}
          <div className="panel hs-family-panel" style={{ background: 'white', border: 'none' }}>
            <span className="panel-num">06</span>
            <h2 style={{ fontFamily: LILITA_FONT, fontSize: 26, color: blue, marginBottom: 28, marginTop: 8 }}>{t.familyTitle}</h2>
            <div className="hs-family-grid">
              {t.family.map(m => (
                <div key={m.name} style={{ border: `2.5px solid ${m.color}`, padding: '16px', background: `${m.color}08` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 28 }}>{m.emoji}</span>
                    <div>
                      <p style={{ fontFamily: LILITA_FONT, fontSize: 14, color: m.color, margin: 0 }}>{m.name}</p>
                      <p style={{ fontSize: 9, fontWeight: 800, color: '#9ca3af', letterSpacing: '0.2em', margin: 0 }}>{m.tag}</p>
                    </div>
                  </div>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0, lineHeight: 1.6 }}>{m.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 4: Full-width quote panel */}
        <div className="panel" style={{ background: yellow, padding: '48px 40px', border: 'none', borderBottom: panelBorder, textAlign: 'center' }}>
          <span className="panel-num">07</span>
          <p style={{ fontFamily: LILITA_FONT, fontSize: 'clamp(1.5rem, 5vw, 4rem)', color: blue, margin: '0 0 16px', lineHeight: 1.1 }}>
            &ldquo;{t.quote}&rdquo;
          </p>
          <p style={{ fontSize: 14, color: '#92400e', fontWeight: 800, margin: 0, letterSpacing: '0.1em' }}>{t.quoteAttribution}</p>
        </div>

        {/* Footer */}
        <div className="hs-footer" style={{ background: blue }}>
          <span style={{ fontFamily: LILITA_FONT, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>{t.footerLeft}</span>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', margin: 0, fontWeight: 800 }}>
            {t.designedBy} <Link href="/" style={{ color: yellow, textDecoration: 'none' }}>Jobli</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
