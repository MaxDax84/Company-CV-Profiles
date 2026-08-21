import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import BlogCta from "@/components/blog-cta";
import { BLOG_POSTS, getBlogPost, type ContentBlock } from "@/lib/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Jobli Blog`,
    description: post.excerpt,
  };
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" });
}

function Block({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "h2":
      return <h2 className="font-heading text-xl md:text-2xl font-bold tracking-tight mt-10 mb-4">{block.text}</h2>;
    case "p":
      return <p className="text-[15px] leading-relaxed text-foreground/85 mb-4">{block.text}</p>;
    case "ul":
      return (
        <ul className="space-y-2 mb-4 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-relaxed text-foreground/85">
              <span className="text-primary shrink-0">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "quote":
      return (
        <blockquote className="border-l-2 pl-5 my-6 space-y-1.5" style={{ borderColor: "var(--primary)" }}>
          <p className="text-[15px] leading-relaxed text-foreground/85 italic">{block.text}</p>
          <p className="text-xs text-muted-foreground/60">— {block.source}</p>
        </blockquote>
      );
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-2xl mx-auto px-6">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            ← Tutti gli articoli
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-primary/10 text-primary">
              {post.category}
            </span>
            <span className="text-[11px] text-muted-foreground/50">
              {formatDate(post.publishedAt)} · {post.readingMinutes} min di lettura
            </span>
          </div>

          <h1 className="font-heading text-2xl md:text-4xl font-bold tracking-tight mb-4">{post.title}</h1>
          <p className="text-muted-foreground text-base leading-relaxed mb-10">{post.excerpt}</p>

          <article>
            {post.content.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </article>

          <div className="mt-12">
            <BlogCta />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
