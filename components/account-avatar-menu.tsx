"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutDashboard, Settings, HelpCircle, Mail, LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useRouter } from "next/navigation";

interface AccountAvatarMenuProps {
  avatarUrl: string | null;
  displayName: string;
}

// Round avatar + dropdown, top-right of the global nav (see
// components/navigation.tsx) whenever a real Supabase session is present —
// the entry point for Dashboard/Account/FAQ/Contatti/Esci from ANY page,
// not just while already on /account. Every item is a plain link (not a
// local-state callback) so it works identically regardless of which page
// it's rendered from.
export default function AccountAvatarMenu({ avatarUrl, displayName }: AccountAvatarMenuProps) {
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const initial = displayName.trim().charAt(0).toUpperCase() || "?";

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  async function handleLogout() {
    setLoggingOut(true);
    const supabase = createBrowserSupabaseClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const ITEMS = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/account?tab=dashboard" },
    { icon: Settings, label: "Account", href: "/account/settings" },
    { icon: HelpCircle, label: "FAQ", href: "/faq" },
    { icon: Mail, label: "Contatti / Supporto", href: "/#contact" },
  ];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Menu account"
        className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary/30 hover:border-primary/60 transition-colors bg-primary/10 flex items-center justify-center font-semibold text-xs text-primary shrink-0"
      >
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt={displayName} className="w-full h-full object-cover" />
        ) : (
          initial
        )}
      </button>

      {open && (
        <div className="absolute top-full right-0 mt-2 w-56 rounded-2xl border border-border bg-background shadow-2xl overflow-hidden z-50 py-1.5">
          {ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-foreground/[0.05] transition-colors"
              onClick={() => setOpen(false)}
            >
              <item.icon className="w-4 h-4 text-muted-foreground" />
              {item.label}
            </a>
          ))}
          <div className="my-1.5 border-t border-border" />
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-500/[0.06] transition-colors disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            {loggingOut ? "Uscita…" : "Esci"}
          </button>
        </div>
      )}
    </div>
  );
}
