import Link from 'next/link'
import { Special_Elite, Lora } from 'next/font/google'
import type { Metadata } from 'next'

const specialElite = Special_Elite({ subsets: ['latin'], weight: ['400'] })
const lora = Lora({ subsets: ['latin'], weight: ['400', '500', '600', '700'], style: ['normal', 'italic'] })

export const metadata: Metadata = { title: 'Forrest Gump — GoOnWeb Showcase' }

export default function ForrestGumpPage() {
  const brown = '#92400e'
  const tan = '#d97706'
  const cream = '#fdf3e3'
  const rust = '#b45309'

  return (
    <div className={lora.className} style={{ minHeight: '100vh', background: cream, color: '#3d2b1f' }}>
      {/* Paper texture top stripe */}
      <div style={{ height: 8, background: `repeating-linear-gradient(90deg, ${brown}, ${tan} 40px, ${brown} 80px)` }} />

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '40px 32px 80px' }}>
        <Link href="/showcase" style={{ fontSize: 13, color: '#a16207', textDecoration: 'none' }}>
          ← Showcase
        </Link>

        {/* Handwritten-style header */}
        <div style={{ textAlign: 'center', padding: '48px 0 40px' }}>
          <div className={specialElite.className} style={{ fontSize: 13, letterSpacing: '0.2em', color: rust, marginBottom: 16, textTransform: 'uppercase' }}>
            Résumé of One
          </div>
          <h1 className={specialElite.className} style={{ fontSize: 'clamp(3rem, 8vw, 5.5rem)', color: brown, margin: 0, lineHeight: 1, letterSpacing: '0.02em' }}>
            Forrest Gump
          </h1>
          <div style={{ width: 120, height: 2, background: `linear-gradient(90deg, transparent, ${tan}, transparent)`, margin: '20px auto' }} />
          <p style={{ fontSize: 16, color: rust, fontStyle: 'italic', margin: 0 }}>
            Greenbow, Alabama &mdash; Shrimpin&apos; Captain &amp; Man of the World
          </p>
        </div>

        {/* Mama said quote */}
        <div style={{ background: '#fef9c3', border: `1px solid ${tan}60`, borderRadius: 8, padding: '20px 28px', marginBottom: 40, textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontStyle: 'italic', color: brown, margin: 0, lineHeight: 1.7 }}>
            &ldquo;Mama always said life was like a box of chocolates. You never know what you&apos;re gonna get.&rdquo;
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 48 }}>
          {/* Sidebar */}
          <div>
            <div style={{ marginBottom: 28 }}>
              <p className={specialElite.className} style={{ fontSize: 12, color: rust, borderBottom: `1px solid ${tan}50`, paddingBottom: 6, marginBottom: 12, letterSpacing: '0.1em' }}>
                PERSONAL
              </p>
              {[
                ['Born', 'June 6, 1944'],
                ['Hometown', 'Greenbow, Alabama'],
                ['IQ', '75 (but who&apos;s counting)'],
                ['Best Friend', 'Bubba Blue (†)'],
                ['Son', 'Forrest Jr.'],
                ['Love', 'Jenny Curran'],
              ].map(([k, v]) => (
                <div key={k} style={{ marginBottom: 10 }}>
                  <p style={{ fontSize: 10, color: '#a16207', margin: '0 0 1px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{k}</p>
                  <p style={{ fontSize: 14, color: brown, margin: 0 }} dangerouslySetInnerHTML={{ __html: v }} />
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 28 }}>
              <p className={specialElite.className} style={{ fontSize: 12, color: rust, borderBottom: `1px solid ${tan}50`, paddingBottom: 6, marginBottom: 12, letterSpacing: '0.1em' }}>
                EDUCATION
              </p>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: brown, margin: '0 0 2px' }}>University of Alabama</p>
                <p style={{ fontSize: 12, color: '#92400e', margin: '0 0 4px' }}>Football Scholarship, 1963</p>
              </div>
              <div style={{ marginTop: 10 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: brown, margin: '0 0 2px' }}>U.S. Army</p>
                <p style={{ fontSize: 12, color: '#92400e', margin: 0 }}>Vietnam, 1967–1969</p>
              </div>
            </div>

            <div>
              <p className={specialElite.className} style={{ fontSize: 12, color: rust, borderBottom: `1px solid ${tan}50`, paddingBottom: 6, marginBottom: 12, letterSpacing: '0.1em' }}>
                AWARDS
              </p>
              {[
                '🎖️ Medal of Honor',
                '🏈 All-American (1963)',
                '🏓 Ping-Pong Champion',
                '💰 Shrimping Millionaire',
                '🏃 Cross-country Record',
              ].map(a => (
                <p key={a} style={{ fontSize: 13, color: brown, margin: '0 0 8px' }}>{a}</p>
              ))}
            </div>
          </div>

          {/* Main content */}
          <div>
            <section style={{ marginBottom: 32 }}>
              <p className={specialElite.className} style={{ fontSize: 12, color: rust, borderBottom: `1px solid ${tan}50`, paddingBottom: 6, marginBottom: 16, letterSpacing: '0.1em' }}>
                ABOUT ME
              </p>
              <p style={{ fontSize: 15, lineHeight: 1.9, color: '#5c3d2e', fontWeight: 400 }}>
                Well, I don&apos;t know if I have a lot to say about myself, but Mama always said I could do anything
                I put my mind to. I ran across the country, twice. I played ping-pong in China. I started a shrimp
                company with my friend Bubba. I met three Presidents. I was there at some of the most important
                moments in American history — I just didn&apos;t always know it at the time.
              </p>
            </section>

            <section style={{ marginBottom: 32 }}>
              <p className={specialElite.className} style={{ fontSize: 12, color: rust, borderBottom: `1px solid ${tan}50`, paddingBottom: 6, marginBottom: 16, letterSpacing: '0.1em' }}>
                EXPERIENCE
              </p>
              {[
                {
                  years: '1963–1967',
                  title: 'All-American Running Back',
                  org: 'University of Alabama Crimson Tide',
                  desc: 'Played college football on scholarship. Met President Kennedy. Scored a lot of touchdowns. Ran fast.',
                },
                {
                  years: '1967–1969',
                  title: 'U.S. Army Specialist',
                  org: 'United States Army · Vietnam',
                  desc: 'Served with distinction in Vietnam. Saved Bubba, Lieutenant Dan, and eight others under enemy fire. Awarded Medal of Honor by President Johnson.',
                },
                {
                  years: '1971–1972',
                  title: 'U.S. Ping-Pong Team',
                  org: 'International Competition · China',
                  desc: 'Part of Ping-Pong Diplomacy with China. Became national celebrity. Met President Nixon.',
                },
                {
                  years: '1975–1980',
                  title: 'Captain & Co-Owner',
                  org: 'Bubba Gump Shrimp Company · Bayou La Batre, AL',
                  desc: 'Founded shrimping company in honour of fallen friend Bubba Blue. Company grew into a multi-million dollar enterprise. I gave most of it away.',
                },
                {
                  years: '1981–1982',
                  title: 'Long-Distance Runner',
                  org: 'Self-directed · United States',
                  desc: 'Ran across America for 3 years, 2 months, 14 days, and 16 hours. No particular reason. Just felt like running.',
                },
              ].map(({ years, title, org, desc }) => (
                <div key={title} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: `1px dashed ${tan}50` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
                    <p style={{ fontWeight: 600, fontSize: 15, color: brown, margin: 0 }}>{title}</p>
                    <p className={specialElite.className} style={{ fontSize: 12, color: rust, margin: 0 }}>{years}</p>
                  </div>
                  <p style={{ fontSize: 13, color: tan, margin: '0 0 8px', fontStyle: 'italic' }}>{org}</p>
                  <p style={{ fontSize: 14, color: '#5c3d2e', margin: 0, lineHeight: 1.7 }}>{desc}</p>
                </div>
              ))}
            </section>
          </div>
        </div>

        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `2px dashed ${tan}50`, textAlign: 'center' }}>
          <p style={{ fontSize: 15, fontStyle: 'italic', color: rust, marginBottom: 8 }}>
            &ldquo;That&apos;s all I have to say about that.&rdquo;
          </p>
          <p style={{ fontSize: 12, color: '#a16207' }}>
            Designed by <Link href="/" style={{ color: brown, textDecoration: 'none', fontWeight: 600 }}>GoOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
