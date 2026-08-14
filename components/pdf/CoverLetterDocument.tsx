import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import type { ProfileSchema } from "@/lib/schema";

// react-pdf hyphenates long words at line-wrap points by default (splitting
// mid-word, e.g. "argu-ment"). A cover letter is prose meant to be read
// normally, not typeset copy — wrap whole words only.
Font.registerHyphenationCallback((word) => [word]);

const FALLBACK_ACCENT = "#4f46e5";

function buildStyles(accent: string) {
  return StyleSheet.create({
    page: { fontFamily: "Helvetica", fontSize: 10.5, color: "#232323", paddingTop: 26, paddingBottom: 40, paddingHorizontal: 48 },
    topBar: { position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: accent },
    name: { fontSize: 18, fontFamily: "Helvetica-Bold", color: accent, marginBottom: 3 },
    contactLine: { fontSize: 9, color: "#5a5a5a", marginBottom: 1.5 },
    date: { fontSize: 9.5, color: "#5a5a5a", marginTop: 24, marginBottom: 24 },
    paragraph: { fontSize: 10.5, lineHeight: 1.6, color: "#232323", marginBottom: 14, textAlign: "justify" },
  });
}

// Blank-line-separated paragraphs from the model's plain-text letter — kept
// as one <Text> per paragraph (not a single block) so react-pdf's automatic
// page-break logic can split between paragraphs instead of only mid-word.
function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export function CoverLetterDocument({ profile, letterText }: { profile: ProfileSchema; letterText: string }) {
  const { personal_info, metadata } = profile;
  const accent = metadata.primary_color || FALLBACK_ACCENT;
  const styles = buildStyles(accent);
  const paragraphs = splitParagraphs(letterText);

  const contactParts = [
    personal_info.email || personal_info.email_obfuscated,
    personal_info.phone || personal_info.phone_obfuscated,
    personal_info.location,
  ].filter(Boolean);

  const today = new Date().toLocaleDateString(metadata.language === "it" ? "it-IT" : "en-US", {
    day: "numeric", month: "long", year: "numeric",
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed />
        <Text style={styles.name}>{personal_info.full_name}</Text>
        <Text style={styles.contactLine}>{contactParts.join("   ")}</Text>
        <Text style={styles.date}>{today}</Text>
        {paragraphs.map((p, i) => (
          <Text key={i} style={styles.paragraph}>{p}</Text>
        ))}
      </Page>
    </Document>
  );
}
