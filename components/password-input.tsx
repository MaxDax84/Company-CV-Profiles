"use client";

import { useState } from "react";
import type { InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

// Drop-in replacement for <input type="password">, everywhere one appears
// (login, signup, change/reset password) — a toggle button reveals the
// typed value in plain text, same as virtually every modern password field.
// tabIndex={-1} keeps it out of the tab order between the password field
// and whatever comes next, since it's a convenience action, not a form step.
export default function PasswordInput({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  const [visible, setVisible] = useState(false);
  const { lang } = useLanguage();

  return (
    <div className="relative">
      <input
        {...props}
        type={visible ? "text" : "password"}
        className={`${className ?? ""} pr-10`}
      />
      <button
        type="button"
        tabIndex={-1}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? (lang === "en" ? "Hide password" : "Nascondi password") : (lang === "en" ? "Show password" : "Mostra password")}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 hover:text-foreground transition-colors"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
