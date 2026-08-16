import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import type { ProfileSchema, ExperienceItem, EducationItem, Project } from "@/lib/schema";

// Three deliberately plain, single-column layouts — plain text flow, only
// standard PDF fonts (Helvetica/Times), no tables, no images, no multi-
// column layout. ATS parsers read this far more reliably than the colorful
// web templates. Colors/rules/markers below are purely decorative Views and
// color props — they never replace text or change reading order, so they
// don't affect ATS parsing, no matter which variant is picked.
const FALLBACK_ACCENT = "#4f46e5";

export type PdfTemplate = "ats-core" | "executive" | "creative-tech";

export const PDF_TEMPLATES: { id: PdfTemplate; name: string; description: string }[] = [
  { id: "ats-core", name: "Pragmatico", description: "Essenziale e diretto, va dritto al punto" },
  { id: "executive", name: "Executive", description: "Elegante e autorevole, pensato per la leadership" },
  { id: "creative-tech", name: "Creative Tech", description: "Moderno e d'impatto, per profili innovativi" },
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

type StdFont = "Helvetica" | "Helvetica-Bold" | "Times-Roman" | "Times-Bold";

interface VariantConfig {
  // Body text always uses fontFamily/fontFamilyBold. Name + section titles
  // use headerFontFamily/headerFontFamilyBold — same as body for two of the
  // three variants, but "executive" pairs a serif header with a sans body.
  fontFamily: StdFont;
  fontFamilyBold: StdFont;
  headerFontFamily: StdFont;
  headerFontFamilyBold: StdFont;
  bullet: string;
  headerAlign: "flex-start" | "center";
  entryMarker: "dot" | "none";
  useDateChip: boolean;
  sectionTitleStyle: "rule-simple" | "rule-both" | "tag";
  // "ats-core" and "executive" use a fixed, non-personalized accent (pure
  // neutral grayscale / institutional navy per the brief) instead of the
  // CV's own suggested color — only "creative-tech" stays personalized.
  fixedAccent?: string;
  // Header keeps a tinted background band for two variants; "ats-core"
  // stays flat white with a hairline rule instead, per its "bianco e nero,
  // solo linee sottili" spec.
  headerBand: boolean;
  skillStyle: "line" | "tags";
  spacing: "normal" | "generous";
}

const VARIANTS: Record<PdfTemplate, VariantConfig> = {
  "ats-core": {
    fontFamily: "Helvetica", fontFamilyBold: "Helvetica-Bold",
    headerFontFamily: "Helvetica", headerFontFamilyBold: "Helvetica-Bold",
    bullet: "•", headerAlign: "flex-start", entryMarker: "none",
    useDateChip: false, sectionTitleStyle: "rule-simple",
    fixedAccent: "#2b2b2b", headerBand: false, skillStyle: "line", spacing: "normal",
  },
  executive: {
    fontFamily: "Helvetica", fontFamilyBold: "Helvetica-Bold",
    headerFontFamily: "Times-Roman", headerFontFamilyBold: "Times-Bold",
    bullet: "—", headerAlign: "center", entryMarker: "none",
    useDateChip: false, sectionTitleStyle: "rule-both",
    fixedAccent: "#16233f", headerBand: true, skillStyle: "line", spacing: "generous",
  },
  "creative-tech": {
    fontFamily: "Helvetica", fontFamilyBold: "Helvetica-Bold",
    headerFontFamily: "Helvetica", headerFontFamilyBold: "Helvetica-Bold",
    bullet: "•", headerAlign: "flex-start", entryMarker: "dot",
    useDateChip: true, sectionTitleStyle: "tag",
    headerBand: true, skillStyle: "tags", spacing: "normal",
  },
};

function resolveAccent(profile: ProfileSchema, cfg: VariantConfig): string {
  return cfg.fixedAccent ?? profile.metadata.primary_color ?? FALLBACK_ACCENT;
}

function buildStyles(cfg: VariantConfig, accent: string, accentSoft: string) {
  const generous = cfg.spacing === "generous";
  const PAGE_PADDING_H = generous ? 54 : 42;
  const RULE_GRAY = "#a3a3a3";
  return StyleSheet.create({
    // Margins live on the Page itself (not a wrapping View) — react-pdf only
    // reapplies a View's own padding at the very start/end of its content, so
    // a wrapping <View> loses its top/bottom inset on every page after the
    // first once a section overflows. Page-level padding, by contrast, is
    // correctly reapplied on every auto-generated page.
    page: { fontFamily: cfg.fontFamily, fontSize: 10, color: "#232323", paddingTop: generous ? 40 : 34, paddingBottom: generous ? 44 : 36, paddingHorizontal: PAGE_PADDING_H },
    // Tinted band behind the name/title/contact block — bleeds to the page's
    // physical edges by cancelling the Page's own horizontal padding, then
    // re-applying it as the band's own padding so the text inside still
    // lines up with the rest of the page's content. "ats-core" skips the
    // tint entirely and gets a hairline rule below instead.
    header: {
      alignItems: cfg.headerAlign,
      backgroundColor: cfg.headerBand ? hexToRgba(accent, 0.06) : "transparent",
      marginHorizontal: -PAGE_PADDING_H,
      marginTop: -10,
      paddingHorizontal: PAGE_PADDING_H,
      paddingTop: generous ? 26 : 20,
      paddingBottom: generous ? 22 : 16,
      marginBottom: cfg.headerBand ? 6 : 14,
      ...(!cfg.headerBand && { borderBottomWidth: 1, borderBottomColor: RULE_GRAY }),
    },
    name: { fontSize: generous ? 25 : 23, fontFamily: cfg.headerFontFamilyBold, letterSpacing: 0.3, marginBottom: 3, textAlign: cfg.headerAlign === "center" ? "center" : "left" },
    title: { fontSize: 12, fontFamily: cfg.headerFontFamily, color: "#4a4a4a", marginBottom: 9, textAlign: cfg.headerAlign === "center" ? "center" : "left" },
    contactLine: { fontSize: 9, color: "#5a5a5a", marginBottom: 2, lineHeight: 1.5, textAlign: cfg.headerAlign === "center" ? "center" : "left" },
    section: { marginTop: generous ? 22 : 17 },
    // Each variant carries a distinct treatment — a plain thin rule
    // (ats-core), a soft double rule (executive), or a filled tag-like
    // band (creative-tech) — rather than one shared look.
    sectionTitle: {
      fontSize: cfg.sectionTitleStyle === "tag" ? 10 : 10.5,
      fontFamily: cfg.headerFontFamilyBold,
      textTransform: "uppercase",
      letterSpacing: cfg.sectionTitleStyle === "tag" ? 1.6 : 1.3,
      color: cfg.sectionTitleStyle === "tag" ? accent : "#232323",
      marginBottom: 9,
      ...(cfg.sectionTitleStyle === "rule-simple" && {
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: RULE_GRAY,
      }),
      ...(cfg.sectionTitleStyle === "tag" && {
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
      marginBottom: generous ? 13 : 11,
      paddingLeft: cfg.entryMarker === "dot" ? 12 : 0,
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
    // under the bullet. Still plain sequential text in the content stream,
    // so ATS extraction order is unaffected.
    bulletRow: { flexDirection: "row", marginBottom: 3.5 },
    bulletMarker: { width: 13, fontSize: 9.5, lineHeight: 1.45, color: accentSoft },
    bulletText: { flex: 1, fontSize: 9.5, lineHeight: 1.45, color: "#333333" },
    skillLine: { fontSize: 9.5, lineHeight: 1.65, color: "#333333" },
    skillLabel: { fontFamily: cfg.fontFamilyBold, color: "#232323" },
    // "creative-tech" only — small pill chips for skills/tools instead of a
    // comma-joined line. Each chip is still its own plain <Text> node in
    // normal document order, so ATS extraction reads the same words in the
    // same order it would from a plain line — only the visual wrapper differs.
    tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginTop: 2, marginBottom: 4 },
    tag: { fontSize: 8.5, fontFamily: cfg.fontFamilyBold, color: accent, backgroundColor: hexToRgba(accent, 0.1), borderRadius: 8, paddingHorizontal: 7, paddingVertical: 3 },
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

function TagRow({ items, styles }: { items: string[]; styles: ReturnType<typeof buildStyles> }) {
  if (items.length === 0) return null;
  return (
    <View style={styles.tagRow}>
      {items.map((item, i) => (
        <Text key={i} style={styles.tag}>{item}</Text>
      ))}
    </View>
  );
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

function ExperienceEntry({ exp, accent, cfg, styles }: { exp: ExperienceItem; accent: string; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
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
        cfg.skillStyle === "tags"
          ? <TagRow items={exp.technologies} styles={styles} />
          : <Text style={styles.skillLine}>{exp.technologies.join(", ")}</Text>
      )}
    </View>
  );
}

function EducationEntry({ ed, accent, cfg, styles }: { ed: EducationItem; accent: string; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
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

function ProjectEntry({ p, cfg, styles }: { p: Project; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
  return (
    <View style={[styles.entry, { position: "relative" }]} wrap={false}>
      <Text style={styles.entryTitle}>{p.title}</Text>
      <Text style={styles.bullet}>{p.description}</Text>
      {p.tags.length > 0 && (
        cfg.skillStyle === "tags"
          ? <TagRow items={p.tags} styles={styles} />
          : <Text style={styles.skillLine}>{p.tags.join(", ")}</Text>
      )}
    </View>
  );
}

function SkillsSection({ skills, labels, cfg, styles }: { skills: ProfileSchema["skills"]; labels: { title: string; hard: string; soft: string; tools: string }; cfg: VariantConfig; styles: ReturnType<typeof buildStyles> }) {
  if (skills.hard.length === 0 && skills.soft.length === 0 && skills.tools.length === 0) return null;
  if (cfg.skillStyle === "tags") {
    // Tools grouped in with hard skills — the visual distinction between
    // "technical" and "tool" chips isn't worth a third labeled row here.
    const chips = [...skills.hard, ...skills.tools];
    return (
      <View style={styles.section} wrap={false}>
        <Text style={styles.sectionTitle}>{labels.title}</Text>
        <TagRow items={chips} styles={styles} />
        {skills.soft.length > 0 && (
          <Text style={styles.skillLine}><Text style={styles.skillLabel}>{labels.soft}: </Text>{skills.soft.join(", ")}</Text>
        )}
      </View>
    );
  }
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

export function AtsResumeDocument({ profile, template = "ats-core" }: { profile: ProfileSchema; template?: PdfTemplate }) {
  const t = LABELS_BY_LANG[profile.metadata.language] ?? LABELS_BY_LANG.en;
  const { personal_info, experience, education, certifications, skills, projects, other } = profile;
  const cfg = VARIANTS[template];
  const accent = resolveAccent(profile, cfg);
  const accentSoft = hexToRgba(accent, 0.5);
  const styles = buildStyles(cfg, accent, accentSoft);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
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
              <ExperienceEntry exp={experience[0]} accent={accent} cfg={cfg} styles={styles} />
            </View>
            {experience.slice(1).map((exp, i) => (
              <ExperienceEntry key={i + 1} exp={exp} accent={accent} cfg={cfg} styles={styles} />
            ))}
          </View>
        )}

        {education.length > 0 && (
          <View style={styles.section}>
            <View wrap={false}>
              <Text style={styles.sectionTitle}>{t.education}</Text>
              <EducationEntry ed={education[0]} accent={accent} cfg={cfg} styles={styles} />
            </View>
            {education.slice(1).map((ed, i) => (
              <EducationEntry key={i + 1} ed={ed} accent={accent} cfg={cfg} styles={styles} />
            ))}
          </View>
        )}

        <SkillsSection
          skills={skills}
          labels={{ title: t.skills, hard: t.skillsHard, soft: t.skillsSoft, tools: t.skillsTools }}
          cfg={cfg}
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
              <ProjectEntry key={i} p={p} cfg={cfg} styles={styles} />
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
