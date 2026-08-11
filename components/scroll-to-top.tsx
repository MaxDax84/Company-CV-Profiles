"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Guarantees every route change lands scrolled to the top of the page,
// regardless of how the navigation happened (next/link, router.push, or a
// plain <a href> full reload — most of this site's nav links are plain
// anchors, which already reset scroll on their own, but client-side
// navigations via router.push (login/signup redirects, etc.) don't always).
export default function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
