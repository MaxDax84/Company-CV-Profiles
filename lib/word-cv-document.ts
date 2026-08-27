import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ExternalHyperlink, BorderStyle } from "docx";
import type { ProfileSchema } from "./schema";
import { LABELS_BY_LANG, formatDateRange, formatYearRange } from "@/components/pdf/AtsResumeDocument";

// A single, plain, genuinely editable layout — unlike the PDF's 3 visual
// templates, a Word download exists specifically so the user can open and
// modify it themselves, so styling choice matters far less than keeping the
// structure simple and predictable to edit.

const ACCENT = "2952CC";
const MUTED = "555555";

function heading(text: string): Paragraph {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: ACCENT, space: 4 } },
    children: [new TextRun({ text, bold: true, color: ACCENT, size: 22 })],
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({ text, bullet: { level: 0 }, spacing: { after: 40 } });
}

function contactLine(profile: ProfileSchema): Paragraph {
  const { email, phone, location, social_links } = profile.personal_info;
  const parts: string[] = [];
  if (email) parts.push(email);
  if (phone) parts.push(phone);
  if (location) parts.push(location);

  const links = [
    social_links.linkedin && { label: "LinkedIn", url: social_links.linkedin },
    social_links.github && { label: "GitHub", url: social_links.github },
    social_links.portfolio && { label: "Portfolio", url: social_links.portfolio },
    social_links.twitter && { label: "Twitter", url: social_links.twitter },
  ].filter(Boolean) as { label: string; url: string }[];

  const children: (TextRun | ExternalHyperlink)[] = [];
  if (parts.length > 0) {
    children.push(new TextRun({ text: parts.join("  ·  "), color: MUTED, size: 20 }));
  }
  for (const link of links) {
    if (children.length > 0) children.push(new TextRun({ text: "  ·  ", color: MUTED, size: 20 }));
    children.push(
      new ExternalHyperlink({
        link: link.url,
        children: [new TextRun({ text: link.label, color: ACCENT, size: 20, underline: {} })],
      })
    );
  }

  return new Paragraph({ children, spacing: { after: 200 } });
}

export async function buildCvDocxBuffer(profile: ProfileSchema): Promise<Buffer> {
  const t = LABELS_BY_LANG[profile.metadata.language] ?? LABELS_BY_LANG.en;
  // projects/certifications default to [] — see components/templates/TemplateBeta.tsx
  // for why (ProfileSchema declares both required, but extraction can omit them).
  const { personal_info, experience, education, certifications = [], skills, projects = [], other } = profile;

  const children: Paragraph[] = [
    new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: personal_info.full_name, bold: true, size: 40 })],
    }),
    new Paragraph({
      spacing: { after: 120 },
      children: [new TextRun({ text: personal_info.title, color: ACCENT, size: 24 })],
    }),
    contactLine(profile),
  ];

  if (personal_info.bio) {
    children.push(heading(t.summary));
    children.push(new Paragraph({ text: personal_info.bio, spacing: { after: 120 } }));
  }

  if (experience.length > 0) {
    children.push(heading(t.experience));
    for (const exp of experience) {
      children.push(
        new Paragraph({
          spacing: { before: 160, after: 20 },
          children: [
            new TextRun({ text: `${exp.role} `, bold: true, size: 22 }),
            new TextRun({ text: `— ${exp.company}`, size: 22 }),
          ],
        })
      );
      const dateLocation = [formatDateRange(exp.start_date, exp.end_date), exp.location].filter(Boolean).join("  ·  ");
      if (dateLocation) {
        children.push(new Paragraph({ spacing: { after: 60 }, children: [new TextRun({ text: dateLocation, italics: true, color: MUTED, size: 20 })] }));
      }
      for (const line of exp.description) children.push(bullet(line));
      if (exp.technologies.length > 0) {
        children.push(
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [new TextRun({ text: exp.technologies.join(" · "), color: MUTED, size: 19, italics: true })],
          })
        );
      }
    }
  }

  if (education.length > 0) {
    children.push(heading(t.education));
    for (const edu of education) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 20 },
          children: [new TextRun({ text: `${edu.degree}${edu.field ? ` — ${edu.field}` : ""}`, bold: true, size: 22 })],
        })
      );
      const detail = [edu.institution, formatYearRange(edu.start_year, edu.end_year), edu.grade].filter(Boolean).join("  ·  ");
      if (detail) {
        children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: detail, color: MUTED, size: 20 })] }));
      }
    }
  }

  if (certifications.length > 0) {
    children.push(heading(t.certifications));
    for (const cert of certifications) {
      children.push(bullet(`${cert.name} — ${cert.issuer} (${cert.year})`));
    }
  }

  const hasSkills = skills.hard.length > 0 || skills.soft.length > 0 || skills.tools.length > 0;
  if (hasSkills) {
    children.push(heading(t.skills));
    if (skills.hard.length > 0) {
      children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `${t.skillsHard}: `, bold: true, size: 20 }), new TextRun({ text: skills.hard.join(", "), size: 20 })] }));
    }
    if (skills.soft.length > 0) {
      children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `${t.skillsSoft}: `, bold: true, size: 20 }), new TextRun({ text: skills.soft.join(", "), size: 20 })] }));
    }
    if (skills.tools.length > 0) {
      children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: `${t.skillsTools}: `, bold: true, size: 20 }), new TextRun({ text: skills.tools.join(", "), size: 20 })] }));
    }
  }

  if (projects.length > 0) {
    children.push(heading(t.projects));
    for (const project of projects) {
      children.push(
        new Paragraph({
          spacing: { before: 120, after: 20 },
          children: [new TextRun({ text: project.title, bold: true, size: 22 })],
        })
      );
      children.push(new Paragraph({ spacing: { after: 40 }, text: project.description }));
      if (project.tags.length > 0) {
        children.push(new Paragraph({ spacing: { after: 40 }, children: [new TextRun({ text: project.tags.join(" · "), color: MUTED, size: 19, italics: true })] }));
      }
    }
  }

  if (other && other.length > 0) {
    children.push(heading(t.other));
    for (const line of other) children.push(bullet(line));
  }

  const doc = new Document({
    sections: [
      {
        properties: { page: { margin: { top: 720, bottom: 720, left: 900, right: 900 } } },
        children,
      },
    ],
    styles: {
      default: {
        document: { run: { font: "Calibri", size: 20 } },
      },
    },
  });

  return Packer.toBuffer(doc);
}
