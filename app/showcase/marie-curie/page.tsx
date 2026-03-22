import Link from 'next/link'
import { Crimson_Pro, Source_Sans_3 } from 'next/font/google'
import type { Metadata } from 'next'

const crimson = Crimson_Pro({ subsets: ['latin'], weight: ['300', '400', '600', '700'], style: ['normal', 'italic'] })
const sourceSans = Source_Sans_3({ subsets: ['latin'], weight: ['300', '400', '600', '700'] })

export const metadata: Metadata = { title: 'Marie Curie — GoOnWeb Showcase' }

export default function MarieCuriePage() {
  const bordeaux = '#7c1e35'
  const bordeauxLight = '#a83252'
  const white = '#fafafa'
  const ink = '#1a1a2e'

  return (
    <div className={sourceSans.className} style={{ minHeight: '100vh', background: white, color: ink }}>

      {/* Academic header stripe */}
      <div style={{ background: bordeaux, color: white, padding: '0' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '40px 40px 36px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.35em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', margin: '0 0 12px', fontWeight: 600 }}>
                Curriculum Vitae Academici
              </p>
              <h1 className={crimson.className} style={{ fontSize: 'clamp(2.5rem, 7vw, 4.5rem)', fontWeight: 700, margin: 0, lineHeight: 1, color: white }}>
                Maria Skłodowska-Curie
              </h1>
              <p style={{ margin: '10px 0 0', fontSize: 14, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.05em' }}>
                Warsaw, 7 November 1867 &mdash; Passy, 4 July 1934
              </p>
            </div>
            <Link href="/showcase" style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', textDecoration: 'none', letterSpacing: '0.1em', marginTop: 4 }}>
              ← Showcase
            </Link>
          </div>

          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 24 }}>
            {[['Physics', 'Nobel Prize 1903'], ['Chemistry', 'Nobel Prize 1911'], ['Radioactivity', 'Field Pioneer']].map(([field, note]) => (
              <div key={field} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.15)' }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: white, margin: 0 }}>{field}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>{note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 40px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 230px', gap: 48 }}>

          {/* Main */}
          <div>
            {/* Biography */}
            <section style={{ marginBottom: 40, borderBottom: '1px solid #e8e0e4', paddingBottom: 40 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: bordeaux, textTransform: 'uppercase', fontWeight: 700, marginBottom: 14 }}>Research Profile</p>
              <p className={crimson.className} style={{ fontSize: 19, lineHeight: 1.85, color: '#3d2030', fontWeight: 300 }}>
                Pioneering physicist and chemist; the first person — and only woman to date — to win the Nobel Prize
                twice, in two distinct scientific disciplines. Conducted groundbreaking research into radioactivity,
                coined the very term. Discovered two new elements: polonium and radium. Opened the first mobile
                X-ray units in World War I. Her research fundamentally changed our understanding of atomic structure
                and founded the fields of nuclear physics and radiochemistry.
              </p>
            </section>

            {/* Positions */}
            <section style={{ marginBottom: 40, borderBottom: '1px solid #e8e0e4', paddingBottom: 40 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: bordeaux, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Academic Positions</p>
              {[
                {
                  dates: '1906–1934',
                  title: 'Professor of Physics',
                  inst: 'University of Paris (Sorbonne)',
                  note: 'First woman to hold a professorship at the Sorbonne. Succeeded her late husband Pierre Curie.',
                },
                {
                  dates: '1914–1934',
                  title: 'Director',
                  inst: 'Curie Institute (Institut du Radium), Paris',
                  note: 'Co-founded with the Pasteur Institute and University of Paris. Now a leading cancer research centre.',
                },
                {
                  dates: '1898–1906',
                  title: 'Research Scientist',
                  inst: 'School of Physics and Chemistry, Paris',
                  note: 'Conducted discovery research for polonium and radium in collaboration with Pierre Curie.',
                },
              ].map(({ dates, title, inst, note }) => (
                <div key={title} style={{ marginBottom: 22, paddingBottom: 22, borderBottom: '1px solid #f5eeef' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 2 }}>
                    <p style={{ fontWeight: 700, fontSize: 15, color: ink, margin: 0 }}>{title}</p>
                    <p style={{ fontSize: 12, color: '#9a7080', margin: 0, whiteSpace: 'nowrap' }}>{dates}</p>
                  </div>
                  <p style={{ fontSize: 13, color: bordeaux, margin: '2px 0 6px', fontWeight: 600 }}>{inst}</p>
                  <p className={crimson.className} style={{ fontSize: 16, color: '#6b4050', margin: 0, lineHeight: 1.6, fontWeight: 300 }}>{note}</p>
                </div>
              ))}
            </section>

            {/* Key discoveries */}
            <section style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: bordeaux, textTransform: 'uppercase', fontWeight: 700, marginBottom: 20 }}>Key Discoveries & Contributions</p>
              {[
                ['1898', 'Polonium', 'New radioactive element. Named after her homeland Poland. Atomic number 84.'],
                ['1898', 'Radium', 'Second new element. Isolated as pure metal in 1910. Atomic number 88.'],
                ['1898', 'Radioactivity', 'Coined the term. Established that radiation is an atomic — not chemical — phenomenon.'],
                ['1914–18', 'Mobile Radiography', 'Developed "petites Curies" — 20 mobile X-ray units used in WWI field hospitals.'],
                ['1921', 'Radium Research', 'Donated 1g radium (gift from US) to continue research. International recognition tour.'],
              ].map(([year, title, desc]) => (
                <div key={title} style={{ display: 'grid', gridTemplateColumns: '52px 1fr', gap: 16, paddingBottom: 14, marginBottom: 14, borderBottom: '1px solid #f5eeef' }}>
                  <span className={crimson.className} style={{ fontSize: 13, color: bordeaux, fontStyle: 'italic', paddingTop: 2 }}>{year}</span>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: 14, color: ink, margin: '0 0 2px' }}>{title}</p>
                    <p className={crimson.className} style={{ fontSize: 16, color: '#6b4050', margin: 0, lineHeight: 1.5, fontWeight: 300 }}>{desc}</p>
                  </div>
                </div>
              ))}
            </section>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

            {/* Education */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: bordeaux, textTransform: 'uppercase', fontWeight: 700, marginBottom: 14, borderBottom: '1px solid #e8e0e4', paddingBottom: 8 }}>Education</p>
              {[
                { inst: 'University of Paris', deg: 'Licence en Physique, 1893', note: 'First in class' },
                { inst: 'University of Paris', deg: 'Licence en Mathématiques, 1894', note: 'Second in class' },
                { inst: 'University of Paris', deg: 'Doctorate, Physics, 1903', note: 'First woman in France' },
              ].map(({ inst, deg, note }) => (
                <div key={deg} style={{ marginBottom: 14, borderBottom: '1px solid #f5eeef', paddingBottom: 14 }}>
                  <p style={{ fontSize: 13, fontWeight: 700, color: ink, margin: '0 0 2px' }}>{inst}</p>
                  <p style={{ fontSize: 12, color: '#6b4050', margin: '0 0 2px' }}>{deg}</p>
                  <p style={{ fontSize: 11, color: bordeaux, margin: 0, fontWeight: 600 }}>{note}</p>
                </div>
              ))}
            </div>

            {/* Awards */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: bordeaux, textTransform: 'uppercase', fontWeight: 700, marginBottom: 14, borderBottom: '1px solid #e8e0e4', paddingBottom: 8 }}>Honours & Awards</p>
              {[
                'Nobel Prize — Physics (1903)',
                'Nobel Prize — Chemistry (1911)',
                'Davy Medal, Royal Society (1903)',
                'Matteucci Medal (1904)',
                'Elliott Cresson Medal (1909)',
                'Franklin Medal (1921)',
                'Cameron Prize (1931)',
              ].map(a => (
                <div key={a} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <div style={{ width: 4, height: 4, background: bordeaux, borderRadius: '50%', marginTop: 5, flexShrink: 0 }} />
                  <p style={{ fontSize: 13, color: '#6b4050', margin: 0, lineHeight: 1.4 }}>{a}</p>
                </div>
              ))}
            </div>

            {/* Memberships */}
            <div style={{ background: '#fdf5f7', border: '1px solid #e8d8dc', borderRadius: 6, padding: 16 }}>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: bordeaux, textTransform: 'uppercase', fontWeight: 700, marginBottom: 12 }}>Society Memberships</p>
              {['French Academy of Medicine', 'Polish Academy of Sciences', 'Czech Academy of Sciences', 'Royal Danish Academy', 'Académie des Sciences (foreign)'].map(m => (
                <p key={m} style={{ fontSize: 12, color: '#6b4050', margin: '0 0 5px', lineHeight: 1.4 }}>{m}</p>
              ))}
            </div>

            {/* Publications note */}
            <div>
              <p style={{ fontSize: 10, letterSpacing: '0.2em', color: bordeaux, textTransform: 'uppercase', fontWeight: 700, marginBottom: 10, borderBottom: '1px solid #e8e0e4', paddingBottom: 8 }}>Publications</p>
              <p className={crimson.className} style={{ fontSize: 16, color: '#9a7080', lineHeight: 1.5, fontWeight: 300 }}>
                Over 70 peer-reviewed papers, including the foundational radioactivity papers of 1898 co-authored with Pierre Curie and G. Bémont.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: 56, paddingTop: 20, borderTop: '1px solid #e8e0e4', textAlign: 'center' }}>
          <p className={crimson.className} style={{ fontSize: 14, color: '#c8a8b0', fontStyle: 'italic' }}>
            Designed by <Link href="/" style={{ color: bordeaux, textDecoration: 'none', fontWeight: 600 }}>GoOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
