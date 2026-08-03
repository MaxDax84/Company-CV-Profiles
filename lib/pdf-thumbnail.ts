// Renders the first page of a PDF File to a PNG data URL, entirely in the
// browser (no upload, no server round-trip, no cost). Used for the "before"
// side of the prima/dopo comparison on /generate.

const TARGET_WIDTH = 500;

export async function renderPdfThumbnail(file: File): Promise<string> {
  const pdfjsLib = await import("pdfjs-dist");
  pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const page = await pdf.getPage(1);

  const unscaledViewport = page.getViewport({ scale: 1 });
  const scale = TARGET_WIDTH / unscaledViewport.width;
  const viewport = page.getViewport({ scale });

  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;

  await page.render({ canvas, viewport }).promise;

  return canvas.toDataURL("image/png");
}
