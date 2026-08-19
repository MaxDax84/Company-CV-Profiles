import { PDF_TEMPLATES } from "@/components/pdf/AtsResumeDocument";

// Static, non-scrolling reference for the 3 PDF templates — the actual
// picker (components/pdf-export-button.tsx) used to embed small, slowly
// auto-scrolling previews inline, which read as blurry/hard-to-follow at
// that size. This page instead shows each template large enough to
// actually read, all at once, no animation — opened from a "Vedi i 3
// formati" link rather than embedded, so the picker itself can stay simple.
const SOURCE_WIDTH = 1200;
const SOURCE_HEIGHT = 1697;
const SCALE = 0.46;

export const metadata = { title: "I 3 template PDF — Jobli" };

export default function PdfTemplatesPage() {
  return (
    <main className="min-h-screen bg-secondary/20 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl md:text-3xl font-bold tracking-tight">I 3 template PDF</h1>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Ogni CV Jobli può essere scaricato in uno di questi 3 stili — stesso contenuto, layout diverso, tutti pensati per superare i filtri ATS.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {PDF_TEMPLATES.map((tpl) => (
            <div key={tpl.id} className="space-y-3" style={{ width: SOURCE_WIDTH * SCALE }}>
              <div
                className="rounded-2xl overflow-hidden border border-foreground/10 bg-white shadow-lg"
                style={{ width: SOURCE_WIDTH * SCALE, height: SOURCE_HEIGHT * SCALE }}
              >
                <iframe
                  src={`/pdf-preview/${tpl.id}`}
                  title={tpl.name}
                  tabIndex={-1}
                  style={{
                    width: SOURCE_WIDTH,
                    height: SOURCE_HEIGHT,
                    border: "none",
                    transform: `scale(${SCALE})`,
                    transformOrigin: "top left",
                    pointerEvents: "none",
                  }}
                />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold">{tpl.name}</p>
                <p className="text-xs text-muted-foreground">{tpl.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
