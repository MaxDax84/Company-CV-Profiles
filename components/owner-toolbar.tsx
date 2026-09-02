"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Coins } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import AccountAvatarMenu from "@/components/account-avatar-menu";
import ActionFeedbackPopup from "@/components/action-feedback-popup";
import { useLanguage } from "@/components/language-provider";

interface OwnerToolbarProps {
  kind: "primary" | "tailored" | "translated";
}

// Shown only to the profile's own owner (see app/[code]/[slug]/page.tsx) —
// a visitor opening the shared link never sees this. Purpose-built for this
// one context (a three-zone bar: back link / centered logo / credits+avatar)
// rather than reusing the generic site <Navigation/>, which has no "back to
// dashboard" link and crowds credits+avatar+hamburger into one corner.
//
// Every template has its own `position: fixed; top: 0; z-index: 100` nav
// bar (see components/templates/Template*.tsx) — this bar sits at the same
// 64px height with a higher z-index, fully covering it rather than
// stacking underneath or beside it.
export default function OwnerToolbar({ kind }: OwnerToolbarProps) {
  const { lang } = useLanguage();
  const [credits, setCredits] = useState<number | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setDisplayName(data.user.email ?? "");
      const [{ data: settings }, { data: accountCredits }] = await Promise.all([
        supabase.from("account_settings").select("avatar_url").eq("user_id", data.user.id).maybeSingle(),
        supabase.from("account_credits").select("credits").eq("user_id", data.user.id).maybeSingle(),
      ]);
      setAvatarUrl((settings?.avatar_url as string | undefined) ?? null);
      setCredits((accountCredits?.credits as number | undefined) ?? null);
    });
  }, []);

  return (
    <>
      <div
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 200, height: 64 }}
        className="bg-background/95 backdrop-blur-md border-b border-border/60"
      >
        <div className="max-w-6xl mx-auto px-6 h-16 grid grid-cols-3 items-center">
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-foreground transition-colors w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>

          <a href="/" className="flex items-center justify-center gap-2 group">
            {/* eslint-disable-next-line @next/next/no-img-element -- small fixed-size mark, same as the global nav */}
            <img src="/icon.png" alt="" className="w-7 h-7 rounded-lg" />
            <span className="font-heading font-bold text-base tracking-tight">Jobli</span>
          </a>

          <div className="flex items-center justify-end gap-3">
            {credits !== null && (
              <a
                href="/account?tab=credits"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/60 hover:border-primary/50 text-sm font-semibold text-foreground transition-all duration-200"
                title={lang === "en" ? "Your credit balance" : "Il tuo saldo crediti"}
              >
                <Coins className="w-3.5 h-3.5 text-primary" />
                {credits}
              </a>
            )}
            <AccountAvatarMenu avatarUrl={avatarUrl} displayName={displayName} />
          </div>
        </div>
      </div>
      {/* Own page freshly opened is already the "got real value" moment
          here (unlike /tailor, which produces a downloadable file rather
          than a page) — no need to wait for an actual download. */}
      {kind === "primary" && <ActionFeedbackPopup actionType="generate" trigger={true} />}
    </>
  );
}
