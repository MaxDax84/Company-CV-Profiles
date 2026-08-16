"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import type { ProfileSchema } from "@/lib/schema";
import type { CreditLedgerEntry } from "@/lib/credits";
import type { PaidDownloadEntry } from "@/lib/paid-downloads";
import AccountTabs, { isTabId, getTabTitle, type TabId } from "@/components/account-tabs";

type ProfileRow = { id: string; slug: string; data: ProfileSchema; created_at: string };

interface AccountShellProps {
  userEmail: string;
  accountCode: string;
  primaryProfiles: ProfileRow[];
  tailoredProfiles: ProfileRow[];
  credits: number;
  ledger: CreditLedgerEntry[];
  paidDownloads: PaidDownloadEntry[];
}

// Account settings now live on their own page (app/account/settings), not a
// drawer here — reached via the avatar dropdown in the global nav (see
// components/account-avatar-menu.tsx), so this shell only owns which
// commercial tab is showing.
export default function AccountShell({ userEmail, accountCode, primaryProfiles, tailoredProfiles, credits, ledger, paidDownloads }: AccountShellProps) {
  const searchParams = useSearchParams();
  const requestedTab = searchParams.get("tab");
  const [tab, setTab] = useState<TabId>(isTabId(requestedTab) ? requestedTab : "dashboard");

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight">{getTabTitle(tab)}</h1>
      </div>

      <AccountTabs
        userEmail={userEmail}
        accountCode={accountCode}
        primaryProfiles={primaryProfiles}
        tailoredProfiles={tailoredProfiles}
        credits={credits}
        ledger={ledger}
        paidDownloads={paidDownloads}
        tab={tab}
        setTab={setTab}
      />
    </div>
  );
}
