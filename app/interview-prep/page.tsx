import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import InterviewPrepAnonymousForm from "@/components/interview-prep-anonymous-form";

export default function InterviewPrepPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="hidden md:block absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-primary/12 rounded-full blur-[120px] animate-glow-pulse pointer-events-none" />

      <div className="relative z-10 flex items-center justify-center px-6 py-32">
        <InterviewPrepAnonymousForm />
      </div>
      <Footer />
    </div>
  );
}
