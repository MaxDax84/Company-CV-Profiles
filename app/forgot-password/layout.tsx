import type { Metadata } from "next";

// "use client" page, so metadata lives in this sibling layout — see
// app/start/layout.tsx. noindex for the same reason as /reset-password.
export const metadata: Metadata = {
  title: "Password dimenticata",
  robots: { index: false, follow: false },
};

export default function ForgotPasswordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
