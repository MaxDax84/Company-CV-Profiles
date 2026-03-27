'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Plus_Jakarta_Sans } from 'next/font/google'
import type { ProfileSchema } from '@/lib/schema'

const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

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

export default function TemplateGamma({ profile }: Props) {
  const { personal_info: p, experience, education, skills, projects, certifications, metadata } = profile

  const accent    = metadata.primary_color
  const darkBg    = '#0b1f14'
  const lightBg   = '#f9fafb'
  const greenBg   = '#f0fdf4'
  const white     = '#ffffff'
  const ink       = '#111827'
  const sub       = '#4b5563'
  const muted     = '#9ca3af'
  const border    = '#e5e7eb'
  const aFaint    = `${accent}12`
  const aBorder   = `${accent}30`

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
    <div className={jakarta.className} style={{ background: lightBg, color: ink, minHeight: '100vh', overflowX: 'hidden' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        *, *::before, *::after { box-sizing: border-box; }

        .gm-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          background: rgba(249,250,251,0.92);
          transition: box-shadow 0.3s;
        }
        .gm-nav.scrolled { box-shadow: 0 1px 0 ${border}; backdrop-filter: blur(12px); }
        .gm-nav-inner {
          max-width: 960px; margin: 0 auto; padding: 0 24px;
          height: 64px; display: flex; align-items: center; justify-content: space-between;
        }
        .gm-nav-links { display: flex; gap: 28px; align-items: center; }
        .gm-nav-link { font-size: 13px; color: ${sub}; text-decoration: none; font-weight: 500; transition: color 0.15s; }
        .gm-nav-link:hover { color: ${ink}; }
        .gm-nav-cta {
          font-size: 13px; font-weight: 600; color: ${white};
          background: ${accent}; text-decoration: none;
          padding: 8px 18px; border-radius: 8px; transition: opacity 0.15s;
        }
        .gm-nav-cta:hover { opacity: 0.85; }
        .gm-container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

        .gm-stats-strip {
          display: grid; grid-template-columns: repeat(4, 1fr);
          background: rgba(255,255,255,0.08); border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.12);
          overflow: hidden; margin-top: 64px;
        }
        .gm-stat { padding: 20px 24px; border-right: 1px solid rgba(255,255,255,0.08); }
        .gm-stat:last-child { border-right: none; }

        .gm-about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }

        .gm-exp-row {
          display: grid; grid-template-columns: 260px 1fr; gap: 32px;
          padding: 28px 0; border-bottom: 1px solid ${border};
        }
        .gm-exp-row:first-child { border-top: 1px solid ${border}; }

        .gm-skills-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

        .gm-edu-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; margin-top: 32px; }

        .gm-proj-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        @media (max-width: 900px) {
          .gm-about-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .gm-exp-row    { grid-template-columns: 1fr !important; gap: 12px !important; }
          .gm-skills-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .gm-edu-grid   { grid-template-columns: 1fr !important; }
          .gm-proj-grid  { grid-template-columns: 1fr !important; }
          .gm-stats-strip { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 600px) {
          .gm-nav-links { display: none; }
          .gm-skills-grid { grid-template-columns: 1fr !important; }
          .hero-ctas { flex-direction: column !important; align-items: center !important; }
        }
      `}</style>

      {/* ── NAVBAR ── */}
      <nav className={`gm-nav${scrolled ? ' scrolled' : ''}`}>
        <div className="gm-nav-inner">
          <a href="#top" style={{ fontSize: 15, fontWeight: 700, color: ink, textDecoration: 'none' }}>{initials}</a>
          <div className="gm-nav-links">
            {([
              ['#about',      isIT ? 'Profilo'    : 'Profile'],
              ['#experience', isIT ? 'Esperienza' : 'Experience'],
              ['#skills',     isIT ? 'Competenze' : 'Skills'],
              ['#contact',    isIT ? 'Contatti'   : 'Contact'],
            ] as [string, string][]).map(([href, label]) => (
              <a key={href} href={href} className="gm-nav-link">{label}</a>
            ))}
          </div>
          <a href="#contact" className="gm-nav-cta">{isIT ? 'Scrivimi' : 'Get in touch'}</a>
        </div>
      </nav>

      {/* ── HERO (dark) ── */}
      <section id="top" style={{ background: darkBg, paddingTop: 64, textAlign: 'center' }}>
        <div
          ref={heroIn.ref}
          className="gm-container"
          style={{ padding: '80px 24px 96px', transition: 'opacity 0.8s, transform 0.8s', opacity: heroIn.inView ? 1 : 0, transform: heroIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: accent, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px' }}>
            {p.title}{p.location ? ` · ${p.location}` : ''}
          </p>
          <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', fontWeight: 700, color: white, lineHeight: 0.95, margin: '0 0 32px', letterSpacing: '-0.02em' }}>
            {p.full_name.split(' ')[0]}{' '}
            <span style={{ color: accent }}>{p.full_name.split(' ').slice(1).join(' ')}</span>
          </h1>

          <div className="hero-ctas" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#experience" style={{ padding: '12px 26px', background: accent, color: white, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              {isIT ? 'Vedi il percorso' : 'View career'}
            </a>
            <a href="#contact" style={{ padding: '11px 26px', border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              {isIT ? 'Contattami' : 'Contact me'}
            </a>
          </div>

          {/* Stats strip */}
          <div className="gm-stats-strip">
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
              { v: `${experience.reduce((y, e) => { const s = parseInt(e.start_date); return s < y ? s : y }, 9999)}`, label: isIT ? 'inizio carriera' : 'career start' },
              { v: `${skills.hard.length + skills.tools.length}`, label: isIT ? 'skill tech' : 'tech skills' },
              { v: `${education.length}`, label: isIT ? 'titoli' : 'degrees' },
            ].slice(0, 4).map(({ v, label }) => (
              <div key={label} className="gm-stat">
                <p style={{ fontSize: 26, fontWeight: 700, color: white, margin: '0 0 4px', lineHeight: 1 }}>{v}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', margin: 0 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" style={{ padding: '96px 0', background: lightBg }}>
        <div
          ref={aboutIn.ref}
          className="gm-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: aboutIn.inView ? 1 : 0, transform: aboutIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 32px' }}>
            {isIT ? 'Profilo' : 'Profile'}
          </p>
          <div className="gm-about-grid">
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: ink, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
                {isIT ? <>Chi sono.<br /><span style={{ color: accent }}>In breve.</span></> : <>About me.<br /><span style={{ color: accent }}>In short.</span></>}
              </h2>
              <p style={{ fontSize: 15, color: sub, lineHeight: 1.85, fontWeight: 300 }}>{p.bio}</p>
            </div>
            <div style={{ background: greenBg, border: `1px solid ${border}`, borderRadius: 12, padding: '28px' }}>
              {([
                ...(p.location        ? [['📍', p.location]]                                                                 : []),
                ...(experience.length ? [['🏢', `${experience[0].role} · ${experience[0].company}`]]                        : []),
                ...(education.length  ? [['🎓', `${education[0].degree} · ${education[0].institution}`]]                    : []),
                ['✉', p.email_obfuscated],
                ...(p.social_links.linkedin ? [['🔗', p.social_links.linkedin.replace('https://', '')]] : []),
              ] as [string, string][]).map(([icon, val], i) => (
                icon === '🔗' ? (
                  <a key={i} href={p.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${border}`, textDecoration: 'none' }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: accent }}>LinkedIn →</span>
                  </a>
                ) : (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 0', borderBottom: `1px solid ${border}` }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: sub }}>{val}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" style={{ padding: '96px 0', background: '#ffffff' }}>
        <div
          ref={expIn.ref}
          className="gm-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: expIn.inView ? 1 : 0, transform: expIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            {isIT ? 'Esperienza' : 'Experience'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: ink, lineHeight: 1.15, margin: '0 0 48px', letterSpacing: '-0.02em' }}>
            {isIT ? <>Dove sono stato.<br /><span style={{ color: accent }}>Cosa ho costruito.</span></> : <>Where I&apos;ve been.<br /><span style={{ color: accent }}>What I&apos;ve built.</span></>}
          </h2>
          {experience.map((exp, i) => (
            <div key={i} className="gm-exp-row">
              <div>
                <p style={{ fontSize: 12, fontWeight: 600, color: accent, margin: '0 0 4px', fontFamily: 'monospace' }}>{exp.start_date} – {exp.end_date}</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: ink, margin: '0 0 2px' }}>{exp.company}</p>
                <p style={{ fontSize: 12, color: muted, margin: '0 0 8px' }}>{exp.location ?? ''}</p>
                {exp.end_date === 'present' && (
                  <span style={{ fontSize: 10, fontWeight: 700, background: accent, color: white, borderRadius: 4, padding: '2px 7px' }}>
                    {isIT ? 'Ora' : 'Now'}
                  </span>
                )}
              </div>
              <div>
                <p style={{ fontSize: 16, fontWeight: 600, color: ink, margin: '0 0 12px' }}>{exp.role}</p>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {exp.description.map((pt, j) => (
                    <li key={j} style={{ display: 'flex', gap: 10, marginBottom: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: accent, flexShrink: 0, marginTop: 3, fontSize: 12 }}>›</span>
                      <span style={{ fontSize: 14, color: sub, lineHeight: 1.7 }}>{pt}</span>
                    </li>
                  ))}
                </ul>
                {exp.technologies.length > 0 && (
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 12 }}>
                    {exp.technologies.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: aFaint, border: `1px solid ${aBorder}`, borderRadius: 4, color: accent, fontWeight: 500 }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── SKILLS + EDUCATION ── */}
      <section id="skills" style={{ padding: '96px 0', background: lightBg }}>
        <div
          ref={skillsIn.ref}
          className="gm-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: skillsIn.inView ? 1 : 0, transform: skillsIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
            {isIT ? 'Competenze' : 'Skills'}
          </p>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 700, color: ink, margin: '0 0 40px', letterSpacing: '-0.02em' }}>
            {isIT ? 'Il toolkit.' : 'The toolkit.'}
          </h2>
          <div className="gm-skills-grid">
            {skillGroups.map(({ label, items }) => (
              <div key={label} style={{ background: greenBg, border: `1px solid ${border}`, borderRadius: 10, padding: '20px' }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: accent, letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 12px' }}>{label}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {items.map(item => (
                    <span key={item} style={{ fontSize: 12, padding: '4px 10px', background: aFaint, border: `1px solid ${aBorder}`, borderRadius: 99, color: accent, fontWeight: 500 }}>{item}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {education.length > 0 && (
            <div className="gm-edu-grid">
              {education.map((ed, i) => (
                <div key={i} style={{ background: '#ffffff', border: `1px solid ${border}`, borderRadius: 10, padding: '20px 24px' }}>
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
                <span key={i} style={{ fontSize: 12, color: sub, background: '#ffffff', border: `1px solid ${border}`, borderRadius: 6, padding: '6px 12px' }}>
                  {cert.name} · {cert.issuer} · {cert.year}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      {projects.length > 0 && (
        <section style={{ padding: '96px 0', background: '#ffffff' }}>
          <div className="gm-container">
            <p style={{ fontSize: 11, fontWeight: 600, color: accent, letterSpacing: '0.2em', textTransform: 'uppercase', margin: '0 0 16px' }}>
              {isIT ? 'Progetti' : 'Projects'}
            </p>
            <div className="gm-proj-grid">
              {projects.map((proj, i) => (
                <div key={i} style={{ border: `1px solid ${border}`, borderRadius: 10, padding: '24px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}50`}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = border}
                >
                  <p style={{ fontSize: 15, fontWeight: 600, color: ink, margin: '0 0 8px' }}>{proj.title}</p>
                  <p style={{ fontSize: 13, color: sub, lineHeight: 1.7, margin: '0 0 14px' }}>{proj.description}</p>
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
      <section id="contact" style={{ padding: '96px 0', background: darkBg, textAlign: 'center' }}>
        <div
          ref={contactIn.ref}
          style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px', transition: 'opacity 0.7s, transform 0.7s', opacity: contactIn.inView ? 1 : 0, transform: contactIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 700, color: white, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {isIT ? <>Parliamo.<br /><span style={{ color: accent }}>Sono disponibile.</span></> : <>Let&apos;s talk.<br /><span style={{ color: accent }}>I&apos;m available.</span></>}
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', margin: '0 0 48px', lineHeight: 1.75, fontWeight: 300 }}>
            {isIT ? 'Aperto a nuove opportunità e collaborazioni.' : 'Open to new opportunities and collaborations.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <span style={{ padding: '13px 26px', background: accent, color: white, fontWeight: 600, fontSize: 14, borderRadius: 8 }}>
              ✉ {p.email_obfuscated}
            </span>
            {p.social_links.linkedin && (
              <a href={p.social_links.linkedin} target="_blank" rel="noopener noreferrer"
                style={{ padding: '12px 26px', border: '1.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.55)', fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
                LinkedIn →
              </a>
            )}
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)', margin: 0 }}>
            {isIT ? 'Progettato da' : 'Designed by'}{' '}
            <Link href="/" style={{ color: accent, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
