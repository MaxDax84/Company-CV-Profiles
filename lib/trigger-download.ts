"use client";

// Fetches a file URL as a blob and saves it via a programmatic <a download>
// click, instead of a plain `window.location.href = url` navigation. The
// difference that matters here: this is awaitable — the caller knows
// exactly when the file has actually finished downloading (to dismiss a
// loading state), which a bare href navigation never signals at all.
// Preserves the server's own Content-Disposition filename. Returns the
// response headers so callers can read a signal like the PDF route's
// X-Compact-Applied without a second request.
export async function triggerDownload(url: string): Promise<Headers> {
  const res = await fetch(url);
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? "Download fallito, riprova.");
  }

  const blob = await res.blob();
  const disposition = res.headers.get("content-disposition") ?? "";
  const match = disposition.match(/filename="?([^";]+)"?/);
  const filename = match?.[1] ?? "download.pdf";

  const blobUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(blobUrl);

  return res.headers;
}
