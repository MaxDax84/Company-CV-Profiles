import Link from 'next/link'
import { DM_Sans, DM_Mono } from 'next/font/google'
import type { Metadata } from 'next'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400', '500'] })

export const metadata: Metadata = { title: 'Elon Musk — BeOnWeb Showcase' }

export default function ElonMuskPage() {
  const blue = '#2563eb'
  const blueLight = '#3b82f6'

  return (
    <div className={dmSans.className} style={{ minHeight: '100vh', background: '#ffffff', color: '#111827' }}>

      {/* Minimal top stripe */}
      <div style={{ height: 4, background: blue }} />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '48px 40px 80px' }}>

        {/* Back */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 48 }}>
          <Link href="/showcase" style={{ fontSize: 12, color: '#9ca3af', textDecoration: 'none', letterSpacing: '0.08em' }}>
            ← Showcase
          </Link>
        </div>

        {/* Name header */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', fontWeight: 700, margin: 0, letterSpacing: '-0.03em', lineHeight: 1, color: '#111827' }}>
            Elon Musk
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 12 }}>
            <p style={{ fontSize: 16, color: blue, fontWeight: 500, margin: 0 }}>
              CEO · Entrepreneur · Engineer
            </p>
            <div style={{ height: 16, width: 1, background: '#e5e7eb' }} />
            <p style={{ fontSize: 14, color: '#9ca3af', margin: 0 }}>Pretoria, 1971 · Austin, TX</p>
          </div>
          <div style={{ marginTop: 20, height: 2, width: 60, background: blue }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 56 }}>

          {/* Left — main */}
          <div>
            {/* Summary */}
            <section style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
                Executive Summary
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.85, color: '#374151', fontWeight: 300 }}>
                Serial entrepreneur and engineer with a 30-year track record of founding, scaling, and
                disrupting industries in electric vehicles, aerospace, payments, AI, and infrastructure.
                Founded or co-founded five companies valued cumulatively above $1 trillion. Holds no
                formal engineering degree, yet has directly contributed to the engineering of Falcon 9,
                Tesla Model S, and Starlink. Named Time Person of the Year, 2021.
              </p>
            </section>

            {/* Experience */}
            <section style={{ marginBottom: 40 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 20 }}>
                Leadership Experience
              </p>
              {[
                {
                  dates: '2004 → Present',
                  title: 'CEO & Chief Designer',
                  company: 'Tesla, Inc.',
                  points: [
                    'Led EV revolution — from $0 to >$800B market cap at peak',
                    'Oversaw engineering of Model S, 3, X, Y, Cybertruck, Semi',
                    'Scaled from 0 to 1.8M vehicles/year (2023)',
                    'Built global Supercharger network: 50,000+ stations',
                  ],
                },
                {
                  dates: '2002 → Present',
                  title: 'Founder, CEO & Chief Engineer',
                  company: 'SpaceX',
                  points: [
                    'First private company to launch and recover orbital rockets',
                    'Falcon 9: 90%+ launch success rate, 250+ orbital missions',
                    'Dragon: ISS crew transport for NASA since 2020',
                    'Starlink: 5,000+ satellites, 2M+ subscribers globally',
                  ],
                },
                {
                  dates: '2015 → Present',
                  title: 'Co-Founder & CEO',
                  company: 'xAI · Grok AI Assistant',
                  points: [
                    'Founded to develop AI for scientific discovery',
                    'Grok LLM integrated into X platform',
                  ],
                },
                {
                  dates: '1999 → 2002',
                  title: 'Co-Founder',
                  company: 'PayPal (X.com)',
                  points: [
                    'Co-founded online payments platform, merged with PayPal',
                    'Sold to eBay for $1.5B in 2002',
                  ],
                },
              ].map(({ dates, title, company, points }) => (
                <div key={company} style={{ marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid #f3f4f6' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 15, color: '#111827', margin: 0 }}>{title}</p>
                      <p style={{ fontSize: 13, color: blue, margin: '2px 0 0', fontWeight: 500 }}>{company}</p>
                    </div>
                    <p className={dmMono.className} style={{ fontSize: 12, color: '#9ca3af', margin: 0, whiteSpace: 'nowrap' }}>{dates}</p>
                  </div>
                  <ul style={{ margin: '10px 0 0', paddingLeft: 18 }}>
                    {points.map(pt => (
                      <li key={pt} style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, marginBottom: 3 }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Education */}
            <section>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
                Education
              </p>
              {[
                { dates: '1997 → 2002*', inst: 'University of Pennsylvania', desc: 'B.Sc. Economics (Wharton) · B.Sc. Physics', note: '* Enrolled in Stanford PhD (Energy Physics) — withdrew after 2 days to found Zip2' },
                { dates: '1992 → 1994', inst: "Queen's University, Ontario", desc: 'Undergraduate transfer — Physics & Economics' },
              ].map(({ dates, inst, desc, note }) => (
                <div key={inst} style={{ marginBottom: 16 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 }}>{inst}</p>
                    <p className={dmMono.className} style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>{dates}</p>
                  </div>
                  <p style={{ fontSize: 13, color: '#6b7280', margin: '2px 0 0' }}>{desc}</p>
                  {note && <p style={{ fontSize: 11, color: '#9ca3af', margin: '4px 0 0', fontStyle: 'italic' }}>{note}</p>}
                </div>
              ))}
            </section>
          </div>

          {/* Right sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

            {/* Contact */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                Contact
              </p>
              {[['Email', 'elon@x.com'], ['X / Twitter', '@elonmusk'], ['Location', 'Austin, TX']].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 10, color: '#9ca3af', margin: '0 0 1px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</p>
                  <p style={{ fontSize: 13, color: '#374151', margin: 0 }}>{v}</p>
                </div>
              ))}
            </div>

            {/* Key ventures */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                Ventures
              </p>
              {[['Tesla', 'EV & Energy'], ['SpaceX', 'Aerospace'], ['X (Twitter)', 'Social Media'], ['xAI', 'Artificial Intelligence'], ['Neuralink', 'BCI / Neurology'], ['The Boring Co.', 'Infrastructure']].map(([name, sector]) => (
                <div key={name} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f9fafb' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{name}</span>
                  <span style={{ fontSize: 12, color: '#9ca3af' }}>{sector}</span>
                </div>
              ))}
            </div>

            {/* Recognition */}
            <div style={{ background: '#eff6ff', borderRadius: 8, padding: 16 }}>
              <p style={{ fontSize: 11, fontWeight: 600, color: blue, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>
                Recognition
              </p>
              {['Time Person of the Year (2021)', 'Forbes #1 Richest (2022)', 'Royal Aeronautical Society Gold Medal', 'Heinlein Prize (Space Commerce)', 'FAA Commercial Space Award'].map(a => (
                <p key={a} style={{ fontSize: 12, color: '#374151', margin: '0 0 6px', lineHeight: 1.4 }}>{a}</p>
              ))}
            </div>

            {/* Technical Skills */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12, borderBottom: '1px solid #f3f4f6', paddingBottom: 8 }}>
                Technical Skills
              </p>
              {['Rocket propulsion systems', 'Battery technology', 'Autonomous driving (FSD)', 'C++, Python (self-taught)', 'Orbital mechanics', 'AI / Machine learning'].map(s => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: blue, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#6b7280' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 64, paddingTop: 20, borderTop: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <p className={dmMono.className} style={{ fontSize: 10, color: '#e5e7eb' }}>CONFIDENTIAL</p>
          <p style={{ fontSize: 12, color: '#d1d5db' }}>
            Designed by <Link href="/" style={{ color: blue, textDecoration: 'none', fontWeight: 500 }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
