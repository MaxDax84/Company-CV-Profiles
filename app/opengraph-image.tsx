import { ImageResponse } from "next/og";

// Site-wide Open Graph / Twitter card. Next.js file convention: this route
// is what fills og:image for every page that doesn't declare its own.
//
// Colors are the brand tokens from app/globals.css, hard-coded here because
// ImageResponse renders in an isolated Satori context with no stylesheet and
// no CSS variables: Dark Navy #0b1279 (the same block colour the footer and
// the final CTA use), Electric Blue #123bff (--primary) and Lime #c7f36b
// (--accent-cyan). No custom font is loaded on purpose — shipping a .ttf
// through the edge bundle for one image is not worth it, and the default
// sans renders this cleanly.
export const alt = "Jobli: più colloqui, con il CV che hai già";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0b1279",
          // A soft Electric Blue bloom in the top-right, echoing the blurred
          // radial glow the real pages use behind their hero sections.
          backgroundImage:
            "radial-gradient(1000px 600px at 88% -12%, rgba(18,59,255,0.85) 0%, rgba(11,18,121,0) 62%)",
          padding: "72px 80px",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#c7f36b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
              color: "#0b1279",
            }}
          >
            J
          </div>
          <div style={{ fontSize: 40, fontWeight: 700, letterSpacing: -1 }}>Jobli</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              lineHeight: 1.08,
              letterSpacing: -2.5,
              maxWidth: 940,
            }}
          >
            Più colloqui, con il CV che hai già.
          </div>
          <div style={{ fontSize: 32, lineHeight: 1.35, color: "rgba(255,255,255,0.78)", maxWidth: 900 }}>
            Punteggio, ottimizzazione ATS e adattamento a ogni annuncio. Senza inventare nulla.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 12, height: 12, borderRadius: 6, background: "#c7f36b" }} />
            <div style={{ fontSize: 26, color: "rgba(255,255,255,0.72)" }}>jobli.it</div>
          </div>
          <div
            style={{
              fontSize: 24,
              fontWeight: 600,
              color: "#0b1279",
              background: "#c7f36b",
              padding: "12px 26px",
              borderRadius: 999,
            }}
          >
            3 crediti gratis
          </div>
        </div>
      </div>
    ),
    size
  );
}
