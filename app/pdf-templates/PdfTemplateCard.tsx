import Image from "next/image";

// Static screenshots (public/pdf-preview/*.png) instead of a live-rendered
// iframe of /pdf-preview/[template] — that page still exists and renders
// exactly what these screenshots capture, so regenerating them after a
// template redesign is just re-screenshotting it, but a static image is far
// cheaper for the browser to composite/scale than a real DOM+CSS layout,
// which mattered here: 3 full-size iframes scaling under mobile pinch-zoom
// could exhaust memory and crash the tab. A plain bitmap doesn't have that
// failure mode.
const IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "ats-core": { width: 1280, height: 423 },
  "executive": { width: 1280, height: 435 },
  "creative-tech": { width: 1280, height: 435 },
};

interface Props {
  templateId: string;
  name: string;
  description: string;
}

export default function PdfTemplateCard({ templateId, name, description }: Props) {
  const dims = IMAGE_DIMENSIONS[templateId] ?? { width: 1280, height: 430 };

  return (
    <div className="space-y-3 w-full max-w-[552px]">
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
          sizes="(min-width: 768px) 552px, 100vw"
        />
      </div>
    </div>
  );
}
