"use client";

import { useEffect, useRef, useState } from "react";
import { BLOG_POSTS, BLOG_CATEGORIES } from "@/lib/blog-posts";
import { useLanguage } from "@/components/language-provider";

interface BlogNavDropdownProps {
  triggerClassName?: string;
  label: string;
}

// Desktop-only mega-menu for "Blog": groups the 70 articles by their real
// category instead of dumping a single link to the index — mirrors the
// click-to-toggle + click-outside pattern already used by
// components/account-avatar-menu.tsx, so it behaves consistently with the
// rest of the nav. Mobile keeps a plain "/blog" link (see navigation.tsx) —
// hover/click mega-menus don't translate well to a touch accordion, and the
// mobile menu already lists every link flat.
export default function BlogNavDropdown({ triggerClassName, label }: BlogNavDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { lang } = useLanguage();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const columns = BLOG_CATEGORIES.map((category) => ({
    category,
    posts: [...BLOG_POSTS]
      .filter((p) => p.category === category)
      .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
      .slice(0, 2),
  }));

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)} className={triggerClassName}>
        {label}
      </button>

      {open && (
        <div
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[620px] max-w-[92vw] rounded-2xl border border-border bg-background shadow-2xl z-50 p-5 grid grid-cols-3 gap-5"
        >
          {columns.map((col) => (
            <div key={col.category} className="space-y-2.5 min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">{col.category}</p>
              <div className="space-y-2">
                {col.posts.map((post) => (
                  <a
                    key={post.slug}
                    href={`/blog/${post.slug}`}
                    onClick={() => setOpen(false)}
                    className="block group"
                  >
                    <p className="text-xs font-semibold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {post.title}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          ))}

          <div
            className="rounded-xl p-4 flex flex-col justify-between gap-3"
            style={{ background: "color-mix(in srgb, var(--primary) 8%, transparent)" }}
          >
            <p className="text-xs text-muted-foreground leading-relaxed">
              {lang === "en"
                ? "Over 70 short, practical articles on interviews, resumes, ATS, LinkedIn and career growth."
                : "Oltre 70 articoli brevi e pratici su colloqui, CV, ATS, LinkedIn e carriera."}
            </p>
            <a
              href="/blog"
              onClick={() => setOpen(false)}
              className="inline-flex items-center text-xs font-semibold"
              style={{ color: "var(--primary)" }}
            >
              {lang === "en" ? "See all articles →" : "Vedi tutti gli articoli →"}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
