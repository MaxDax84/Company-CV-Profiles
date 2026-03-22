import Link from 'next/link'
import { IBM_Plex_Mono, IBM_Plex_Sans } from 'next/font/google'
import type { Metadata } from 'next'

const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500', '700'] })
const sans = IBM_Plex_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })

export const metadata: Metadata = { title: 'Walter White — GoOnWeb Showcase' }

export default function WalterWhitePage() {
  const gray = '#374151'
  const accent = '#1f2937'
  const green = '#059669'

  return (
    <div className={sans.className} style={{ minHeight: '100vh', background: '#f9fafb', color: gray }}>

      {/* Clinical header bar */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e5e7eb', padding: '12px 0' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={mono.className} style={{ fontSize: 11, color: '#9ca3af', letterSpacing: '0.1em' }}>
            ALBUQUERQUE PUBLIC SCHOOLS · FACULTY RECORD
          </span>
          <span className={mono.className} style={{ fontSize: 11, color: '#9ca3af' }}>
            REF: WW-9P-2004
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 32px 80px' }}>

        <Link href="/showcase" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none' }}>
          ← Showcase
        </Link>

        {/* Name block */}
        <div style={{ borderLeft: '4px solid #d1d5db', paddingLeft: 24, margin: '40px 0 48px' }}>
          <p className={mono.className} style={{ fontSize: 11, color: '#9ca3af', margin: '0 0 8px', letterSpacing: '0.15em' }}>
            CURRICULUM VITAE
          </p>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 700, margin: 0, color: accent, letterSpacing: '-0.02em', lineHeight: 1 }}>
            Walter Hartwell White
          </h1>
          <p style={{ margin: '12px 0 0', fontSize: 15, color: '#6b7280', fontWeight: 400 }}>
            Chemistry Teacher · Albuquerque, New Mexico
          </p>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 48 }}>

          {/* Sidebar */}
          <div>
            {/* Contact */}
            <div style={{ marginBottom: 32 }}>
              <p className={mono.className} style={{ fontSize: 10, letterSpacing: '0.15em', color: '#9ca3af', borderBottom: '1px solid #e5e7eb', paddingBottom: 8, marginBottom: 12 }}>
                CONTACT
              </p>
              {[
                ['Email', 'w.white@abq.edu'],
                ['Phone', '505-503-4455'],
                ['Location', 'Albuquerque, NM'],
                ['DOB', 'Sep 7, 1958'],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 10, color: '#9ca3af', margin: '0 0 1px', fontWeight: 600 }}>{k}</p>
                  <p style={{ fontSize: 13, color: gray, margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Education */}
            <div style={{ marginBottom: 32 }}>
              <p className={mono.className} style={{ fontSize: 10, letterSpacing: '0.15em', color: '#9ca3af', borderBottom: '1px solid #e5e7eb', paddingBottom: 8, marginBottom: 12 }}>
                EDUCATION
              </p>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: accent, margin: '0 0 2px' }}>California Institute of Technology</p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: '0 0 4px' }}>B.S. Chemistry, 1980</p>
                <p style={{ fontSize: 11, color: green, margin: 0, fontWeight: 600 }}>Summa Cum Laude</p>
              </div>
              <div style={{ marginTop: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: accent, margin: '0 0 2px' }}>California Institute of Technology</p>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Ph.D. Chemistry, 1985</p>
              </div>
            </div>

            {/* Certifications */}
            <div>
              <p className={mono.className} style={{ fontSize: 10, letterSpacing: '0.15em', color: '#9ca3af', borderBottom: '1px solid #e5e7eb', paddingBottom: 8, marginBottom: 12 }}>
                CERTIFICATIONS
              </p>
              {['New Mexico Teaching License', 'Hazardous Materials Handler', 'Lab Safety Certified', 'Nobel Prize (Physics, 1985)*'].map(c => (
                <p key={c} style={{ fontSize: 12, color: gray, margin: '0 0 6px', paddingLeft: 12, borderLeft: '2px solid #e5e7eb' }}>
                  {c}
                </p>
              ))}
              <p style={{ fontSize: 10, color: '#9ca3af', marginTop: 8 }}>*Contributed research, Gray Matter Technologies</p>
            </div>
          </div>

          {/* Main content */}
          <div>
            {/* Summary */}
            <section style={{ marginBottom: 36 }}>
              <p className={mono.className} style={{ fontSize: 10, letterSpacing: '0.15em', color: '#9ca3af', borderBottom: '1px solid #e5e7eb', paddingBottom: 8, marginBottom: 16 }}>
                PROFESSIONAL SUMMARY
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.8, color: '#4b5563', fontWeight: 300 }}>
                Dedicated chemistry educator with over 15 years of experience in secondary education.
                Co-founder of Gray Matter Technologies (1985). Experienced in organic chemistry,
                biochemistry, and laboratory safety protocols. Known for meticulous attention to precision
                and exceptionally high standards of quality in all areas of work.
              </p>
            </section>

            {/* Experience */}
            <section style={{ marginBottom: 36 }}>
              <p className={mono.className} style={{ fontSize: 10, letterSpacing: '0.15em', color: '#9ca3af', borderBottom: '1px solid #e5e7eb', paddingBottom: 8, marginBottom: 20 }}>
                PROFESSIONAL EXPERIENCE
              </p>
              {[
                {
                  dates: 'Sep 1989 – Present',
                  title: 'Chemistry Teacher',
                  org: 'J.P. Wynne High School, Albuquerque Public Schools',
                  points: [
                    'Teach AP Chemistry, standard Chemistry I & II to grades 10–12',
                    'Maintain 94% student pass rate on AP Chemistry exam (district average: 67%)',
                    'Carwash co-owner (supplemental income)',
                  ],
                },
                {
                  dates: '1984 – 1985',
                  title: 'Co-Founder & Research Lead',
                  org: 'Gray Matter Technologies, Pasadena, CA',
                  points: [
                    'Co-founded technology firm; departed prior to public offering',
                    'Published 3 peer-reviewed papers in Journal of Organic Chemistry',
                    'Contributed foundational research in proton radiation therapy',
                  ],
                },
              ].map(({ dates, title, org, points }) => (
                <div key={title} style={{ marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 2 }}>
                    <p style={{ fontWeight: 600, fontSize: 15, color: accent, margin: 0 }}>{title}</p>
                    <p className={mono.className} style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{dates}</p>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '0 0 10px' }}>{org}</p>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    {points.map(pt => (
                      <li key={pt} style={{ fontSize: 13, color: '#4b5563', lineHeight: 1.7, marginBottom: 4 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Technical skills */}
            <section>
              <p className={mono.className} style={{ fontSize: 10, letterSpacing: '0.15em', color: '#9ca3af', borderBottom: '1px solid #e5e7eb', paddingBottom: 8, marginBottom: 16 }}>
                TECHNICAL SKILLS
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {['Organic Chemistry', 'Inorganic Chemistry', 'Spectroscopy', 'Gas Chromatography', 'Lab Protocols', 'Hazmat Handling', 'Curriculum Design', 'Student Assessment'].map(skill => (
                  <span key={skill} style={{ fontSize: 12, background: '#f3f4f6', border: '1px solid #e5e7eb', borderRadius: 4, padding: '4px 10px', color: gray }}>
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div style={{ marginTop: 64, paddingTop: 24, borderTop: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className={mono.className} style={{ fontSize: 10, color: '#d1d5db' }}>
            ALBUQUERQUE PUBLIC SCHOOLS · CONFIDENTIAL DOCUMENT
          </p>
          <p style={{ fontSize: 12, color: '#9ca3af' }}>
            Designed by <Link href="/" style={{ color: gray, textDecoration: 'none', fontWeight: 600 }}>GoOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
