'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Inter } from 'next/font/google'
import type { ProfileSchema } from '@/lib/schema'

const inter = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

// ── Scroll hooks (same as delta) ──────────────────────────────────────────
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

// ── Section header (identical to delta) ──────────────────────────────────
function SectionHeader({ label, bdr, v }: { label: string; bdr: string; v: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 48 }}>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${bdr}, transparent)` }} />
      <h2 style={{ fontSize: 11, letterSpacing: '0.3em', textTransform: 'uppercase', color: v, fontWeight: 500, margin: 0 }}>{label}</h2>
      <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, transparent, ${bdr}, transparent)` }} />
    </div>
  )
}

// ── Derive years of experience from first job start ───────────────────────
function yearsOfExp(experience: ProfileSchema['experience']): string {
  if (!experience.length) return '—'
  const earliest = experience.reduce((min, e) => {
    const year = parseInt(e.start_date.slice(0, 4))
    return year < min ? year : min
  }, 9999)
  return `${new Date().getFullYear() - earliest}+`
}

// ── Main component ────────────────────────────────────────────────────────
interface Props { profile: ProfileSchema }

export default function TemplateAlpha({ profile }: Props) {
  const { personal_info: p, experience, education, skills, projects, certifications, metadata } = profile

  // ── Design tokens (same structure as delta, accent from metadata) ─────
  const accent = metadata.primary_color  // hex, e.g. "#6366f1"
  const bg    = 'oklch(0.14 0.005 270)'
  const bgAlt = 'oklch(0.18 0.005 270)'
  const card  = 'oklch(0.20 0.007 270)'
  const bdr   = 'oklch(0.28 0.007 270)'
  const fg    = 'oklch(0.95 0.01 270)'
  const mut   = 'oklch(0.60 0.01 270)'
  const v     = accent
  const vFaint  = `${accent}18`
  const vBorder = `${accent}35`

  const isIT = metadata.language === 'it'
  const initials = p.full_name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const firstName = p.full_name.split(' ')[0]
  const lastName  = p.full_name.split(' ').slice(1).join(' ')

  // ── Stats ─────────────────────────────────────────────────────────────
  const stats = [
    { value: yearsOfExp(experience), unit: isIT ? ' anni' : ' yrs', label: isIT ? 'di esperienza' : 'of experience' },
    ...((() => {
      const uniqueCo = new Set(experience.map(e => e.company)).size
      const roles = experience.length
      if (roles > uniqueCo) {
        return [
          { value: `${uniqueCo}`, unit: '', label: isIT ? 'aziende' : 'companies' },
          { value: `${roles}`,    unit: '', label: isIT ? 'ruoli ricoperti' : 'roles held' },
        ]
      }
      return [{ value: `${uniqueCo}`, unit: '', label: isIT ? 'aziende' : 'companies' }]
    })()),
    { value: `${skills.hard.length + skills.tools.length}`, unit: '', label: isIT ? 'competenze tech' : 'tech skills' },
    { value: `${projects.length || education.length}`, unit: '', label: projects.length ? (isIT ? 'progetti' : 'projects') : (isIT ? 'titoli' : 'degrees') },
  ]

  // ── Skill groups from schema ───────────────────────────────────────────
  const skillGroups = [
    ...(skills.hard.length ? [{ label: isIT ? 'Hard Skills' : 'Hard Skills', items: skills.hard }] : []),
    ...(skills.tools.length ? [{ label: 'Tools', items: skills.tools }] : []),
    ...(skills.soft.length ? [{ label: isIT ? 'Soft Skills' : 'Soft Skills', items: skills.soft }] : []),
  ]

  // ── Nav links ─────────────────────────────────────────────────────────
  const navLinks: [string, string][] = [
    ['#about', isIT ? 'Profilo' : 'Profile'],
    ['#experience', isIT ? 'Esperienza' : 'Experience'],
    ['#skills', isIT ? 'Competenze' : 'Skills'],
    ['#contact', isIT ? 'Contatti' : 'Contact'],
  ]

  // ── Info rows for about card ──────────────────────────────────────────
  const infoRows: [string, string][] = [
    ...(p.location ? [['📍', p.location] as [string, string]] : []),
    ...(experience.length ? [['🏢', `${experience[0].role} · ${experience[0].company}`] as [string, string]] : []),
    ...(education.length ? [['🎓', `${education[0].degree} · ${education[0].institution}`] as [string, string]] : []),
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

        .exp-item {
          position: relative; padding-left: 32px;
          border-left: 2px solid ${bdr};
          padding-bottom: 48px;
          transition: border-color 0.2s;
        }
        .exp-item:last-child { padding-bottom: 0; }
        .exp-item:hover { border-left-color: ${accent}80; }
        .exp-dot {
          position: absolute; left: -9px; top: 4px;
          width: 16px; height: 16px; border-radius: 50%;
          background: ${bg}; border: 2px solid ${v};
          display: flex; align-items: center; justify-content: center;
        }
        .exp-dot-inner { width: 6px; height: 6px; border-radius: 50%; background: ${v}; }

        .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
        .edu-grid    { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }
        .about-grid  { display: grid; grid-template-columns: 1fr 320px; gap: 64px; align-items: start; }
        .stats-row   { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; }
        .proj-grid   { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

        @media (max-width: 900px) {
          .about-grid  { grid-template-columns: 1fr !important; gap: 40px !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .edu-grid    { grid-template-columns: 1fr !important; }
          .stats-row   { grid-template-columns: repeat(2, 1fr) !important; }
          .proj-grid   { grid-template-columns: 1fr !important; }
        }
        .lr-back-mobile { display: none; font-size: 13px; color: ${mut}; text-decoration: none; font-weight: 500; }
        .lr-back-mobile:hover { color: ${fg}; }

        @media (max-width: 600px) {
          .lr-nav-links { display: none; }
          .lr-back-mobile { display: block; }
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
          <a href="#top" style={{ fontSize: 16, fontWeight: 700, color: fg, textDecoration: 'none', letterSpacing: '0.04em' }}>{initials}</a>
          <div className="lr-nav-links">
            {navLinks.map(([href, label]) => (
              <a key={href} href={href} className="lr-nav-link">{label}</a>
            ))}
          </div>
          <a href="#contact" className="lr-nav-cta">{isIT ? 'Scrivimi' : 'Get in touch'}</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section id="top" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', paddingTop: 64, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '20%', right: '10%', width: 500, height: 500, borderRadius: '50%', background: `${accent}10`, filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '5%', width: 300, height: 300, borderRadius: '50%', background: `${accent}07`, filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div
          ref={heroIn.ref}
          className="lr-container"
          style={{ padding: '80px 24px 96px', width: '100%', textAlign: 'center', transition: 'opacity 0.8s, transform 0.8s', opacity: heroIn.inView ? 1 : 0, transform: heroIn.inView ? 'translateY(0)' : 'translateY(32px)' }}
        >
          <p style={{ fontSize: 12, fontWeight: 600, color: v, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 20px', opacity: 0.85 }}>
            {p.title}{p.location ? ` · ${p.location}` : ''}
          </p>

          <h1 className="lr-hero-h1" style={{ fontSize: 'clamp(3.5rem, 9vw, 7rem)', fontWeight: 700, color: fg, lineHeight: 0.92, margin: '0 0 36px', letterSpacing: '-0.03em', whiteSpace: 'nowrap' }}>
            {firstName} <span style={{ color: v }}>{lastName}</span>
          </h1>

          <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.12rem)', color: mut, maxWidth: 700, lineHeight: 1.8, margin: '0 auto 48px', fontWeight: 300 }}>
            {p.bio}
          </p>

          <div className="hero-ctas" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 80, justifyContent: 'center' }}>
            <a href="#experience" style={{ padding: '12px 26px', background: v, color: bg, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              {isIT ? 'Vedi il percorso' : 'View career'}
            </a>
            <a href="#contact" style={{ padding: '11px 26px', border: `1.5px solid ${bdr}`, color: mut, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
              {isIT ? 'Contattami' : 'Contact me'}
            </a>
          </div>

          {/* Stats row */}
          <div className="stats-row" style={{ border: `1px solid ${bdr}`, borderRadius: 12, overflow: 'hidden' }}>
            {stats.slice(0, 4).map(({ value, unit, label }, i, arr) => (
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
          <SectionHeader label={isIT ? 'Profilo' : 'Profile'} bdr={bdr} v={v} />
          <div className="about-grid">
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.6rem)', fontWeight: 700, color: fg, lineHeight: 1.15, margin: '0 0 28px', letterSpacing: '-0.02em' }}>
                {isIT ? <>Chi sono.<br /><span style={{ color: v }}>In breve.</span></> : <>About me.<br /><span style={{ color: v }}>In short.</span></>}
              </h2>
              <p style={{ fontSize: 15, color: mut, lineHeight: 1.85, fontWeight: 300 }}>{p.bio}</p>
            </div>
            <div>
              <div style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 12, padding: '8px 0', marginBottom: 20 }}>
                {infoRows.map(([icon, val], i, arr) => (
                  <div key={val} style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '13px 20px', borderBottom: i < arr.length - 1 ? `1px solid ${bdr}` : 'none' }}>
                    <span style={{ fontSize: 14, width: 20, textAlign: 'center', flexShrink: 0 }}>{icon}</span>
                    <span style={{ fontSize: 13, color: mut }}>{val}</span>
                  </div>
                ))}
              </div>
              {(p.social_links.github || p.social_links.portfolio || p.social_links.twitter) && (
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {p.social_links.github && (
                    <a href={p.social_links.github} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 500, color: v, background: vFaint, border: `1px solid ${vBorder}`, borderRadius: 4, padding: '4px 10px', textDecoration: 'none' }}>GitHub →</a>
                  )}
                  {p.social_links.portfolio && (
                    <a href={p.social_links.portfolio} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 500, color: v, background: vFaint, border: `1px solid ${vBorder}`, borderRadius: 4, padding: '4px 10px', textDecoration: 'none' }}>Portfolio →</a>
                  )}
                </div>
              )}
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
          <SectionHeader label={isIT ? 'Esperienza' : 'Experience'} bdr={bdr} v={v} />
          <h3 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, color: fg, lineHeight: 1.15, margin: '0 0 56px', letterSpacing: '-0.02em' }}>
            {isIT ? <>Dove sono stato.<br /><span style={{ color: v }}>Cosa ho costruito.</span></> : <>Where I&apos;ve been.<br /><span style={{ color: v }}>What I&apos;ve built.</span></>}
          </h3>
          <div>
            {experience.map((exp, i) => {
              const isCurrent = exp.end_date === 'present'
              return (
                <div key={i} className="exp-item">
                  <div className="exp-dot"><div className="exp-dot-inner" /></div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
                        <h4 style={{ fontSize: 18, fontWeight: 600, color: fg, margin: 0, letterSpacing: '-0.01em' }}>{exp.company}</h4>
                        {isCurrent && <span style={{ fontSize: 10, fontWeight: 700, background: v, color: bg, borderRadius: 4, padding: '2px 7px' }}>{isIT ? 'Ora' : 'Now'}</span>}
                      </div>
                      <p style={{ fontSize: 14, fontWeight: 500, color: v, margin: '0 0 4px' }}>{exp.role}</p>
                      <p style={{ fontSize: 12, color: mut, margin: 0 }}>{exp.location ?? ''}{exp.technologies.length ? ` · ${exp.technologies.slice(0, 3).join(', ')}` : ''}</p>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: mut, fontFamily: 'monospace', background: card, border: `1px solid ${bdr}`, borderRadius: 4, padding: '3px 9px', whiteSpace: 'nowrap' }}>{exp.start_date} – {exp.end_date}</span>
                  </div>
                  <ul style={{ margin: '12px 0 0', padding: 0, listStyle: 'none' }}>
                    {exp.description.map((pt, j) => (
                      <li key={j} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                        <span style={{ fontSize: 12, color: v, marginTop: 3, flexShrink: 0 }}>›</span>
                        <span style={{ fontSize: 14, color: mut, lineHeight: 1.7 }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── SKILLS + EDUCATION + CERTS ── */}
      <section id="skills" style={{ padding: '96px 0', background: bgAlt }}>
        <div
          ref={skillsIn.ref}
          className="lr-container"
          style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: skillsIn.inView ? 1 : 0, transform: skillsIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <SectionHeader label={isIT ? 'Competenze' : 'Skills'} bdr={bdr} v={v} />
          <h3 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, color: fg, lineHeight: 1.15, margin: '0 0 48px', letterSpacing: '-0.02em' }}>
            {isIT ? 'Il toolkit.' : 'The toolkit.'}
          </h3>
          <div className="skills-grid">
            {skillGroups.map(({ label, items }) => (
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
          {education.length > 0 && (
            <div style={{ marginTop: 40 }}>
              <div className="edu-grid">
                {education.map((ed, i) => (
                  <div key={i} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 10, padding: '20px 24px' }}>
                    <p style={{ fontSize: 14, fontWeight: 600, color: fg, margin: '0 0 4px' }}>{ed.degree}{ed.field ? ` — ${ed.field}` : ''}</p>
                    <p style={{ fontSize: 13, color: v, margin: '0 0 4px', fontWeight: 500 }}>{ed.institution}</p>
                    <p style={{ fontSize: 12, color: mut, margin: 0 }}>{ed.start_year} – {ed.end_year}{ed.grade ? ` · ${ed.grade}` : ''}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {certifications.map((cert, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: card, border: `1px solid ${bdr}`, borderRadius: 6 }}>
                  <span style={{ fontSize: 10, color: v }}>●</span>
                  <span style={{ fontSize: 12, color: mut }}>{cert.name} · {cert.issuer} · {cert.year}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── PROJECTS (if any) ── */}
      {projects.length > 0 && (
        <section style={{ padding: '96px 0' }}>
          <div className="lr-container">
            <SectionHeader label={isIT ? 'Progetti' : 'Projects'} bdr={bdr} v={v} />
            <h3 style={{ fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)', fontWeight: 700, color: fg, lineHeight: 1.15, margin: '0 0 48px', letterSpacing: '-0.02em' }}>
              {isIT ? 'Side projects.' : 'Side projects.'}
            </h3>
            <div className="proj-grid">
              {projects.map((proj, i) => (
                <div key={i} style={{ background: card, border: `1px solid ${bdr}`, borderRadius: 10, padding: '24px', transition: 'border-color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${accent}50`}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = bdr}
                >
                  <p style={{ fontSize: 15, fontWeight: 600, color: fg, margin: '0 0 8px' }}>{proj.title}</p>
                  <p style={{ fontSize: 13, color: mut, lineHeight: 1.7, margin: '0 0 14px' }}>{proj.description}</p>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: proj.url ? 12 : 0 }}>
                    {proj.tags.map(t => (
                      <span key={t} style={{ fontSize: 11, padding: '3px 8px', background: vFaint, border: `1px solid ${vBorder}`, borderRadius: 4, color: v }}>{t}</span>
                    ))}
                  </div>
                  {proj.url && (
                    <a href={proj.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: v, textDecoration: 'none', fontWeight: 500 }}>
                      {isIT ? 'Vedi progetto →' : 'View project →'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONTACT ── */}
      <section id="contact" style={{ padding: '96px 0', background: bgAlt, textAlign: 'center' }}>
        <div
          ref={contactIn.ref}
          style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px', transition: 'opacity 0.7s, transform 0.7s', opacity: contactIn.inView ? 1 : 0, transform: contactIn.inView ? 'translateY(0)' : 'translateY(28px)' }}
        >
          <SectionHeader label={isIT ? 'Contatti' : 'Contact'} bdr={bdr} v={v} />
          <h2 style={{ fontSize: 'clamp(2rem, 4.5vw, 3.2rem)', fontWeight: 700, color: fg, lineHeight: 1.1, margin: '0 0 16px', letterSpacing: '-0.02em' }}>
            {isIT ? <>Parliamo.<br /><span style={{ color: v }}>Sono disponibile.</span></> : <>Let&apos;s talk.<br /><span style={{ color: v }}>I&apos;m available.</span></>}
          </h2>
          <p style={{ fontSize: 15, color: mut, margin: '0 0 48px', lineHeight: 1.75, fontWeight: 300 }}>
            {isIT ? 'Aperto a nuove opportunità e collaborazioni.' : 'Open to new opportunities and collaborations.'}
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 56 }}>
            <span style={{ padding: '13px 26px', background: v, color: bg, fontWeight: 600, fontSize: 14, borderRadius: 8 }}>
              ✉ {p.email_obfuscated}
            </span>
            {p.social_links.linkedin && (
              <a href={p.social_links.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: '12px 26px', border: `1.5px solid ${bdr}`, color: mut, fontWeight: 600, fontSize: 14, borderRadius: 8, textDecoration: 'none' }}>
                LinkedIn →
              </a>
            )}
          </div>
          <div style={{ borderTop: `1px solid ${bdr}`, paddingTop: 28 }}>
            <p style={{ fontSize: 12, color: mut, margin: '0 0 4px', opacity: 0.5 }}>© {new Date().getFullYear()} {p.full_name}</p>
            <p style={{ fontSize: 12, color: mut, margin: 0, opacity: 0.5 }}>
              {isIT ? 'Progettato da' : 'Designed by'}{' '}
              <Link href="/" style={{ color: v, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
