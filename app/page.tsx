import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import TaglineStrip from '@/components/tagline-strip'
import ServicesSection from '@/components/services-section'
import PortfolioSection from '@/components/portfolio-section'
import MissionSection from '@/components/mission-section'
import PricingSection from '@/components/pricing-section'
import ContactSection from '@/components/contact-section'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <TaglineStrip />
      <ServicesSection />
      <PortfolioSection />
      <MissionSection />
      <PricingSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
