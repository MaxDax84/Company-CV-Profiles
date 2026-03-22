import Link from 'next/link'
import { Lilita_One, Nunito } from 'next/font/google'
import type { Metadata } from 'next'

const lilita = Lilita_One({ subsets: ['latin'], weight: ['400'] })
const nunito = Nunito({ subsets: ['latin'], weight: ['400', '600', '700', '800'] })

export const metadata: Metadata = { title: 'Homer Simpson — BeOnWeb Showcase' }

export default function HomerSimpsonPage() {
  const yellow = '#fbbf24'
  const blue = '#1d4ed8'
  const orange = '#f97316'

  return (
    <div className={nunito.className} style={{ minHeight: '100vh', background: '#fef9c3', color: '#1e293b' }}>
      {/* Top bar */}
      <div style={{ background: yellow, padding: '8px 0', textAlign: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: '0.1em', color: blue }}>
          🍩 SPRINGFIELD NUCLEAR POWER PLANT · EMPLOYEE PROFILE 🍩
        </span>
      </div>

      <div style={{ maxWidth: 780, margin: '0 auto', padding: '32px 24px 64px' }}>
        <Link href="/showcase" style={{ fontSize: 13, color: blue, textDecoration: 'none', fontWeight: 700 }}>
          ← Back to Showcase
        </Link>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, margin: '32px 0 40px', background: yellow, borderRadius: 20, padding: 28, border: `4px solid ${blue}` }}>
          <div style={{ fontSize: 80, flexShrink: 0 }}>🍩</div>
          <div>
            <h1 className={lilita.className} style={{ fontSize: 'clamp(2.5rem, 7vw, 4rem)', color: blue, margin: 0, lineHeight: 1 }}>
              Homer J.<br />Simpson
            </h1>
            <p style={{ margin: '8px 0 0', fontSize: 16, fontWeight: 800, color: '#92400e' }}>
              Nuclear Safety Inspector · Sector 7-G
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#a16207' }}>
              Springfield Nuclear Power Plant · Springfield, USA
            </p>
          </div>
        </div>

        {/* Fun stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 32 }}>
          {[['🍩', 'Donuts today', '∞'], ['🍺', 'Duff beers', '∞'], ['😴', 'Naps at work', '3/day'], ['💥', 'Near meltdowns', '17']].map(([icon, label, val]) => (
            <div key={label} style={{ background: 'white', borderRadius: 16, padding: '16px 12px', textAlign: 'center', border: `2px solid ${yellow}`, boxShadow: `4px 4px 0 ${yellow}` }}>
              <div style={{ fontSize: 24 }}>{icon}</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: blue, marginTop: 4 }}>{val}</div>
              <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, fontWeight: 600 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
          {/* Personal info */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, border: `2px solid ${yellow}`, boxShadow: `4px 4px 0 ${yellow}` }}>
            <h2 className={lilita.className} style={{ fontSize: 20, color: blue, marginBottom: 16 }}>👤 Personal Info</h2>
            {[
              ['Full Name', 'Homer Jay Simpson'],
              ['Born', 'May 12, 1956'],
              ['Hometown', 'Springfield'],
              ['Hair', 'None (2 strands)'],
              ['Spouse', 'Marge Simpson'],
              ['Kids', 'Bart, Lisa, Maggie'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '6px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700, display: 'block' }}>{k}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div style={{ background: 'white', borderRadius: 20, padding: 24, border: `2px solid ${yellow}`, boxShadow: `4px 4px 0 ${yellow}` }}>
            <h2 className={lilita.className} style={{ fontSize: 20, color: blue, marginBottom: 16 }}>⭐ Skills</h2>
            {[['Eating', 99], ['Sleeping', 97], ['TV Watching', 95], ['Nuclear Safety', 8], ['Parenting', 52], ['Bowling', 63]].map(([skill, pct]) => (
              <div key={skill} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{skill}</span>
                  <span style={{ fontSize: 12, color: pct as number > 50 ? blue : orange, fontWeight: 800 }}>{pct}</span>
                </div>
                <div style={{ height: 8, background: '#f1f5f9', borderRadius: 4 }}>
                  <div style={{ width: `${pct}%`, height: '100%', background: pct as number > 50 ? blue : orange, borderRadius: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Work history */}
        <div style={{ background: 'white', borderRadius: 20, padding: 28, marginBottom: 24, border: `2px solid ${yellow}`, boxShadow: `4px 4px 0 ${yellow}` }}>
          <h2 className={lilita.className} style={{ fontSize: 20, color: blue, marginBottom: 20 }}>💼 Work History</h2>
          {[
            ['1989 → NOW', 'Nuclear Safety Inspector', 'Springfield Nuclear Power Plant', 'Sector 7-G. Responsible for preventing meltdown. Has caused 3 meltdowns. Still employed.'],
            ['Various', 'Astronaut', 'NASA', 'Went to space. Accidentally caused problems. Ate all the food in zero gravity.'],
            ['Various', 'Food Critic', 'Springfield Shopper', 'Ate every dish in Springfield. Positive reviews only. Gained 8 lbs on assignment.'],
            ['Various', 'Country Singer', 'Grand Ole Opry', 'Brief but passionate career as "Homer in the House". One hit single.'],
          ].map(([date, title, org, desc]) => (
            <div key={title} style={{ display: 'grid', gridTemplateColumns: '110px 1fr', gap: 16, paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid #f1f5f9' }}>
              <div>
                <p style={{ fontSize: 10, color: orange, fontWeight: 800, margin: '0 0 2px' }}>{date}</p>
                <p style={{ fontSize: 11, color: '#94a3b8', margin: 0, fontWeight: 700 }}>{org}</p>
              </div>
              <div>
                <p style={{ fontWeight: 800, margin: '0 0 4px', fontSize: 14, color: blue }}>{title}</p>
                <p style={{ color: '#64748b', fontSize: 13, margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quote */}
        <div style={{ background: yellow, borderRadius: 20, padding: 24, textAlign: 'center', border: `4px solid ${blue}`, boxShadow: `6px 6px 0 ${blue}` }}>
          <p className={lilita.className} style={{ fontSize: 22, color: blue, margin: 0, lineHeight: 1.5 }}>
            &ldquo;D&apos;oh!&rdquo;
          </p>
          <p style={{ fontSize: 13, color: '#92400e', marginTop: 8, fontWeight: 700 }}>— Homer J. Simpson, constantly</p>
        </div>

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <p style={{ fontSize: 12, color: '#a16207' }}>
            Designed with 🍩 by <Link href="/" style={{ color: blue, textDecoration: 'none', fontWeight: 800 }}>BeOnWeb</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
