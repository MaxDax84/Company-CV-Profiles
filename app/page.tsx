import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import MissionSection from '@/components/mission-section'
import ServicesSection from '@/components/services-section'
import AboutSection from '@/components/about-section'
import FaqSection from '@/components/faq-section'
import FinalCtaSection from '@/components/final-cta-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <MissionSection />
      <ServicesSection />
      <AboutSection />
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </main>
  )
}
