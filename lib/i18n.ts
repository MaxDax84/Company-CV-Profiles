export type Language = 'en' | 'it'

export const translations = {
  en: {
    nav: {
      services: 'Services',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      contact: 'Contact',
    },
    hero: {
      badge: 'Professional Web Presence',
      titleGradient: 'Your Career,',
      titleNormal: 'Elevated Online.',
      subtitle:
        'GoOnWeb crafts elegant, fully personalized web CVs — a modern alternative to the traditional résumé. Choose your colors, your style, your domain.',
      ctaPrimary: 'View Portfolio',
      ctaSecondary: 'Get Started',
    },
    services: {
      sectionLabel: 'What We Offer',
      title: 'Everything You Need to Stand Out',
      subtitle:
        'From first design to going live, GoOnWeb handles every detail of your professional online presence.',
      cards: [
        {
          title: 'Custom Design',
          description:
            'Choose your colors, typography, and layout. We build a web CV that reflects who you are — not a template, a statement.',
        },
        {
          title: 'Domain Setup',
          description:
            'Get your own professional domain (yourname.com). We handle DNS configuration and deployment so you go live without any hassle.',
        },
        {
          title: 'Monthly Maintenance',
          description:
            'Career evolving? We keep your profile up to date. Up to 3 content updates per month, so your page is always accurate.',
        },
      ],
    },
    portfolio: {
      sectionLabel: 'Our Work',
      title: 'Real Profiles, Real Impact',
      subtitle:
        'Every project is handcrafted for the individual. Here are some examples of what we have delivered.',
      projects: [
        {
          label: 'Project Alpha',
          role: 'Finance & Management Professional',
          description:
            'A dark, sophisticated web CV with a violet accent palette — featuring a full career timeline, competency grid, and professional statistics dashboard.',
          tags: ['Finance', 'Management', 'Dark Theme', 'Timeline'],
        },
        {
          label: 'Project Beta',
          role: 'Business Consulting Executive',
          description:
            'A teal-accented executive profile with multilingual skills section, philosophy approach cards, and a results-driven narrative structure.',
          tags: ['Consulting', 'Strategy', 'Executive', 'Multilingual'],
        },
      ],
    },
    pricing: {
      sectionLabel: 'Pricing',
      title: 'Simple, Transparent Pricing',
      subtitle: 'No surprises. Pick the plan that fits your needs and get online.',
      mostPopular: 'Most Popular',
      oneTime: 'one-time',
      monthly: '/mo',
      plus: '+',
      plans: [
        {
          name: 'Basic',
          price: '35',
          priceMonthly: null,
          description: 'A beautiful, fully personalized web CV to get you online.',
          features: [
            'Custom design (colors, fonts, layout)',
            'All your content included',
            'Mobile responsive',
            'Delivered in 5 business days',
            'Hosted on GoOnWeb infrastructure',
          ],
          cta: 'Get Started',
          highlighted: false,
        },
        {
          name: 'Standard',
          price: '50',
          priceMonthly: null,
          description: 'Your web CV live on your own professional domain.',
          features: [
            'Everything in Basic',
            'Custom domain (.com, .it, etc.)',
            'DNS configuration included',
            '1 year domain registration',
            'Go live with your own address',
          ],
          cta: 'Get Started',
          highlighted: true,
        },
        {
          name: 'Premium',
          price: '50',
          priceMonthly: '25',
          description: 'Domain included + ongoing care for a profile that stays current.',
          features: [
            'Everything in Standard',
            'Up to 3 content updates/month',
            'Priority support',
            'Performance monitoring',
            'Your profile always up to date',
          ],
          cta: 'Get Started',
          highlighted: false,
        },
      ],
    },
    contact: {
      sectionLabel: 'Contact',
      title: "Let's Build Your Presence",
      subtitle:
        'Have a question or ready to get started? Drop us a message and we will get back to you shortly.',
      form: {
        name: 'Your Name',
        namePlaceholder: 'John Doe',
        email: 'Email Address',
        emailPlaceholder: 'john@example.com',
        message: 'Message',
        messagePlaceholder: 'Tell us a bit about yourself and what you are looking for...',
        submit: 'Send Message',
        sending: 'Sending...',
        success: "Message sent! We'll be in touch soon.",
        error: 'Something went wrong. Please try again or email us directly.',
      },
    },
    footer: {
      tagline: 'Crafting professional web presences, one profile at a time.',
      rights: '© 2025 GoOnWeb. All rights reserved.',
    },
  },

  it: {
    nav: {
      services: 'Servizi',
      portfolio: 'Portfolio',
      pricing: 'Prezzi',
      contact: 'Contatti',
    },
    hero: {
      badge: 'Presenza Professionale Online',
      titleGradient: 'La Tua Carriera,',
      titleNormal: 'Elevata Online.',
      subtitle:
        'GoOnWeb crea eleganti CV web completamente personalizzati — un\'alternativa moderna al curriculum tradizionale. Scegli i tuoi colori, il tuo stile, il tuo dominio.',
      ctaPrimary: 'Vedi il Portfolio',
      ctaSecondary: 'Inizia Ora',
    },
    services: {
      sectionLabel: 'Cosa Offriamo',
      title: 'Tutto il Necessario per Distinguerti',
      subtitle:
        'Dal primo design al lancio online, GoOnWeb gestisce ogni dettaglio della tua presenza professionale sul web.',
      cards: [
        {
          title: 'Design Personalizzato',
          description:
            'Scegli colori, tipografia e layout. Creiamo un CV web che riflette davvero chi sei — non un template, una dichiarazione d\'identità.',
        },
        {
          title: 'Configurazione Dominio',
          description:
            'Ottieni il tuo dominio professionale (tuonome.com). Gestiamo DNS e deploy così puoi andare online senza problemi.',
        },
        {
          title: 'Manutenzione Mensile',
          description:
            'La tua carriera evolve? Teniamo il tuo profilo aggiornato. Fino a 3 modifiche al mese, così la tua pagina è sempre accurata.',
        },
      ],
    },
    portfolio: {
      sectionLabel: 'I Nostri Lavori',
      title: 'Profili Reali, Impatto Reale',
      subtitle:
        'Ogni progetto è realizzato su misura per la persona. Ecco alcuni esempi di ciò che abbiamo consegnato.',
      projects: [
        {
          label: 'Progetto Alpha',
          role: 'Professionista Finance & Management',
          description:
            'Un CV web sofisticato con palette viola — timeline completa della carriera, griglia di competenze e dashboard di statistiche professionali.',
          tags: ['Finance', 'Management', 'Dark Theme', 'Timeline'],
        },
        {
          label: 'Progetto Beta',
          role: 'Executive Business Consulting',
          description:
            'Profilo executive con accento teal, sezione competenze multilingua, cards di filosofia lavorativa e narrativa orientata ai risultati.',
          tags: ['Consulting', 'Strategy', 'Executive', 'Multilingua'],
        },
      ],
    },
    pricing: {
      sectionLabel: 'Prezzi',
      title: 'Prezzi Semplici e Trasparenti',
      subtitle: 'Nessuna sorpresa. Scegli il piano adatto alle tue esigenze e vai online.',
      mostPopular: 'Più Popolare',
      oneTime: 'una tantum',
      monthly: '/mese',
      plus: '+',
      plans: [
        {
          name: 'Basic',
          price: '35',
          priceMonthly: null,
          description: 'Un bellissimo CV web completamente personalizzato per andare online.',
          features: [
            'Design personalizzato (colori, font, layout)',
            'Tutti i tuoi contenuti inclusi',
            'Mobile responsive',
            'Consegna in 5 giorni lavorativi',
            'Hosting sull\'infrastruttura GoOnWeb',
          ],
          cta: 'Inizia Ora',
          highlighted: false,
        },
        {
          name: 'Standard',
          price: '50',
          priceMonthly: null,
          description: 'Il tuo CV web live sul tuo dominio professionale.',
          features: [
            'Tutto incluso in Basic',
            'Dominio personalizzato (.com, .it, ecc.)',
            'Configurazione DNS inclusa',
            'Registrazione dominio 1 anno',
            'Online con il tuo indirizzo personale',
          ],
          cta: 'Inizia Ora',
          highlighted: true,
        },
        {
          name: 'Premium',
          price: '50',
          priceMonthly: '25',
          description: 'Dominio incluso + manutenzione mensile per un profilo sempre aggiornato.',
          features: [
            'Tutto incluso in Standard',
            'Fino a 3 modifiche ai contenuti/mese',
            'Supporto prioritario',
            'Monitoraggio delle performance',
            'Profilo sempre aggiornato',
          ],
          cta: 'Inizia Ora',
          highlighted: false,
        },
      ],
    },
    contact: {
      sectionLabel: 'Contatti',
      title: 'Costruiamo la Tua Presenza',
      subtitle:
        'Hai domande o vuoi iniziare? Scrivici un messaggio e ti risponderemo al più presto.',
      form: {
        name: 'Il Tuo Nome',
        namePlaceholder: 'Mario Rossi',
        email: 'Indirizzo Email',
        emailPlaceholder: 'mario@esempio.com',
        message: 'Messaggio',
        messagePlaceholder: 'Raccontaci un po\' di te e cosa stai cercando...',
        submit: 'Invia Messaggio',
        sending: 'Invio in corso...',
        success: 'Messaggio inviato! Ti risponderemo presto.',
        error: 'Qualcosa è andato storto. Riprova o scrivici direttamente.',
      },
    },
    footer: {
      tagline: 'Creiamo presenze professionali online, un profilo alla volta.',
      rights: '© 2025 GoOnWeb. Tutti i diritti riservati.',
    },
  },
} as const

export type Translations = typeof translations
