"use client";

import { UploadCloud, MessageSquareText, ArrowRight } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { useLanguage } from "@/components/language-provider";

export default function StartPage() {
  const { lang } = useLanguage();

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="hidden md:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/12 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-3xl space-y-10">
          <div className="text-center space-y-3">
            <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight">
              {lang === "en" ? "Where do you want to start?" : "Da dove vuoi partire?"}
            </h1>
            <p className="text-muted-foreground">
              {lang === "en"
                ? "Two ways to get ready — pick one, you can always do the other later."
                : "Due modi per prepararti — scegline uno, l'altro puoi sempre farlo dopo."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <a
              href="/generate"
              className="group glass-card flex flex-col gap-4 rounded-3xl p-8 border transition-all duration-200 hover:-translate-y-1"
              style={{ borderColor: "color-mix(in srgb, var(--accent-cyan) 45%, transparent)" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent-cyan) 18%, transparent)" }}>
                <UploadCloud className="w-7 h-7" style={{ color: "color-mix(in srgb, var(--accent-cyan) 70%, var(--foreground))" }} />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-heading text-xl font-bold">
                  {lang === "en" ? "Upload your CV" : "Carica il tuo CV"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === "en"
                    ? "Turn it into an ATS-optimized profile page and PDF, ready to send in minutes."
                    : "Trasformalo in un profilo ottimizzato per gli ATS e in un PDF, pronto in pochi minuti."}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "color-mix(in srgb, var(--accent-cyan) 70%, var(--foreground))" }}>
                {lang === "en" ? "Get started" : "Inizia"} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>

            <a
              href="/interview-prep"
              className="group glass-card flex flex-col gap-4 rounded-3xl p-8 border transition-all duration-200 hover:-translate-y-1"
              style={{ borderColor: "color-mix(in srgb, var(--accent-cyan) 45%, transparent)" }}
            >
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: "color-mix(in srgb, var(--accent-cyan) 18%, transparent)" }}>
                <MessageSquareText className="w-7 h-7" style={{ color: "color-mix(in srgb, var(--accent-cyan) 70%, var(--foreground))" }} />
              </div>
              <div className="space-y-1.5">
                <h2 className="font-heading text-xl font-bold">
                  {lang === "en" ? "Prepare for an interview" : "Prepara un colloquio"}
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {lang === "en"
                    ? "Paste a job posting and get a report on the company, its culture, and what to expect."
                    : "Incolla un annuncio e ottieni un report sull'azienda, la sua cultura e cosa aspettarti."}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1.5 text-sm font-semibold" style={{ color: "color-mix(in srgb, var(--accent-cyan) 70%, var(--foreground))" }}>
                {lang === "en" ? "Get started" : "Inizia"} <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </span>
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
