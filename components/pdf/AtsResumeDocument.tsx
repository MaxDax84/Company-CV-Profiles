import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import type { ProfileSchema } from "@/lib/schema";

// Single, deliberately plain layout — one column, plain text flow, core
// Helvetica only. ATS parsers read this far more reliably than the colorful
// web templates. The accent color / borders below are purely decorative
// Views and color props — they never replace text or change reading order,
// so they don't affect ATS parsing.
const FALLBACK_ACCENT = "#4f46e5";

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

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#232323" },
  topBar: { height: 6 },
  body: { paddingTop: 26, paddingBottom: 36, paddingHorizontal: 42 },
  name: { fontSize: 23, fontFamily: "Helvetica-Bold", letterSpacing: 0.3, marginBottom: 3 },
  title: { fontSize: 12, fontFamily: "Helvetica", color: "#4a4a4a", marginBottom: 9 },
  contactLine: { fontSize: 9, color: "#5a5a5a", marginBottom: 2, lineHeight: 1.5 },
  section: { marginTop: 17 },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    letterSpacing: 1.3,
    color: "#232323",
    marginBottom: 9,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomStyle: "solid",
    borderBottomColor: "#e2e2e2",
  },
  bio: { fontSize: 10, lineHeight: 1.55, color: "#333333" },
  entry: {
    marginBottom: 11,
    paddingLeft: 11,
    borderLeftWidth: 2,
    borderLeftStyle: "solid",
    borderLeftColor: "#e2e2e2",
  },
  entryHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  entryTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold", color: "#232323" },
  entryDates: { fontSize: 8.5, fontFamily: "Helvetica-Bold", letterSpacing: 0.3 },
  entrySubtitle: { fontSize: 9.5, color: "#555555", marginTop: 1, marginBottom: 5 },
  bullet: { fontSize: 9.5, lineHeight: 1.45, marginBottom: 2.5, color: "#333333" },
  skillLine: { fontSize: 9.5, lineHeight: 1.65, color: "#333333" },
  skillLabel: { fontFamily: "Helvetica-Bold", color: "#232323" },
  link: { textDecoration: "none", fontFamily: "Helvetica-Bold" },
});

function formatDateRange(start: string, end: string): string {
  return `${start} – ${end === "present" || end.toLowerCase() === "present" ? "Present" : end}`;
}

function ContactLine({ profile, accent }: { profile: ProfileSchema; accent: string }) {
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

function SkillsSection({ skills, labels, accent }: { skills: ProfileSchema["skills"]; labels: { title: string; hard: string; soft: string; tools: string }; accent: string }) {
  if (skills.hard.length === 0 && skills.soft.length === 0 && skills.tools.length === 0) return null;
  return (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { borderBottomColor: accent }]}>{labels.title}</Text>
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

export function AtsResumeDocument({ profile }: { profile: ProfileSchema }) {
  const t = LABELS_BY_LANG[profile.metadata.language] ?? LABELS_BY_LANG.en;
  const { personal_info, experience, education, certifications, skills, projects, other } = profile;
  const accent = profile.metadata.primary_color || FALLBACK_ACCENT;
  const accentSoft = hexToRgba(accent, 0.5);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={[styles.topBar, { backgroundColor: accent }]} fixed />
        <View style={styles.body}>
          <Text style={[styles.name, { color: accent }]}>{personal_info.full_name}</Text>
          <Text style={styles.title}>{personal_info.title}</Text>
          <ContactLine profile={profile} accent={accent} />

          {personal_info.bio && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { borderBottomColor: accent }]}>{t.summary}</Text>
              <Text style={styles.bio}>{personal_info.bio}</Text>
            </View>
          )}

          {experience.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { borderBottomColor: accent }]}>{t.experience}</Text>
              {experience.map((exp, i) => (
                <View key={i} style={[styles.entry, { borderLeftColor: accentSoft }]} wrap={false}>
                  <View style={styles.entryHeaderRow}>
                    <Text style={styles.entryTitle}>{exp.role}</Text>
                    <Text style={[styles.entryDates, { color: accent }]}>{formatDateRange(exp.start_date, exp.end_date)}</Text>
                  </View>
                  <Text style={styles.entrySubtitle}>
                    {exp.company}{exp.location ? ` — ${exp.location}` : ""}
                  </Text>
                  {exp.description.map((d, j) => (
                    <Text key={j} style={styles.bullet}>• {d}</Text>
                  ))}
                  {exp.technologies.length > 0 && (
                    <Text style={styles.skillLine}>{exp.technologies.join(", ")}</Text>
                  )}
                </View>
              ))}
            </View>
          )}

          {education.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { borderBottomColor: accent }]}>{t.education}</Text>
              {education.map((ed, i) => (
                <View key={i} style={[styles.entry, { borderLeftColor: accentSoft }]} wrap={false}>
                  <View style={styles.entryHeaderRow}>
                    <Text style={styles.entryTitle}>{ed.degree}{ed.field ? ` — ${ed.field}` : ""}</Text>
                    <Text style={[styles.entryDates, { color: accent }]}>{ed.start_year} – {ed.end_year}</Text>
                  </View>
                  <Text style={styles.entrySubtitle}>{ed.institution}{ed.grade ? ` — ${ed.grade}` : ""}</Text>
                </View>
              ))}
            </View>
          )}

          <SkillsSection
            skills={skills}
            labels={{ title: t.skills, hard: t.skillsHard, soft: t.skillsSoft, tools: t.skillsTools }}
            accent={accent}
          />

          {certifications.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { borderBottomColor: accent }]}>{t.certifications}</Text>
              {certifications.map((c, i) => (
                <Text key={i} style={styles.skillLine}>
                  {c.name} — {c.issuer} ({c.year})
                </Text>
              ))}
            </View>
          )}

          {projects.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { borderBottomColor: accent }]}>{t.projects}</Text>
              {projects.map((p, i) => (
                <View key={i} style={[styles.entry, { borderLeftColor: accentSoft }]} wrap={false}>
                  <Text style={styles.entryTitle}>{p.title}</Text>
                  <Text style={styles.bullet}>{p.description}</Text>
                  {p.tags.length > 0 && <Text style={styles.skillLine}>{p.tags.join(", ")}</Text>}
                </View>
              ))}
            </View>
          )}

          {other && other.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { borderBottomColor: accent }]}>{t.other}</Text>
              <Text style={styles.skillLine}>{other.join(" • ")}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
}
