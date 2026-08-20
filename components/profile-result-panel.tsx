"use client";

import { useState, type ReactNode } from "react";
import { Copy, Check, Share2 } from "lucide-react";
import type { ProfileSchema } from "@/lib/schema";
import { useLanguage } from "@/components/language-provider";

export interface ProfileResultPanelLabels {
  done: string;
  doneNote: string;
  doneExpiry: string;
  openProfile: string;
  copyLink: string;
  copyLinkDone: string;
  share: string;
  generateAnother: string;
  // Short "why a web page, not just a PDF" blurb — optional since /tailor's
  // result (already a saved, owned profile) doesn't need to re-sell the format.
  valueTitle?: string;
  valueText?: string;
}

interface ProfileResultPanelProps {
  slug: string;
  // The account's permanent code — present once the profile is claimed
  // (e.g. /tailor's result, saved straight to the caller's account), absent
  // for a still-pending /generate preview (which uses /profile/<slug>
  // instead, and never actually renders the link this feeds — see the
  // claimSlot check below).
  code?: string;
  profile: ProfileSchema;
  accentColor: string;
  labels: ProfileResultPanelLabels;
  onReset: () => void;
  // Each flow's before/after comparison is semantically different (raw PDF
  // vs. rewritten bio for /generate; original vs. tailored bio for /tailor,
  // no PDF involved), so it stays a slot rather than shared logic here.
  beforeAfter?: ReactNode;
  // e.g. a "Download PDF" button on /tailor, or an invite to /tailor here.
  extraActions?: ReactNode;
  // The claim-a-free-account CTA on /generate's still-pending preview.
  // /tailor never renders this — its result is already saved to the
  // caller's own (already-authenticated) account.
  claimSlot?: ReactNode;
  // /tailor's result never gets a public web page (job-adapted CVs are
  // PDF/cover-letter only, see lib/profile-store.ts getProfileByAccountCode)
  // — hides the "Apri profilo"/copy-link/share block, which would otherwise
  // point at a URL that 404s.
  hideWebPageActions?: boolean;
  // /tailor replaces this with its own "vai ai CV adattati" link in
  // extraActions instead — "adatta un altro" competing right next to
  // download buttons for the CV just produced was the wrong second action.
  hideGenerateAnother?: boolean;
}

export default function ProfileResultPanel({
  slug,
  code,
  profile,
  accentColor,
  labels,
  onReset,
  beforeAfter,
  extraActions,
  claimSlot,
  hideWebPageActions,
  hideGenerateAnother,
}: ProfileResultPanelProps) {
  const [copied, setCopied] = useState(false);
  const { lang } = useLanguage();
  const path = code ? `/${code}/${slug}` : `/profile/${slug}`;

  function profileUrl() {
    return typeof window !== "undefined" ? `${window.location.origin}${path}` : "";
  }

  async function handleCopyLink() {
    await navigator.clipboard.writeText(profileUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleShare() {
    const url = profileUrl();
    if (navigator.share) {
      try {
        await navigator.share({ url, title: profile.personal_info.full_name });
      } catch {
        // user cancelled the share sheet — nothing to do
      }
    } else {
      await handleCopyLink();
    }
  }

  return (
    <div
      className="rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center space-y-5"
      style={{ boxShadow: "0 0 40px color-mix(in srgb, var(--primary) 14%, transparent)" }}
    >
      <div className="text-4xl">✅</div>
      <div>
        <p className="font-semibold text-foreground">{labels.done}</p>
        {labels.doneNote && <p className="text-sm text-muted-foreground mt-1">{labels.doneNote}</p>}
      </div>
      <p className="text-xs text-muted-foreground/50">{labels.doneExpiry}</p>

      {labels.valueTitle && labels.valueText && (
        <div className="text-left rounded-2xl border border-foreground/10 bg-foreground/[0.02] p-4 space-y-1">
          <p className="text-xs font-semibold text-foreground/80">{labels.valueTitle}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{labels.valueText}</p>
        </div>
      )}

      {beforeAfter}

      {/* Still a pending preview (no account behind it yet) — opening,
          copying, or sharing this link is premature: it's unclaimed and
          will expire, so these actions only appear once there's no
          claimSlot to fill (i.e. the profile is already permanently saved). */}
      {!claimSlot && !hideWebPageActions && (
        <>
          <a
            href={path}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3 px-4 rounded-2xl font-semibold text-sm transition-all hover:opacity-90 hover:shadow-lg"
            style={{ background: accentColor, color: "#000", boxShadow: `0 4px 20px ${accentColor}50` }}
          >
            {labels.openProfile}
          </a>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border border-foreground/10 bg-foreground/[0.03] text-foreground/80 transition-all hover:bg-foreground/[0.06]"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? labels.copyLinkDone : labels.copyLink}
            </button>
            <button
              onClick={handleShare}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border border-foreground/10 bg-foreground/[0.03] text-foreground/80 transition-all hover:bg-foreground/[0.06]"
            >
              <Share2 className="w-3.5 h-3.5" />
              {labels.share}
            </button>
          </div>
        </>
      )}

      {extraActions}

      {claimSlot}

      {/* Hidden while there's a claimSlot to fill (still a pending, unclaimed
          preview) — "Procedi"/"Crea account" is the one and only action that
          makes sense there; offering to throw the preview away and start
          over right next to it was just noise. Still shown once the profile
          is permanently saved (e.g. /tailor's own done state). */}
      {!claimSlot && !hideGenerateAnother && (
        <button
          onClick={onReset}
          className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors"
        >
          {labels.generateAnother}
        </button>
      )}

      <p className="text-[11px] text-muted-foreground/40 leading-relaxed pt-1">
        {lang === "en"
          ? "Jobli helps optimize your CV and pass ATS filters, but doesn't guarantee an interview or a hire."
          : "Jobli aiuta a ottimizzare il CV e a superare i filtri ATS, ma non garantisce un colloquio o un'assunzione."}
      </p>
    </div>
  );
}
