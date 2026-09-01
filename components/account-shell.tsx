"use client";

import { useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { ProfileSchema } from "@/lib/schema";
import type { CreditLedgerEntry } from "@/lib/credits";
import type { PaidDownloadEntry } from "@/lib/paid-downloads";
import type { GeneratedCoverLetterEntry } from "@/lib/cover-letters";
import type { InterviewPrepListItem } from "@/components/interview-prep-panel";
import AccountTabs, { isTabId, getTabTitle, type TabId } from "@/components/account-tabs";
import { useLanguage } from "@/components/language-provider";

type ProfileRow = { id: string; slug: string; data: ProfileSchema; created_at: string };

interface AccountShellProps {
  userEmail: string;
  accountCode: string;
  primaryProfiles: ProfileRow[];
  tailoredProfiles: ProfileRow[];
  translatedProfiles: ProfileRow[];
  credits: number;
  ledger: CreditLedgerEntry[];
  paidDownloads: PaidDownloadEntry[];
  coverLetters: GeneratedCoverLetterEntry[];
  creditsLastRequestedAt: string | null;
  interviewPreps: InterviewPrepListItem[];
}

// Account settings now live on their own page (app/account/settings), not a
// drawer here — reached via the avatar dropdown in the global nav (see
// components/account-avatar-menu.tsx), so this shell only owns which
// commercial tab is showing.
export default function AccountShell({ userEmail, accountCode, primaryProfiles, tailoredProfiles, translatedProfiles, credits, ledger, paidDownloads, coverLetters, creditsLastRequestedAt, interviewPreps }: AccountShellProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const requestedTab = searchParams.get("tab");
  const [tab, setTabState] = useState<TabId>(isTabId(requestedTab) ? requestedTab : "dashboard");

  // Mirrors the active tab into the URL (?tab=...) so refreshing the page —
  // or sharing/bookmarking the link — lands back on the same section
  // instead of always resetting to the default. replace, not push: switching
  // tabs isn't a "new page" for back-button purposes.
  const setTab = useCallback((next: TabId) => {
    setTabState(next);
    router.replace(`/account?tab=${next}`, { scroll: false });
  }, [router]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">{getTabTitle(tab, lang)}</h1>
      </div>

      <AccountTabs
        userEmail={userEmail}
        accountCode={accountCode}
        primaryProfiles={primaryProfiles}
        tailoredProfiles={tailoredProfiles}
        translatedProfiles={translatedProfiles}
        credits={credits}
        ledger={ledger}
        paidDownloads={paidDownloads}
        coverLetters={coverLetters}
        creditsLastRequestedAt={creditsLastRequestedAt}
        interviewPreps={interviewPreps}
        tab={tab}
        setTab={setTab}
      />
    </div>
  );
}
