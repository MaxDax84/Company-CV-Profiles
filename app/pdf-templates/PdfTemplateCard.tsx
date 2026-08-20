"use client";

import { useEffect, useRef, useState } from "react";

const SOURCE_WIDTH = 1200;
const SOURCE_HEIGHT = 1697;

interface Props {
  templateId: string;
  name: string;
  description: string;
}

// The iframe always renders the real page at its native 1200px width — only
// the CSS transform scaling it down changes. On a fixed desktop-sized card
// that scale was a constant (0.46), but a card that's also meant to fit a
// phone screen needs a scale computed from whatever width the card actually
// ends up at, or the card (and the whole page) overflows horizontally. A
// ResizeObserver measures the card's own rendered width and derives the
// scale from that, so the preview always fits — no horizontal scroll, ever.
export default function PdfTemplateCard({ templateId, name, description }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / SOURCE_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="space-y-3 w-full max-w-[552px]">
      <div className="text-center">
        <p className="text-sm font-semibold">{name}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <div
        ref={cardRef}
        className="rounded-2xl overflow-hidden border border-foreground/10 bg-white shadow-lg w-full"
        style={{ aspectRatio: `${SOURCE_WIDTH} / ${SOURCE_HEIGHT}` }}
      >
        {scale > 0 && (
          <iframe
            src={`/pdf-preview/${templateId}`}
            title={name}
            tabIndex={-1}
            style={{
              width: SOURCE_WIDTH,
              height: SOURCE_HEIGHT,
              border: "none",
              transform: `scale(${scale})`,
              transformOrigin: "top left",
              pointerEvents: "none",
            }}
          />
        )}
      </div>
    </div>
  );
}
