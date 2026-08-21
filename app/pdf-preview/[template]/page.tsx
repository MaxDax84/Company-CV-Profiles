import { notFound } from "next/navigation";
import { PDF_TEMPLATES, type PdfTemplate } from "@/components/pdf/AtsResumeDocument";
import { PDF_PREVIEW_ACCENT, PDF_PREVIEW_DEMO as demo } from "@/lib/pdf-preview-demo";

// A plain HTML approximation of each PDF template, used ONLY as the source
// for the small auto-scrolling thumbnail in the PDF template picker (same
// iframe + CSS-scale-and-scroll trick as the web-template picker on
// /generate). It deliberately mirrors AtsResumeDocument's per-variant traits
// (font, section-title style, entry marker, accent handling) rather than
// rendering the real PDF — a live PDF-plugin preview would render
// inconsistently across browsers and can't be panned with CSS the way a
// plain HTML page can.
//
// Sizing is deliberately larger than a real print document's margins/type
// scale would be: this renders into a fixed 1200x1697 canvas (see
// PdfTemplateCard's SOURCE_WIDTH/HEIGHT) that gets scaled down to fit a
// thumbnail card, and a realistically-sparse A4 layout left too much blank
// canvas around and below the demo content at that size — content width and
// every font size here are scaled up (~1.3x) purely so the thumbnail reads
// as a full page, not a small block floating in white space.
interface Props {
  params: Promise<{ template: string }>;
}

export default async function PdfPreviewPage({ params }: Props) {
  const { template: raw } = await params;
  if (!PDF_TEMPLATES.some(t => t.id === raw)) notFound();
  const template = raw as PdfTemplate;

  // "ats-core" and "executive" use a fixed accent (grayscale / institutional
  // navy) rather than the CV's own color, same as AtsResumeDocument — only
  // "creative-tech" stays personalized (here: the shared demo accent).
  const accent = template === "ats-core" ? "#2b2b2b" : template === "executive" ? "#16233f" : PDF_PREVIEW_ACCENT;
  const serif = template === "executive";
  const headerFontFamily = serif ? "Georgia, 'Times New Roman', serif" : "Helvetica, Arial, sans-serif";
  const bodyFontFamily = "Helvetica, Arial, sans-serif";
  const centered = template === "executive";
  const generous = template === "executive";
  const bullet = template === "ats-core" ? "•" : template === "executive" ? "—" : "•";
  const showTags = template === "creative-tech";

  const sectionTitleStyle: React.CSSProperties =
    template === "ats-core"
      ? { color: "#232323", borderBottom: "1px solid #a3a3a3", paddingBottom: 6 }
      : template === "executive"
      ? { color: accent, borderTop: `1px solid ${accent}59`, borderBottom: `1px solid ${accent}59`, padding: "5px 0" }
      : { color: accent, letterSpacing: "0.13em", background: `${accent}1a`, padding: "8px 13px", borderRadius: 4 };

  const entryStyle: React.CSSProperties =
    template === "creative-tech" ? { paddingLeft: 18, position: "relative" } : { paddingLeft: 0 };

  return (
    <div style={{ background: "#ffffff", color: "#232323", fontFamily: bodyFontFamily, minHeight: "100%" }}>
      <div
        style={{
          background: template === "ats-core" ? "transparent" : `${accent}0f`,
          borderBottom: template === "ats-core" ? "1px solid #a3a3a3" : "none",
          padding: `${generous ? 44 : 36}px 0 28px`,
        }}
      >
        <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 60px", textAlign: centered ? "center" : "left" }}>
          <p style={{ fontFamily: headerFontFamily, fontWeight: 700, fontSize: generous ? 42 : 39, color: accent, margin: 0 }}>{demo.fullName}</p>
          <p style={{ fontFamily: headerFontFamily, fontSize: 19, color: "#4a4a4a", margin: "5px 0 13px" }}>{demo.title}</p>
          <p style={{ fontSize: 14, color: "#5a5a5a", margin: "0 0 3px" }}>{demo.contact}</p>
          <p style={{ fontSize: 14, color: accent, margin: 0, fontWeight: 700 }}>{demo.links}</p>
        </div>
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "8px 60px 78px" }}>
        <Section title="Profilo" fontFamily={headerFontFamily} sectionTitleStyle={sectionTitleStyle}>
          <p style={{ fontSize: 15, lineHeight: 1.6, margin: 0 }}>{demo.bio}</p>
        </Section>

        <Section title="Esperienza" fontFamily={headerFontFamily} sectionTitleStyle={sectionTitleStyle}>
          {demo.experience.map((exp) => (
            <div key={exp.role} style={{ ...entryStyle, marginBottom: 20 }}>
              {template === "creative-tech" && (
                <span style={{ position: "absolute", left: 0, top: 8, width: 8, height: 8, borderRadius: 999, background: accent }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 15 }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{exp.role}</p>
                {template === "creative-tech" ? (
                  <span style={{ fontSize: 13, fontWeight: 700, color: accent, background: `${accent}18`, padding: "3px 10px", borderRadius: 12 }}>{exp.dates}</span>
                ) : (
                  <span style={{ fontSize: 13.5, fontWeight: 700, color: accent }}>{exp.dates}</span>
                )}
              </div>
              <p style={{ fontSize: 15, color: "#555555", margin: "3px 0 8px" }}>{exp.company}</p>
              {exp.bullets.map((b) => (
                <p key={b} style={{ fontSize: 15, lineHeight: 1.5, margin: "0 0 4px" }}>{bullet} {b}</p>
              ))}
              {showTags ? (
                <TagRow items={exp.tech.split(", ")} accent={accent} />
              ) : (
                <p style={{ fontSize: 14, color: "#333333", margin: "5px 0 0" }}>{exp.tech}</p>
              )}
            </div>
          ))}
        </Section>

        <Section title="Istruzione" fontFamily={headerFontFamily} sectionTitleStyle={sectionTitleStyle}>
          {demo.education.map((ed) => (
            <div key={ed.degree} style={{ ...entryStyle, marginBottom: 15, position: "relative" }}>
              {template === "creative-tech" && (
                <span style={{ position: "absolute", left: 0, top: 8, width: 8, height: 8, borderRadius: 999, background: accent }} />
              )}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 15 }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{ed.degree}</p>
                <span style={{ fontSize: 13.5, fontWeight: 700, color: accent }}>{ed.dates}</span>
              </div>
              <p style={{ fontSize: 15, color: "#555555", margin: "3px 0 0" }}>{ed.school}{ed.grade ? ` — ${ed.grade}` : ""}</p>
            </div>
          ))}
        </Section>

        <Section title="Competenze" fontFamily={headerFontFamily} sectionTitleStyle={sectionTitleStyle}>
          {showTags ? (
            <TagRow items={[...demo.skills.hard.split(", "), ...demo.skills.tools.split(", ")]} accent={accent} />
          ) : (
            <>
              <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0 }}><b>Tecniche:</b> {demo.skills.hard}</p>
              <p style={{ fontSize: 15, lineHeight: 1.7, margin: 0 }}><b>Strumenti:</b> {demo.skills.tools}</p>
            </>
          )}
          <p style={{ fontSize: 15, lineHeight: 1.7, margin: showTags ? "8px 0 0" : 0 }}><b>Trasversali:</b> {demo.skills.soft}</p>
        </Section>

        <Section title="Certificazioni" fontFamily={headerFontFamily} sectionTitleStyle={sectionTitleStyle}>
          {demo.certifications.map((c) => (
            <p key={c} style={{ fontSize: 15, lineHeight: 1.7, margin: 0 }}>{c}</p>
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, fontFamily, sectionTitleStyle, children }: { title: string; fontFamily: string; sectionTitleStyle: React.CSSProperties; children: React.ReactNode }) {
  return (
    <div style={{ marginTop: 28 }}>
      <p style={{ fontFamily, fontWeight: 700, fontSize: 15, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 13, ...sectionTitleStyle }}>
        {title}
      </p>
      {children}
    </div>
  );
}

function TagRow({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 3, marginBottom: 5 }}>
      {items.map((item) => (
        <span key={item} style={{ fontSize: 13, fontWeight: 700, color: accent, background: `${accent}1a`, borderRadius: 10, padding: "4px 10px" }}>{item}</span>
      ))}
    </div>
  );
}
