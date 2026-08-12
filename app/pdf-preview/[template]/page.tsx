import { notFound } from "next/navigation";
import { PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import { PDF_PREVIEW_ACCENT, PDF_PREVIEW_DEMO as demo } from "@/lib/pdf-preview-demo";

// A plain HTML approximation of each PDF template, used ONLY as the source
// for the small auto-scrolling thumbnail in the PDF template picker (same
// iframe + CSS-scale-and-scroll trick as the web-template picker on
// /generate). It deliberately mirrors AtsResumeDocument's per-variant traits
// (font, section-title style, entry marker, bullet character) rather than
// rendering the real PDF — a live PDF-plugin preview would render
// inconsistently across browsers and can't be panned with CSS the way a
// plain HTML page can.
interface Props {
  params: Promise<{ template: string }>;
}

export default async function PdfPreviewPage({ params }: Props) {
  const { template: raw } = await params;
  if (!PDF_TEMPLATES.some(t => t.id === raw)) notFound();
  const template = raw as PdfTemplate;

  const accent = PDF_PREVIEW_ACCENT;
  const serif = template === "executive";
  const fontFamily = serif ? "Georgia, 'Times New Roman', serif" : "Helvetica, Arial, sans-serif";
  const centered = template === "executive";
  const bullet = template === "classic" ? "•" : template === "modern" ? "–" : "—";

  const sectionTitleStyle: React.CSSProperties =
    template === "classic"
      ? { borderBottom: `1.5px solid ${accent}`, borderLeft: `3px solid ${accent}`, paddingLeft: 8, paddingBottom: 5 }
      : template === "modern"
      ? { letterSpacing: "0.13em", color: accent, background: `${accent}1a`, padding: "6px 10px", borderRadius: 3 }
      : { borderTop: `1px solid ${accent}59`, borderBottom: `1px solid ${accent}59`, padding: "4px 0" };

  const entryStyle: React.CSSProperties =
    template === "classic"
      ? { borderLeft: `2px solid ${accent}55`, paddingLeft: 12 }
      : template === "modern"
      ? { paddingLeft: 14, position: "relative" }
      : { paddingLeft: 0 };

  return (
    <div style={{ background: "#ffffff", color: "#232323", fontFamily, minHeight: "100%" }}>
      {template === "classic" && <div style={{ height: 6, background: accent }} />}
      <div style={{ background: `${accent}0f`, padding: `${template === "classic" ? 20 : 28}px 0 22px` }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 48px", textAlign: centered ? "center" : "left" }}>
          <p style={{ fontSize: 30, fontWeight: 700, color: template === "modern" ? "#232323" : accent, margin: 0 }}>{demo.fullName}</p>
          <p style={{ fontSize: 15, color: "#4a4a4a", margin: "4px 0 10px" }}>{demo.title}</p>
          <p style={{ fontSize: 11, color: "#5a5a5a", margin: "0 0 2px" }}>{demo.contact}</p>
          <p style={{ fontSize: 11, color: accent, margin: 0, fontWeight: 700 }}>{demo.links}</p>
        </div>
      </div>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "6px 48px 60px" }}>
        <Section title="Profilo" sectionTitleStyle={sectionTitleStyle}>
          <p style={{ fontSize: 12, lineHeight: 1.6, margin: 0 }}>{demo.bio}</p>
        </Section>

        <Section title="Esperienza" sectionTitleStyle={sectionTitleStyle}>
          {demo.experience.map((exp) => (
            <div key={exp.role} style={{ ...entryStyle, marginBottom: 16 }}>
              {template === "modern" && (
                <span style={{ position: "absolute", left: 0, top: 6, width: 6, height: 6, borderRadius: 999, background: accent }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{exp.role}</p>
                {template === "modern" ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: accent, background: `${accent}18`, padding: "2px 8px", borderRadius: 10 }}>{exp.dates}</span>
                ) : (
                  <span style={{ fontSize: 10.5, fontWeight: 700, color: accent }}>{exp.dates}</span>
                )}
              </div>
              <p style={{ fontSize: 11.5, color: "#555555", margin: "2px 0 6px" }}>{exp.company}</p>
              {exp.bullets.map((b) => (
                <p key={b} style={{ fontSize: 11.5, lineHeight: 1.5, margin: "0 0 3px" }}>{bullet} {b}</p>
              ))}
              <p style={{ fontSize: 11, color: "#333333", margin: "4px 0 0" }}>{exp.tech}</p>
            </div>
          ))}
        </Section>

        <Section title="Istruzione" sectionTitleStyle={sectionTitleStyle}>
          {demo.education.map((ed) => (
            <div key={ed.degree} style={{ ...entryStyle, marginBottom: 12, position: "relative" }}>
              {template === "modern" && (
                <span style={{ position: "absolute", left: 0, top: 6, width: 6, height: 6, borderRadius: 999, background: accent }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
                <p style={{ fontSize: 13, fontWeight: 700, margin: 0 }}>{ed.degree}</p>
                <span style={{ fontSize: 10.5, fontWeight: 700, color: accent }}>{ed.dates}</span>
              </div>
              <p style={{ fontSize: 11.5, color: "#555555", margin: "2px 0 0" }}>{ed.school}{ed.grade ? ` — ${ed.grade}` : ""}</p>
            </div>
          ))}
        </Section>

        <Section title="Competenze" sectionTitleStyle={sectionTitleStyle}>
          <p style={{ fontSize: 11.5, lineHeight: 1.7, margin: 0 }}><b>Tecniche:</b> {demo.skills.hard}</p>
          <p style={{ fontSize: 11.5, lineHeight: 1.7, margin: 0 }}><b>Strumenti:</b> {demo.skills.tools}</p>
          <p style={{ fontSize: 11.5, lineHeight: 1.7, margin: 0 }}><b>Trasversali:</b> {demo.skills.soft}</p>
        </Section>

        <Section title="Certificazioni" sectionTitleStyle={sectionTitleStyle}>
          {demo.certifications.map((c) => (
            <p key={c} style={{ fontSize: 11.5, lineHeight: 1.7, margin: 0 }}>{c}</p>
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, sectionTitleStyle, children }: { title: string; sectionTitleStyle: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 22 }}>
      <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "#232323", marginBottom: 10, ...sectionTitleStyle }}>
        {title}
      </p>
      {children}
    </div>
  );
}
