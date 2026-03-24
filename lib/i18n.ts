export type Language = 'en' | 'it'

export const translations = {
  en: {
    nav: {
      services: 'Services',
      portfolio: 'Portfolio',
      pricing: 'Pricing',
      contact: 'Contact',
      generate: 'Try Free',
    },
    hero: {
      badge: 'Professional Web Presence',
      titleGradient: 'Your Career,',
      titleNormal: 'Elevated Online.',
      subtitle:
        'BeOnWeb crafts elegant, fully personalized web CVs — a modern alternative to the traditional résumé. Choose your colors, your style, your domain.',
      ctaPrimary: 'View Portfolio',
      ctaSecondary: 'Try Free →',
    },
    services: {
      sectionLabel: 'What We Offer',
      title: 'Everything You Need to Stand Out',
      subtitle:
        'From first design to going live, BeOnWeb handles every detail of your professional online presence.',
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
          role: 'Product & Growth Leader',
          description:
            'A dark, minimal web CV inspired by modern SaaS design — violet accent on near-black background, transparent navbar, timeline experience layout, and clean section headers with gradient dividers.',
          tags: ['Product', 'Growth', 'Dark Theme', 'SaaS'],
          href: '/portfolio/delta',
        },
        {
          label: 'Project Beta',
          role: 'Finance & Management Professional',
          description:
            'A dark, sophisticated web CV with a gold accent palette — featuring a full career timeline, competency grid, and professional statistics dashboard.',
          tags: ['Finance', 'Management', 'Dark Theme', 'Timeline'],
          href: '/portfolio/alpha',
        },
        {
          label: 'Project Gamma',
          role: 'Business Consulting Executive',
          description:
            'An editorial executive profile with multilingual skills section, philosophy approach cards, and a results-driven narrative structure.',
          tags: ['Consulting', 'Strategy', 'Executive', 'Multilingual'],
          href: '/portfolio/beta',
        },
        {
          label: 'Project Delta',
          role: 'HR & People Operations Leader',
          description:
            'A warm, minimal web CV for an HR professional who grew from Coordinator to Head of People across three companies — featuring a career timeline, soft-skills grid, and a values-led narrative.',
          tags: ['HR', 'People Ops', 'Career Growth', 'Warm Palette'],
          href: '/portfolio/gamma',
        },
      ],
    },
    pricing: {
      sectionLabel: 'Pricing',
      title: 'Simple, Transparent Pricing',
      subtitle: 'No surprises. Pick the plan that fits your needs and get online.',
      mostPopular: 'Most Popular',
      oneTime: 'one-time',
      launchBadge: 'Launch offer',
      launchNote: 'Limited spots — introductory pricing for early clients',
      plans: [
        {
          name: 'Professional',
          price: '55',
          originalPrice: '110',
          description: 'Your web CV live on a custom domain, chosen together.',
          features: [
            'Custom design (colors, fonts, layout)',
            'All your content included',
            'PC & mobile responsive',
            'Custom domain (chosen together, subject to availability)',
            'Delivered in 2 business days',
            'Source code not included',
            'Further updates available upon request',
          ],
          cta: 'Get Started',
          highlighted: true,
        },
        {
          name: 'Advanced',
          price: '75',
          originalPrice: '150',
          description: 'Everything in Professional, plus your source code and one free revision.',
          features: [
            'Everything in Professional',
            'Full source code delivered',
            '1 free change within 1 month of payment',
            'Free change can include a full site redesign',
          ],
          cta: 'Get Started',
          highlighted: false,
        },
        {
          name: 'Complete',
          price: '250',
          originalPrice: '500',
          priceNote: 'site + 12 months',
          description: 'Full site build with one year of maintenance included. No add-ons, no surprises.',
          features: [
            'Custom design (colors, fonts, layout)',
            'All your content included',
            'PC & mobile responsive',
            'Custom domain (chosen together, subject to availability)',
            'Delivered in 2 business days',
            '3 content updates/month included (36/year)',
            'Priority support',
            'Maintenance already included — zero extras',
          ],
          cta: 'Get Started',
          highlighted: false,
        },
      ],
      maintenance: {
        name: 'Maintenance',
        tagline: 'On-demand maintenance — not required. Packages from €20 if ever needed.',
        description: 'Keep your web CV always up to date. Content updates, performance checks, and ongoing care for your profile.',
        features: [
          'Up to 3 content updates/month',
          'Priority support',
          'Performance monitoring',
          'Profile always current and accurate',
        ],
        cta: 'Get in Touch',
        note: 'Optional add-on — not required for any plan',
      },
    },
    generate: {
      badge: 'Profile Generator',
      title: 'Create your web profile',
      subtitle: 'Upload your CV, choose a style and press Start — your page is ready in seconds.',
      stepTemplate: '1 · Choose a template',
      stepUpload: '2 · Upload your CV',
      dragHere: 'Drag your PDF here',
      dragOr: 'or click to select a file',
      dragLimit: 'Max 10 MB · PDF only',
      clickToChange: 'Click to change file',
      generating: 'Extracting data…',
      generatingNote: 'This may take 10–20 seconds',
      done: 'Profile created!',
      doneNote: 'Your site is available at this link:',
      openProfile: 'Open profile ↗',
      generateAnother: 'Generate another',
      ctaReady: 'Start preview →',
      ctaWaiting: 'Upload a PDF to continue',
      back: '← Back to site',
    },
    contact: {
      sectionLabel: 'Contact',
      title: "Let's Build Your Presence",
      subtitle:
        'Have a question or ready to get started? Drop us a message and we will get back to you shortly.',
      form: {
        firstName: 'First Name',
        firstNamePlaceholder: 'John',
        lastName: 'Last Name',
        lastNamePlaceholder: 'Doe',
        email: 'Email Address',
        emailPlaceholder: 'john@example.com',
        message: 'Message',
        messagePlaceholder: 'Tell us a bit about yourself and what you are looking for...',
        attachment: 'Attach your CV (PDF, optional)',
        attachmentHint: 'Max 5MB — PDF only',
        privacy: 'I have read and agree to the',
        privacyLink: 'Privacy Policy',
        submit: 'Send Message',
        sending: 'Sending...',
        success: "Message sent! We'll be in touch soon.",
        error: 'Something went wrong. Please try again or email us directly.',
        fileTooLarge: 'File exceeds 5MB limit.',
      },
    },
    mission: {
      sectionLabel: 'Why BeOnWeb',
      headline: 'You own it.',
      headlineAccent: 'Always.',
      subheadline: 'No subscriptions. No lock-in. No hostages.',
      pillars: [
        {
          icon: '💳',
          title: 'Pay once, yours forever',
          description: 'No monthly fees, no platform subscriptions. Pay for the build — the site is yours for as long as you choose to keep the domain active. You own the domain, you decide. We\'re a studio, not a SaaS.',
        },
        {
          icon: '🌐',
          title: 'Your domain, your credentials',
          description: 'We choose the domain together. It gets registered in your name, with full login credentials delivered directly to you — not us.',
        },
        {
          icon: '</>',
          title: 'Your source code',
          description: 'The Advanced plan includes full source code delivery. Modify it, deploy it yourself, or hand it to any developer. Zero lock-in.',
        },
        {
          icon: '✦',
          title: 'Your CV deserves better than a PDF',
          description: 'Every CV looks the same in PDF. We build web presences with personality, real design, and structure that reflects who you actually are.',
        },
      ],
      note: 'Unlike Wix, Squarespace, or similar platforms — if you stop paying them, your site goes offline. We don\'t do that.',
      noteBold: 'Your site stays live.',
    },
    footer: {
      tagline: 'Crafting professional web presences, one profile at a time.',
      rights: '© 2025 BeOnWeb. All rights reserved.',
    },
  },

  it: {
    nav: {
      services: 'Servizi',
      portfolio: 'Portfolio',
      pricing: 'Prezzi',
      contact: 'Contatti',
      generate: 'Prova Gratis',
    },
    hero: {
      badge: 'Presenza Professionale Online',
      titleGradient: 'La Tua Carriera,',
      titleNormal: 'Elevata Online.',
      subtitle:
        'BeOnWeb crea eleganti CV web completamente personalizzati — un\'alternativa moderna al curriculum tradizionale. Scegli i tuoi colori, il tuo stile, il tuo dominio.',
      ctaPrimary: 'Vedi il Portfolio',
      ctaSecondary: 'Prova Gratis →',
    },
    services: {
      sectionLabel: 'Cosa Offriamo',
      title: 'Tutto il Necessario per Distinguerti',
      subtitle:
        'Dal primo design al lancio online, BeOnWeb gestisce ogni dettaglio della tua presenza professionale sul web.',
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
          role: 'Product & Growth Leader',
          description:
            'Un CV web scuro e minimalista ispirato al design SaaS moderno — accento viola su sfondo quasi-nero, navbar trasparente, layout a timeline e intestazioni di sezione con divisori a gradiente.',
          tags: ['Product', 'Growth', 'Dark Theme', 'SaaS'],
          href: '/portfolio/delta',
        },
        {
          label: 'Progetto Beta',
          role: 'Professionista Finance & Management',
          description:
            'Un CV web sofisticato con palette oro su sfondo scuro — timeline completa della carriera, griglia di competenze e dashboard di statistiche professionali.',
          tags: ['Finance', 'Management', 'Dark Theme', 'Timeline'],
          href: '/portfolio/alpha',
        },
        {
          label: 'Progetto Gamma',
          role: 'Executive Business Consulting',
          description:
            'Profilo executive editoriale con sezione competenze multilingua, cards di filosofia lavorativa e narrativa orientata ai risultati.',
          tags: ['Consulting', 'Strategy', 'Executive', 'Multilingua'],
          href: '/portfolio/beta',
        },
        {
          label: 'Progetto Delta',
          role: 'HR & People Operations Leader',
          description:
            'CV web caldo e minimalista per una professionista HR cresciuta da Coordinator a Head of People in tre aziende — con timeline di carriera, griglia soft-skills e narrativa orientata ai valori.',
          tags: ['HR', 'People Ops', 'Crescita Professionale', 'Palette Calda'],
          href: '/portfolio/gamma',
        },
      ],
    },
    pricing: {
      sectionLabel: 'Prezzi',
      title: 'Prezzi Semplici e Trasparenti',
      subtitle: 'Nessuna sorpresa. Scegli il piano adatto alle tue esigenze e vai online.',
      mostPopular: 'Più Popolare',
      oneTime: 'una tantum',
      launchBadge: 'Offerta lancio',
      launchNote: 'Posti limitati — prezzi introduttivi per i primi clienti',
      plans: [
        {
          name: 'Professional',
          price: '55',
          originalPrice: '110',
          description: 'Il tuo CV web live su un dominio personalizzato, scelto insieme.',
          features: [
            'Design personalizzato (colori, font, layout)',
            'Tutti i tuoi contenuti inclusi',
            'Ottimizzato per PC e mobile',
            'Dominio personalizzato (scelto insieme, soggetto a disponibilità)',
            'Consegna in 2 giorni lavorativi',
            'Codice sorgente non incluso',
            'Aggiornamenti disponibili su richiesta',
          ],
          cta: 'Inizia Ora',
          highlighted: true,
        },
        {
          name: 'Advanced',
          price: '75',
          originalPrice: '150',
          description: 'Tutto incluso in Professional, più il codice sorgente e una modifica gratuita.',
          features: [
            'Tutto incluso in Professional',
            'Codice sorgente consegnato',
            '1 modifica gratuita entro 1 mese dal pagamento',
            'La modifica può includere un redesign completo del sito',
          ],
          cta: 'Inizia Ora',
          highlighted: false,
        },
        {
          name: 'Completo',
          price: '250',
          originalPrice: '500',
          priceNote: 'sito + 12 mesi',
          description: 'Sito realizzato e un anno di manutenzione inclusa. Nessun extra, nessuna sorpresa.',
          features: [
            'Design personalizzato (colori, font, layout)',
            'Tutti i tuoi contenuti inclusi',
            'Ottimizzato per PC e mobile',
            'Dominio personalizzato (scelto insieme, soggetto a disponibilità)',
            'Consegna in 2 giorni lavorativi',
            '3 modifiche ai contenuti/mese incluse (36/anno)',
            'Supporto prioritario',
            'Manutenzione già inclusa — zero extra',
          ],
          cta: 'Inizia Ora',
          highlighted: false,
        },
      ],
      maintenance: {
        name: 'Manutenzione',
        tagline: 'Manutenzione su richiesta — non necessaria. Pacchetti a partire da €20 in caso di necessità.',
        description: 'Tieni il tuo CV web sempre aggiornato. Modifiche ai contenuti, controllo performance e cura continuativa del tuo profilo.',
        features: [
          'Fino a 3 modifiche ai contenuti/mese',
          'Supporto prioritario',
          'Monitoraggio delle performance',
          'Profilo sempre aggiornato e accurato',
        ],
        cta: 'Contattaci',
        note: 'Add-on opzionale — non richiesto da nessun piano',
      },
    },
    generate: {
      badge: 'Generatore di profili',
      title: 'Crea il tuo profilo web',
      subtitle: 'Carica il CV, scegli lo stile e premi Avvia — la tua pagina è pronta in secondi.',
      stepTemplate: '1 · Scegli il template',
      stepUpload: '2 · Carica il tuo CV',
      dragHere: 'Trascina il PDF qui',
      dragOr: 'oppure clicca per selezionare il file',
      dragLimit: 'Max 10 MB · solo PDF',
      clickToChange: 'Clicca per cambiare file',
      generating: 'Estrazione dati in corso…',
      generatingNote: 'Potrebbe richiedere 10–20 secondi',
      done: 'Profilo creato!',
      doneNote: 'Il tuo sito è disponibile a questo link:',
      openProfile: 'Apri il profilo ↗',
      generateAnother: 'Genera un altro',
      ctaReady: 'Avvia la preview →',
      ctaWaiting: 'Carica un PDF per continuare',
      back: '← Torna al sito',
    },
    contact: {
      sectionLabel: 'Contatti',
      title: 'Costruiamo la Tua Presenza',
      subtitle:
        'Hai domande o vuoi iniziare? Scrivici un messaggio e ti risponderemo al più presto.',
      form: {
        firstName: 'Nome',
        firstNamePlaceholder: 'Mario',
        lastName: 'Cognome',
        lastNamePlaceholder: 'Rossi',
        email: 'Indirizzo Email',
        emailPlaceholder: 'mario@esempio.com',
        message: 'Messaggio',
        messagePlaceholder: 'Raccontaci un po\' di te e cosa stai cercando...',
        attachment: 'Allega il tuo CV (PDF, opzionale)',
        attachmentHint: 'Max 5MB — solo PDF',
        privacy: 'Ho letto e accetto la',
        privacyLink: 'Privacy Policy',
        submit: 'Invia Messaggio',
        sending: 'Invio in corso...',
        success: 'Messaggio inviato! Ti risponderemo presto.',
        error: 'Qualcosa è andato storto. Riprova o scrivici direttamente.',
        fileTooLarge: 'Il file supera il limite di 5MB.',
      },
    },
    mission: {
      sectionLabel: 'Perché BeOnWeb',
      headline: 'Lo possiedi.',
      headlineAccent: 'Per sempre.',
      subheadline: 'Nessun abbonamento. Nessun vincolo. Nessun ostaggio.',
      pillars: [
        {
          icon: '💳',
          title: 'Paghi una volta, è tuo per sempre',
          description: 'Nessun canone mensile, nessuna piattaforma. Paghi il lavoro — il sito è tuo finché decidi di tenere il dominio attivo. Tu sei il proprietario del dominio, tu decidi. Siamo uno studio, non un software.',
        },
        {
          icon: '🌐',
          title: 'Il dominio è tuo, le credenziali anche',
          description: 'Scegliamo insieme il dominio. Viene registrato a tuo nome, con le credenziali di accesso consegnate direttamente a te — non a noi.',
        },
        {
          icon: '</>',
          title: 'Il tuo codice sorgente',
          description: 'Il piano Advanced include la consegna del codice sorgente completo. Modificalo, deployalo da solo o passalo a qualsiasi developer. Zero vincoli.',
        },
        {
          icon: '✦',
          title: 'Il tuo CV merita di meglio di un PDF',
          description: 'Tutti i CV sembrano uguali in PDF. Noi costruiamo presenze web con personalità, design autentico e struttura che riflette davvero chi sei.',
        },
      ],
      note: 'A differenza di Wix, Squarespace e simili — se smetti di pagare, il tuo sito va offline. Noi no.',
      noteBold: 'Il tuo sito rimane online.',
    },
    footer: {
      tagline: 'Creiamo presenze professionali online, un profilo alla volta.',
      rights: '© 2025 BeOnWeb. Tutti i diritti riservati.',
    },
  },
} as const

export type Translations = typeof translations
