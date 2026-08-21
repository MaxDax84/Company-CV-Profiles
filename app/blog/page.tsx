import type { Metadata } from "next";
import Link from "next/link";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { BLOG_POSTS } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Jobli",
  description: "Consigli pratici su colloqui, CV, ATS e carriera, scritti per chi sta cercando lavoro adesso, non per fare numero.",
};

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexPage() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center mb-14">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-3">Blog</p>
          <h1 className="font-heading text-2xl md:text-4xl font-bold tracking-tight mb-3">
            Colloqui, CV, ATS e carriera
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Articoli brevi e diretti, senza riempitivi. Presi da quello che vediamo davvero funzionare (o non funzionare) nelle candidature.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 grid sm:grid-cols-2 gap-5">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group glass-card rounded-2xl p-6 flex flex-col transition-all duration-200 hover:border-primary/40 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                  {post.category}
                </span>
                <span className="text-[11px] text-muted-foreground/50">{post.readingMinutes} min di lettura</span>
              </div>
              <h2 className="font-heading text-lg font-bold tracking-tight mb-2 group-hover:text-primary transition-colors">
                {post.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{post.excerpt}</p>
              <p className="text-[11px] text-muted-foreground/40 mt-4">{formatDate(post.publishedAt)}</p>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
