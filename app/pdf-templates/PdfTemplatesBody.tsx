"use client";

import { PDF_TEMPLATES, PDF_TEMPLATES_EN } from "@/components/pdf/AtsResumeDocument";
import PdfTemplateCard from "./PdfTemplateCard";
import { useLanguage } from "@/components/language-provider";

export default function PdfTemplatesBody() {
  const { lang } = useLanguage();

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-secondary/20 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">
            {lang === "en" ? "The 3 PDF templates" : "I 3 template PDF"}
          </h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            {lang === "en"
              ? "Every Jobli CV can be downloaded in one of these 3 styles — same content, different layout, all built to pass ATS filters."
              : "Ogni CV Jobli può essere scaricato in uno di questi 3 stili — stesso contenuto, layout diverso, tutti pensati per superare i filtri ATS."}
          </p>
        </div>

        <div className="flex flex-wrap justify-center items-start gap-8">
          {PDF_TEMPLATES.map((tpl) => {
            const label = lang === "en" ? PDF_TEMPLATES_EN[tpl.id] : tpl;
            return (
              <PdfTemplateCard key={tpl.id} templateId={tpl.id} name={label.name} description={label.description} />
            );
          })}
        </div>
      </div>
    </main>
  );
}
