import { PDF_TEMPLATES } from "@/components/pdf/AtsResumeDocument";
import PdfTemplateCard from "./PdfTemplateCard";

// Static, non-scrolling reference for the 3 PDF templates — the actual
// picker (components/pdf-export-button.tsx) used to embed small, slowly
// auto-scrolling previews inline, which read as blurry/hard-to-follow at
// that size. This page instead shows each template large enough to
// actually read, all at once, no animation — opened from a "Vedi i 3
// formati" link rather than embedded, so the picker itself can stay simple.
// Each card's own preview scale is measured client-side (see
// PdfTemplateCard) so the page always fits the screen width exactly, phone
// or desktop — vertical scroll only, never horizontal.

export const metadata = { title: "I 3 template PDF — Jobli" };

export default function PdfTemplatesPage() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-secondary/20 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">I 3 template PDF</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Ogni CV Jobli può essere scaricato in uno di questi 3 stili — stesso contenuto, layout diverso, tutti pensati per superare i filtri ATS.
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-8">
          {PDF_TEMPLATES.map((tpl) => (
            <PdfTemplateCard key={tpl.id} templateId={tpl.id} name={tpl.name} description={tpl.description} />
          ))}
        </div>
      </div>
    </main>
  );
}
