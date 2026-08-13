import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import type { ProfileSchema, ExperienceItem, EducationItem, Project } from "@/lib/schema";

// Three deliberately plain, single-column layouts — plain text flow, only
// standard PDF fonts (Helvetica/Times), no tables, no images, no multi-
// column layout. ATS parsers read this far more reliably than the colorful
// web templates. Colors/rules/markers below are purely decorative Views and
// color props — they never replace text or change reading order, so they
// don't affect ATS parsing, no matter which variant is picked.
const FALLBACK_ACCENT = "#4f46e5";

export type PdfTemplate = "classic" | "modern" | "executive";

export const PDF_TEMPLATES: { id: PdfTemplate; name: string; description: string }[] = [
  { id: "classic", name: "Classico", description: "Helvetica, barra colorata, sezioni sottolineate" },
  { id: "modern", name: "Moderno", description: "Helvetica, date in pillola, marcatori a puntino" },
  { id: "executive", name: "Executive", description: "Times, intestazione centrata, righe doppie" },
];

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace("#", "");
  const value = clean.length === 3 ? clean.split("").map(c => c + c).join("") : clean;
  const bigint = parseInt(value, 16);
  if (Number.isNaN(bigint)) return `rgba(79, 70, 229, ${alpha})`;
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

interface VariantConfig {
  fontFamily: "Helvetica" | "Times-Roman";
  fontFamilyBold: "Helvetica-Bold" | "Times-Bold";
  bullet: string;
  headerAlign: "flex-start" | "center";
  entryMarker: "border" | "dot" | "none";
  useTopBar: boolean;
  useDateChip: boolean;
  sectionTitleStyle: "underline" | "rule-both" | "spaced";
}

const VARIANTS: Record<PdfTemplate, VariantConfig> = {
  classic: {
    fontFamily: "Helvetica", fontFamilyBold: "Helvetica-Bold", bullet: "•",
    headerAlign: "flex-start", entryMarker: "border", useTopBar: true,
    useDateChip: false, sectionTitleStyle: "underline",
  },
  modern: {
    fontFamily: "Helvetica", fontFamilyBold: "Helvetica-Bold", bullet: "•",
    headerAlign: "flex-start", entryMarker: "dot", useTopBar: false,
    useDateChip: true, sectionTitleStyle: "spaced",
  },
  executive: {
    fontFamily: "Times-Roman", fontFamilyBold: "Times-Bold", bullet: "•",
    headerAlign: "center", entryMarker: "none", useTopBar: false,
    useDateChip: false, sectionTitleStyle: "rule-both",
  },
};

function buildStyles(cfg: VariantConfig, accent: string, accentSoft: string) {
  const PAGE_PADDING_H = 42;
  return StyleSheet.create({
    // Margins live on the Page itself (not a wrapping View) — react-pdf only
    // reapplies a View's own padding at the very start/end of its content, so
    // a wrapping <View> loses its top/bottom inset on every page after the
    // first once a section overflows. Page-level padding, by contrast, is
    // correctly reapplied on every auto-generated page.
    page: { fontFamily: cfg.fontFamily, fontSize: 10, color: "#232323", paddingTop: cfg.useTopBar ? 26 : 34, paddingBottom: 36, paddingHorizontal: PAGE_PADDING_H },
    // Bleeds edge-to-edge on every page regardless of the Page's own padding.
    topBar: { position: "absolute", top: 0, left: 0, right: 0, height: 6 },
    // Tinted band behind the name/title/contact block — bleeds to the page's
    // physical edges by cancelling the Page's own horizontal padding, then
    // re-applying it as the band's own padding so the text inside still
    // lines up with the rest of the page's content.
    header: {
      alignItems: cfg.headerAlign,
      backgroundColor: hexToRgba(accent, 0.06),
      marginHorizontal: -PAGE_PADDING_H,
      marginTop: cfg.useTopBar ? 0 : -10,
      paddingHorizontal: PAGE_PADDING_H,
      paddingTop: cfg.useTopBar ? 14 : 20,
      paddingBottom: 16,
      marginBottom: 6,
    },
    name: { fontSize: 23, fontFamily: cfg.fontFamilyBold, letterSpacing: 0.3, marginBottom: 3, textAlign: cfg.headerAlign === "center" ? "center" : "left" },
    title: { fontSize: 12, fontFamily: cfg.fontFamily, color: "#4a4a4a", marginBottom: 9, textAlign: cfg.headerAlign === "center" ? "center" : "left" },
    contactLine: { fontSize: 9, color: "#5a5a5a", marginBottom: 2, lineHeight: 1.5, textAlign: cfg.headerAlign === "center" ? "center" : "left" },
    section: { marginTop: 17 },
    // Each variant carries a distinct colored treatment — a left tab +
    // underline (classic), a filled band (modern), or a soft double rule
    // (executive) — rather than one shared gray-border look.
    sectionTitle: {
      fontSize: cfg.sectionTitleStyle === "spaced" ? 10 : 10.5,
      fontFamily: cfg.fontFamilyBold,
      textTransform: "uppercase",
      letterSpacing: cfg.sectionTitleStyle === "spaced" ? 1.6 : 1.3,
      color: cfg.sectionTitleStyle === "spaced" ? accent : "#232323",
      marginBottom: 9,
      ...(cfg.sectionTitleStyle === "underline" && {
        paddingBottom: 4,
        paddingLeft: 8,
        borderBottomWidth: 1.5,
        borderBottomColor: accent,
        borderLeftWidth: 3,
        borderLeftColor: accent,
      }),
      ...(cfg.sectionTitleStyle === "spaced" && {
        alignSelf: "stretch",
        backgroundColor: hexToRgba(accent, 0.1),
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 3,
      }),
      ...(cfg.sectionTitleStyle === "rule-both" && {
        paddingVertical: 3,
        borderTopWidth: 1,
        borderTopColor: accentSoft,
        borderBottomWidth: 1,
        borderBottomColor: accentSoft,
      }),
    },
    bio: { fontSize: 10, lineHeight: 1.55, color: "#333333" },
    entry: {
      marginBottom: 11,
      paddingLeft: cfg.entryMarker === "border" ? 11 : cfg.entryMarker === "dot" ? 12 : 0,
      borderLeftWidth: cfg.entryMarker === "border" ? 2.5 : 0,
      borderLeftStyle: "solid",
      borderLeftColor: accentSoft,
    },
    entryDot: { position: "absolute", left: 0, top: 3, width: 5, height: 5, borderRadius: 2.5 },
    entryHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
    entryTitle: { fontSize: 10.5, fontFamily: cfg.fontFamilyBold, color: "#232323" },
    entryDates: { fontSize: 8.5, fontFamily: cfg.fontFamilyBold, letterSpacing: 0.3 },
    entryDatesChip: { fontSize: 8, fontFamily: cfg.fontFamilyBold, letterSpacing: 0.3, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
    entrySubtitle: { fontSize: 9.5, color: "#555555", marginTop: 1, marginBottom: 5 },
    bullet: { fontSize: 9.5, lineHeight: 1.45, marginBottom: 2.5, color: "#333333" },
    // Marker and text as separate fixed-width/flex columns (not one inline
    // string) so a wrapped second line indents under the text, not back
    // under the bullet — a hanging indent, same as the entry's own
    // paddingLeft is achieved via borderLeft above. Still plain sequential
    // text in the content stream, so ATS extraction order is unaffected.
    bulletRow: { flexDirection: "row", marginBottom: 3.5 },
    bulletMarker: { width: 13, fontSize: 9.5, lineHeight: 1.45, color: accentSoft },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.45, color: "#333333" },
    skillLine: { fontSize: 9.5, lineHeight: 1.65, color: "#333333" },
    skillLabel: { fontFamily: cfg.fontFamilyBold, color: "#232323" },
    link: { textDecoration: "none", fontFamily: cfg.fontFamilyBold },
  });
}

// The extraction prompt tells Claude to use JSON null for a missing
// optional field — interpolated straight into a template literal, `null`
// stringifies to the literal text "null" rather than disappearing the way
// it would in JSX. Every date field passes through here (or formatYearRange
// below) specifically to strip that out instead of printing it.
function cleanDatePart(value: string | null | undefined): string {
  if (!value) return "";
  const trimmed = value.trim();
  return trimmed.toLowerCase() === "null" ? "" : trimmed;
}

function formatDateRange(start: string | null | undefined, end: string | null | undefined): string {
  const cleanStart = cleanDatePart(start);
  const isPresent = typeof end === "string" && end.toLowerCase() === "present";
  const cleanEnd = isPresent ? "Present" : cleanDatePart(end);
  if (cleanStart && cleanEnd) return `${cleanStart} – ${cleanEnd}`;
  return cleanStart || cleanEnd;
}

function formatYearRange(start: number | string | null | undefined, end: number | string | null | undefined): string {
  const isPresent = end === "present";
  const cleanStart = cleanDatePart(start != null ? String(start) : start);
  const cleanEnd = isPresent ? "Present" : cleanDatePart(end != null ? String(end) : end);
  if (cleanStart && cleanEnd) return `${cleanStart} – ${cleanEnd}`;
  return cleanStart || cleanEnd;
}

function DateLabel({ text, accent, cfg, styles }: { text: string; accent: string; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
  if (!text) return null;
  if (cfg.useDateChip) {
    return (
      <Text style={[styles.entryDatesChip, { color: accent, backgroundColor: hexToRgba(accent, 0.1) }]}>{text}</Text>
    );
  }
  return <Text style={[styles.entryDates, { color: accent }]}>{text}</Text>;
}

function EntryMarker({ accent, cfg, styles }: { accent: string; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
  if (cfg.entryMarker !== "dot") return null;
  return <View style={[styles.entryDot, { backgroundColor: accent }]} />;
}

function ContactLine({ profile, accent, cfg, styles }: { profile: ProfileSchema; accent: string; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
  const { email, phone, email_obfuscated, phone_obfuscated, location, social_links } = profile.personal_info;
  // Real, non-obfuscated contact info — this PDF is downloaded privately and
  // submitted directly to job applications, unlike the public web profile
  // (which stays obfuscated to deter scraping). Fall back to the obfuscated
  // fields only for profiles generated before this field existed.
  const parts: string[] = [email || email_obfuscated];
  const displayPhone = phone || phone_obfuscated;
  if (displayPhone) parts.push(displayPhone);
  if (location) parts.push(location);

  const links = [
    social_links.linkedin && { label: "LinkedIn", url: social_links.linkedin },
    social_links.github && { label: "GitHub", url: social_links.github },
    social_links.portfolio && { label: "Portfolio", url: social_links.portfolio },
    social_links.twitter && { label: "Twitter", url: social_links.twitter },
  ].filter(Boolean) as { label: string; url: string }[];

  return (
    <View>
      <Text style={styles.contactLine}>{parts.join("   ")}</Text>
      {links.length > 0 && (
        <Text style={styles.contactLine}>
          {links.map((l, i) => (
            <Text key={l.label}>
              {i > 0 && "   "}
              <Link src={l.url} style={[styles.link, { color: accent }]}>{l.label}</Link>
            </Text>
          ))}
        </Text>
      )}
    </View>
  );
}

function ExperienceEntry({ exp, accent, accentSoft, cfg, styles }: { exp: ExperienceItem; accent: string; accentSoft: string; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
  return (
    <View style={[styles.entry, { position: "relative" }]} wrap={false}>
      <EntryMarker accent={accent} cfg={cfg} styles={styles} />
      <View style={styles.entryHeaderRow}>
        <Text style={styles.entryTitle}>{exp.role}</Text>
        <DateLabel text={formatDateRange(exp.start_date, exp.end_date)} accent={accent} cfg={cfg} styles={styles} />
      </View>
      <Text style={styles.entrySubtitle}>
        {exp.company}{exp.location ? ` — ${exp.location}` : ""}
      </Text>
      {exp.description.map((d, j) => (
        <View key={j} style={styles.bulletRow}>
          <Text style={styles.bulletMarker}>{cfg.bullet}</Text>
          <Text style={styles.bulletText}>{d}</Text>
        </View>
      ))}
      {exp.technologies.length > 0 && (
        <Text style={styles.skillLine}>{exp.technologies.join(", ")}</Text>
      )}
    </View>
  );
}

function EducationEntry({ ed, accent, accentSoft, cfg, styles }: { ed: EducationItem; accent: string; accentSoft: string; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
  return (
    <View style={[styles.entry, { position: "relative" }]} wrap={false}>
      <EntryMarker accent={accent} cfg={cfg} styles={styles} />
      <View style={styles.entryHeaderRow}>
        <Text style={styles.entryTitle}>{[ed.degree, ed.field].filter(Boolean).join(" — ")}</Text>
        <DateLabel text={formatYearRange(ed.start_year, ed.end_year)} accent={accent} cfg={cfg} styles={styles} />
      </View>
      <Text style={styles.entrySubtitle}>{ed.institution}{ed.grade ? ` — ${ed.grade}` : ""}</Text>
    </View>
  );
}

function ProjectEntry({ p, accentSoft, cfg, styles }: { p: Project; accentSoft: string; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
  return (
    <View style={[styles.entry, { position: "relative" }]} wrap={false}>
      <Text style={styles.entryTitle}>{p.title}</Text>
      <Text style={styles.bullet}>{p.description}</Text>
      {p.tags.length > 0 && <Text style={styles.skillLine}>{p.tags.join(", ")}</Text>}
    </View>
  );
}

function SkillsSection({ skills, labels, accent, styles }: { skills: ProfileSchema["skills"]; labels: { title: string; hard: string; soft: string; tools: string }; accent: string; styles: ReturnType<typeof buildStyles> }) {
  if (skills.hard.length === 0 && skills.soft.length === 0 && skills.tools.length === 0) return null;
  return (
    // Always short (a handful of lines) — never worth splitting across pages.
    <View style={styles.section} wrap={false}>
      <Text style={styles.sectionTitle}>{labels.title}</Text>
      {skills.hard.length > 0 && (
        <Text style={styles.skillLine}><Text style={styles.skillLabel}>{labels.hard}: </Text>{skills.hard.join(", ")}</Text>
      )}
      {skills.tools.length > 0 && (
        <Text style={styles.skillLine}><Text style={styles.skillLabel}>{labels.tools}: </Text>{skills.tools.join(", ")}</Text>
      )}
      {skills.soft.length > 0 && (
        <Text style={styles.skillLine}><Text style={styles.skillLabel}>{labels.soft}: </Text>{skills.soft.join(", ")}</Text>
      )}
    </View>
  );
}

interface Labels {
  summary: string;
  experience: string;
  education: string;
  certifications: string;
  skills: string;
  skillsHard: string;
  skillsSoft: string;
  skillsTools: string;
  projects: string;
  other: string;
}

const LABELS_BY_LANG: Record<"it" | "en", Labels> = {
  en: {
    summary: "Summary", experience: "Experience", education: "Education",
    certifications: "Certifications", skills: "Skills", skillsHard: "Technical",
    skillsSoft: "Soft skills", skillsTools: "Tools", projects: "Projects", other: "Other",
  },
  it: {
    summary: "Profilo", experience: "Esperienza", education: "Istruzione",
    certifications: "Certificazioni", skills: "Competenze", skillsHard: "Tecniche",
    skillsSoft: "Trasversali", skillsTools: "Strumenti", projects: "Progetti", other: "Altro",
  },
};

export function AtsResumeDocument({ profile, template = "classic" }: { profile: ProfileSchema; template?: PdfTemplate }) {
  const t = LABELS_BY_LANG[profile.metadata.language] ?? LABELS_BY_LANG.en;
  const { personal_info, experience, education, certifications, skills, projects, other } = profile;
  const accent = profile.metadata.primary_color || FALLBACK_ACCENT;
  const accentSoft = hexToRgba(accent, 0.5);
  const cfg = VARIANTS[template];
  const styles = buildStyles(cfg, accent, accentSoft);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {cfg.useTopBar && <View style={[styles.topBar, { backgroundColor: accent }]} fixed />}

        <View style={styles.header}>
          <Text style={[styles.name, { color: accent }]}>{personal_info.full_name}</Text>
          <Text style={styles.title}>{personal_info.title}</Text>
          <ContactLine profile={profile} accent={accent} cfg={cfg} styles={styles} />
        </View>

        {personal_info.bio && (
          // Always short — never worth splitting across pages.
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{t.summary}</Text>
            <Text style={styles.bio}>{personal_info.bio}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            {/* Title glued to the first entry so it can never end up alone
                at the bottom of a page with all its content pushed to the
                next one — later entries can still flow independently. */}
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{t.experience}</Text>
              <ExperienceEntry exp={experience[0]} accent={accent} accentSoft={accentSoft} cfg={cfg} styles={styles} />
            </View>
            {experience.slice(1).map((exp, i) => (
              <ExperienceEntry key={i + 1} exp={exp} accent={accent} accentSoft={accentSoft} cfg={cfg} styles={styles} />
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{t.education}</Text>
              <EducationEntry ed={education[0]} accent={accent} accentSoft={accentSoft} cfg={cfg} styles={styles} />
            </View>
            {education.slice(1).map((ed, i) => (
              <EducationEntry key={i + 1} ed={ed} accent={accent} accentSoft={accentSoft} cfg={cfg} styles={styles} />
            ))}
          </View>
        )}

        <SkillsSection
          skills={skills}
          labels={{ title: t.skills, hard: t.skillsHard, soft: t.skillsSoft, tools: t.skillsTools }}
          accent={accent}
          styles={styles}
        />

        {certifications.length > 0 && (
          // Capped at 4 short lines (see lib/parse-resume.ts) — never worth
          // splitting across pages.
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{t.certifications}</Text>
            {certifications.map((c, i) => (
              <Text key={i} style={styles.skillLine}>
                {c.name} — {c.issuer} ({c.year})
              </Text>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          // Capped at 2 entries (see lib/parse-resume.ts) — never worth
          // splitting across pages.
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{t.projects}</Text>
            {projects.map((p, i) => (
              <ProjectEntry key={i} p={p} accentSoft={accentSoft} cfg={cfg} styles={styles} />
            ))}
          </View>
        )}

        {other && other.length > 0 && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.sectionTitle}>{t.other}</Text>
            <Text style={styles.skillLine}>{other.join(" • ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
