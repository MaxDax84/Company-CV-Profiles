import PdfExportButton from "@/components/pdf-export-button";

interface OwnerToolbarProps {
  slug: string;
  kind: "primary" | "tailored";
}

// Shown only to the profile's own owner (see app/profile/[slug]/page.tsx) —
// a visitor opening the shared link never sees this. Without it, landing on
// your own public page was a dead end: no way back to the account, no way
// to grab the PDF, no way to tailor the CV to a job posting.
export default function OwnerToolbar({ slug, kind }: OwnerToolbarProps) {
  return (
    <div
      className="w-full flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 py-2.5 text-xs sm:text-sm"
      style={{ background: "rgba(10,10,14,0.95)", borderBottom: "1px solid rgba(255,255,255,0.08)" }}
    >
      <span className="text-white/40 hidden sm:inline">Questa è la tua pagina pubblica —</span>
      <a href="/account" className="font-semibold text-white/90 hover:text-white transition-colors">
        Il tuo account
      </a>
      <span className="text-white/20">·</span>
      <PdfExportButton
        slug={slug}
        label="Scarica PDF ↓"
        className="font-semibold text-white/90 hover:text-white transition-colors"
      />
      {kind === "primary" && (
        <>
          <span className="text-white/20">·</span>
          <a href={`/tailor?profile=${slug}`} className="font-semibold hover:opacity-80 transition-opacity" style={{ color: "#818cf8" }}>
            Adatta a un annuncio →
          </a>
        </>
      )}
    </div>
  );
}
