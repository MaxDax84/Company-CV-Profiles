'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { DM_Serif_Display, DM_Sans } from 'next/font/google'
import type { ProfileSchema } from '@/lib/schema'

const serif = DM_Serif_Display({ subsets: ['latin'], weight: ['400'] })
const sans  = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

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

export default function TemplateBeta({ profile }: Props) {
  const { personal_info: p, experience, education, skills, projects, certifications, metadata } = profile

  const accent      = metadata.primary_color
  const white       = '#ffffff'
  const lightBg     = '#f8f7ff'
  const ink         = '#0f0e1a'
  const muted       = '#4b5563'
  const border      = '#e5e7eb'
  const darkPanel   = '#1e1b4b'
  const aFaint      = `${accent}12`
  const aBorder     = `${accent}30`

  const isIT = metadata.language === 'it'
  const initials = p.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const skillGroups = [
    ...(skills.hard.length  ? [{ label: 'Hard Skills', items: skills.hard }]  : []),
    ...(skills.tools.length ? [{ label: 'Tools',       items: skills.tools }] : []),
    ...(skills.soft.length  ? [{ label: 'Soft Skills', items: skills.soft }]  : []),
  ]

  const infoRows: [string, string][] = [
    ...(p.location            ? [['📍', p.location] as [string, string]] : []),
    ...(experience.length     ? [['🏢', `${experience[0].role} · ${experience[0].company}`] as [string, string]] : []),
    ...(education.length      ? [['🎓', `${education[0].degree} · ${education[0].institution}`] as [string, string]] : []),
    ['✉', p.email_obfuscated],
    ...(p.social_links.linkedin ? [['🔗', p.social_links.linkedin.replace('https://', '')] as [string, string]] : []),
  ]

  const scrolled  = useScrolled()
  const heroIn    = useInView()
  const aboutIn   = useInView()
  const expIn     = useInView()
  const skillsIn  = useInView()
  const contactIn = useInView()

  return (
    <div className={sans.className} style={{ background: white, color: ink, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }

        .sb-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(255,255,255,0.9);
          transition: box-shadow 0.3s;
        }
        .sb-nav.scrolled { box-shadow: 0 1px 0 ${border}; backdrop-filter: blur(12px); }
        .sb-nav-inner {
          max-width: 960px; margin: 0 auto; padding: 0 24px;
          height: 64px; display: flex; align-items: center; justify-content: space-between;
        }
        .sb-nav-links { display: flex; gap: 28px; align-items: center; }
        .sb-nav-link { font-size: 13px; color: ${muted}; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .sb-nav-link:hover { color: ${ink}; }
        .sb-nav-cta {
          font-size: 13px; font-weight: 600; color: ${white};
          background: ${accent}; text-decoration: none;
          padding: 8px 18px; border-radius: 8px; transition: opacity 0.15s;
        }
        .sb-nav-cta:hover { opacity: 0.85; }
        .sb-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

        .sb-stats-divider { display: flex; border-top: 1px solid ${border}; border-bottom: 1px solid ${border}; }
        .sb-stat { flex: 1; padding: 20px 24px; border-right: 1px solid ${border}; }
        .sb-stat:last-child { border-right: none; }

        .sb-about-grid { display: grid; grid-template-columns: 1fr 340px; gap: 0; }
        .sb-about-left { padding: 64px 48px 64px 0; }
        .sb-about-right { background: ${darkPanel}; padding: 48px 32px; border-radius: 0 12px 12px 0; }

        .sb-exp-row { display: grid; grid-template-columns: 200px 1fr; gap: 32px; padding: 32px 0; border-bottom: 1px solid ${border}; }
        .sb-exp-row:first-child { border-top: 1px solid ${border}; }

        .sb-expertise-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        .sb-edu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 32px; }

        .sb-proj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        @media (max-width: 900px) {
          .sb-about-grid   { grid-template-columns: 1fr !important; }
          .sb-about-right  { border-radius: 0 0 12px 12px !important; padding: 32px !important; }
          .sb-about-left   { padding: 48px 0 32px !important; }
          .sb-exp-row      { grid-template-columns: 1fr !important; gap: 12px !important; }
          .sb-expertise-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .sb-edu-grid     { grid-template-columns: 1fr !important; }
          .sb-proj-grid    { grid-template-columns: 1fr !important; }
          .sb-stats-divider { flex-wrap: wrap; }
          .sb-stat         { flex: 1 1 50%; border-bottom: 1px solid ${border}; }
        }
        @media (max-width: 600px) {
          .sb-nav-links { display: none; }
          .sb-expertise-grid { grid-template-columns: 1fr !important; }
          .hero-ctas { flex-direction: column !important; align-items: flex-start !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`sb-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="sb-nav-inner">
          <a href="#top" style={{ fontSize: 15, fontWeight: 700, color: ink, textDecoration: 'none', letterSpacing: '0.02em' }}>{initials}</a>
          <div className="sb-nav-links">
            {([
              ['#about',      isIT ? 'Profilo'    : 'Profile'],
              ['#experience', isIT ? 'Esperienza' : 'Experience'],
              ['#skills',     isIT ? 'Competenze' : 'Skills'],
              ['#contact',    isIT ? 'Contatti'   : 'Contact'],
            ] as [string, string][]).map(([href, label]) => (
              <a key={href} href={href} className="sb-nav-link">{label}</a>
            ))}
          </div>
          <a href="#contact" className="sb-nav-cta">{isIT ? 'Scrivimi' : 'Get in touch'}</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" style={{ paddingTop: 64, background: white }}>
        <div
          ref={heroIn.ref}
          className="sb-container"
          style={{ padding: '96px 24px 64px', transition: 'opacity 0.8s, transform 0.8s', opacity: heroIn.inView ? 1 : 0, transform: heroIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: accent, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            {p.title}{p.location ? ` · ${p.location}` : ''}
          </p>

          <h1 className={serif.className} style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', fontWeight: 400, color: ink, lineHeight: 0.95, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            {p.full_name.split(' ')[0]}<br />
            <span style={{ color: accent }}>{p.full_name.split(' ').slice(1).join(' ')}</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.12rem)', color: muted, maxWidth: 640, lineHeight: 1.8, margin: '0 0 48px', fontWeight: 300 }}>
            {p.bio}
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 64 }}>
            <a href="#experience" style={{ padding: '12px 26px', background: accent, color: white, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              {isIT ? 'Vedi il percorso' : 'View career'}
            </a>
            <a href="#contact" style={{ padding: '11px 26px', border: `1.5px solid ${border}`, color: muted, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              {isIT ? 'Contattami' : 'Contact me'}
            </a>
          </div>

          {/* Stats divider */}
          <div className="sb-stats-divider">
            {[
              ...(() => {
                const uniqueCo = new Set(experience.map(e => e.company)).size
                const roles = experience.length
                if (roles > uniqueCo) return [
                  { v: `${uniqueCo}`, label: isIT ? 'aziende' : 'companies' },
                  { v: `${roles}`,    label: isIT ? 'ruoli ricoperti' : 'roles held' },
                ]
                return [{ v: `${uniqueCo}`, label: isIT ? 'aziende' : 'companies' }]
              })(),
              { v: `${experience.reduce((y, e) => { const s = parseInt(e.start_date); return s < y ? s : y }, 9999)}`, label: isIT ? 'anno inizio carriera' : 'career started' },
              { v: `${skills.hard.length + skills.tools.length}`, label: isIT ? 'skill tech' : 'tech skills' },
              { v: `${certifications.length || education.length}`, label: certifications.length ? (isIT ? 'certificazioni' : 'certifications') : (isIT ? 'titoli' : 'degrees') },
            ].map(({ v, label }) => (
              <div key={label} className="sb-stat">
                <p style={{ fontSize: 28, fontWeight: 700, color: ink, margin: '0 0 4px', lineHeight: 1 }}>
                  {v}<span style={{ fontSize: 14, color: accent, fontWeight: 500 }}> </span>
                </p>
                <p style={{ fontSize: 11, color: muted, margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '0 0 96px' }}>
        <div
          ref={aboutIn.ref}
          className="sb-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: aboutIn.inView ? 1 : 0, transform: aboutIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <div className="sb-about-grid" style={{ borderRadius: 12, overflow: 'hidden' }}>
            <div className="sb-about-left">
              <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px' }}>
                {isIT ? 'Profilo' : 'Profile'}
              </p>
              <h2 className={serif.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: ink, lineHeight: 1.2, margin: '0 0 24px' }}>
                {isIT ? <>Chi sono.<br /><span style={{ color: accent }}>In breve.</span></> : <>About me.<br /><span style={{ color: accent }}>In short.</span></>}
              </h2>
              <p style={{ fontSize: 15, color: muted, lineHeight: 1.85, fontWeight: 300 }}>{p.bio}</p>
            </div>
            <div className="sb-about-right">
              <p style={{ fontSize: 11, fontWeight: 600, color: `${accent}90`, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 20px' }}>Info</p>
              {infoRows.map(([icon, val], i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 14 }}>
                  <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                  <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.5 }}>{val}</span>
                </div>
              ))}
              {p.social_links.github && (
                <a href={p.social_links.github} target="_blank" rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: 12, fontSize: 12, fontWeight: 600, color: accent, background: aFaint, border: `1px solid ${aBorder}`, borderRadius: 4, padding: '5px 12px', textDecoration: 'none' }}>
                  GitHub →
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: '96px 0', background: lightBg }}>
        <div
          ref={expIn.ref}
          className="sb-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: expIn.inView ? 1 : 0, transform: expIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            {isIT ? 'Esperienza' : 'Experience'}
          </p>
          <h2 className={serif.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 400, color: ink, lineHeight: 1.15, margin: '0 0 48px' }}>
            {isIT ? <>Dove sono stato.<br /><span style={{ color: accent }}>Cosa ho costruito.</span></> : <>Where I&apos;ve been.<br /><span style={{ color: accent }}>What I&apos;ve built.</span></>}
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="sb-exp-row">
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: accent, margin: '0 0 4px', fontFamily: 'monospace' }}>{exp.start_date} – {exp.end_date}</p>
                <p style={{ fontSize: 12, color: muted, margin: 0 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</p>
                {exp.end_date === 'present' && (
                  <span style={{ display: 'inline-block', marginTop: 8, fontSize: 10, fontWeight: 700, background: accent, color: white, borderRadius: 4, padding: '2px 7px' }}>
                    {isIT ? 'Ora' : 'Now'}
                  </span>
                )}
              </div>
              <div>
                <h3 style={{ fontSize: 17, fontWeight: 600, color: ink, margin: '0 0 12px' }}>{exp.role}</h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {exp.description.map((pt, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: accent, flexShrink: 0, marginTop: 3, fontSize: 12 }}>›</span>
                      <span style={{ fontSize: 14, color: muted, lineHeight: 1.7 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
                {exp.technologies.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                    {exp.technologies.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: aFaint, border: `1px solid ${aBorder}`, borderRadius: 4, color: accent }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS + EDUCATION ── */}
      <section id="skills" style={{ padding: '96px 0', background: white }}>
        <div
          ref={skillsIn.ref}
          className="sb-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: skillsIn.inView ? 1 : 0, transform: skillsIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            {isIT ? 'Competenze' : 'Skills'}
          </p>
          <h2 className={serif.className} style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 400, color: ink, margin: '0 0 40px' }}>
            {isIT ? 'Il toolkit.' : 'The toolkit.'}
          </h2>
          <div className="sb-expertise-grid">
            {skillGroups.map(({ label, items }) => (
              <div key={label}
                style={{ padding: '24px', border: `1px solid ${border}`, borderRadius: 10, transition: 'border-color 0.2s' }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}50`}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = border}
              >
                <p style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 14px' }}>{label}</p>
                {items.map(item => (
                  <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontSize: 11, color: accent }}>›</span>
                    <span style={{ fontSize: 13, color: muted }}>{item}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {education.length > 0 && (
            <div className="sb-edu-grid">
              {education.map((ed, i) => (
                <div key={i} style={{ padding: '20px 24px', border: `1px solid ${border}`, borderRadius: 10, borderLeft: `3px solid ${accent}` }}>
                  <p style={{ fontSize: 14, fontWeight: 600, color: ink, margin: '0 0 4px' }}>{ed.degree}{ed.field ? ` — ${ed.field}` : ''}</p>
                  <p style={{ fontSize: 13, color: accent, margin: '0 0 4px', fontWeight: 500 }}>{ed.institution}</p>
                  <p style={{ fontSize: 12, color: muted, margin: 0 }}>{ed.start_year} – {ed.end_year}{ed.grade ? ` · ${ed.grade}` : ''}</p>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {certifications.map((cert, i) => (
                <span key={i} style={{ fontSize: 12, color: muted, background: lightBg, border: `1px solid ${border}`, borderRadius: 6, padding: '6px 12px' }}>
                  {cert.name} · {cert.issuer} · {cert.year}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section style={{ padding: '96px 0', background: lightBg }}>
          <div className="sb-container">
            <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
              {isIT ? 'Progetti' : 'Projects'}
            </p>
            <div className="sb-proj-grid">
              {projects.map((proj, i) => (
                <div key={i} style={{ background: white, border: `1px solid ${border}`, borderRadius: 10, padding: '24px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}50`}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = border}
                >
                  <p style={{ fontSize: 15, fontWeight: 600, color: ink, margin: '0 0 8px' }}>{proj.title}</p>
                  <p style={{ fontSize: 13, color: muted, lineHeight: 1.7, margin: '0 0 14px' }}>{proj.description}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: proj.url ? 12 : 0 }}>
                    {proj.tags.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: aFaint, border: `1px solid ${aBorder}`, borderRadius: 4, color: accent }}>{t}</span>
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

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '96px 0', background: darkPanel, textAlign: 'center' }}>
        <div
          ref={contactIn.ref}
          style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px', transition: 'opacity 0.7s, transform 0.7s', opacity: contactIn.inView ? 1 : 0, transform: contactIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <h2 className={serif.className} style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 400, color: white, lineHeight: 1.1, margin: '0 0 16px' }}>
            {isIT ? <>Parliamo.<br /><span style={{ color: accent }}>Sono disponibile.</span></> : <>Let&apos;s talk.<br /><span style={{ color: accent }}>I&apos;m available.</span></>}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: '0 0 48px', lineHeight: 1.75, fontWeight: 300 }}>
            {isIT ? 'Aperto a nuove opportunità e collaborazioni.' : 'Open to new opportunities and collaborations.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <span style={{ padding: '13px 26px', background: accent, color: white, fontWeight: 600, fontSize: 14, borderRadius: 8 }}>
              ✉ {p.email_obfuscated}
            </span>
            {p.social_links.linkedin && (
              <a href={p.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ padding: '12px 26px', border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
                LinkedIn →
              </a>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', margin: 0 }}>
            {isIT ? 'Progettato da' : 'Designed by'}{' '}
            <Link href="/" style={{ color: accent, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
