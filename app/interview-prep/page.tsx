import { redirect } from "next/navigation";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { createServerSupabaseClient } from "@/lib/supabase/server";

// "Prepara il colloquio" is account-only — no anonymous preview, unlike
// /generate's CV flow. A signed-in visitor lands straight on the real
// feature (the "Prepara il colloquio" tab in /account); an anonymous one
// gets a plain prompt to sign up or log in instead of a form that would
// otherwise let them spend a real Claude research call for free.
export default async function InterviewPrepPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/account?tab=interview");

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="hidden md:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/12 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-sm space-y-6 text-center">
          <h1 className="font-heading text-2xl font-bold tracking-tight">Prepara il colloquio</h1>
          <p className="text-sm text-muted-foreground">
            Questa funzione richiede un account gratuito — i nuovi account partono con 3 crediti omaggio.
          </p>
          <div className="flex flex-col gap-3">
            <a
              href="/signup"
              className="w-full py-3 rounded-xl font-semibold text-sm text-center transition-all"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Crea account gratis
            </a>
            <a
              href="/login"
              className="w-full py-3 rounded-xl font-semibold text-sm text-center border border-foreground/10 hover:bg-foreground/[0.06] transition-all"
            >
              Ho già un account — accedi
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
