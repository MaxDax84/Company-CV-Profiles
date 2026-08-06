import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import MissionSection from '@/components/mission-section'
import ServicesSection from '@/components/services-section'
import FinalCtaSection from '@/components/final-cta-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <MissionSection />
      <ServicesSection />
      <FinalCtaSection />
      <Footer />
    </main>
  )
}
