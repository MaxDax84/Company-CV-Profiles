'use client'

import Link from 'next/link'
// Self-hosted (see app/layout.tsx)
import '@fontsource/playfair-display/400.css'
import '@fontsource/playfair-display/400-italic.css'
import '@fontsource/playfair-display/700.css'
import '@fontsource/playfair-display/700-italic.css'
import '@fontsource/playfair-display/900.css'
import '@fontsource/playfair-display/900-italic.css'
import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/300-italic.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/400-italic.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/600-italic.css'
import { useLanguage } from '@/components/language-provider'

const PLAYFAIR_FONT = "'Playfair Display', serif"
const CORMORANT_FONT = "'Cormorant Garamond', serif"

const gold = '#c9a84c'
const darkBg = '#0a0907'
const parchment = 'rgba(201,168,76,0.07)'
const borderGold = 'rgba(201,168,76,0.3)'

const content = {
  en: {
    backLabel: '← Showcase',
    eyebrowNav: 'Jobli · Style Showcase',
    dates: '4 May 1929 – 20 January 1993',
    heroEyebrow: 'Actress · Humanitarian · Style Icon',
    firstName: 'Audrey',
    lastName: 'Hepburn',
    openingQuote: 'Nothing is impossible — the word itself says I’m possible.',
    bioLabel: 'Biography',
    bio1First: 'B',
    bio1Rest: 'orn Audrey Kathleen Ruston in Brussels on 4 May 1929, she survived the Nazi occupation of the Netherlands as a child — an experience that permanently shaped her profound empathy for those the world had abandoned. She came of age in wartime, watching, hungry, and learning.',
    bio2: 'She trained in ballet — Amsterdam first, then London — before the theatre claimed her. A chance encounter in Monte Carlo, where novelist Colette spotted her and insisted she play the lead in the Broadway production of Gigi, changed everything. By 1953, Roman Holiday had made her the most luminous face in Hollywood.',
    pullQuote1: 'She survived a war. Then she conquered Hollywood. Then she gave it all up — for children she would never meet.',
    bio3: 'In her final years, Hepburn devoted herself entirely to UNICEF. She traveled to Ethiopia, Sudan, Bangladesh, Vietnam, and Somalia — places that the cameras had left. She sat with dying children, held their hands, and put her face to their suffering until the world was forced to look.',
    filmsLabel: 'Selected Filmography',
    films: [
      { year: '1953', title: 'Roman Holiday', role: 'Princess Ann', award: 'Academy Award · Best Actress', note: 'Her debut leading role. Overnight global icon. Shot on location in Rome with Gregory Peck.' },
      { year: '1954', title: 'Sabrina', role: 'Sabrina Fairchild', award: 'Oscar Nomination · BAFTA Award', note: 'Hubert de Givenchy designed her wardrobe for the first time. A lifelong partnership began.' },
      { year: '1961', title: "Breakfast at Tiffany's", role: 'Holly Golightly', award: 'Grammy Award — Moon River', note: "The role that defined a generation's idea of New York elegance. Holly Golightly, forever." },
      { year: '1964', title: 'My Fair Lady', role: 'Eliza Doolittle', award: 'One of her most beloved roles', note: 'Musical adaptation. Dubbed by Marni Nixon — a controversy that followed her for years.' },
      { year: '1967', title: 'Wait Until Dark', role: 'Susy Hendrix', award: 'Academy Award Nomination', note: 'Playing blind against a professional killer. Broadway-trained psychological tension at its finest.' },
    ],
    asRole: 'as',
    awardsLabel: 'Awards & Honours',
    awardsHeadline: 'One of only 17 people in history to achieve the EGOT.',
    awardsBody: 'Academy Award (1953, Roman Holiday) · Tony Award (1954, Ondine) · Grammy Award (1993) · Emmy Award (1993) — and the Presidential Medal of Freedom, awarded just months before her death. She received the Jean Hersholt Humanitarian Award from the Academy of Motion Picture Arts and Sciences. The EGOT arrived as an afterthought. Hepburn had long since stopped counting.',
    awardTags: ['Academy Award', 'Tony Award', 'Grammy Award', 'Emmy Award', 'BAFTA Award', 'Presidential Medal of Freedom'],
    humanitarianLabel: 'Humanitarian Legacy',
    pullQuote2: 'She gave up cinema to save children. And she never once looked back.',
    human1: "UNICEF Goodwill Ambassador from 1988 until her death on 20 January 1993. Ethiopia, Sudan, El Salvador, Bangladesh, Vietnam, Somalia. She sat with children no headline would cover and brought the world's cameras after her. The Presidential Medal of Freedom followed in 1992 — her last year of strength.",
    human2: "The Audrey Hepburn Children's Fund continues her work. She left no memoir, no autobiography. She left only the photographs of the places she went — and the faces of the children she refused to forget.",
    designedBy: 'Designed by',
  },
  it: {
    backLabel: '← Showcase',
    eyebrowNav: 'Jobli · Vetrina di stile',
    dates: '4 maggio 1929 – 20 gennaio 1993',
    heroEyebrow: 'Attrice · Umanitaria · Icona di stile',
    firstName: 'Audrey',
    lastName: 'Hepburn',
    openingQuote: 'Niente è impossibile — la parola stessa dice "io-possibile".',
    bioLabel: 'Biografia',
    bio1First: 'N',
    bio1Rest: 'ata Audrey Kathleen Ruston a Bruxelles il 4 maggio 1929, sopravvisse da bambina all\'occupazione nazista dei Paesi Bassi — un\'esperienza che plasmò per sempre la sua profonda empatia verso chi il mondo aveva abbandonato. Crebbe in tempo di guerra, osservando, affamata, imparando.',
    bio2: 'Si formò nella danza classica — prima ad Amsterdam, poi a Londra — prima che il teatro la reclamasse. Un incontro casuale a Monte Carlo, dove la scrittrice Colette la notò e insistette perché interpretasse il ruolo principale nella produzione di Broadway di Gigi, cambiò tutto. Nel 1953, Vacanze Romane l\'aveva già resa il volto più luminoso di Hollywood.',
    pullQuote1: 'Sopravvisse a una guerra. Poi conquistò Hollywood. Poi rinunciò a tutto — per bambini che non avrebbe mai incontrato.',
    bio3: 'Negli ultimi anni, Hepburn si dedicò interamente all\'UNICEF. Viaggiò in Etiopia, Sudan, Bangladesh, Vietnam e Somalia — luoghi che le telecamere avevano abbandonato. Si sedette accanto a bambini morenti, tenne loro la mano, e mise il proprio volto davanti alla loro sofferenza finché il mondo non fu costretto a guardare.',
    filmsLabel: 'Filmografia selezionata',
    films: [
      { year: '1953', title: 'Vacanze Romane', role: 'Principessa Ann', award: 'Premio Oscar · Miglior Attrice', note: 'Il suo debutto da protagonista. Icona globale dall\'oggi al domani. Girato a Roma con Gregory Peck.' },
      { year: '1954', title: 'Sabrina', role: 'Sabrina Fairchild', award: 'Nomination Oscar · Premio BAFTA', note: 'Hubert de Givenchy disegnò il suo guardaroba per la prima volta. Iniziò un sodalizio durato tutta la vita.' },
      { year: '1961', title: 'Colazione da Tiffany', role: 'Holly Golightly', award: 'Grammy Award — Moon River', note: 'Il ruolo che ha definito l\'idea di eleganza newyorkese per una generazione. Holly Golightly, per sempre.' },
      { year: '1964', title: 'My Fair Lady', role: 'Eliza Doolittle', award: 'Uno dei suoi ruoli più amati', note: 'Adattamento musicale. Doppiata nel canto da Marni Nixon — una controversia che la seguì per anni.' },
      { year: '1967', title: 'Gli occhi della notte', role: 'Susy Hendrix', award: 'Nomination Oscar', note: 'Interpreta una donna cieca contro un killer professionista. Tensione psicologica da attrice di formazione teatrale, al suo meglio.' },
    ],
    asRole: 'nel ruolo di',
    awardsLabel: 'Premi e riconoscimenti',
    awardsHeadline: 'Una delle sole 17 persone nella storia ad aver ottenuto l\'EGOT.',
    awardsBody: 'Premio Oscar (1953, Vacanze Romane) · Tony Award (1954, Ondine) · Grammy Award (1993) · Emmy Award (1993) — e la Presidential Medal of Freedom, ricevuta pochi mesi prima della morte. Ricevette lo Jean Hersholt Humanitarian Award dall\'Academy of Motion Picture Arts and Sciences. L\'EGOT arrivò quasi come un dettaglio. Hepburn aveva ormai smesso di contare.',
    awardTags: ['Premio Oscar', 'Tony Award', 'Grammy Award', 'Emmy Award', 'Premio BAFTA', 'Presidential Medal of Freedom'],
    humanitarianLabel: 'Eredità umanitaria',
    pullQuote2: 'Rinunciò al cinema per salvare i bambini. E non si voltò mai indietro.',
    human1: 'Ambasciatrice di buona volontà UNICEF dal 1988 fino alla morte, il 20 gennaio 1993. Etiopia, Sudan, El Salvador, Bangladesh, Vietnam, Somalia. Si sedette accanto a bambini di cui nessun titolo avrebbe parlato, e portò con sé le telecamere del mondo. La Presidential Medal of Freedom arrivò nel 1992 — il suo ultimo anno di forze.',
    human2: 'L\'Audrey Hepburn Children\'s Fund continua la sua opera. Non lasciò memoir, né autobiografia. Lasciò solo le fotografie dei luoghi in cui era stata — e i volti dei bambini che si rifiutò di dimenticare.',
    designedBy: 'Progettato da',
  },
}

export default function AudreyHepburnPage() {
  const { lang } = useLanguage()
  const t = content[lang]

  return (
    <div style={{ fontFamily: CORMORANT_FONT, background: darkBg, color: '#e8e0d0', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .ah-pull-quote {
          margin: 0 -80px;
          padding: 0 80px;
        }
        .ah-header {
          padding: 20px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(201,168,76,0.1);
        }
        .ah-header-date { display: block; }
        .ah-back-mobile { display: none; font-size: 13px; color: #4b3e2e; text-decoration: none; letter-spacing: 0.15em; font-style: italic; }
        .ah-film-grid { display: grid; grid-template-columns: 48px 1fr; gap: 32; }
        .ah-footer-row { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }

        @media (max-width: 900px) {
          .ah-pull-quote { margin: 0; padding: 0; }
        }
        .ah-content-col { padding: 0 40px 100px; }
        .ah-hero { padding: 100px 0 80px; }

        @media (max-width: 600px) {
          .ah-pull-quote { margin: 0 !important; padding: 0 !important; }
          .ah-header { padding: 12px 20px !important; }
          .ah-header-date { display: none; }
          .ah-back-mobile { display: block; }
          .ah-content-col { padding: 0 20px 60px !important; }
          .ah-hero { padding: 56px 0 40px !important; }
        }
      `}</style>

      {/* Top strip */}
      <div style={{ height: 3, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }} />

      {/* Minimal header */}
      <div className="ah-header">
        <Link href="/showcase" style={{ fontFamily: CORMORANT_FONT, fontSize: 13, color: '#4b3e2e', textDecoration: 'none', letterSpacing: '0.15em', fontStyle: 'italic' }}>{t.backLabel}</Link>
        <p style={{ fontFamily: CORMORANT_FONT, fontSize: 11, color: '#4b3e2e', letterSpacing: '0.4em', margin: 0, textTransform: 'uppercase' }}>{t.eyebrowNav}</p>
        <p className="ah-header-date" style={{ fontFamily: CORMORANT_FONT, fontSize: 12, color: '#4b3e2e', margin: 0, fontStyle: 'italic' }}>{t.dates}</p>
      </div>

      {/* ── OPENING — full-bleed typographic title ── */}
      <section className="ah-hero" style={{ textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at 50% 60%, rgba(201,168,76,0.06), transparent 60%)`, pointerEvents: 'none' }} />
        <p style={{ fontFamily: CORMORANT_FONT, fontSize: 12, letterSpacing: '0.6em', color: gold, textTransform: 'uppercase', margin: '0 0 32px' }}>
          {t.heroEyebrow}
        </p>
        <h1 style={{ fontFamily: PLAYFAIR_FONT, fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, lineHeight: 0.9, margin: '0 0 0', color: '#ffffff', letterSpacing: '-0.02em' }}>
          {t.firstName}
        </h1>
        <h1 style={{ fontFamily: PLAYFAIR_FONT, fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 400, fontStyle: 'italic', lineHeight: 0.9, color: gold, letterSpacing: '-0.01em', margin: '0 0 48px' }}>
          {t.lastName}
        </h1>
        <div style={{ width: 1, height: 80, background: `linear-gradient(to bottom, ${gold}, transparent)`, margin: '0 auto' }} />
      </section>

      {/* ── MAGAZINE CONTENT COLUMN ── */}
      <div className="ah-content-col" style={{ maxWidth: 820, margin: '0 auto' }}>

        {/* Opening quote — editorial pull style */}
        <div className="ah-pull-quote" style={{ borderTop: `1px solid ${borderGold}`, borderBottom: `1px solid ${borderGold}`, padding: '40px 80px', margin: '0 -80px 64px', textAlign: 'center' }}>
          <p style={{ fontFamily: PLAYFAIR_FONT, fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontWeight: 400, fontStyle: 'italic', color: '#e8e0d0', margin: 0, lineHeight: 1.5 }}>
            &ldquo;{t.openingQuote}&rdquo;
          </p>
        </div>

        {/* Biography — drop cap first paragraph */}
        <section id="biography">
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 11, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 28px' }}>{t.bioLabel}</p>

          {/* Drop cap effect */}
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 21, lineHeight: 1.85, color: '#9c8870', marginBottom: 24, fontWeight: 300 }}>
            <span style={{ fontFamily: PLAYFAIR_FONT, float: 'left', fontSize: '4.5em', lineHeight: 0.75, paddingRight: 12, paddingTop: 10, color: gold, fontWeight: 900 }}>{t.bio1First}</span>
            {t.bio1Rest}
          </p>
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 21, lineHeight: 1.85, color: '#9c8870', marginBottom: 24, fontWeight: 300 }}>
            {t.bio2}
          </p>

          {/* Pull quote mid-article */}
          <div className="ah-pull-quote" style={{ margin: '40px -80px', padding: '36px 80px', background: parchment, borderLeft: `3px solid ${gold}` }}>
            <p style={{ fontFamily: PLAYFAIR_FONT, fontSize: 'clamp(1.2rem, 2vw, 1.6rem)', fontStyle: 'italic', color: '#e8e0d0', margin: 0, lineHeight: 1.55 }}>
              &ldquo;{t.pullQuote1}&rdquo;
            </p>
          </div>

          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 21, lineHeight: 1.85, color: '#9c8870', marginTop: 40, marginBottom: 0, fontWeight: 300 }}>
            {t.bio3}
          </p>
        </section>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '64px 0' }}>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
          <span style={{ color: gold, fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
        </div>

        {/* Filmography — editorial numbered list */}
        <section id="films">
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 11, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 48px' }}>{t.filmsLabel}</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {t.films.map((f, i) => (
              <div key={f.title} style={{ display: 'grid', gridTemplateColumns: '48px 1fr', gap: 32, paddingBottom: 40, marginBottom: 40, borderBottom: i < t.films.length - 1 ? `1px solid rgba(201,168,76,0.12)` : 'none' }}>
                {/* Number */}
                <div style={{ paddingTop: 6 }}>
                  <p style={{ fontFamily: PLAYFAIR_FONT, fontSize: 36, fontWeight: 900, color: 'rgba(201,168,76,0.2)', margin: 0, lineHeight: 1 }}>{String(i + 1).padStart(2, '0')}</p>
                </div>
                {/* Content */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 16, marginBottom: 6, flexWrap: 'wrap' }}>
                    <p style={{ fontFamily: PLAYFAIR_FONT, fontSize: 22, fontWeight: 700, color: '#ffffff', margin: 0 }}>{f.title}</p>
                    <p style={{ fontFamily: CORMORANT_FONT, fontSize: 14, color: gold, margin: 0, fontStyle: 'italic', letterSpacing: '0.1em' }}>{f.year}</p>
                  </div>
                  <p style={{ fontFamily: CORMORANT_FONT, fontSize: 16, color: 'rgba(201,168,76,0.6)', margin: '0 0 10px', fontStyle: 'italic' }}>{t.asRole} {f.role}</p>
                  <p style={{ fontFamily: CORMORANT_FONT, fontSize: 19, color: '#9c8870', margin: '0 0 10px', lineHeight: 1.7, fontWeight: 300 }}>{f.note}</p>
                  <p style={{ fontFamily: CORMORANT_FONT, fontSize: 14, color: gold, margin: 0, letterSpacing: '0.05em' }}>{f.award}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '64px 0' }}>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
          <span style={{ color: gold, fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
        </div>

        {/* Awards — inline editorial block, not cards */}
        <section id="awards">
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 11, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 28px' }}>{t.awardsLabel}</p>
          <p style={{ fontFamily: PLAYFAIR_FONT, fontSize: 'clamp(1.4rem, 2.5vw, 1.9rem)', fontWeight: 700, color: '#ffffff', lineHeight: 1.3, marginBottom: 28 }}>
            {t.awardsHeadline}
          </p>
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 20, color: '#9c8870', lineHeight: 1.85, marginBottom: 32, fontWeight: 300 }}>
            {t.awardsBody}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {t.awardTags.map(a => (
              <span key={a} style={{ fontFamily: CORMORANT_FONT, fontSize: 14, padding: '6px 16px', border: `1px solid ${borderGold}`, borderRadius: 99, color: gold, letterSpacing: '0.08em', fontStyle: 'italic' }}>{a}</span>
            ))}
          </div>
        </section>

        {/* Decorative divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, margin: '64px 0' }}>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
          <span style={{ color: gold, fontSize: 16 }}>✦</span>
          <div style={{ flex: 1, height: 1, background: borderGold }} />
        </div>

        {/* Humanitarian — full-width pull quote + text */}
        <section id="humanitarian">
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 11, letterSpacing: '0.5em', color: gold, textTransform: 'uppercase', margin: '0 0 28px' }}>{t.humanitarianLabel}</p>

          <div className="ah-pull-quote" style={{ margin: '0 -80px 48px', padding: '40px 80px', borderTop: `1px solid ${borderGold}`, borderBottom: `1px solid ${borderGold}` }}>
            <p style={{ fontFamily: PLAYFAIR_FONT, fontSize: 'clamp(1.3rem, 2.5vw, 2rem)', fontStyle: 'italic', color: '#e8e0d0', margin: 0, lineHeight: 1.5, textAlign: 'center' }}>
              &ldquo;{t.pullQuote2}&rdquo;
            </p>
          </div>

          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 21, color: '#9c8870', lineHeight: 1.85, marginBottom: 24, fontWeight: 300 }}>
            {t.human1}
          </p>
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 21, color: '#9c8870', lineHeight: 1.85, fontWeight: 300 }}>
            {t.human2}
          </p>
        </section>

        {/* Footer */}
        <div className="ah-footer-row" style={{ marginTop: 80, paddingTop: 32, borderTop: `1px solid rgba(201,168,76,0.15)` }}>
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 13, color: '#4b3e2e', fontStyle: 'italic', margin: 0 }}>{t.dates}</p>
          <p style={{ fontFamily: CORMORANT_FONT, fontSize: 13, color: '#4b3e2e', fontStyle: 'italic', margin: 0 }}>
            {t.designedBy} <Link href="/" style={{ color: gold, textDecoration: 'none' }}>Jobli</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
