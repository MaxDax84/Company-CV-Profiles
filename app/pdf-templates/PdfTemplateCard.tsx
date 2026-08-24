import Image from "next/image";

// Static screenshots (public/pdf-preview/*.png) instead of a live-rendered
// iframe of /pdf-preview/[template] — that page still exists and renders
// exactly what these screenshots capture, so regenerating them after a
// template redesign is just re-screenshotting it, but a static image is far
// cheaper for the browser to composite/scale than a real DOM+CSS layout,
// which mattered here: 3 full-size iframes scaling under mobile pinch-zoom
// could exhaust memory and crash the tab. A plain bitmap doesn't have that
// failure mode.
//
// Cropped tight to the CV's own content box (no surrounding browser-viewport
// void) — the aspect ratio now lands close to a real A4 page (~0.71), so the
// image fills this card edge to edge instead of floating in extra whitespace.
const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "ats-core": { width: 290, height: 415 },
  "executive": { width: 343, height: 519 },
  "creative-tech": { width: 345, height: 519 },
};

interface Props {
  templateId: string;
  name: string;
  description: string;
}

export default function PdfTemplateCard({ templateId, name, description }: Props) {
  const dims = IMAGE_DIMENSIONS[templateId] ?? { width: 293, height: 420 };

  return (
    <div className="space-y-3 w-full max-w-[420px]">
      <div className="text-center">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="rounded-2xl overflow-hidden border border-foreground/10 bg-white shadow-lg w-full">
        <Image
          src={`/pdf-preview/${templateId}.png`}
          alt={name}
          width={dims.width}
          height={dims.height}
          className="w-full h-auto block"
          sizes="(min-width: 768px) 420px, 100vw"
        />
      </div>
    </div>
  );
}
