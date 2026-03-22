import Link from 'next/link'
import { Bangers, Rajdhani } from 'next/font/google'
import type { Metadata } from 'next'

const bangers = Bangers({ subsets: ['latin'], weight: ['400'] })
const rajdhani = Rajdhani({ subsets: ['latin'], weight: ['400', '500', '600', '700'] })

export const metadata: Metadata = { title: 'Son Goku — BeOnWeb Showcase' }

export default function SonGokuPage() {
  const orange = '#ea580c'
  const blue = '#1d4ed8'
  const yellow = '#fbbf24'

  return (
    <div className={rajdhani.className} style={{ minHeight: '100vh', background: '#0f0a1e', color: '#e2e8f0', overflow: 'hidden' }}>
      {/* Energy burst background effects */}
      <div style={{ position: 'fixed', inset: 0, background: `radial-gradient(ellipse at 20% 50%, ${orange}18, transparent 50%), radial-gradient(ellipse at 80% 20%, ${blue}18, transparent 50%)`, pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '40px 24px 80px' }}>
        <Link href="/showcase" style={{ fontSize: 13, color: '#6b7280', textDecoration: 'none', letterSpacing: '0.1em' }}>
          ← SHOWCASE
        </Link>

        {/* EXPLOSIVE HEADER */}
        <div style={{ position: 'relative', margin: '32px 0 40px', padding: '40px 32px', background: `linear-gradient(135deg, ${orange}20, transparent 50%, ${blue}20)`, border: `2px solid ${orange}60`, borderRadius: 4 }}>
          {/* Speed lines */}
          <div style={{ position: 'absolute', inset: 0, background: `repeating-linear-gradient(85deg, transparent, transparent 40px, ${orange}06 40px, ${orange}06 42px)`, pointerEvents: 'none', borderRadius: 4 }} />
          <div style={{ position: 'relative' }}>
            <p className={bangers.className} style={{ fontSize: 13, letterSpacing: '0.5em', color: orange, margin: '0 0 8px' }}>
              Z FIGHTER · EARTH'S DEFENDER · SAIYAN WARRIOR
            </p>
            <h1 className={bangers.className} style={{ fontSize: 'clamp(4rem, 12vw, 8rem)', margin: 0, lineHeight: 0.9, letterSpacing: '0.05em' }}>
              <span style={{ color: orange }}>SON</span>{' '}
              <span style={{ color: '#ffffff', WebkitTextStroke: `2px ${orange}` }}>GOKU</span>
            </h1>
            <p className={bangers.className} style={{ fontSize: 18, color: yellow, letterSpacing: '0.2em', margin: '8px 0 0' }}>
              カカロット / Kakarrot
            </p>
          </div>
        </div>

        {/* Power level banner */}
        <div style={{ background: `linear-gradient(90deg, ${orange}, #f97316, ${yellow})`, padding: '12px 24px', borderRadius: 4, marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className={bangers.className} style={{ fontSize: 18, color: '#1a0a00', letterSpacing: '0.15em' }}>POWER LEVEL</span>
          <span className={bangers.className} style={{ fontSize: 24, color: '#1a0a00' }}>∞ (Ultra Instinct)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 28 }}>
          {/* Identity */}
          <div style={{ background: 'rgba(234,88,12,0.08)', border: `1px solid ${orange}40`, borderRadius: 4, padding: 24 }}>
            <h2 className={bangers.className} style={{ fontSize: 22, color: orange, marginBottom: 16, letterSpacing: '0.1em' }}>
              IDENTITY
            </h2>
            {[
              ['Birth Name', 'Kakarrot'],
              ['Given Name', 'Son Goku (孫悟空)'],
              ['Race', 'Saiyan (raised on Earth)'],
              ['Born', 'Age 736, Planet Vegeta'],
              ['Height', '175 cm'],
              ['Wife', 'Chi-Chi'],
              ['Sons', 'Gohan, Goten'],
              ['Trainer', 'Master Roshi, King Kai'],
            ].map(([k, v]) => (
              <div key={k} style={{ padding: '6px 0', borderBottom: `1px solid ${orange}15` }}>
                <span style={{ fontSize: 11, color: orange, fontWeight: 700, display: 'block', letterSpacing: '0.1em' }}>{k}</span>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>

          {/* Transformations */}
          <div style={{ background: 'rgba(29,78,216,0.08)', border: `1px solid ${blue}40`, borderRadius: 4, padding: 24 }}>
            <h2 className={bangers.className} style={{ fontSize: 22, color: yellow, marginBottom: 16, letterSpacing: '0.1em' }}>
              TRANSFORMATIONS
            </h2>
            {[
              ['⚡', 'Base Form', 'Standard'],
              ['💛', 'Super Saiyan', 'x50 base'],
              ['🔵', 'SSB (Blue)', 'God Ki + SS'],
              ['⚪', 'Ultra Instinct Sign', 'Auto-dodge'],
              ['🌟', 'Ultra Instinct', 'Mastered'],
              ['👊', 'False SSJ', 'Partial ascension'],
            ].map(([icon, form, note]) => (
              <div key={form} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: `1px solid ${blue}15` }}>
                <span style={{ fontSize: 18 }}>{icon}</span>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: yellow }}>{form}</p>
                  <p style={{ fontSize: 11, margin: 0, color: '#6b7280' }}>{note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Battle record */}
        <div style={{ background: 'rgba(234,88,12,0.06)', border: `1px solid ${orange}30`, borderRadius: 4, padding: 28, marginBottom: 28 }}>
          <h2 className={bangers.className} style={{ fontSize: 22, color: orange, marginBottom: 20, letterSpacing: '0.1em' }}>
            BATTLE RECORD
          </h2>
          {[
            ['Age 749', 'vs. Pilaf Gang', 'WIN', 'Dragon Balls recovered. Planet saved.'],
            ['Age 761', 'vs. Raditz', 'WIN*', 'Sacrificed own life. Revived via Dragon Balls. *Assist: Piccolo.'],
            ['Age 762', 'vs. Vegeta', 'WIN', 'Saiyan invasion repelled. Vegeta retreated.'],
            ['Age 764', 'vs. Frieza', 'WIN', 'First SSJ transformation. Namek destroyed. Frieza defeated.'],
            ['Age 774', 'Cell Games', 'LOSS*', 'Sacrificed self to prevent explosion. *Gohan finished fight.'],
            ['Age 774', 'vs. Majin Buu', 'WIN', 'SSJ3 achieved. Earth restored via Dragon Balls.'],
          ].map(([date, opp, result, desc]) => (
            <div key={opp} style={{ display: 'grid', gridTemplateColumns: '90px 180px 60px 1fr', gap: 12, paddingBottom: 12, marginBottom: 12, borderBottom: `1px solid ${orange}10`, alignItems: 'start' }}>
              <span style={{ fontSize: 11, color: '#6b7280', fontWeight: 600, paddingTop: 2 }}>{date}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{opp}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: result === 'WIN' || result === 'WIN*' ? '#22c55e' : '#f87171', letterSpacing: '0.05em' }}>{result}</span>
              <span style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.5 }}>{desc}</span>
            </div>
          ))}
        </div>

        {/* Signature moves */}
        <div style={{ marginBottom: 40 }}>
          <h2 className={bangers.className} style={{ fontSize: 22, color: blue, marginBottom: 16, letterSpacing: '0.1em' }}>
            SIGNATURE TECHNIQUES
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {['Kamehameha', 'Spirit Bomb', 'Instant Transmission', 'Kaioken', 'Dragon Fist', 'Hakai (limited)', 'Ultra Instinct Dodge', 'Solar Flare'].map(move => (
              <div key={move} style={{ padding: '8px 16px', background: `${blue}15`, border: `1px solid ${blue}40`, borderRadius: 4 }}>
                <span className={bangers.className} style={{ fontSize: 15, color: yellow, letterSpacing: '0.1em' }}>{move}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div style={{ position: 'relative', padding: '24px 28px', border: `2px solid ${orange}`, borderRadius: 4 }}>
          <div style={{ position: 'absolute', top: -12, left: 20, background: '#0f0a1e', padding: '0 8px' }}>
            <span className={bangers.className} style={{ fontSize: 14, color: orange, letterSpacing: '0.2em' }}>MOTTO</span>
          </div>
          <p className={bangers.className} style={{ fontSize: 20, color: yellow, margin: 0, lineHeight: 1.5, letterSpacing: '0.05em' }}>
            &ldquo;I am the answer to all living things that cry out for peace. I am protector of the innocent. I am the light in the darkness. I am truth. Ally to good! Nightmare to you!&rdquo;
          </p>
        </div>

        <div style={{ marginTop: 48, paddingTop: 20, borderTop: `1px solid rgba(255,255,255,0.05)`, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#374151', letterSpacing: '0.1em' }}>
            DESIGNED BY <Link href="/" style={{ color: orange, textDecoration: 'none' }}>BEONWEB</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
