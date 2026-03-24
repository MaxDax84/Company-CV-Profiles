'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Playfair_Display, Inter } from 'next/font/google'
import type { ProfileSchema } from '@/lib/schema'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '700', '900'] })
const inter    = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

function useScrolled(threshold = 50) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > threshold)
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
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

interface Props { profile: ProfileSchema }

export default function TemplateDelta({ profile }: Props) {
  const { personal_info: p, experience, education, skills, projects, certifications, metadata } = profile

  const accent   = metadata.primary_color
  const navy     = '#0a1628'
  const navyCard = '#0d1f3c'
  const cream    = '#f4f0e8'
  const creamAlt = '#ede8de'
  const fg       = '#ddd8cc'
  const muted    = '#7a8ca0'
  const inkDark  = '#1a2332'
  const inkMid   = '#3d4f63'
  const border   = 'rgba(255,255,255,0.07)'
  const aBorder  = `${accent}35`

  const isIT = metadata.language === 'it'
  const initials = p.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const skillGroups = [
    ...(skills.hard.length  ? [{ label: 'Hard Skills', items: skills.hard }]  : []),
    ...(skills.tools.length ? [{ label: 'Tools',       items: skills.tools }] : []),
    ...(skills.soft.length  ? [{ label: 'Soft Skills', items: skills.soft }]  : []),
  ]

  const scrolled  = useScrolled()
  const heroIn    = useInView()
  const aboutIn   = useInView()
  const expIn     = useInView()
  const skillsIn  = useInView()
  const contactIn = useInView()

  return (
    <div className={inter.className} style={{ background: navy, color: fg, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }

        .dl-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background 0.3s, backdrop-filter 0.3s;
        }
        .dl-nav.scrolled {
          background: rgba(10,22,40,0.9);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .dl-nav-inner {
          max-width: 960px; margin: 0 auto; padding: 0 24px;
          height: 64px; display: flex; align-items: center; justify-content: space-between;
        }
        .dl-nav-links { display: flex; gap: 28px; align-items: center; }
        .dl-nav-link { font-size: 13px; color: ${muted}; text-decoration: none; font-weight: 500; letter-spacing: 0.05em; transition: color 0.15s; }
        .dl-nav-link:hover { color: ${fg}; }
        .dl-nav-cta {
          font-size: 12px; font-weight: 600; color: ${navy};
          background: ${accent}; text-decoration: none;
          padding: 8px 18px; border-radius: 6px; letter-spacing: 0.05em;
          transition: opacity 0.15s;
        }
        .dl-nav-cta:hover { opacity: 0.85; }
        .dl-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

        .dl-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: ${border}; border: 1px solid ${border}; border-radius: 10px; overflow: hidden; }
        .dl-stat { padding: 20px 24px; background: ${navyCard}; }

        .dl-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; }

        .dl-exp-row { padding: 32px 0; border-bottom: 1px solid ${border}; }
        .dl-exp-row:first-child { border-top: 1px solid ${border}; }
        .dl-exp-inner { display: grid; grid-template-columns: 200px 1fr; gap: 32px; }

        .dl-skills-rows { display: flex; flex-direction: column; gap: 20px; }

        .dl-edu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 40px; }

        .dl-proj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        @media (max-width: 900px) {
          .dl-about-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .dl-exp-inner  { grid-template-columns: 1fr !important; gap: 12px !important; }
          .dl-edu-grid   { grid-template-columns: 1fr !important; }
          .dl-proj-grid  { grid-template-columns: 1fr !important; }
          .dl-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .dl-nav-links { display: none; }
          .hero-ctas { flex-direction: column !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`dl-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="dl-nav-inner">
          <span className={playfair.className} style={{ fontSize: 15, fontWeight: 700, color: accent, letterSpacing: '0.08em' }}>{initials}</span>
          <div className="dl-nav-links">
            {([
              ['#about',      isIT ? 'Profilo'    : 'Profile'],
              ['#experience', isIT ? 'Esperienza' : 'Experience'],
              ['#skills',     isIT ? 'Competenze' : 'Skills'],
              ['#contact',    isIT ? 'Contatti'   : 'Contact'],
            ] as [string, string][]).map(([href, label]) => (
              <a key={href} href={href} className="dl-nav-link">{label}</a>
            ))}
          </div>
          <a href="#contact" className="dl-nav-cta">{isIT ? 'Scrivimi' : 'Get in touch'}</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
        {/* Diagonal texture overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 40px, ${accent}04 40px, ${accent}04 41px)`, pointerEvents: 'none' }} />
        {/* Large watermark initials */}
        <div className={playfair.className} style={{ position: 'absolute', right: '-2%', top: '50%', transform: 'translateY(-50%)', fontSize: 'clamp(18rem, 35vw, 30rem)', fontWeight: 900, color: `${accent}06`, lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>
          {initials}
        </div>

        <div
          ref={heroIn.ref}
          className="dl-container"
          style={{ position: 'relative', padding: '80px 24px 96px', transition: 'opacity 0.8s, transform 0.8s', opacity: heroIn.inView ? 1 : 0, transform: heroIn.inView ? 'translateY(0)' : 'translateY(32px)' }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.3em', textTransform: 'uppercase', margin: '0 0 24px' }}>
            {p.title}{p.location ? ` · ${p.location}` : ''}
          </p>
          <h1 className={playfair.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 900, color: fg, lineHeight: 0.95, margin: '0 0 32px', letterSpacing: '-0.01em' }}>
            {p.full_name.split(' ')[0]}<br />
            <span style={{ color: accent }}>{p.full_name.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.1rem)', color: muted, maxWidth: 560, lineHeight: 1.85, margin: '0 0 48px', fontWeight: 300 }}>
            {p.bio}
          </p>
          <div className="hero-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 72 }}>
            <a href="#experience" style={{ padding: '12px 28px', background: accent, color: navy, fontWeight: 600, fontSize: 13, borderRadius: 6, textDecoration: 'none', letterSpacing: '0.04em' }}>
              {isIT ? 'Vedi il percorso' : 'View career'}
            </a>
            <a href="#contact" style={{ padding: '11px 28px', border: `1.5px solid ${border}`, color: muted, fontWeight: 600, fontSize: 13, borderRadius: 6, textDecoration: 'none', letterSpacing: '0.04em' }}>
              {isIT ? 'Contattami' : 'Contact me'}
            </a>
          </div>

          {/* Stats */}
          <div className="dl-stats-grid">
            {[
              { v: `${experience.reduce((y, e) => { const s = parseInt(e.start_date); return s < y ? s : y }, 9999)}`, label: isIT ? 'inizio carriera' : 'career start' },
              ...(() => {
                const uniqueCo = new Set(experience.map(e => e.company)).size
                const roles = experience.length
                if (roles > uniqueCo) return [
                  { v: `${uniqueCo}`, label: isIT ? 'aziende' : 'companies' },
                  { v: `${roles}`,    label: isIT ? 'ruoli ricoperti' : 'roles held' },
                ]
                return [{ v: `${uniqueCo}`, label: isIT ? 'aziende' : 'companies' }]
              })(),
              { v: `${skills.hard.length + skills.tools.length}`, label: isIT ? 'skill tech' : 'tech skills' },
              { v: `${education.length + certifications.length}`, label: isIT ? 'titoli & cert.' : 'degrees & certs' },
            ].slice(0, 4).map(({ v, label }) => (
              <div key={label} className="dl-stat">
                <p className={playfair.className} style={{ fontSize: 28, fontWeight: 700, color: accent, margin: '0 0 4px', lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 11, color: muted, margin: 0, letterSpacing: '0.05em' }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT (cream) ── */}
      <section id="about" style={{ padding: '96px 0', background: cream }}>
        <div
          ref={aboutIn.ref}
          className="dl-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: aboutIn.inView ? 1 : 0, transform: aboutIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <div className="dl-about-grid">
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: inkMid, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px' }}>
                {isIT ? 'Profilo' : 'Profile'}
              </p>
              <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: inkDark, lineHeight: 1.15, margin: '0 0 24px' }}>
                {isIT ? <>Chi sono.<br /><span style={{ color: accent }}>In breve.</span></> : <>About me.<br /><span style={{ color: accent }}>In short.</span></>}
              </h2>
              <p style={{ fontSize: 15, color: inkMid, lineHeight: 1.85, fontWeight: 300 }}>{p.bio}</p>
            </div>
            <div>
              <div style={{ background: creamAlt, border: `1px solid ${accent}20`, borderRadius: 10, padding: '8px 0', marginBottom: 20 }}>
                {([
                  ...(p.location        ? [['📍', p.location]]                                                              : []),
                  ...(experience.length ? [['🏢', `${experience[0].role} · ${experience[0].company}`]]                     : []),
                  ...(education.length  ? [['🎓', `${education[0].degree} · ${education[0].institution}`]]                 : []),
                  ['✉', p.email_obfuscated],
                  ...(p.social_links.linkedin ? [['🔗', p.social_links.linkedin.replace('https://', '')]] : []),
                ] as [string, string][]).map(([icon, val], i, arr) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '12px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${accent}15` : 'none' }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: inkMid }}>{val}</span>
                  </div>
                ))}
              </div>
              {p.social_links.github && (
                <a href={p.social_links.github} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, color: accent, border: `1px solid ${aBorder}`, borderRadius: 4, padding: '5px 12px', textDecoration: 'none' }}>
                  GitHub →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE (navy) ── */}
      <section id="experience" style={{ padding: '96px 0', background: navy }}>
        <div
          ref={expIn.ref}
          className="dl-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: expIn.inView ? 1 : 0, transform: expIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            {isIT ? 'Esperienza' : 'Experience'}
          </p>
          <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: fg, margin: '0 0 56px' }}>
            {isIT ? <>Dove sono stato.<br /><span style={{ color: accent }}>Cosa ho costruito.</span></> : <>Where I&apos;ve been.<br /><span style={{ color: accent }}>What I&apos;ve built.</span></>}
          </h2>
          <div className="dl-skills-rows">
            {experience.map((exp, i) => (
              <div key={i} className="dl-exp-row">
                <div className="dl-exp-inner">
                  <div>
                    <p style={{ fontSize: 11, color: accent, margin: '0 0 4px', letterSpacing: '0.08em', fontFamily: 'monospace' }}>{exp.start_date} – {exp.end_date}</p>
                    <p style={{ fontSize: 14, fontWeight: 600, color: fg, margin: '0 0 2px' }}>{exp.company}</p>
                    <p style={{ fontSize: 12, color: muted, margin: '0 0 8px' }}>{exp.location ?? ''}</p>
                    {exp.end_date === 'present' && (
                      <span style={{ fontSize: 10, fontWeight: 700, background: accent, color: navy, borderRadius: 4, padding: '2px 7px' }}>
                        {isIT ? 'Ora' : 'Now'}
                      </span>
                    )}
                  </div>
                  <div>
                    <p className={playfair.className} style={{ fontSize: 17, fontWeight: 700, color: fg, margin: '0 0 14px' }}>{exp.role}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 24px' }}>
                      {exp.description.map((pt, j) => (
                        <div key={j} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                          <span style={{ color: accent, flexShrink: 0, marginTop: 3, fontSize: 10 }}>◆</span>
                          <span style={{ fontSize: 13, color: muted, lineHeight: 1.65 }}>{pt}</span>
                        </div>
                      ))}
                    </div>
                    {exp.technologies.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 10 }}>
                        {exp.technologies.map(t => (
                          <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: `${accent}12`, border: `1px solid ${aBorder}`, borderRadius: 4, color: accent }}>{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SKILLS (cream) ── */}
      <section id="skills" style={{ padding: '96px 0', background: cream }}>
        <div
          ref={skillsIn.ref}
          className="dl-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: skillsIn.inView ? 1 : 0, transform: skillsIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: inkMid, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            {isIT ? 'Competenze' : 'Skills'}
          </p>
          <h2 className={playfair.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 900, color: inkDark, margin: '0 0 40px' }}>
            {isIT ? 'Il toolkit.' : 'The toolkit.'}
          </h2>
          {skillGroups.map(({ label, items }) => (
            <div key={label} style={{ marginBottom: 28 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: inkMid, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 12px' }}>{label}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {items.map(item => (
                  <span key={item} style={{ fontSize: 13, padding: '6px 14px', background: creamAlt, border: `1px solid ${accent}25`, borderRadius: 99, color: inkMid, fontWeight: 500 }}>{item}</span>
                ))}
              </div>
            </div>
          ))}

          {education.length > 0 && (
            <div className="dl-edu-grid">
              {education.map((ed, i) => (
                <div key={i} style={{ background: creamAlt, border: `1px solid ${accent}20`, borderRadius: 10, padding: '20px 24px' }}>
                  <p className={playfair.className} style={{ fontSize: 15, fontWeight: 700, color: inkDark, margin: '0 0 4px' }}>{ed.institution}</p>
                  <p style={{ fontSize: 13, color: accent, margin: '0 0 4px', fontWeight: 500 }}>{ed.degree}{ed.field ? ` — ${ed.field}` : ''}</p>
                  <p style={{ fontSize: 12, color: inkMid, margin: 0 }}>{ed.start_year} – {ed.end_year}{ed.grade ? ` · ${ed.grade}` : ''}</p>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {certifications.map((cert, i) => (
                <span key={i} style={{ fontSize: 12, color: inkMid, background: creamAlt, border: `1px solid ${accent}20`, borderRadius: 6, padding: '6px 12px' }}>
                  {cert.name} · {cert.issuer} · {cert.year}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section style={{ padding: '96px 0', background: navy }}>
          <div className="dl-container">
            <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px' }}>
              {isIT ? 'Progetti' : 'Projects'}
            </p>
            <div className="dl-proj-grid">
              {projects.map((proj, i) => (
                <div key={i} style={{ background: navyCard, border: `1px solid ${border}`, borderRadius: 10, padding: '24px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}40`}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = border}
                >
                  <p className={playfair.className} style={{ fontSize: 16, fontWeight: 700, color: fg, margin: '0 0 8px' }}>{proj.title}</p>
                  <p style={{ fontSize: 13, color: muted, lineHeight: 1.7, margin: '0 0 14px' }}>{proj.description}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: proj.url ? 12 : 0 }}>
                    {proj.tags.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: `${accent}12`, border: `1px solid ${aBorder}`, borderRadius: 4, color: accent }}>{t}</span>
                    ))}
                  </div>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: accent, textDecoration: 'none', fontWeight: 500 }}>
                      {isIT ? 'Vedi →' : 'View →'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT (cream) ── */}
      <section id="contact" style={{ padding: '96px 0', background: cream, textAlign: 'center' }}>
        <div
          ref={contactIn.ref}
          style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px', transition: 'opacity 0.7s, transform 0.7s', opacity: contactIn.inView ? 1 : 0, transform: contactIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <h2 className={playfair.className} style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 900, color: inkDark, lineHeight: 1.1, margin: '0 0 16px' }}>
            {isIT ? <>Parliamo.<br /><span style={{ color: accent }}>Sono disponibile.</span></> : <>Let&apos;s talk.<br /><span style={{ color: accent }}>I&apos;m available.</span></>}
          </h2>
          <p style={{ fontSize: 15, color: inkMid, margin: '0 0 48px', lineHeight: 1.75, fontWeight: 300 }}>
            {isIT ? 'Aperto a nuove opportunità e collaborazioni.' : 'Open to new opportunities and collaborations.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <span style={{ padding: '13px 26px', background: accent, color: navy, fontWeight: 600, fontSize: 14, borderRadius: 6 }}>
              ✉ {p.email_obfuscated}
            </span>
            {p.social_links.linkedin && (
              <a href={p.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ padding: '12px 26px', border: `1.5px solid ${accent}30`, color: inkMid, fontWeight: 600, fontSize: 14, borderRadius: 6, textDecoration: 'none' }}>
                LinkedIn →
              </a>
            )}
          </div>
          <p style={{ fontSize: 12, color: inkMid, margin: 0, opacity: 0.6 }}>
            {isIT ? 'Progettato da' : 'Designed by'}{' '}
            <Link href="/" style={{ color: accent, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
