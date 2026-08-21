import Link from "next/link";

// Every article ends with this — the whole point of the blog is bringing
// organic/SEO traffic in and pointing it at the actual product. IT-only for
// now, matching the rest of the blog (see lib/blog-posts.ts).
export default function BlogCta() {
  return (
    <div
      className="rounded-2xl p-8 text-center space-y-4 mt-4"
      style={{ background: "#101996" }}
    >
      <h3 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-white">
        Vuoi vedere il tuo CV con questi occhi?
      </h3>
      <p className="text-white/70 text-sm max-w-md mx-auto leading-relaxed">
        Carica il tuo CV su Jobli: ricevi un punteggio ATS reale e una pagina profilo pronta da condividere, in pochi minuti.
      </p>
      <Link
        href="/generate"
        className="inline-flex px-7 py-3 rounded-xl font-semibold text-sm transition-all duration-200 hover:-translate-y-0.5"
        style={{ background: "#c7f36b", color: "#101996" }}
      >
        Carica il tuo CV gratis →
      </Link>
    </div>
  );
}
