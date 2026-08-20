import PdfTemplatesBody from "./PdfTemplatesBody";

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
  return <PdfTemplatesBody />;
}
