"use client";

import { Suspense } from "react";
import Navigation from "@/components/navigation";
import LoginForm from "@/components/login-form";
import { useLanguage } from "@/components/language-provider";

export default function LoginPageBody() {
  const { lang } = useLanguage();

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="hidden md:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">
              {lang === "en" ? "Welcome back" : "Bentornato"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {lang === "en" ? "Log in to your Jobli profile." : "Accedi al tuo profilo Jobli."}
            </p>
          </div>
          <div className="glass-card rounded-2xl p-8">
            <Suspense fallback={null}>
              <LoginForm />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
