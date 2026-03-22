'use client'

import Link from 'next/link'
import { DM_Sans, Fraunces } from 'next/font/google'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })
const fraunces = Fraunces({ subsets: ['latin'], weight: ['400', '600', '700', '900'], style: ['normal', 'italic'] })

const amber = '#c98535'
const amberLight = '#f0c97a'
const cream = '#faf8f4'
const ink = '#1c1510'
const warmGray = '#6b5a4e'
const border = '#e8ddd2'
const cardBg = '#f3ede4'
const darkBg = '#1a120a'

const experience = [
  {
    period: '2021 → Present',
    role: 'Head of People & Culture',
    company: 'Arca Systems',
    location: 'Milan, Italy',
    type: 'Tech Scale-up · 250 employees',
    points: [
      'Built the People function from scratch during a Series B growth phase — scaling from 80 to 250 employees in 30 months.',
      'Designed and rolled out a company-wide performance review framework, cutting manager preparation time by 40%.',
      'Led cultural integration after acquisition of two smaller teams; employee NPS rose from 32 to 61 within 18 months.',
      'Introduced a structured L&D programme with 12 internal mentoring pairs and a €150k annual training budget.',
    ],
  },
  {
    period: '2017 – 2021',
    role: 'Head of HR',
    company: 'Vela Digital',
    location: 'Milan / Remote',
    type: 'Digital Agency · 65 employees',
    points: [
      'Took full ownership of HR as first dedicated hire — built all processes, templates, and onboarding from zero.',
      'Reduced time-to-hire from 47 days to 22 days by restructuring the recruitment pipeline and introducing structured interviews.',
      'Managed remote transition during 2020 — retained 96% of staff, highest in peer group of comparable agencies.',
      'Negotiated new employment contracts and benefits package, saving €38k annually while increasing perceived value.',
    ],
  },
  {
    period: '2014 – 2017',
    role: 'HR Manager',
    company: 'Nexo Group',
    location: 'Turin, Italy',
    type: 'Manufacturing · 800 employees',
    points: [
      'Promoted from HR Generalist after 18 months; took over a team of 3 HR coordinators.',
      'Managed full employee lifecycle for two production sites — recruitment, contracts, disciplinary, offboarding.',
      'Implemented HRIS (Zucchetti) across both sites, digitising a 100% paper-based process.',
    ],
  },
  {
    period: '2012 – 2014',
    role: 'HR Coordinator',
    company: 'Nexo Group',
    location: 'Turin, Italy',
    type: 'Manufacturing · 800 employees',
    points: [
      'First role after graduation. Covered administrative HR, payroll coordination, and recruitment support.',
      'Organised the company\'s first employer branding initiative at two local universities.',
    ],
  },
]

const skills = [
  { label: 'Talent Acquisition', level: 95 },
  { label: 'People Strategy', level: 92 },
  { label: 'L&D & Training Design', level: 88 },
  { label: 'Performance Management', level: 90 },
  { label: 'Employee Relations', level: 94 },
  { label: 'HR Systems (HRIS)', level: 80 },
  { label: 'Culture & Engagement', level: 96 },
  { label: 'Change Management', level: 85 },
]

export default function GammaPage() {
  return (
    <div className={dmSans.className} style={{ background: darkBg, minHeight: '100vh' }}>
      <style>{`
        html { scroll-behavior: smooth; }
        .amber-bar { height: 3px; background: linear-gradient(90deg, ${amber}, ${amberLight}, ${amber}); }
        @media (max-width: 900px) {
          .two-col { grid-template-columns: 1fr !important; }
          .sidebar { border-right: none !important; border-bottom: 1px solid ${border}; }
        }
      `}</style>

      {/* Top amber stripe */}
      <div className="amber-bar" />

      {/* Running header */}
      <div style={{ background: darkBg, padding: '14px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link href="/#portfolio" style={{ fontSize: 11, color: 'rgba(201,133,53,0.45)', textDecoration: 'none', letterSpacing: '0.2em', fontWeight: 600 }}>← PORTFOLIO</Link>
        <p style={{ fontSize: 11, color: 'rgba(201,133,53,0.3)', letterSpacing: '0.25em', margin: 0, fontWeight: 600 }}>PROJECT GAMMA · BEONWEB</p>
        <p style={{ fontSize: 11, color: 'rgba(201,133,53,0.3)', letterSpacing: '0.15em', margin: 0 }}>HR & People Operations</p>
      </div>

      {/* Page wrapper — cream background */}
      <div style={{ background: cream, maxWidth: 1000, margin: '0 auto', boxShadow: '0 0 80px rgba(0,0,0,0.5)' }}>

        {/* ── HERO ── */}
        <div style={{ background: `linear-gradient(135deg, ${ink} 0%, #2d1f0e 100%)`, padding: '64px 56px', position: 'relative', overflow: 'hidden' }}>
          {/* Decorative orb */}
          <div style={{ position: 'absolute', top: -60, right: -60, width: 300, height: 300, borderRadius: '50%', background: `radial-gradient(circle, ${amber}18, transparent 70%)`, pointerEvents: 'none' }} />

          <p style={{ fontSize: 11, color: amber, letterSpacing: '0.35em', fontWeight: 700, margin: '0 0 20px', textTransform: 'uppercase' }}>
            Head of People & Culture
          </p>
          <h1 className={fraunces.className} style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900, color: '#f5f0e8', lineHeight: 1, margin: '0 0 20px', letterSpacing: '-0.01em' }}>
            Giulia<br /><span style={{ color: amber }}>Ferrara</span>
          </h1>
          <div style={{ width: 60, height: 2, background: `linear-gradient(90deg, ${amber}, transparent)`, margin: '0 0 28px' }} />
          <p style={{ fontSize: 17, color: 'rgba(245,240,232,0.6)', fontWeight: 300, maxWidth: 520, lineHeight: 1.75, margin: '0 0 40px' }}>
            Building the teams and cultures that let great companies grow. Twelve years turning organisational challenges into people-first solutions — from Turin manufacturing floors to Milan tech scale-ups.
          </p>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
            {[['📍', 'Milan, Italy'], ['💼', '12 yrs experience'], ['🏢', 'Currently: Arca Systems'], ['🎓', 'MSc Work Psychology']].map(([icon, text]) => (
              <div key={text as string} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 13 }}>{icon}</span>
                <span style={{ fontSize: 13, color: 'rgba(245,240,232,0.55)', fontWeight: 400 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── TWO-COLUMN BODY ── */}
        <div className="two-col" style={{ display: 'grid', gridTemplateColumns: '260px 1fr' }}>

          {/* ── SIDEBAR ── */}
          <div className="sidebar" style={{ background: cardBg, padding: '48px 32px', borderRight: `1px solid ${border}` }}>

            {/* Contact */}
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: amber, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Contact</p>
              {[
                ['✉', 'giulia.ferrara@mail.com'],
                ['🔗', 'linkedin.com/in/giuliaferrara'],
                ['📱', '+39 335 778 4421'],
              ].map(([icon, text]) => (
                <div key={text as string} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <span style={{ fontSize: 12, marginTop: 1 }}>{icon}</span>
                  <p style={{ fontSize: 13, color: warmGray, margin: 0, lineHeight: 1.4, wordBreak: 'break-word' }}>{text}</p>
                </div>
              ))}
            </div>

            {/* Languages */}
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: amber, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Languages</p>
              {[['Italian', 'Native'], ['English', 'Fluent · C1'], ['French', 'Intermediate · B1']].map(([lang, level]) => (
                <div key={lang as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, color: ink, fontWeight: 500 }}>{lang}</span>
                  <span style={{ fontSize: 11, color: warmGray }}>{level}</span>
                </div>
              ))}
            </div>

            {/* Core Skills */}
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: amber, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Core Skills</p>
              {skills.map(({ label, level }) => (
                <div key={label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: ink }}>{label}</span>
                    <span style={{ fontSize: 11, color: amber, fontWeight: 600 }}>{level}</span>
                  </div>
                  <div style={{ height: 4, background: `${amber}20`, borderRadius: 2 }}>
                    <div style={{ width: `${level}%`, height: '100%', background: `linear-gradient(90deg, ${amber}, ${amberLight})`, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: amber, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Education</p>
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, color: ink, fontWeight: 600, margin: '0 0 2px' }}>MSc Psychology of Work & Organizations</p>
                <p style={{ fontSize: 12, color: amber, margin: '0 0 2px' }}>Università degli Studi di Milano</p>
                <p style={{ fontSize: 11, color: warmGray, margin: 0 }}>2010 – 2012 · 110/110 cum laude</p>
              </div>
              <div>
                <p style={{ fontSize: 13, color: ink, fontWeight: 600, margin: '0 0 2px' }}>BSc Psychology</p>
                <p style={{ fontSize: 12, color: amber, margin: '0 0 2px' }}>Università degli Studi di Torino</p>
                <p style={{ fontSize: 11, color: warmGray, margin: 0 }}>2007 – 2010</p>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <p style={{ fontSize: 10, fontWeight: 700, color: amber, letterSpacing: '0.25em', textTransform: 'uppercase', margin: '0 0 16px' }}>Certifications</p>
              {['SHRM-CP · 2019', 'Coaching Fundamentals (ICF) · 2020', 'Zucchetti HRIS Certified · 2015'].map(cert => (
                <div key={cert} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start' }}>
                  <span style={{ color: amber, fontSize: 10, marginTop: 3, flexShrink: 0 }}>◆</span>
                  <p style={{ fontSize: 12, color: warmGray, margin: 0, lineHeight: 1.5 }}>{cert}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── MAIN CONTENT ── */}
          <div style={{ padding: '48px 48px', background: cream }}>

            {/* About */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: amber, letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>About</p>
                <div style={{ flex: 1, height: 1, background: border }} />
              </div>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: '#3d2f24', marginBottom: 16, fontWeight: 300 }}>
                I came into HR through organisational psychology, and that lens has never left me. I believe that great People functions do not just administer — they <em style={{ color: ink }}>design</em>. They shape the conditions under which people do their best work.
              </p>
              <p style={{ fontSize: 16, lineHeight: 1.85, color: '#3d2f24', fontWeight: 300 }}>
                Over twelve years I have built HR from scratch twice, scaled a team through a Series B, navigated a full remote transition, and integrated two acquired teams. Each experience taught me that process matters less than trust — and that trust is built one conversation at a time.
              </p>
            </section>

            {/* Experience */}
            <section style={{ marginBottom: 48 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: amber, letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>Experience</p>
                <div style={{ flex: 1, height: 1, background: border }} />
              </div>

              {experience.map((exp, i) => (
                <div key={exp.role + exp.company} style={{ display: 'flex', gap: 20, marginBottom: i < experience.length - 1 ? 36 : 0 }}>
                  {/* Timeline line */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, paddingTop: 4 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: i === 0 ? amber : `${amber}55`, border: `2px solid ${amber}`, flexShrink: 0 }} />
                    {i < experience.length - 1 && (
                      <div style={{ width: 1, flex: 1, background: `${amber}30`, marginTop: 6, minHeight: 20 }} />
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: i < experience.length - 1 ? 0 : 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 4 }}>
                      <div>
                        <p className={fraunces.className} style={{ fontSize: 17, fontWeight: 700, color: ink, margin: '0 0 2px' }}>{exp.role}</p>
                        <p style={{ fontSize: 14, color: amber, fontWeight: 600, margin: '0 0 2px' }}>{exp.company}</p>
                        <p style={{ fontSize: 12, color: warmGray, margin: 0 }}>{exp.type} · {exp.location}</p>
                      </div>
                      <span style={{ fontSize: 11, color: warmGray, background: `${amber}12`, border: `1px solid ${amber}30`, borderRadius: 4, padding: '3px 8px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                        {exp.period}
                      </span>
                    </div>
                    <ul style={{ margin: '12px 0 0', paddingLeft: 0, listStyle: 'none' }}>
                      {exp.points.map((pt, j) => (
                        <li key={j} style={{ display: 'flex', gap: 10, marginBottom: 7, alignItems: 'flex-start' }}>
                          <span style={{ color: amber, fontSize: 9, marginTop: 5, flexShrink: 0 }}>▸</span>
                          <span style={{ fontSize: 14, color: '#4a3525', lineHeight: 1.65 }}>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </section>

            {/* Key achievements */}
            <section style={{ marginBottom: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <p style={{ fontSize: 10, fontWeight: 700, color: amber, letterSpacing: '0.25em', textTransform: 'uppercase', margin: 0 }}>Key Numbers</p>
                <div style={{ flex: 1, height: 1, background: border }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                {[
                  { value: '250+', label: 'Employees managed at peak' },
                  { value: '×3', label: 'Time-to-hire improvement' },
                  { value: '96%', label: 'Retention during remote pivot' },
                  { value: '61', label: 'Employee NPS (from 32)' },
                ].map(({ value, label }) => (
                  <div key={label} style={{ background: cardBg, border: `1px solid ${border}`, borderRadius: 10, padding: '20px 22px' }}>
                    <p className={fraunces.className} style={{ fontSize: 32, fontWeight: 900, color: amber, margin: '0 0 4px', lineHeight: 1 }}>{value}</p>
                    <p style={{ fontSize: 13, color: warmGray, margin: 0 }}>{label}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ── FOOTER ── */}
        <div className="amber-bar" />
        <div style={{ background: cardBg, padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${border}` }}>
          <p style={{ fontSize: 11, color: `${amber}70`, margin: 0, letterSpacing: '0.15em', fontWeight: 600 }}>GIULIA FERRARA · MILAN · 2025</p>
          <p style={{ fontSize: 13, color: warmGray, margin: 0 }}>
            Designed by <Link href="/" style={{ color: amber, textDecoration: 'none', fontWeight: 600 }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
