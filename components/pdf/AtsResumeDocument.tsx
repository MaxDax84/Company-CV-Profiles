import { Document, Page, View, Text, Link, StyleSheet } from "@react-pdf/renderer";
import type { ProfileSchema } from "@/lib/schema";

// Single, deliberately plain layout — no columns, no graphics, core Helvetica
// only. ATS parsers read this far more reliably than the colorful web
// templates, which is the entire point of this export (see /tailor).
const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 10, fontFamily: "Helvetica", color: "#1a1a1a" },
  name: { fontSize: 20, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  title: { fontSize: 12, marginBottom: 6, color: "#333333" },
  contactLine: { fontSize: 9, color: "#444444", marginBottom: 14 },
  section: { marginTop: 14 },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    marginBottom: 6,
    textTransform: "uppercase",
    borderBottom: "1 solid #cccccc",
    paddingBottom: 2,
  },
  bio: { fontSize: 10, lineHeight: 1.4 },
  entry: { marginBottom: 8 },
  entryHeaderRow: { flexDirection: "row", justifyContent: "space-between" },
  entryTitle: { fontSize: 10.5, fontFamily: "Helvetica-Bold" },
  entryDates: { fontSize: 9, color: "#555555" },
  entrySubtitle: { fontSize: 9.5, color: "#333333", marginBottom: 3 },
  bullet: { fontSize: 9.5, lineHeight: 1.35, marginBottom: 2, paddingLeft: 10 },
  skillLine: { fontSize: 9.5, lineHeight: 1.5 },
  skillLabel: { fontFamily: "Helvetica-Bold" },
  link: { color: "#1a1a1a", textDecoration: "none" },
});

function formatDateRange(start: string, end: string): string {
  return `${start} – ${end === "present" || end.toLowerCase() === "present" ? "Present" : end}`;
}

function ContactLine({ profile }: { profile: ProfileSchema }) {
  const { email_obfuscated, phone_obfuscated, location, social_links } = profile.personal_info;
  const parts: string[] = [email_obfuscated];
  if (phone_obfuscated) parts.push(phone_obfuscated);
  if (location) parts.push(location);

  const links = [
    social_links.linkedin && { label: "LinkedIn", url: social_links.linkedin },
    social_links.github && { label: "GitHub", url: social_links.github },
    social_links.portfolio && { label: "Portfolio", url: social_links.portfolio },
    social_links.twitter && { label: "Twitter", url: social_links.twitter },
  ].filter(Boolean) as { label: string; url: string }[];

  return (
    <View>
      <Text style={styles.contactLine}>{parts.join("  •  ")}</Text>
      {links.length > 0 && (
        <Text style={styles.contactLine}>
          {links.map((l, i) => (
            <Text key={l.label}>
              {i > 0 && "  •  "}
              <Link src={l.url} style={styles.link}>{l.label}</Link>
            </Text>
          ))}
        </Text>
      )}
    </View>
  );
}

function SkillsSection({ skills, labels }: { skills: ProfileSchema["skills"]; labels: { title: string; hard: string; soft: string; tools: string } }) {
  if (skills.hard.length === 0 && skills.soft.length === 0 && skills.tools.length === 0) return null;
  return (
    <View style={styles.section}>
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

export function AtsResumeDocument({ profile }: { profile: ProfileSchema }) {
  const t = LABELS_BY_LANG[profile.metadata.language] ?? LABELS_BY_LANG.en;
  const { personal_info, experience, education, certifications, skills, projects, other } = profile;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{personal_info.full_name}</Text>
        <Text style={styles.title}>{personal_info.title}</Text>
        <ContactLine profile={profile} />

        {personal_info.bio && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.summary}</Text>
            <Text style={styles.bio}>{personal_info.bio}</Text>
          </View>
        )}

        {experience.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.experience}</Text>
            {experience.map((exp, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>{exp.role}</Text>
                  <Text style={styles.entryDates}>{formatDateRange(exp.start_date, exp.end_date)}</Text>
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
            <Text style={styles.sectionTitle}>{t.education}</Text>
            {education.map((ed, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <View style={styles.entryHeaderRow}>
                  <Text style={styles.entryTitle}>{ed.degree}{ed.field ? ` — ${ed.field}` : ""}</Text>
                  <Text style={styles.entryDates}>{ed.start_year} – {ed.end_year}</Text>
                </View>
                <Text style={styles.entrySubtitle}>{ed.institution}{ed.grade ? ` — ${ed.grade}` : ""}</Text>
              </View>
            ))}
          </View>
        )}

        <SkillsSection
          skills={skills}
          labels={{ title: t.skills, hard: t.skillsHard, soft: t.skillsSoft, tools: t.skillsTools }}
        />

        {certifications.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.certifications}</Text>
            {certifications.map((c, i) => (
              <Text key={i} style={styles.skillLine}>
                {c.name} — {c.issuer} ({c.year})
              </Text>
            ))}
          </View>
        )}

        {projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.projects}</Text>
            {projects.map((p, i) => (
              <View key={i} style={styles.entry} wrap={false}>
                <Text style={styles.entryTitle}>{p.title}</Text>
                <Text style={styles.bullet}>{p.description}</Text>
                {p.tags.length > 0 && <Text style={styles.skillLine}>{p.tags.join(", ")}</Text>}
              </View>
            ))}
          </View>
        )}

        {other && other.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t.other}</Text>
            <Text style={styles.skillLine}>{other.join(" • ")}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}
