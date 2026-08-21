"use client";

import { useEffect, useRef, useState } from "react";
import { BLOG_CATEGORIES } from "@/lib/blog-posts";
import { useLanguage } from "@/components/language-provider";

interface BlogNavDropdownProps {
  triggerClassName?: string;
  label: string;
}

// Desktop-only dropdown for "Blog": links straight to each macro-category
// (via /blog?category=..., read by app/blog/BlogIndexBody.tsx) instead of
// listing individual articles — same click-to-toggle + click-outside
// pattern as components/account-avatar-menu.tsx. Mobile keeps a plain
// "/blog" link (see navigation.tsx) — a dropdown doesn't translate well to
// a touch accordion, and the mobile menu already lists every link flat.
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

  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen((v) => !v)} className={triggerClassName}>
        {label}
      </button>

      {open && (
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl border border-border bg-background shadow-2xl z-50 overflow-hidden py-1.5">
          <a
            href="/blog"
            onClick={() => setOpen(false)}
            className="block px-4 py-2.5 text-sm font-semibold hover:bg-foreground/[0.05] transition-colors"
            style={{ color: "var(--primary)" }}
          >
            {lang === "en" ? "All articles" : "Tutti gli articoli"}
          </a>
          <div className="my-1.5 border-t border-border" />
          {BLOG_CATEGORIES.map((category) => (
            <a
              key={category}
              href={`/blog?category=${encodeURIComponent(category)}`}
              onClick={() => setOpen(false)}
              className="block px-4 py-2.5 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors"
            >
              {category}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
