import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { SITE_URL } from "@/lib/site";

// Only genuinely public, indexable marketing routes belong here.
//
// Deliberately excluded:
// - /profile/[slug] and /[code]/[slug] (the generated CV pages). They set
//   `robots: { index: false, follow: false }` in their own metadata by
//   design: they hold someone's real career history, and the Privacy Policy
//   promises they aren't search-indexed. Listing them in a sitemap would
//   invite exactly the crawl that noindex is there to stop.
// - Anything behind a login (/account, /tailor, /generate's authed flow),
//   /login and /signup, and the /portfolio + /showcase demo pages, which are
//   internal design samples rather than pages a searcher should land on.
const STATIC_ROUTES: { path: string; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"]; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/start", changeFrequency: "monthly", priority: 0.9 },
  { path: "/faq", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // publishedAt is a plain ISO date ("2026-07-09") on every post — see
  // lib/blog-posts.ts. Articles are hand-written and effectively immutable
  // once out, so the publish date is an honest lastModified.
  const postEntries: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...staticEntries, ...postEntries];
}
