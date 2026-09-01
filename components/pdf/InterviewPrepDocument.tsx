import { Document, Page, View, Text, Link, StyleSheet, Font } from "@react-pdf/renderer";
import type { InterviewPrepContent } from "@/lib/interview-prep";

// Same reasoning as CoverLetterDocument: this is prose meant to be read
// normally, not typeset copy — wrap whole words only.
Font.registerHyphenationCallback((word) => [word]);

const ACCENT = "#4f46e5";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 10, color: "#232323", paddingTop: 30, paddingBottom: 40, paddingHorizontal: 46 },
  topBar: { position: "absolute", top: 0, left: 0, right: 0, height: 6, backgroundColor: ACCENT },
  eyebrow: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: ACCENT, letterSpacing: 1.2, marginBottom: 4, textTransform: "uppercase" },
  title: { fontSize: 17, fontFamily: "Helvetica-Bold", color: "#151515", marginBottom: 2 },
  subtitle: { fontSize: 10.5, color: "#5a5a5a", marginBottom: 18 },
  sectionTitle: { fontSize: 10, fontFamily: "Helvetica-Bold", color: ACCENT, marginTop: 14, marginBottom: 5, textTransform: "uppercase", letterSpacing: 0.6 },
  paragraph: { fontSize: 9.8, lineHeight: 1.5, color: "#2b2b2b" },
  bulletRow: { flexDirection: "row", marginBottom: 4 },
  bulletMarker: { width: 10, fontSize: 9.8, color: ACCENT },
  bulletText: { flex: 1, fontSize: 9.8, lineHeight: 1.45, color: "#2b2b2b" },
  sourcesBlock: { marginTop: 20, paddingTop: 10, borderTopWidth: 0.75, borderTopColor: "#e2e2e2" },
  sourcesTitle: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#8a8a8a", textTransform: "uppercase", letterSpacing: 1, marginBottom: 5 },
  sourceRow: { fontSize: 8, color: "#7a7a7a", marginBottom: 2.5 },
  sourceLink: { color: ACCENT, textDecoration: "none" },
});

function Bullets({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  return (
    <View>
      {items.map((item, i) => (
        <View key={i} style={styles.bulletRow}>
          <Text style={styles.bulletMarker}>•</Text>
          <Text style={styles.bulletText}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

const LABELS = {
  it: {
    eyebrow: "Preparazione colloquio",
    company: "L'azienda",
    market: "Mercato e posizionamento",
    culture: "Cultura e valori",
    news: "Novità recenti",
    focus: "Punti chiave dell'annuncio",
    questions: "Possibili domande al colloquio",
    sources: "Fonti",
    unknownCompany: "Azienda non identificata dall'annuncio",
  },
  en: {
    eyebrow: "Interview prep",
    company: "The company",
    market: "Market & positioning",
    culture: "Culture & values",
    news: "Recent news",
    focus: "Key points from the posting",
    questions: "Possible interview questions",
    sources: "Sources",
    unknownCompany: "Company not identified from the posting",
  },
  es: {
    eyebrow: "Preparación de la entrevista",
    company: "La empresa",
    market: "Mercado y posicionamiento",
    culture: "Cultura y valores",
    news: "Noticias recientes",
    focus: "Puntos clave de la oferta",
    questions: "Posibles preguntas de la entrevista",
    sources: "Fuentes",
    unknownCompany: "Empresa no identificada en la oferta",
  },
  fr: {
    eyebrow: "Préparation à l'entretien",
    company: "L'entreprise",
    market: "Marché et positionnement",
    culture: "Culture et valeurs",
    news: "Actualités récentes",
    focus: "Points clés de l'offre",
    questions: "Questions d'entretien possibles",
    sources: "Sources",
    unknownCompany: "Entreprise non identifiée dans l'offre",
  },
  de: {
    eyebrow: "Vorbereitung auf das Vorstellungsgespräch",
    company: "Das Unternehmen",
    market: "Markt und Positionierung",
    culture: "Kultur und Werte",
    news: "Aktuelle Nachrichten",
    focus: "Wichtige Punkte der Stellenanzeige",
    questions: "Mögliche Interviewfragen",
    sources: "Quellen",
    unknownCompany: "Unternehmen aus der Anzeige nicht identifiziert",
  },
  pt: {
    eyebrow: "Preparação para a entrevista",
    company: "A empresa",
    market: "Mercado e posicionamento",
    culture: "Cultura e valores",
    news: "Notícias recentes",
    focus: "Pontos-chave da vaga",
    questions: "Possíveis perguntas da entrevista",
    sources: "Fontes",
    unknownCompany: "Empresa não identificada na vaga",
  },
  zh: {
    eyebrow: "面试准备",
    company: "公司简介",
    market: "市场与定位",
    culture: "文化与价值观",
    news: "最新动态",
    focus: "职位要点",
    questions: "可能的面试问题",
    sources: "参考来源",
    unknownCompany: "无法从职位信息中识别公司",
  },
} as const;

interface InterviewPrepDocumentProps {
  content: InterviewPrepContent;
}

export function InterviewPrepDocument({ content }: InterviewPrepDocumentProps) {
  const t = LABELS[content.language as keyof typeof LABELS] ?? LABELS.en;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.topBar} fixed />
        <Text style={styles.eyebrow}>{t.eyebrow}</Text>
        <Text style={styles.title}>{content.company_name ?? t.unknownCompany}</Text>
        {content.role_title && <Text style={styles.subtitle}>{content.role_title}</Text>}

        <Text style={styles.sectionTitle}>{t.company}</Text>
        <Text style={styles.paragraph}>{content.company_summary}</Text>

        {content.market && (
          <>
            <Text style={styles.sectionTitle}>{t.market}</Text>
            <Text style={styles.paragraph}>{content.market}</Text>
          </>
        )}

        {content.culture_values && (
          <>
            <Text style={styles.sectionTitle}>{t.culture}</Text>
            <Text style={styles.paragraph}>{content.culture_values}</Text>
          </>
        )}

        {content.recent_news.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t.news}</Text>
            <Bullets items={content.recent_news} />
          </>
        )}

        {content.role_focus_points.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t.focus}</Text>
            <Bullets items={content.role_focus_points} />
          </>
        )}

        {content.likely_questions.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>{t.questions}</Text>
            <Bullets items={content.likely_questions} />
          </>
        )}

        {content.sources.length > 0 && (
          <View style={styles.sourcesBlock}>
            <Text style={styles.sourcesTitle}>{t.sources}</Text>
            {content.sources.map((s, i) => (
              <Text key={i} style={styles.sourceRow}>
                {s.title} — <Link src={s.url} style={styles.sourceLink}>{s.url}</Link>
              </Text>
            ))}
          </View>
        )}
      </Page>
    </Document>
  );
}
