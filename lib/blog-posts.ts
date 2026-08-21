// Static, hand-written articles — no CMS, no markdown lib. Plain content
// blocks rendered by app/blog/[slug]/page.tsx, matching this project's usual
// pattern of local structured data over an external content pipeline (see
// lib/showcase-items.ts for the same approach). IT-only for now (per
// feedback_single_language_dev_workflow) — translate once the tone settles.

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string; source: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
  content: ContentBlock[];
}

export const BLOG_CATEGORIES = ["Colloqui", "CV", "ATS", "LinkedIn", "Carriera"] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "colloquio-domande-piu-comuni",
    title: "Le domande più comuni in un colloquio (e come rispondere davvero)",
    excerpt: "\"Parlami di te\" non è una domanda casuale. Ogni domanda da colloquio ne nasconde un'altra, più concreta, che il recruiter non fa ad alta voce.",
    category: "Colloqui",
    publishedAt: "2026-07-02",
    readingMinutes: 5,
    content: [
      { type: "p", text: "Ogni domanda da colloquio ne nasconde un'altra. Quando ti chiedono \"parlami di te\", non vogliono la tua biografia: vogliono capire in 90 secondi se sai raccontare il tuo percorso in modo pertinente al ruolo. Rispondere con l'ordine cronologico delle scuole frequentate è il modo più veloce per perdere l'attenzione di chi ti ascolta." },
      { type: "h2", text: "\"Parlami di te\"" },
      { type: "p", text: "Struttura la risposta in tre parti: dove sei ora professionalmente, come ci sei arrivato in una frase, perché questo ruolo è il passo logico successivo. Novanta secondi, non di più. Se il recruiter vuole sapere di più, farà una domanda di follow-up." },
      { type: "h2", text: "\"Qual è il tuo più grande difetto?\"" },
      { type: "p", text: "La risposta finta (\"sono troppo perfezionista\") si vede a un chilometro di distanza, e chi fa colloqui da anni l'ha sentita centinaia di volte. Scegli un limite vero, di solito legato a un'abitudine di lavoro (delegare poco, sottostimare i tempi, difficoltà a dire no) e racconta cosa hai fatto concretamente per gestirlo. Un esempio specifico vale più di qualsiasi aggettivo." },
      { type: "h2", text: "\"Perché vuoi lasciare il tuo lavoro attuale?\"" },
      { type: "p", text: "Non parlare mai male del capo o dell'azienda precedente, anche se la ragione vera è quella. Sposta il discorso su cosa cerchi, non su cosa fuggi: crescita non disponibile nel ruolo attuale, un cambio di settore che ti interessa da tempo, un progetto che il nuovo ruolo ti permette di seguire. Chi ascolta valuta anche come parli di chi non è nella stanza." },
      { type: "h2", text: "\"Dove ti vedi tra 5 anni?\"" },
      { type: "p", text: "Non serve un piano quinquennale dettagliato. Serve dimostrare che hai un'idea di crescita coerente con quello che l'azienda può offrirti, e che non stai usando questo ruolo come parcheggio in attesa di altro. Se non lo sai con precisione, dillo, ma aggancia la risposta a competenze che vuoi sviluppare, non a titoli di ruolo." },
      { type: "quote", text: "Le domande comportamentali (\"raccontami di una volta in cui...\") si preparano meglio con il metodo STAR: Situazione, Compito, Azione, Risultato. Senza un risultato misurabile alla fine, la storia resta un aneddoto.", source: "Metodo diffuso nella selezione del personale, formalizzato per la prima volta negli anni '70 negli studi sull'intervista comportamentale" },
      { type: "p", text: "Prepara tre episodi della tua carriera che puoi raccontare con il metodo STAR e riadattarli a qualsiasi domanda comportamentale ti facciano. Non serve un episodio diverso per ogni possibile domanda: la stessa storia, raccontata con enfasi diversa, risponde sia a \"parlami di un conflitto in team\" sia a \"parlami di una decisione difficile\"." },
    ],
  },
  {
    slug: "come-superare-filtri-ats",
    title: "Come superare i filtri ATS: cosa legge davvero il software prima del recruiter",
    excerpt: "Un CV bellissimo che l'ATS legge male non arriva mai a un essere umano. Ecco cosa succede davvero dentro il software prima che qualcuno apra il tuo file.",
    category: "ATS",
    publishedAt: "2026-07-09",
    readingMinutes: 6,
    content: [
      { type: "p", text: "La maggior parte delle grandi aziende, e un numero crescente di PMI, usa un ATS (Applicant Tracking System) per raccogliere e filtrare le candidature prima che arrivino a un recruiter umano. Il software non giudica il tuo CV: lo legge, lo trasforma in testo strutturato, e in alcuni casi lo classifica per parole chiave. Un CV che l'ATS legge male, semplicemente, arriva incompleto o non arriva affatto." },
      { type: "h2", text: "Il problema non è il contenuto, è la struttura" },
      { type: "p", text: "Colonne multiple, tabelle, caselle di testo, header e footer con informazioni di contatto: tutti elementi che un occhio umano legge senza sforzo, ma che molti parser ATS leggono da sinistra a destra riga per riga, ignorando la disposizione visiva. Il risultato è testo mescolato: competenze finite in mezzo a un'esperienza lavorativa, il telefono scomparso perché era in un header." },
      { type: "h2", text: "La sidebar è il nemico silenzioso" },
      { type: "p", text: "Il template con foto e colonna laterale (contatti, competenze, lingue) è tra i più diffusi su Canva e Word, ed è anche tra i più rischiosi per un ATS. Non perché la sidebar sia \"vietata\", ma perché il parser spesso legge la pagina per righe orizzontali: il contenuto della colonna stretta finisce intercalato dentro le frasi della colonna larga, e il risultato che arriva al recruiter è illeggibile anche quando il tuo CV originale era perfetto." },
      { type: "h2", text: "Cosa funziona sempre" },
      { type: "ul", items: [
        "Colonna singola, dall'alto verso il basso, senza eccezioni",
        "Titoli di sezione standard: Esperienza, Istruzione, Competenze — non \"Il mio percorso\" o giochi di parole creativi",
        "Testo selezionabile, mai un'immagine o una scansione del CV",
        "Date in un formato coerente in tutto il documento",
        "Parole chiave della job description riprese con lo stesso lessico, non solo sinonimi",
      ] },
      { type: "p", text: "Quest'ultimo punto è quello che la maggior parte delle persone sottovaluta di più. Se l'annuncio cerca \"project management\" e il tuo CV dice solo \"gestione progetti\", un matching per parole chiave esatte può non farli combaciare. Non significa riscrivere il CV copiando l'annuncio parola per parola: significa usare la stessa terminologia quando descrivi cose che hai davvero fatto." },
      { type: "h2", text: "Il test più semplice che puoi fare da solo" },
      { type: "p", text: "Apri il tuo CV, seleziona tutto il testo con Ctrl+A, copialo e incollalo in un editor di testo semplice (non Word: il Blocco Note, o simile). Se quello che vedi è nell'ordine giusto e leggibile, è un buon segno. Se contatti, competenze e bullet di esperienza escono mescolati in un ordine senza senso, quello che vedi tu è più o meno quello che legge anche un ATS." },
    ],
  },
  {
    slug: "cv-una-pagina-o-due",
    title: "CV in una pagina o due? La risposta dipende da questo",
    excerpt: "La regola della pagina unica è utile finché diventa un dogma. Il criterio giusto non è la lunghezza, è la densità di informazione utile per riga.",
    category: "CV",
    publishedAt: "2026-07-16",
    readingMinutes: 4,
    content: [
      { type: "p", text: "\"Il CV deve stare in una pagina\" è uno dei consigli più ripetuti e meno spiegati che esistano. È un buon punto di partenza per chi ha meno di 5 anni di esperienza: a quel livello, due pagine sono quasi sempre un problema di sintesi, non di contenuto reale da mostrare. Oltre i 5-8 anni, però, la regola smette di essere automaticamente vera." },
      { type: "h2", text: "Quando una pagina non basta" },
      { type: "p", text: "Se hai avuto ruoli con responsabilità crescenti, più aziende rilevanti, o un percorso che include un cambio di settore che vale la pena spiegare, comprimere tutto in una pagina spesso significa tagliare proprio i dettagli che dimostrano seniority: i numeri, il contesto del team, la scala del budget gestito. Due pagine ben scritte battono una pagina densa di frasi generiche." },
      { type: "h2", text: "Il criterio giusto: densità, non lunghezza" },
      { type: "p", text: "Ogni riga del CV dovrebbe guadagnarsi il suo posto. Il test è semplice: se togliessi questa riga, il recruiter perderebbe un'informazione che lo aiuta a decidere se convocarti? Se la risposta è no, quella riga va tagliata, indipendentemente da quante pagine restano. Un CV di due pagine dove ogni riga supera questo test è più efficace di un CV di una pagina pieno di paragrafi tirati via." },
      { type: "ul", items: [
        "Esperienze di oltre 10 anni fa: una riga, non un paragrafo, a meno che non siano direttamente rilevanti per il ruolo",
        "Elenchi di competenze software generiche (Pacchetto Office, email): quasi mai utili, occupano spazio senza informare",
        "Descrizioni di mansione senza risultato: se un bullet descrive solo cosa facevi e non cosa hai ottenuto, o lo riscrivi o lo tagli",
      ] },
      { type: "p", text: "Terza pagina, in generale, è quasi sempre troppo, con un'eccezione: i CV accademici o quelli che includono un elenco esteso di pubblicazioni, dove è la convenzione del settore ad aspettarselo. Fuori da quel contesto, tre pagine segnalano che non hai ancora deciso cosa è davvero importante raccontare di te." },
    ],
  },
  {
    slug: "domande-da-fare-al-recruiter",
    title: "Le domande che dovresti fare TU al colloquio",
    excerpt: "\"Non ho domande\" è la risposta che fa più danni in un colloquio. Un buon set di domande finali vale quanto le tue risposte.",
    category: "Colloqui",
    publishedAt: "2026-07-23",
    readingMinutes: 4,
    content: [
      { type: "p", text: "Alla fine di quasi ogni colloquio arriva la stessa domanda: \"hai qualcosa da chiedere a noi?\". Rispondere \"no, penso sia stato tutto chiaro\" è l'equivalente di chiudere un incontro d'affari senza aver capito con chi stai per lavorare. Un colloquio è una valutazione a doppio senso, e le domande che fai raccontano quanto ci hai pensato davvero." },
      { type: "h2", text: "Domande che dimostrano che hai fatto i compiti" },
      { type: "ul", items: [
        "\"Come è cambiato il team negli ultimi 12 mesi, e cosa vi aspettate che cambi nei prossimi 12?\"",
        "\"Qual è la prima cosa concreta che vorreste vedere fatta da chi entra in questo ruolo nei primi 90 giorni?\"",
        "\"Cosa distingue chi ha davvero successo in questo ruolo da chi invece fatica, nella vostra esperienza?\"",
      ] },
      { type: "p", text: "Queste domande fanno due cose insieme: ti danno informazioni reali su cosa ti aspetta, e mostrano a chi ti intervista che stai valutando il ruolo con la stessa serietà con cui loro valutano te." },
      { type: "h2", text: "La domanda che quasi nessuno fa (e dovrebbe)" },
      { type: "p", text: "\"Perché la persona precedente ha lasciato questo ruolo, o perché è stato creato ora?\" È una domanda diretta, non aggressiva se posta con curiosità genuina, e la risposta ti dice moltissimo: turnover alto per un motivo strutturale, crescita del team, un ruolo nuovo di zecca senza precedenti da cui imparare. Ognuna di queste risposte cambia cosa dovresti aspettarti." },
      { type: "h2", text: "Cosa evitare" },
      { type: "p", text: "Non aprire con domande su ferie, smart working o benefit: arriveranno al momento giusto, di solito con HR, e farle troppo presto sposta la percezione da \"persona interessata al ruolo\" a \"persona interessata alle condizioni\". Non è sbagliato chiederle, è sbagliato il momento." },
    ],
  },
  {
    slug: "ottimizzare-profilo-linkedin",
    title: "Come ottimizzare il profilo LinkedIn per farti trovare (non solo per farti vedere)",
    excerpt: "Un profilo LinkedIn curato ma invisibile alla ricerca non serve a molto. La differenza è tra scrivere per chi legge e scrivere per chi cerca.",
    category: "LinkedIn",
    publishedAt: "2026-07-30",
    readingMinutes: 5,
    content: [
      { type: "p", text: "Molti profili LinkedIn sono scritti bene per chi li legge e quasi invisibili per chi cerca. Sono due cose diverse. I recruiter, quando cercano candidati attivamente, filtrano per parole chiave specifiche in un motore di ricerca interno: se il tuo titolo è \"Problem solver appassionato di persone\" invece di \"Customer Success Manager\", semplicemente non comparirai in quella ricerca, per quanto il tuo profilo sia scritto bene." },
      { type: "h2", text: "Il titolo (headline) è la riga più importante che hai" },
      { type: "p", text: "Di default LinkedIn usa il tuo ruolo attuale come titolo. È uno spreco: quello spazio dovrebbe contenere il ruolo che cerchi, 2-3 competenze chiave verificabili, e un settore o dominio specifico. \"Senior Product Manager | SaaS B2B | Go-to-Market e Pricing Strategy\" fa il lavoro di ricerca al posto del recruiter." },
      { type: "h2", text: "Il riepilogo non è una biografia" },
      { type: "p", text: "La sezione \"Informazioni\" non serve a raccontare la tua vita, serve a rispondere in 3-4 righe alla domanda \"perché dovrei contattare questa persona per un ruolo aperto\". Le prime due righe sono quelle che si vedono senza cliccare \"vedi altro\": mettici il contenuto più forte, non l'introduzione." },
      { type: "h2", text: "Le competenze contano solo se qualcuno le conferma" },
      { type: "p", text: "Una lista di 40 competenze senza nessuna conferma pesa meno di 8 competenze con conferme reali da colleghi o manager. LinkedIn dà peso, nella ricerca interna, alle competenze più confermate del tuo profilo: se le prime tre in elenco sono generiche e senza conferme, riordina manualmente mettendo davanti quelle più specifiche e più validate." },
      { type: "h2", text: "Attività, non solo presenza" },
      { type: "p", text: "Un profilo statico, aggiornato una volta e mai più toccato, tende a perdere visibilità nell'algoritmo di ricerca nel tempo rispetto a profili con attività regolare (commenti, articoli, aggiornamenti). Non serve pubblicare ogni giorno: basta un'interazione genuina ogni tanto su contenuti del proprio settore, che è anche il modo più naturale per restare visibile alla propria rete senza sembrare in cerca disperata di lavoro." },
    ],
  },
  {
    slug: "errori-cv-che-scartano-candidatura",
    title: "5 errori nel CV che fanno scartare una candidatura in pochi secondi",
    excerpt: "Uno studio di eye-tracking spesso citato parla di circa 6 secondi di prima occhiata. In quel tempo, alcuni errori pesano più di altri.",
    category: "CV",
    publishedAt: "2026-08-06",
    readingMinutes: 5,
    content: [
      { type: "quote", text: "Uno studio di eye-tracking del 2012 di TheLadders, spesso citato (e talvolta semplificato) nel settore HR, ha misurato un tempo medio di prima occhiata su un CV di circa 6 secondi prima che il recruiter decidesse se continuare a leggere.", source: "TheLadders, \"Eye-Tracking Study\", 2012 — cifra ampiamente ripresa nella letteratura di settore, da prendere come ordine di grandezza più che come dato scientifico definitivo" },
      { type: "p", text: "Sei secondi non bastano per leggere un CV, bastano per farsi un'impressione. In quel lasso di tempo alcuni errori pesano più di altri, perché saltano all'occhio prima ancora di leggere una singola parola." },
      { type: "h2", text: "1. Bio generica in apertura" },
      { type: "p", text: "\"Professionista motivato e dinamico con forte spirito di squadra\" non dice nulla a nessuno: potrebbe essere scritta da chiunque, per qualsiasi ruolo. Le prime due righe del CV dovrebbero contenere il tuo ruolo attuale, un numero o un risultato concreto, e il tipo di ruolo che cerchi. Zero aggettivi che non si possono verificare." },
      { type: "h2", text: "2. Bullet senza numeri" },
      { type: "p", text: "\"Gestione del team di vendita\" descrive un compito. \"Gestito un team di 8 persone, superando il target trimestrale del 15% per 4 trimestri consecutivi\" descrive un risultato. Non ogni bullet può avere un numero perfetto, ma se in tutto il CV non ce n'è nemmeno uno, è un segnale che salta all'occhio in pochi secondi anche a chi non legge riga per riga." },
      { type: "h2", text: "3. Un layout che nasconde le informazioni chiave" },
      { type: "p", text: "Foto grande, colonna laterale decorativa, tre font diversi: nessuno di questi elementi aiuta un recruiter a trovare in fretta ruolo, azienda e date. Se il layout richiede uno sforzo per orientarsi, quello sforzo viene sottratto al tempo che il recruiter avrebbe dedicato a leggere davvero cosa hai fatto." },
      { type: "h2", text: "4. Refusi ed errori di battitura" },
      { type: "p", text: "Un refuso isolato capita a chiunque e raramente costa una candidatura da solo. Più refusi nello stesso documento, però, vengono letti come un segnale di scarsa attenzione ai dettagli, ancora di più se il ruolo richiede precisione (contabilità, editing, legale). Rileggere il CV ad alta voce, non solo a schermo, aiuta a intercettare errori che l'occhio salta per abitudine." },
      { type: "h2", text: "5. Contatti sbagliati o difficili da trovare" },
      { type: "p", text: "Sembra ovvio, eppure capita: un numero di telefono con una cifra sbagliata, un indirizzo email di lavoro precedente ancora attivo nel documento, contatti infilati in un header che alcuni software non leggono correttamente. Controlla che chiamando il numero e scrivendo all'email risponda davvero qualcuno, cioè te." },
    ],
  },
  {
    slug: "spiegare-buco-cv-cambio-carriera",
    title: "Come spiegare un buco nel CV o un cambio di carriera senza giustificarti",
    excerpt: "Un periodo vuoto nel CV non è un problema da nascondere, è un fatto da inquadrare. La differenza tra i due approcci si sente subito in colloquio.",
    category: "Carriera",
    publishedAt: "2026-08-13",
    readingMinutes: 5,
    content: [
      { type: "p", text: "Un periodo senza lavoro, o un cambio di settore che non segue una logica lineare, non è automaticamente un problema per un recruiter. Diventa un problema quando la persona che lo racconta sembra doversi giustificare, invece di inquadrare semplicemente cosa è successo e cosa ne ha portato con sé." },
      { type: "h2", text: "Nel CV: non nascondere le date, contestualizzale" },
      { type: "p", text: "Sparire per mesi o anni da un CV senza spiegazione genera più sospetto di un periodo dichiarato con chiarezza. Se in quel periodo hai fatto formazione, freelance, volontariato o ti sei preso cura di un famigliare, una riga basta: \"2023-2024 — Percorso di certificazione in [ambito] e collaborazioni freelance\". Non serve un paragrafo di scuse, serve una riga che riempie il vuoto con un fatto." },
      { type: "h2", text: "In colloquio: il tono conta più delle parole" },
      { type: "p", text: "Le stesse informazioni, dette con tono difensivo o con tono neutro, arrivano in modo completamente diverso. \"Purtroppo ho dovuto lasciare il lavoro per motivi personali\" suona come una scusa. \"Ho preso una pausa per motivi personali, e l'ho usata anche per [attività concreta]\" suona come una scelta di cui hai il controllo. Il contenuto può essere identico: cambia solo l'inquadramento." },
      { type: "h2", text: "Cambio di carriera: la connessione conta più della coerenza formale" },
      { type: "p", text: "Un percorso da avvocato a project manager, o da insegnante a UX designer, non ha bisogno di sembrare un percorso lineare per essere convincente. Ha bisogno di una connessione esplicita: quali competenze del ruolo precedente si trasferiscono davvero al nuovo (gestione di stakeholder, comunicazione complessa, organizzazione di progetti con scadenze rigide), dette con esempi specifici, non con un generico \"le competenze trasversali\"." },
      { type: "p", text: "Chi fa selezione ha visto decine di cambi di carriera diversi. Quello che nota, in positivo o in negativo, è se la persona davanti a sé ha già fatto la fatica di collegare i punti, o se si aspetta che sia il recruiter a farlo per lei." },
    ],
  },
  {
    slug: "lettera-presentazione-serve-ancora",
    title: "La lettera di presentazione serve ancora nel 2026?",
    excerpt: "Dipende da chi la legge e da come è scritta. Una lettera copiata dal CV non serve a nessuno, una scritta bene può ancora fare la differenza.",
    category: "CV",
    publishedAt: "2026-08-18",
    readingMinutes: 4,
    content: [
      { type: "p", text: "Dipende. Alcune aziende non la leggono mai, altre la considerano un vero e proprio filtro di selezione, soprattutto per ruoli dove la scrittura conta (comunicazione, marketing, contenuti, alcuni ruoli in ambito legale). Quello che è certo è che una lettera che ripete il CV con frasi più lunghe non aggiunge nulla, e in alcuni casi toglie punti invece di aggiungerne." },
      { type: "h2", text: "Quando scriverla ha senso" },
      { type: "ul", items: [
        "Quando l'annuncio la richiede esplicitamente: non scriverla, in quel caso, è un segnale negativo",
        "Quando devi spiegare qualcosa che il CV da solo non chiarisce (un cambio di settore, un rientro dopo una pausa)",
        "Quando candidarti per un'azienda specifica per cui hai una motivazione reale e concreta, non generica",
      ] },
      { type: "h2", text: "Cosa deve fare una buona lettera (e cosa non deve fare)" },
      { type: "p", text: "Non deve riassumere il CV. Deve rispondere a una domanda che il CV da solo non può: perché questa azienda, perché ora, e cosa porti che altri candidati con un profilo simile non porterebbero. Tre paragrafi bastano quasi sempre: un'apertura diretta che nomina il ruolo e l'azienda, un corpo che collega una o due esperienze concrete al problema che l'azienda sta cercando di risolvere, una chiusura breve senza supplicare." },
      { type: "h2", text: "L'errore più comune: scriverla generica e riciclarla per ogni candidatura" },
      { type: "p", text: "Una lettera che potrebbe essere inviata a qualsiasi azienda dello stesso settore, cambiando solo il nome in cima, si vede a colpo d'occhio, e vale meno di zero: comunica che non hai dedicato tempo a quella candidatura specifica. Se non hai tempo per personalizzarla almeno in parte, spesso è meglio non scriverla affatto, quando non è obbligatoria." },
    ],
  },
  {
    slug: "negoziare-stipendio-dopo-offerta",
    title: "Come negoziare lo stipendio dopo aver ricevuto un'offerta",
    excerpt: "La maggior parte delle offerte iniziali ha un margine di negoziazione. Il problema non è chiedere, è come e quando farlo.",
    category: "Carriera",
    publishedAt: "2026-08-20",
    readingMinutes: 5,
    content: [
      { type: "p", text: "La maggior parte delle prime offerte lascia un margine di trattativa: le aziende raramente aprono con la cifra massima disponibile per il ruolo. Il problema non è se negoziare, ma come farlo senza compromettere un'offerta che, a conti fatti, potrebbe già essere buona." },
      { type: "h2", text: "Prima regola: mai il primo numero" },
      { type: "p", text: "Se ti chiedono le tue aspettative economiche prima ancora di ricevere un'offerta, evita di sparare un numero secco. Rispondi con un range basato su ricerche reali di mercato per quel ruolo, quella seniority, quella zona geografica, e aggiungi che sei aperto a discuterne in base al pacchetto completo. Chi fa la prima offerta, in una trattativa, parte quasi sempre svantaggiato." },
      { type: "h2", text: "Quando arriva l'offerta: non rispondere subito" },
      { type: "p", text: "Anche se la cifra ti sembra già ottima, prenditi 24-48 ore prima di rispondere. Non per finta strategia, ma perché una risposta immediata ed entusiasta toglie qualsiasi leva per chiedere qualcosa in più: bonus di ingresso, giorni di ferie aggiuntivi, una data di revisione salariale anticipata a 6 mesi invece che a 12." },
      { type: "h2", text: "Come formulare la controproposta" },
      { type: "p", text: "Ringrazia per l'offerta, conferma l'interesse reale per il ruolo, poi chiedi la cifra specifica motivandola con dati concreti: altre offerte in corso (se vere), ricerche di mercato, o competenze specifiche che il ruolo richiede e che porti già pronte all'uso. \"Vorrei X\" senza motivazione è una richiesta debole. \"Vorrei X, in linea con [dato di mercato] per ruoli equivalenti nella zona\" è una richiesta che si può discutere seriamente." },
      { type: "h2", text: "Cosa negoziare oltre allo stipendio base" },
      { type: "ul", items: [
        "Bonus di ingresso una tantum, spesso più facile da ottenere di un aumento sul fisso",
        "Data della prima revisione salariale (chiedere 6 mesi invece di 12 è una richiesta ragionevole)",
        "Giorni di ferie aggiuntivi o flessibilità di orario/smart working",
        "Budget formazione o certificazioni pagate dall'azienda",
      ] },
      { type: "p", text: "Un'ultima cosa da tenere a mente: un'azienda seria non ritira un'offerta perché hai chiesto, con educazione e con dati alla mano, di discutere le condizioni. Se succede, è un'informazione preziosa su che tipo di ambiente di lavoro stavi per accettare." },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
