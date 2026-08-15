import Navigation from "@/components/navigation";
import ForgotPasswordForm from "@/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      {/* Decorative only — hidden on mobile: a large animated blur is real
          continuous GPU cost, and this element contributes nothing to the
          mobile layout. */}
      <div className="hidden md:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center px-6 py-32">
        <div className="w-full max-w-sm space-y-8">
          <div className="text-center space-y-2">
            <h1 className="font-heading text-2xl font-bold tracking-tight">Password dimenticata?</h1>
            <p className="text-sm text-muted-foreground">Ti mandiamo un link per reimpostarla.</p>
          </div>
          <div className="glass-card rounded-2xl p-8">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}
