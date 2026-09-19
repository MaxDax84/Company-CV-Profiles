import type { Metadata } from "next";

// "use client" page, so metadata lives in this sibling layout — see
// app/start/layout.tsx. noindex: this page is only ever reached from a
// one-time recovery link and has nothing to offer a searcher.
export const metadata: Metadata = {
  title: "Reimposta password",
  robots: { index: false, follow: false },
};

export default function ResetPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
