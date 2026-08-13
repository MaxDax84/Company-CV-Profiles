import Navigation from "@/components/navigation";

// Shown instead of crashing when an account-gated page loads before the
// Supabase project has been created/configured (see .env.local.example).
export default function SupabaseNotConfigured() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 flex items-center justify-center px-6 py-32">
        <div className="max-w-md w-full glass-card rounded-2xl p-8 text-center space-y-3">
          <p className="font-heading text-lg font-bold">Account non ancora configurati</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Questa pagina richiede un progetto Supabase collegato. Crealo su supabase.com, esegui
            <code className="mx-1 px-1.5 py-0.5 rounded bg-foreground/10 text-xs">supabase/migrations/0001_init.sql</code>
            e aggiungi le tre chiavi in <code className="px-1.5 py-0.5 rounded bg-foreground/10 text-xs">.env.local</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
