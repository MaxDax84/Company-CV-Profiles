import Navigation from '@/components/navigation'
import FaqSection from '@/components/faq-section'
import Footer from '@/components/footer'

export default function FaqPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <Navigation />
      <div className="absolute inset-0 grid-overlay" />
      <div className="relative z-10 pt-32 pb-16">
        <FaqSection />
      </div>
      <Footer />
    </div>
  )
}
