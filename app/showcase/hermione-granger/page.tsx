'use client'

import Link from 'next/link'
import { EB_Garamond, Cinzel } from 'next/font/google'

const garamond = EB_Garamond({ subsets: ['latin'], weight: ['400', '500', '700', '800'], style: ['normal', 'italic'] })
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400', '600', '900'] })

const gold = '#c9993f'
const burgundy = '#9b1c1c'
const darkBg = '#1a0508'
const midBg = '#220810'
const parchment = '#fdf6e3'
const ink = '#2c1810'
const border = 'rgba(201,153,63,0.2)'
const borderGold = 'rgba(201,153,63,0.5)'

const years = [
  {
    year: '1991 – 1992',
    title: 'First Year',
    subtitle: 'Arrival at Hogwarts',
    color: gold,
    desc: 'Arrived knowing more spells than most third-years. Immediately the top student in every class. Made two friends by helping defeat a mountain troll. The pattern was set.',
  },
  {
    year: '1992 – 1993',
    title: 'Second Year',
    subtitle: 'The Chamber of Secrets',
    color: gold,
    desc: 'Correctly identified the Basilisk from library research alone — while Petrified. Left the cure in her hand for others to find. Solved the mystery from inside the hospital wing.',
  },
  {
    year: '1993 – 1994',
    title: 'Third Year',
    subtitle: 'Time & Justice',
    color: gold,
    desc: 'Carried a Time-Turner to attend extra classes. Used it to save two innocent lives in one night. Achieved 11 O.W.L.s — the highest in her year, possibly in Hogwarts history.',
  },
  {
    year: '1994 – 1995',
    title: 'Fourth Year',
    subtitle: 'S.P.E.W. & The Triwizard',
    color: gold,
    desc: 'Founded S.P.E.W. — Society for the Promotion of Elfish Welfare. Single-handedly raised awareness of magical creature rights. Became Viktor Krum\'s date at the Yule Ball. Refused to apologise for either.',
  },
  {
    year: '1995 – 1998',
    title: 'Fifth → Seventh Year',
    subtitle: 'The War',
    color: burgundy,
    desc: 'Co-founded Dumbledore\'s Army. Tortured by Bellatrix Lestrange — did not break. Obliviated her parents to protect them. Hunted Horcruxes across Britain. Helped end Voldemort\'s reign. Age 18.',
  },
]

const career = [
  {
    period: '1998 – 2000',
    title: 'Magical Law Enforcement',
    org: 'Ministry of Magic · Department of Magical Law Enforcement',
    color: gold,
    points: [
      'Returned to Hogwarts to complete N.E.W.T.s post-war — 7 Outstanding, 3 Exceeds Expectations',
      'Joined the Ministry as junior counsel; helped rebuild wizarding legal framework shattered by Voldemort\'s regime',
    ],
  },
  {
    period: '2000 – 2007',
    title: 'Dept. for Regulation of Magical Creatures',
    org: 'Ministry of Magic · Senior Counsel → Head of Division',
    color: gold,
    points: [
      'Drafted and passed historic House-Elf Rights Legislation — the first of its kind in wizarding Britain',
      'Promoted three times in seven years; overhauled creature welfare policy across all 11 wizarding departments',
    ],
  },
  {
    period: '2007 – 2019',
    title: 'Deputy Minister for Magic',
    org: 'Ministry of Magic · Office of the Minister',
    color: burgundy,
    points: [
      'Youngest Deputy Minister in Ministry history — appointed at 28',
      'Spearheaded Wizengamot reform, the Muggle Relations Act, and cross-ministry transparency initiatives',
    ],
  },
  {
    period: '2019 → Present',
    title: 'Minister for Magic',
    org: 'Ministry of Magic · London',
    color: '#d97706',
    points: [
      'Historic appointment: youngest ever, and first Muggle-born Minister for Magic in British wizarding history',
      'Ongoing work on international wizarding cooperation, magical education reform, and creature rights expansion',
    ],
  },
]

export default function HermioneGrangerPage() {
  return (
    <div className={garamond.className} style={{ background: darkBg, color: parchment, overflowX: 'hidden' }}>
      <style>{`html { scroll-behavior: smooth; }`}</style>

      {/* Top stripe */}
      <div style={{ height: 4, background: `linear-gradient(90deg, ${burgundy}, ${gold}, ${burgundy})` }} />

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(26,5,8,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${borderGold}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px', height: 56, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className={cinzel.className} style={{ fontSize: 13, color: gold, letterSpacing: '0.2em', fontWeight: 600 }}>H·G</span>
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            {[['#story', 'The Story'], ['#hogwarts', 'Hogwarts'], ['#ministry', 'Ministry'], ['#legacy', 'Legacy']].map(([href, label]) => (
              <a key={href} href={href} className={cinzel.className} style={{ fontSize: 11, color: 'rgba(201,153,63,0.5)', textDecoration: 'none', letterSpacing: '0.15em' }}
                onMouseEnter={e => (e.currentTarget.style.color = gold)}
                onMouseLeave={e => (e.currentTarget.style.color = 'rgba(201,153,63,0.5)')}
              >{label}</a>
            ))}
            <Link href="/showcase" className={cinzel.className} style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', textDecoration: 'none', letterSpacing: '0.1em' }}>← SHOWCASE</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ minHeight: '90vh', position: 'relative', display: 'flex', alignItems: 'center', overflow: 'hidden', background: `radial-gradient(ellipse at 60% 30%, rgba(201,153,63,0.08), transparent 55%), ${darkBg}` }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(201,153,63,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(201,153,63,0.03) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />
        <div style={{ position: 'relative', maxWidth: 1100, margin: '0 auto', padding: '80px 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '5px 16px', background: 'rgba(201,153,63,0.08)', border: `1px solid ${borderGold}`, borderRadius: 99, marginBottom: 32 }}>
            <span>⚡</span>
            <span className={cinzel.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.3em' }}>HOGWARTS · MINISTRY OF MAGIC · GRYFFINDOR</span>
          </div>

          <h1 className={cinzel.className} style={{ fontSize: 'clamp(3.5rem, 10vw, 8rem)', fontWeight: 900, lineHeight: 0.9, margin: '0 0 28px', letterSpacing: '0.03em' }}>
            HERMIONE<br />
            <span style={{ color: gold }}>GRANGER</span>
          </h1>

          <p className={garamond.className} style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: 'rgba(253,246,227,0.6)', maxWidth: 520, lineHeight: 1.85, marginBottom: 48, fontStyle: 'italic', fontWeight: 400 }}>
            Muggle-born. Head Girl. War hero. Minister for Magic.
            The brightest witch of her age — a title she earned not by birthright,
            but by an unrelenting refusal to stop learning.
          </p>

          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {[['O.W.L.s', '11', gold], ['N.E.W.T.s', '10', gold], ['BOOKS READ', '∞', burgundy], ['MINISTER', '2019→', '#d97706']].map(([k, v, c]) => (
              <div key={k} style={{ padding: '14px 20px', background: 'rgba(201,153,63,0.06)', border: `1px solid ${border}`, borderRadius: 8, minWidth: 110 }}>
                <p className={cinzel.className} style={{ fontSize: 20, fontWeight: 900, color: c as string, margin: 0, lineHeight: 1 }}>{v}</p>
                <p className={cinzel.className} style={{ fontSize: 9, color: 'rgba(201,153,63,0.4)', margin: '4px 0 0', letterSpacing: '0.2em' }}>{k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE STORY */}
      <section id="story" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={cinzel.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.4em', marginBottom: 20 }}>// 01 THE STORY</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64 }}>
            <div>
              <h2 className={cinzel.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 32px' }}>
                BORN MUGGLE.<br />
                <span style={{ color: gold }}>BECAME LEGEND.</span>
              </h2>
              <blockquote style={{ borderLeft: `3px solid ${gold}`, paddingLeft: 24 }}>
                <p className={garamond.className} style={{ fontSize: 18, color: parchment, fontStyle: 'italic', margin: 0, lineHeight: 1.75, fontWeight: 400 }}>
                  &ldquo;Books! And cleverness! There are more important things — friendship and bravery.&rdquo;
                </p>
                <p className={cinzel.className} style={{ fontSize: 11, color: gold, marginTop: 14, letterSpacing: '0.1em' }}>— Hermione Granger, 1997</p>
              </blockquote>
            </div>
            <div>
              <p className={garamond.className} style={{ fontSize: 16, color: 'rgba(253,246,227,0.7)', lineHeight: 1.9, marginBottom: 20, fontWeight: 400 }}>
                Born 19 September 1979 to Jean and Robert Granger, two perfectly ordinary Muggle dentists.
                She received her Hogwarts letter at eleven — and nothing was ordinary again.
                She arrived at school having memorised every textbook, spoken to no one,
                and convinced the entire train carriage she was insufferable.
              </p>
              <p className={garamond.className} style={{ fontSize: 16, color: 'rgba(253,246,227,0.7)', lineHeight: 1.9, fontWeight: 400 }}>
                She was also, without question, the best student Hogwarts had seen in a generation.
                She would go on to risk her life for the wizarding world that had not been hers by birth —
                then spend her career making sure that world was more just than she found it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HOGWARTS YEARS */}
      <section id="hogwarts" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={cinzel.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.4em', marginBottom: 20 }}>// 02 SEVEN YEARS AT HOGWARTS</p>
          <h2 className={cinzel.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 56px' }}>
            Seven years.<br />
            <span style={{ color: gold }}>One war at the end of it.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {years.map((y) => (
              <div key={y.year}
                style={{ background: 'rgba(201,153,63,0.04)', border: `1px solid ${border}`, borderRadius: 8, padding: '24px 28px', display: 'grid', gridTemplateColumns: '200px 1fr', gap: 32, transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = borderGold; el.style.background = 'rgba(201,153,63,0.08)'; el.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = border; el.style.background = 'rgba(201,153,63,0.04)'; el.style.transform = 'translateX(0)' }}
              >
                <div>
                  <p className={cinzel.className} style={{ fontSize: 10, color: gold, margin: '0 0 4px', letterSpacing: '0.12em' }}>{y.year}</p>
                  <p className={cinzel.className} style={{ fontSize: 14, fontWeight: 900, color: parchment, margin: '0 0 4px' }}>{y.title}</p>
                  <p className={garamond.className} style={{ fontSize: 13, color: 'rgba(201,153,63,0.6)', margin: 0, fontStyle: 'italic' }}>{y.subtitle}</p>
                </div>
                <p className={garamond.className} style={{ fontSize: 15, color: 'rgba(253,246,227,0.65)', margin: 0, lineHeight: 1.8 }}>{y.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MINISTRY CAREER */}
      <section id="ministry" style={{ background: midBg, borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={cinzel.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.4em', marginBottom: 20 }}>// 03 MINISTRY OF MAGIC</p>
          <h2 className={cinzel.className} style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 900, lineHeight: 1.1, margin: '0 0 56px' }}>
            Youngest Minister.<br />
            <span style={{ color: gold }}>Not by accident.</span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {career.map((c) => (
              <div key={c.title}
                style={{ background: 'rgba(201,153,63,0.04)', border: `1px solid ${border}`, borderRadius: 8, padding: '28px 32px', transition: 'all 0.3s ease', cursor: 'default' }}
                onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = borderGold; el.style.background = 'rgba(201,153,63,0.08)'; el.style.transform = 'translateX(4px)' }}
                onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor = border; el.style.background = 'rgba(201,153,63,0.04)'; el.style.transform = 'translateX(0)' }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 32 }}>
                  <div>
                    <p className={cinzel.className} style={{ fontSize: 10, color: c.color, margin: '0 0 6px', letterSpacing: '0.12em' }}>{c.period}</p>
                    <p className={cinzel.className} style={{ fontSize: 14, fontWeight: 900, color: parchment, margin: '0 0 4px' }}>{c.title}</p>
                    <p className={garamond.className} style={{ fontSize: 12, color: 'rgba(253,246,227,0.35)', margin: 0, fontStyle: 'italic' }}>{c.org}</p>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {c.points.map(pt => (
                      <li key={pt} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                        <span style={{ color: gold, fontSize: 12, marginTop: 3, flexShrink: 0 }}>✦</span>
                        <span className={garamond.className} style={{ fontSize: 15, color: 'rgba(253,246,227,0.65)', lineHeight: 1.75 }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* LEGACY */}
      <section id="legacy" style={{ background: darkBg }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '96px 32px' }}>
          <p className={cinzel.className} style={{ fontSize: 10, color: gold, letterSpacing: '0.4em', marginBottom: 20 }}>// 04 LEGACY</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              {/* Parchment card */}
              <div style={{ background: parchment, borderRadius: 4, padding: '36px 32px', color: ink, border: `2px solid rgba(201,153,63,0.4)`, boxShadow: `0 16px 48px rgba(0,0,0,0.6), inset 0 0 60px rgba(201,153,63,0.06)` }}>
                <p className={cinzel.className} style={{ fontSize: 11, color: burgundy, letterSpacing: '0.2em', marginBottom: 16 }}>FROM THE OFFICE OF THE MINISTER</p>
                <p className={garamond.className} style={{ fontSize: 17, color: ink, lineHeight: 1.85, margin: '0 0 20px', fontStyle: 'italic' }}>
                  &ldquo;Brightest witch of her age. Bravest person I know.
                  If I had to face Voldemort again, she&apos;d be the one I&apos;d want beside me.&rdquo;
                </p>
                <p className={cinzel.className} style={{ fontSize: 11, color: burgundy, margin: 0, letterSpacing: '0.1em' }}>— Harry Potter, 2024</p>
              </div>
            </div>
            <div>
              <p className={garamond.className} style={{ fontSize: 16, color: 'rgba(253,246,227,0.65)', lineHeight: 1.9, marginBottom: 20 }}>
                Hermione Granger did not inherit the wizarding world. She earned her place in it
                with 11 O.W.L.s, a Time-Turner, and more moral courage than anyone around her.
                She fought in a war she didn&apos;t have to fight, for a world that had once called her &ldquo;Mudblood.&rdquo;
              </p>
              <p className={garamond.className} style={{ fontSize: 16, color: 'rgba(253,246,227,0.65)', lineHeight: 1.9 }}>
                As Minister for Magic, she continues doing what she always has:
                reading every brief, questioning every assumption, and refusing to let
                the word &ldquo;impossible&rdquo; end a conversation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <div style={{ height: 4, background: `linear-gradient(90deg, ${burgundy}, ${gold}, ${burgundy})` }} />

      <footer style={{ background: midBg, padding: '24px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={cinzel.className} style={{ fontSize: 10, color: 'rgba(201,153,63,0.2)', letterSpacing: '0.2em' }}>MINISTRY OF MAGIC · OFFICIAL RECORD</span>
          <p className={garamond.className} style={{ fontSize: 12, color: 'rgba(253,246,227,0.25)', margin: 0, fontStyle: 'italic' }}>
            Designed by <Link href="/" style={{ color: gold, textDecoration: 'none' }}>BeOnWeb</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
