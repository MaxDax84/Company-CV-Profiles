"use client";

import { useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useLanguage } from "@/components/language-provider";

interface GoogleAuthButtonProps {
  // Same pending-CV claim token the password login/signup forms forward to
  // /api/claim — OAuth leaves the page entirely for Google, so it has to
  // ride along as a query param on the callback URL instead of in-memory
  // component state, then gets picked up server-side in
  // app/auth/callback/route.ts.
  claimToken?: string | null;
  // "interview" for a pending "Prepara il colloquio" report — see
  // app/api/claim/route.ts and app/auth/callback/route.ts.
  claimKind?: string | null;
}

export default function GoogleAuthButton({ claimToken, claimKind }: GoogleAuthButtonProps) {
  const [loading, setLoading] = useState(false);
  const { lang } = useLanguage();

  async function handleClick() {
    setLoading(true);
    const supabase = createBrowserSupabaseClient();
    const redirectTo = new URL("/auth/callback", window.location.origin);
    if (claimToken) redirectTo.searchParams.set("claim", claimToken);
    if (claimToken && claimKind) redirectTo.searchParams.set("kind", claimKind);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: redirectTo.toString() },
    });
    // On success the browser is already navigating to Google — this only
    // runs if signInWithOAuth itself failed before ever redirecting
    // (e.g. Google provider not configured yet).
    if (error) setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl border border-foreground/10 bg-background text-sm font-semibold text-foreground/80 transition-all duration-200 hover:bg-foreground/[0.03] hover:border-foreground/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
        <path fill="#4285F4" d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087c1.7018-1.5668 2.6836-3.8741 2.6836-6.615z" />
        <path fill="#34A853" d="M9 18c2.43 0 4.4673-.8059 5.9564-2.1805l-2.9087-2.2581c-.8059.54-1.8368.8591-3.0477.8591-2.3436 0-4.3282-1.5831-5.036-3.7104H.9573v2.3318C2.4382 15.9832 5.4818 18 9 18z" />
        <path fill="#FBBC05" d="M3.964 10.71c-.18-.54-.2822-1.1168-.2822-1.71s.1023-1.17.2823-1.71V4.9582H.9573C.3477 6.1732 0 7.5477 0 9s.3477 2.8268.9573 4.0418L3.964 10.71z" />
        <path fill="#EA4335" d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5814C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9573 4.9582L3.964 7.29C4.6718 5.1627 6.6564 3.5795 9 3.5795z" />
      </svg>
      {loading
        ? (lang === "en" ? "Redirecting to Google…" : "Ti reindirizzo a Google…")
        : (lang === "en" ? "Continue with Google" : "Continua con Google")}
    </button>
  );
}
