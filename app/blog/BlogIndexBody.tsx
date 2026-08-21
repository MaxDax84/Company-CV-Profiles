"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-posts";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

export default function BlogIndexBody() {
  // Lets the nav's Blog section (components/navigation.tsx) link straight
  // to a filtered category, e.g. /blog?category=ATS — read once on mount,
  // then the filter is purely local state same as before.
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [category, setCategory] = useState<string | null>(
    initialCategory && (BLOG_CATEGORIES as readonly string[]).includes(initialCategory) ? initialCategory : null
  );
  const [query, setQuery] = useState("");

  const posts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return [...BLOG_POSTS]
      .filter((post) => !category || post.category === category)
      .filter((post) => !q || post.title.toLowerCase().includes(q) || post.excerpt.toLowerCase().includes(q))
      .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || b.publishedAt.localeCompare(a.publishedAt));
  }, [category, query]);

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-3xl mx-auto px-6 text-center mb-10">
          <p className="text-xs font-semibold text-primary uppercase tracking-[0.18em] mb-3">Blog</p>
          <h1 className="font-heading text-2xl md:text-4xl font-bold tracking-tight mb-3">
            Colloqui, CV, ATS e carriera
          </h1>
          <p className="text-muted-foreground text-sm md:text-base max-w-xl mx-auto">
            Articoli brevi e diretti, senza riempitivi. Presi da quello che vediamo davvero funzionare (o non funzionare) nelle candidature.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-6 mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-sm mx-auto">
            <Search className="w-4 h-4 text-muted-foreground/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cerca per parola chiave…"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foreground/10 bg-foreground/[0.03] text-sm outline-none focus:border-primary/50 transition-colors"
            />
          </div>

          {/* Category filters */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors ${category === null ? "" : "bg-foreground/[0.06] text-muted-foreground"}`}
              style={category === null ? { background: "var(--primary)", color: "var(--primary-foreground)" } : undefined}
            >
              Tutti
            </button>
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-colors"
                style={
                  category === cat
                    ? { background: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
                    : { borderColor: "var(--border)", color: "var(--muted-foreground)" }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-6">
          {posts.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-16">
              Nessun articolo trovato. Prova un&apos;altra parola chiave o categoria.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
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
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
