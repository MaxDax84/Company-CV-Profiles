import Navigation from '@/components/navigation'
import HeroSection from '@/components/hero-section'
import MissionSection from '@/components/mission-section'
import ServicesSection from '@/components/services-section'
import PricingSection from '@/components/pricing-section'
import TailorExampleSection from '@/components/tailor-example-section'
import AboutSection from '@/components/about-section'
import FaqSection from '@/components/faq-section'
import FinalCtaSection from '@/components/final-cta-section'
import Footer from '@/components/footer'
import JsonLd from '@/components/json-ld'
import { SUPPORT_EMAIL } from '@/lib/contact'
import { SITE_NAME, SITE_URL } from '@/lib/site'

// Structured data for the homepage. Two graphs rather than one blob: an
// Organization node that other pages' schema can point back at by @id, and
// a SoftwareApplication node describing the product itself. The FAQPage
// schema for this page's Q&A lives in components/faq-section.tsx, next to
// the content it describes, so the two can't drift apart.
const ORGANIZATION_ID = `${SITE_URL}/#organization`

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': ORGANIZATION_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  email: SUPPORT_EMAIL,
  description:
    'Jobli usa l\'AI per dare un punteggio al tuo CV, ottimizzarlo per i sistemi ATS e adattarlo a ogni annuncio, senza mai inventare informazioni che non hai scritto.',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Milano',
    addressCountry: 'IT',
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer support',
    email: SUPPORT_EMAIL,
    availableLanguage: ['it', 'en'],
  },
}

const softwareApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  '@id': `${SITE_URL}/#software`,
  name: SITE_NAME,
  url: SITE_URL,
  applicationCategory: 'BusinessApplication',
  // A web app: no download, runs in any browser.
  operatingSystem: 'Web',
  inLanguage: ['it', 'en'],
  publisher: { '@id': ORGANIZATION_ID },
  description:
    'Carica il PDF del tuo CV: Jobli lo analizza, gli assegna un punteggio su 4 criteri, ne genera una pagina profilo condivisibile, lo adatta a un annuncio di lavoro e lo esporta in un PDF ottimizzato per i sistemi ATS.',
  featureList: [
    'Punteggio del CV su 4 criteri (risultati misurabili, chiarezza, struttura ATS, competenze specifiche)',
    'Ottimizzazione dei contenuti senza inventare nulla',
    'Pagina profilo pubblica e condivisibile',
    'Esportazione in PDF ottimizzato per i sistemi ATS',
    'Esportazione in documento Word',
    'Adattamento del CV a uno specifico annuncio di lavoro',
    'Generazione della lettera di presentazione',
    'Traduzione del CV e della lettera in 6 lingue',
    'Preparazione al colloquio con ricerca sull\'azienda',
    'Chat con l\'AI per completare le informazioni mancanti nel CV',
  ],
  // Free during the beta: the credit model runs on the 3 welcome credits
  // plus free top-ups on request, and nothing on the site can be bought.
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'EUR',
    availability: 'https://schema.org/InStock',
  },
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <JsonLd data={organizationSchema} />
      <JsonLd data={softwareApplicationSchema} />
      <Navigation />
      <HeroSection />
      <MissionSection />
      <ServicesSection />
      <PricingSection />
      <TailorExampleSection />
      <AboutSection />
      {/* TestimonialsSection intentionally not rendered — kept in
          components/testimonials-section.tsx, unpublished for now. */}
      <FaqSection />
      <FinalCtaSection />
      <Footer />
    </main>
  )
}
