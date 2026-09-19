'use client'

import Link from 'next/link'
import { useLanguage } from '@/components/language-provider'
import { SUPPORT_EMAIL } from '@/lib/contact'

export default function PrivacyPage() {
  const { lang } = useLanguage()

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-3xl mx-auto px-6 py-24">
        {/* Back link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-12"
        >
          {lang === 'it' ? '← Torna al sito' : '← Back to site'}
        </Link>

        <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-muted-foreground text-sm mb-12">
          {lang === 'it' ? 'Ultimo aggiornamento: Settembre 2026' : 'Last updated: September 2026'}
        </p>

        <div className="space-y-10 text-sm leading-relaxed text-muted-foreground">
          {lang === 'it' ? (
            <>
              <p>
                Informativa sul trattamento dei dati personali ai sensi degli artt. 13 e 14 del
                Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018.
              </p>

              <div>
                <h2 className="font-semibold text-foreground mb-2">1. Titolare del Trattamento</h2>
                <p>
                  Il titolare del trattamento è{' '}
                  <strong className="text-foreground">Jobli Srls (in costituzione)</strong>, con sede
                  a Milano, Italia.
                  <br />
                  Email di contatto:{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
                <p className="mt-2">
                  Il Titolare non ha nominato un Responsabile della Protezione dei Dati (DPO), non
                  obbligatorio in base alla natura, all&apos;ambito e alle finalità del trattamento
                  svolto attualmente (art. 37 GDPR).
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">2. Dati Raccolti</h2>
                <p>Tramite il modulo di contatto raccogliamo:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Nome e cognome</li>
                  <li>Indirizzo email</li>
                  <li>Testo del messaggio</li>
                  <li>Eventuale curriculum vitae in formato PDF allegato (facoltativo)</li>
                </ul>
                <p className="mt-3">Se crei un account raccogliamo inoltre:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Indirizzo email e password (la password è gestita dal nostro fornitore di autenticazione, Supabase, e non è mai visibile a noi in chiaro)</li>
                  <li>In alternativa alla password, se scegli di accedere con Google: il tuo indirizzo email e il tuo nome, comunicati a noi da Google al termine dell&apos;autenticazione. Non riceviamo né la tua password Google né altri dati del tuo account Google, e non abbiamo accesso a nulla che vi sia contenuto</li>
                  <li>Data di creazione dell&apos;account</li>
                  <li>Saldo crediti e storico delle transazioni (es. &quot;download PDF&quot;, &quot;adattamento annuncio&quot;, con data)</li>
                  <li>La foto del profilo, se scegli di caricarne una dalle impostazioni dell&apos;account. Il file viene salvato sullo spazio di archiviazione di Supabase in una cartella intestata al tuo account. Va sottolineato che questo spazio è configurato come pubblico: chi conosce (o indovina) l&apos;indirizzo del file può aprirlo senza effettuare l&apos;accesso, esattamente come accade per la foto del profilo di gran parte dei servizi online. Puoi sostituirla o rimuoverla in qualsiasi momento dalle impostazioni</li>
                </ul>
                <p className="mt-3">Quando carichi un CV tramite il generatore di profili raccogliamo:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Il contenuto del CV caricato (esperienze, formazione, competenze, progetti, ecc.), estratto ed elaborato tramite intelligenza artificiale per costruire il tuo profilo</li>
                  <li>Nome del file PDF caricato, utilizzato per generare l&apos;indirizzo web della tua pagina profilo (modificabile in qualsiasi momento dal tuo account)</li>
                  <li>Email e numero di telefono reali (non oscurati), utilizzati esclusivamente per il PDF scaricabile privatamente (la pagina web pubblica mostra sempre versioni oscurate di questi dati per limitare la raccolta automatizzata da parte di terzi)</li>
                  <li>Eventuali link a profili social (es. LinkedIn) se forniti</li>
                </ul>
                <p className="mt-3">
                  Se utilizzi la funzione di adattamento del CV a un annuncio di lavoro, il testo
                  dell&apos;annuncio (incollato o recuperato da un link fornito) viene inviato al
                  nostro fornitore di intelligenza artificiale per generare la versione adattata del
                  CV, ma non viene conservato da noi oltre il tempo necessario a completare
                  l&apos;elaborazione.
                </p>
                <p className="mt-3">
                  Le altre funzioni che elaborano i tuoi dati, e cosa comportano:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Lettera di presentazione: il tuo CV e il testo dell&apos;annuncio vengono inviati al fornitore di intelligenza artificiale; la lettera generata viene salvata nel tuo account, così da non doverla rigenerare (e ripagare) per lo stesso annuncio</li>
                  <li>Traduzione: il CV (o la lettera) viene inviato al fornitore di intelligenza artificiale e la versione tradotta viene salvata nel tuo account come un CV aggiuntivo</li>
                  <li>Documento Word (.docx): generato sul momento dai dati del CV già presenti nel tuo account, senza inviare nulla a fornitori ulteriori rispetto a quelli elencati al punto 5</li>
                  <li>Preparazione al colloquio: il testo dell&apos;annuncio viene inviato al fornitore di intelligenza artificiale, che per rispondere consulta fonti pubbliche sul web in tempo reale tramite i propri strumenti di ricerca e di lettura delle pagine. Le ricerche riguardano l&apos;azienda che assume, non te: questa funzione, per scelta progettuale, non accede al tuo CV. La scheda risultante viene salvata nel tuo account</li>
                  <li>Chat per completare il CV: le domande dell&apos;AI e le tue risposte vengono conservate nel tuo account per la durata della conversazione e per poterla riprendere; al termine, le informazioni che hai fornito vengono integrate nel tuo CV</li>
                </ul>
                <p className="mt-3">
                  Per ogni elaborazione svolta tramite intelligenza artificiale registriamo inoltre, su
                  un nostro registro tecnico interno, il tipo di operazione (es. &quot;analisi CV&quot;,
                  &quot;adattamento annuncio&quot;), il modello utilizzato, il numero di token
                  consumati, il costo corrispondente, la data e l&apos;identificativo interno del tuo
                  account. Questo registro non contiene il contenuto del tuo CV né il testo scambiato
                  con l&apos;intelligenza artificiale: serve unicamente a sapere quanto costa erogare
                  il servizio e a dimensionare il modello a crediti.
                </p>
                <p className="mt-3">
                  Il servizio non richiede né sollecita dati appartenenti a categorie particolari
                  (art. 9 GDPR: origine razziale o etnica, opinioni politiche, convinzioni religiose,
                  appartenenza sindacale, dati relativi alla salute, alla vita sessuale o
                  all&apos;orientamento sessuale). Se il tuo CV li contiene comunque (ad esempio
                  perché citati in un&apos;esperienza di volontariato o per spiegare un periodo di
                  congedo), ti invitiamo a non includerli quando non necessari: non vengono richiesti,
                  non sono utilizzati per generare punteggi o consigli, e puoi rimuoverli in autonomia
                  modificando i dati del tuo profilo dal tuo account.
                </p>
                <p className="mt-3">
                  Il servizio assegna al CV un punteggio automatizzato su criteri oggettivi (risultati
                  misurabili, chiarezza, struttura ATS, competenze specifiche) e suggerisce ruoli in
                  linea con la tua esperienza: si tratta di un trattamento automatizzato che valuta
                  aspetti professionali ai sensi dell&apos;art. 4(4) GDPR, svolto su tua esplicita
                  richiesta e a tuo esclusivo beneficio. Non costituisce una decisione automatizzata
                  con effetti giuridici o significativamente analoghi ai sensi dell&apos;art. 22 GDPR:
                  il punteggio e i suggerimenti restano informazioni che leggi e utilizzi tu, non una
                  decisione presa nei tuoi confronti da terzi (es. un datore di lavoro) sulla base di
                  un processo automatizzato.
                </p>
                <p className="mt-3">
                  Se hai un account, ogni tanto (al massimo una volta ogni 21 giorni per la
                  generazione del profilo e per l&apos;adattamento a un annuncio, e mai se non hai
                  effettuato l&apos;accesso) ti mostriamo un breve popup facoltativo per valutare la
                  funzione appena usata: se lo compili, raccogliamo un voto da 1 a 5 e un eventuale
                  commento testuale, collegati al tuo account.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">3. Finalità e Base Giuridica</h2>
                <p>
                  I dati del modulo di contatto sono trattati sulla base dell&apos;art. 6(1)(b) GDPR
                  (misure precontrattuali adottate su richiesta dell&apos;interessato) oppure, quando
                  non ricorre un rapporto contrattuale, dell&apos;art. 6(1)(f) GDPR (legittimo
                  interesse a rispondere a una richiesta di informazioni volontariamente inviata
                  dall&apos;utente). I dati legati alla creazione e gestione dell&apos;account, alla
                  generazione del profilo e all&apos;adattamento del CV sono trattati per
                  l&apos;esecuzione del servizio richiesto dall&apos;utente (art. 6(1)(b) GDPR,
                  esecuzione di un contratto/misure precontrattuali su richiesta dell&apos;interessato).
                </p>
                <p className="mt-2">
                  Se hai un account, ti inviamo inoltre alcune comunicazioni di servizio via email
                  (es. email di benvenuto, avviso quando i crediti sono esauriti, un promemoria se non
                  hai ancora completato il tuo profilo), sulla base del legittimo interesse a mantenerti
                  informato sull&apos;uso del servizio che hai richiesto (art. 6(1)(f) GDPR). Puoi
                  opporti in qualsiasi momento, senza alcuna conseguenza sul funzionamento del tuo
                  account, tramite il link presente in calce a ciascuna di queste email o dalla sezione
                  &quot;Preferenze email&quot; delle impostazioni del tuo account.
                </p>
                <p className="mt-2">
                  Alcuni moduli del sito (caricamento del CV, adattamento a un annuncio) limitano il
                  numero di richieste consentite da uno stesso indirizzo IP in un dato intervallo di
                  tempo, per prevenire abusi automatizzati. Questo trattamento dell&apos;indirizzo IP,
                  temporaneo e non collegato alla tua identità se non sei autenticato, si basa sul
                  legittimo interesse alla sicurezza e all&apos;integrità del servizio (art. 6(1)(f)
                  GDPR).
                </p>
                <p className="mt-2">
                  Se ti registri con un&apos;email che aveva già ricevuto in passato il credito di
                  benvenuto (ad esempio perché l&apos;account collegato era stato eliminato e poi
                  ricreato), non riceverai un secondo bonus: per riconoscere questo caso conserviamo
                  un&apos;impronta crittografica (hash) della tua email, non l&apos;email in chiaro,
                  sulla base del legittimo interesse a prevenire un uso fraudolento del programma di
                  benvenuto (art. 6(1)(f) GDPR).
                </p>
                <p className="mt-2">
                  Il voto e l&apos;eventuale commento che lasci nel popup di valutazione facoltativo
                  sono trattati sulla base del legittimo interesse a migliorare il servizio (art.
                  6(1)(f) GDPR): è una richiesta di opinione che scegli tu se compilare o ignorare, non
                  necessaria per l&apos;esecuzione del servizio.
                </p>
                <p className="mt-2">
                  Il registro tecnico dei consumi di intelligenza artificiale descritto al punto 2
                  (tipo di operazione, modello, token, costo, identificativo interno dell&apos;account)
                  è trattato sulla base del legittimo interesse alla sostenibilità economica e alla
                  corretta contabilizzazione dei costi del servizio (art. 6(1)(f) GDPR). Il
                  collegamento all&apos;account è necessario per attribuire il costo a chi lo ha
                  generato, condizione indispensabile per calibrare il modello a crediti ed
                  individuare eventuali usi anomali.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">4. Conservazione dei Dati</h2>
                <p>
                  I dati del modulo di contatto vengono ricevuti via email e non sono archiviati in
                  alcun database.
                </p>
                <p className="mt-2">
                  Un CV appena caricato ma non ancora collegato a un account (&quot;anteprima&quot;)
                  viene conservato per un massimo di <strong className="text-foreground">1 ora</strong>,
                  trascorsa la quale viene eliminato automaticamente se non registri un account.
                </p>
                <p className="mt-2">
                  Un CV collegato a un account (registrandoti o accedendo dopo averlo caricato) viene
                  invece conservato <strong className="text-foreground">senza scadenza automatica</strong>,
                  per tutta la durata del rapporto con il tuo account: il criterio di conservazione è
                  la persistenza dell&apos;account stesso, poiché il servizio è pensato per restare
                  utilizzabile (riscaricare un PDF, ri-adattare un CV) in qualsiasi momento futuro,
                  anche a distanza di mesi o anni. Puoi eliminare un singolo CV, o l&apos;intero
                  account (con tutti i CV, gli adattamenti, i crediti e le eventuali valutazioni
                  lasciate nel popup di feedback) in qualsiasi momento,
                  in piena autonomia, dalla pagina del tuo account: l&apos;eliminazione è immediata e
                  irreversibile, e non richiede di contattarci o attendere alcun intervento da parte
                  nostra.
                </p>
                <p className="mt-2">
                  Per evitare di rielaborare (e farti ripagare) lo stesso identico file, conserviamo
                  separatamente una copia dei dati estratti da un CV, indicizzata con
                  un&apos;impronta crittografica del PDF caricato. Questa copia{' '}
                  <strong className="text-foreground">scade 30 giorni dopo l&apos;ultimo
                  utilizzo</strong> (ogni nuovo caricamento dello stesso file fa ripartire il
                  conteggio) e viene inoltre cancellata quando elimini il tuo account, per tutte le
                  impronte collegate ai CV salvati nel tuo account. Va detto con precisione: le
                  impronte non collegate ad alcun CV salvato (tipicamente quelle di un caricamento
                  anonimo mai registrato) non possono essere ricondotte a un account in fase di
                  eliminazione, e per queste vale soltanto la scadenza automatica a 30 giorni.
                </p>
                <p className="mt-2">
                  Fa eccezione un&apos;impronta crittografica (hash) della tua email, generata solo per
                  riconoscere se hai già ricevuto in passato il credito di benvenuto: non viene
                  eliminata insieme all&apos;account, proprio perché la sua funzione è impedire che lo
                  stesso bonus venga richiesto più volte cancellando e ricreando l&apos;account. Non
                  consente di risalire alla tua email in chiaro, non è collegata a nessun altro dato
                  personale, e non viene mai utilizzata per finalità diverse da questa.
                </p>
                <p className="mt-2">
                  Ogni volta che accetti una casella &quot;ho letto e accetto&quot; prima di un&apos;azione
                  che condivide tuoi dati con noi (creazione dell&apos;account, caricamento del CV,
                  adattamento a un annuncio, moduli di contatto e supporto), conserviamo una prova
                  tecnica di quella scelta sui nostri server (data e ora, versione della policy
                  accettata, il contesto dell&apos;azione, e — quando disponibile — l&apos;account
                  collegato), a fini di dimostrabilità del consenso (art. 5(2) e 7(1) GDPR,
                  &quot;responsabilizzazione&quot;). Conserviamo questo registro per 5 anni dalla data
                  della scelta, in linea con gli ordinari termini di prescrizione. Non si tratta di
                  un impegno generico: una procedura automatica in esecuzione ogni giorno cancella
                  le registrazioni che hanno superato i 5 anni, sia per le scelte sui cookie sia per
                  le accettazioni delle policy.
                </p>
                <p className="mt-2">
                  Copie di backup dell&apos;infrastruttura (mantenute dai nostri fornitori di hosting e
                  database per finalità di disaster recovery) e i log tecnici applicativi vengono
                  conservati secondo i cicli di rotazione standard dei rispettivi fornitori e non sono
                  accessibili per un uso diverso dal ripristino in caso di guasto.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">5. Destinatari dei Dati</h2>
                <p>
                  I dati non vengono ceduti né venduti a terzi. I soggetti che trattano i dati in
                  qualità di responsabili del trattamento ai sensi dell&apos;art. 28 GDPR sono:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Aruba S.p.A., gestore della casella email del Titolare: ricezione messaggi dal modulo di contatto e invio delle comunicazioni di servizio relative al tuo account descritte al punto 3</li>
                  <li>Vercel Inc., hosting dell&apos;applicazione, conservazione temporanea delle anteprime non ancora collegate a un account, e limitazione del numero di richieste per indirizzo IP sui moduli più sensibili</li>
                  <li>Supabase Inc., gestione degli account, autenticazione e conservazione permanente dei profili e dei dati dei CV collegati a un account</li>
                  <li>Anthropic PBC, elaborazione del testo del CV per l&apos;estrazione, il miglioramento e l&apos;adattamento del profilo</li>
                  <li>Cloudflare Inc., verifica anti-bot (Turnstile) sui moduli di caricamento CV e adattamento annuncio</li>
                  <li>Google Ireland Limited, autenticazione tramite &quot;Accedi con Google&quot;, se scegli questo metodo di accesso: Google verifica la tua identità e ci comunica email e nome. Questo trattamento è indipendente dal punto successivo e non dipende dal banner cookie, perché è parte del servizio che hai richiesto</li>
                  <li>Google Ireland Limited, statistiche di navigazione aggregate e anonimizzate (Google Analytics 4), solo se hai dato il consenso alla categoria Statistiche nel banner cookie. Questa integrazione è predisposta ma <strong className="text-foreground">non è attiva al momento</strong>: nessun identificativo di misurazione è configurato, quindi Google Analytics non viene caricato e nessun dato gli viene trasmesso, nemmeno se hai acconsentito alla categoria Statistiche. Questa voce verrà aggiornata se e quando lo attiveremo</li>
                  <li>PostHog Inc., analisi di prodotto ed eventuale registrazione di sessione (session replay, con mascheramento del contenuto del CV e di tutti i campi di digitazione) — dati trattati ed ospitati nella regione UE, solo se hai dato il consenso alla categoria Statistiche nel banner cookie</li>
                </ul>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">6. Trasferimento Dati Extra-UE</h2>
                <p>
                  La maggior parte dei fornitori sopra indicati ha sede negli Stati Uniti
                  (l&apos;infrastruttura dati di Supabase può essere configurata in diverse regioni,
                  incluse quelle europee; PostHog Inc. tratta e ospita questi dati specifici nella
                  regione UE, e Aruba S.p.A. ha sede in Italia, quindi nessuno di questi comporta un
                  trasferimento extra-UE). Per i fornitori extra-UE, i trasferimenti sono
                  effettuati nel rispetto delle garanzie previste dagli artt. 44–49 GDPR, tramite le
                  Standard Contractual Clauses (SCC) adottate dalla Commissione Europea.
                </p>
                <p className="mt-2">
                  In particolare, l&apos;utilizzo di Anthropic PBC per l&apos;elaborazione del testo
                  del CV è disciplinato da un Data Processing Addendum pubblico che incorpora le SCC
                  (Decisione della Commissione UE 2021/914, Modulo Due e/o Modulo Tre) e prevede
                  espressamente che i contenuti inviati tramite l&apos;API non vengano utilizzati per
                  addestrare i modelli, la cancellazione dei dati entro 30 giorni dalla cessazione del
                  rapporto contrattuale, e la notifica di eventuali violazioni di sicurezza entro 48
                  ore dalla scoperta.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">7. Diritti dell&apos;Interessato</h2>
                <p>Ai sensi degli artt. 15–22 GDPR, l&apos;interessato ha il diritto di:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Accedere ai propri dati personali (art. 15)</li>
                  <li>Rettificarli (art. 16), i dati anagrafici del tuo CV sono modificabili direttamente dalla pagina del tuo account</li>
                  <li>Ottenerne la cancellazione (art. 17, &quot;diritto all&apos;oblio&quot;), puoi eliminare un singolo CV o l&apos;intero account autonomamente, senza bisogno di richiederlo a noi (con la sola eccezione, per finalità di prevenzione frodi, dell&apos;impronta crittografica della tua email descritta al punto 4)</li>
                  <li>Limitarne il trattamento (art. 18)</li>
                  <li>Ricevere i propri dati in formato portabile (art. 20)</li>
                  <li>Opporsi al trattamento (art. 21)</li>
                  <li>Revocare il consenso in qualsiasi momento (art. 7(3))</li>
                </ul>
                <p className="mt-2">
                  Per esercitare i diritti non disponibili in autonomia dalla pagina del tuo account,
                  scrivere a{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                  . Il titolare risponderà entro 30 giorni dalla richiesta.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">8. Reclamo all&apos;Autorità di Controllo</h2>
                <p>
                  L&apos;interessato ha il diritto di proporre reclamo al Garante per la Protezione
                  dei Dati Personali (
                  <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    www.garanteprivacy.it
                  </a>
                  ) qualora ritenga che il trattamento violi il GDPR.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">9. Cookie</h2>
                <p>
                  Questo sito utilizza cookie strettamente necessari al funzionamento del servizio
                  (es. mantenimento della sessione di accesso, verifica anti-bot), sempre attivi, e
                  (solo previo tuo consenso esplicito) cookie di Statistiche per capire come viene
                  usato il sito. L&apos;unico strumento di statistica effettivamente attivo è
                  PostHog, con eventuale registrazione di sessione; Google Analytics 4 è predisposto
                  ma non è attivo al momento (vedi il punto 5). Puoi dare, rifiutare o revocare il consenso in
                  qualsiasi momento dal banner cookie o dal link &quot;Preferenze Cookie&quot; in fondo
                  al sito. Per maggiori informazioni consulta la nostra{' '}
                  <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">10. Sicurezza</h2>
                <p>
                  I dati sono cifrati sia a riposo (a livello di infrastruttura del database) sia in
                  transito (connessioni HTTPS su tutto il sito). L&apos;accesso ai tuoi dati da parte
                  di altri utenti del servizio richiede sempre l&apos;autenticazione ed è tecnicamente
                  limitato ai soli dati di loro proprietà tramite regole di accesso a livello di
                  database (Row Level Security), non solo lato applicazione. Le credenziali con
                  accesso privilegiato ai dati sono usate esclusivamente lato server e non sono mai
                  esposte al browser. I tuoi dati di contatto reali (email e telefono) non vengono mai
                  pubblicati sulla pagina web pubblica generata dal servizio, e restano visibili solo a
                  te, all&apos;interno del tuo account protetto.
                </p>
                <p className="mt-2">
                  Per completezza: il personale autorizzato del Titolare può accedere ai dati degli
                  account tramite strumenti amministrativi interni (protetti da credenziali dedicate e
                  utilizzati esclusivamente lato server), per finalità di assistenza agli utenti,
                  prevenzione degli abusi e gestione operativa del servizio, ad esempio per verificare
                  il saldo crediti di chi scrive al supporto o per leggere le valutazioni lasciate nel
                  popup di feedback. Queste operazioni non passano dalle regole di accesso a livello di
                  database descritte sopra, che limitano gli utenti fra loro e non il Titolare: un
                  servizio non potrebbe essere gestito altrimenti, e preferiamo dirlo esplicitamente
                  piuttosto che lasciar intendere il contrario.
                </p>
              </div>
            </>
          ) : (
            <>
              <p>
                Privacy notice pursuant to Arts. 13 and 14 of EU Regulation 2016/679 (GDPR).
              </p>

              <div>
                <h2 className="font-semibold text-foreground mb-2">1. Data Controller</h2>
                <p>
                  The data controller is{' '}
                  <strong className="text-foreground">Jobli Srls (in costituzione)</strong>, based in
                  Milan, Italy.
                  <br />
                  Contact email:{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                </p>
                <p className="mt-2">
                  The Controller has not appointed a Data Protection Officer (DPO), not mandatory
                  given the nature, scope, and purposes of the processing currently carried out
                  (Art. 37 GDPR).
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">2. Data Collected</h2>
                <p>When you submit the contact form, we collect:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>First and last name</li>
                  <li>Email address</li>
                  <li>Message content</li>
                  <li>Optionally, a CV/résumé in PDF format</li>
                </ul>
                <p className="mt-3">If you create an account, we also collect:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Email address and password (your password is handled by our authentication provider, Supabase, and is never visible to us in plain text)</li>
                  <li>Instead of a password, if you choose to sign in with Google: your email address and your name, passed to us by Google once authentication completes. We never receive your Google password or any other data from your Google account, and we have no access to anything held in it</li>
                  <li>Account creation date</li>
                  <li>Credit balance and transaction history (e.g. &quot;PDF download&quot;, &quot;job tailoring&quot;, with date)</li>
                  <li>Your profile photo, if you choose to upload one from your account settings. The file is stored in Supabase Storage, in a folder belonging to your account. Worth stating plainly: that storage area is configured as public, so anyone who knows (or guesses) the file&apos;s address can open it without signing in, exactly as happens with the profile photo on most online services. You can replace or remove it at any time from your settings</li>
                </ul>
                <p className="mt-3">When you upload a CV via the profile generator, we collect:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>The uploaded CV&apos;s content (experience, education, skills, projects, etc.), extracted and processed by AI to build your profile</li>
                  <li>The uploaded PDF&apos;s filename, used to generate your profile page&apos;s web address (editable at any time from your account)</li>
                  <li>Your real (unredacted) email and phone number, used solely for the privately downloadable PDF (the public web page always shows redacted versions of these to limit automated scraping by third parties)</li>
                  <li>Any social profile links (e.g. LinkedIn) you provide</li>
                </ul>
                <p className="mt-3">
                  If you use the job-tailoring feature, the job posting text (pasted or fetched from
                  a link you provide) is sent to our AI provider to generate the tailored version of
                  your CV, but is not retained by us beyond the time needed to complete that processing.
                </p>
                <p className="mt-3">
                  The other features that process your data, and what each involves:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Cover letter: your CV and the job posting text are sent to our AI provider; the generated letter is saved to your account, so you don&apos;t have to regenerate (and pay for) it again for the same posting</li>
                  <li>Translation: the CV (or the letter) is sent to our AI provider and the translated version is saved to your account as an additional CV</li>
                  <li>Word (.docx) document: generated on the spot from the CV data already in your account, without sending anything to providers beyond those listed in point 5</li>
                  <li>Interview preparation: the job posting text is sent to our AI provider, which, in order to answer, consults public sources on the live web through its own web-search and page-reading tools. Those searches are about the hiring company, not about you: by design, this feature does not access your CV at all. The resulting briefing is saved to your account</li>
                  <li>CV completion chat: the AI&apos;s questions and your answers are kept in your account for the duration of the conversation and so you can resume it; when you finish, the information you supplied is folded into your CV</li>
                </ul>
                <p className="mt-3">
                  For every AI-processed operation we also record, in an internal technical log, the
                  type of operation (e.g. &quot;CV analysis&quot;, &quot;job tailoring&quot;), the
                  model used, the number of tokens consumed, the corresponding cost, the date, and
                  your account&apos;s internal identifier. This log contains neither your CV&apos;s
                  content nor the text exchanged with the AI: it exists solely so we know what the
                  service costs to run and can size the credit model accordingly.
                </p>
                <p className="mt-3">
                  The service does not request or solicit special category data (Art. 9 GDPR: racial
                  or ethnic origin, political opinions, religious beliefs, trade union membership,
                  health data, sex life or sexual orientation). If your CV happens to contain any of
                  this (for example mentioned in a volunteering experience, or to explain a career
                  gap), please avoid including it when not necessary: it is never requested, never
                  used to generate scores or suggestions, and you can remove it yourself by editing
                  your profile&apos;s data from your account.
                </p>
                <p className="mt-3">
                  The service assigns your CV an automated score against objective criteria
                  (quantified results, clarity, ATS structure, specific skills) and suggests roles
                  that fit your experience: this is automated processing that evaluates professional
                  aspects under Art. 4(4) GDPR, carried out at your explicit request and solely for
                  your own benefit. It does not amount to automated decision-making producing legal or
                  similarly significant effects under Art. 22 GDPR: the score and suggestions remain
                  information for you to read and use, not a decision made about you by a third party
                  (e.g. an employer) based on an automated process.
                </p>
                <p className="mt-3">
                  If you have an account, every so often (at most once every 21 days for profile
                  generation and for job tailoring, and never if you&apos;re not signed in) we show a
                  brief, optional popup asking you to rate the feature you just used: if you fill it
                  in, we collect a 1-5 rating and an optional text comment, linked to your account.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">3. Purpose and Legal Basis</h2>
                <p>
                  Contact form data is processed on the basis of Art. 6(1)(b) GDPR (steps taken at
                  your request prior to entering into a relationship with us) or, where no contractual
                  relationship is in place, Art. 6(1)(f) GDPR (legitimate interest in responding to an
                  inquiry you voluntarily sent us). Data related to your account, profile generation,
                  and CV tailoring is processed to perform the service you requested (Art. 6(1)(b)
                  GDPR, performance of a contract / pre-contractual steps taken at your request).
                </p>
                <p className="mt-2">
                  If you have an account, we also send you a small number of service emails (e.g. a
                  welcome email, a notice when your credits run out, a reminder if you haven&apos;t
                  finished your profile yet), based on our legitimate interest in keeping you informed
                  about the service you requested (Art. 6(1)(f) GDPR). You can object at any time,
                  with no effect on your account, via the link at the bottom of each such email or
                  from the &quot;Email preferences&quot; section of your account settings.
                </p>
                <p className="mt-2">
                  Some forms on the site (CV upload, job-posting tailoring) limit how many requests a
                  single IP address can make in a given time window, to prevent automated abuse. This
                  temporary processing of your IP address, not linked to your identity unless you are
                  signed in, is based on our legitimate interest in the security and integrity of the
                  service (Art. 6(1)(f) GDPR).
                </p>
                <p className="mt-2">
                  If you sign up with an email that had already received the welcome credit bonus in
                  the past (for example because the linked account had been deleted and re-created),
                  you won&apos;t receive a second bonus: to recognize this case we keep a cryptographic
                  hash of your email, never the plaintext email itself, based on our legitimate
                  interest in preventing abuse of the welcome bonus program (Art. 6(1)(f) GDPR).
                </p>
                <p className="mt-2">
                  The rating and optional comment you leave in the feedback popup are processed on
                  the basis of our legitimate interest in improving the service (Art. 6(1)(f) GDPR):
                  it&apos;s an optional request for your opinion, not something needed to perform the
                  service itself.
                </p>
                <p className="mt-2">
                  The technical AI-usage log described in point 2 (operation type, model, tokens,
                  cost, internal account identifier) is processed on the basis of our legitimate
                  interest in the service&apos;s economic sustainability and in accounting for its
                  costs correctly (Art. 6(1)(f) GDPR). The link to your account is what makes it
                  possible to attribute a cost to whoever generated it, which is in turn what lets us
                  calibrate the credit model and spot abnormal usage.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">4. Data Retention</h2>
                <p>
                  Contact form data is received by email and is not stored in any database.
                </p>
                <p className="mt-2">
                  A CV you&apos;ve just uploaded but not yet linked to an account (a &quot;preview&quot;)
                  is kept for a maximum of <strong className="text-foreground">1 hour</strong>, after
                  which it is deleted automatically if you don&apos;t create or sign in to an account.
                </p>
                <p className="mt-2">
                  A CV linked to an account (by signing up or logging in after uploading it) is kept{' '}
                  <strong className="text-foreground">indefinitely</strong>, for as long as your
                  account exists: the retention criterion is the account&apos;s own persistence, since
                  the service is meant to stay usable (re-downloading a PDF, re-tailoring a CV) at any
                  point in the future, even months or years later. You can delete a single CV, or your
                  entire account (with every CV, every tailored version, your credits, and any ratings
                  left in the feedback popup) at any time, entirely on your own, from your account page: deletion is immediate and
                  irreversible, and doesn&apos;t require contacting us or waiting on anything from our
                  side.
                </p>
                <p className="mt-2">
                  To avoid re-processing (and re-charging you for) the exact same file, we separately
                  keep a copy of the data extracted from a CV, indexed by a cryptographic fingerprint
                  of the uploaded PDF. That copy{' '}
                  <strong className="text-foreground">expires 30 days after it was last used</strong>{' '}
                  (each fresh upload of the same file restarts the clock), and is additionally
                  deleted when you delete your account, for every fingerprint linked to the CVs saved
                  in it. To be precise about the limit: fingerprints not linked to any saved CV
                  (typically those from an anonymous upload that was never registered) cannot be
                  traced back to an account being deleted, so for those only the automatic 30-day
                  expiry applies.
                </p>
                <p className="mt-2">
                  One exception: a cryptographic hash of your email, generated solely to recognize
                  whether you&apos;ve already received the welcome credit bonus in the past. This is
                  not deleted along with your account, precisely because its purpose is to prevent the
                  same bonus from being claimed repeatedly by deleting and re-creating an account. It
                  cannot be reversed back into your plaintext email, is not linked to any other
                  personal data, and is never used for any purpose other than this one.
                </p>
                <p className="mt-2">
                  Whenever you tick an &quot;I have read and agree&quot; box before an action that
                  shares your data with us (account signup, CV upload, job-posting tailoring, contact
                  and support forms), we keep a technical record of that choice on our servers (date
                  and time, the policy version accepted, the action&apos;s context, and — where
                  available — the linked account), for consent accountability purposes (Art. 5(2) and
                  7(1) GDPR). We keep this record for 5 years from the date of the choice, in line
                  with ordinary statute-of-limitations periods. This is not a general promise: an
                  automated job running every day deletes records older than 5 years, for both cookie
                  choices and policy acceptances.
                </p>
                <p className="mt-2">
                  Infrastructure backup copies (kept by our hosting and database providers for
                  disaster-recovery purposes) and technical application logs are retained according to
                  each provider&apos;s standard rotation cycle, and are never accessed for any purpose
                  other than restoring service after a failure.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">5. Data Recipients</h2>
                <p>
                  Your data is not sold or shared with third parties. The processors (Art. 28 GDPR) are:
                </p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Aruba S.p.A., operator of the Controller&apos;s mailbox: receipt of contact form messages and delivery of the account service emails described in point 3</li>
                  <li>Vercel Inc., application hosting, temporary storage of previews not yet linked to an account, and per-IP-address rate limiting on the more sensitive forms</li>
                  <li>Supabase Inc., account management, authentication, and permanent storage of profiles and CV data linked to an account</li>
                  <li>Anthropic PBC, processing of CV text for profile extraction, improvement, and job tailoring</li>
                  <li>Cloudflare Inc., bot verification (Turnstile) on the CV upload and job-tailoring forms</li>
                  <li>Google Ireland Limited, authentication via &quot;Sign in with Google&quot;, if you choose that login method: Google verifies your identity and passes us your email and name. This processing is separate from the next entry and does not depend on the cookie banner, because it is part of the service you asked for</li>
                  <li>Google Ireland Limited, aggregated, anonymised browsing statistics (Google Analytics 4), only if you&apos;ve consented to the Statistics category in the cookie banner. This integration is in place but <strong className="text-foreground">is not currently active</strong>: no measurement ID is configured, so Google Analytics is never loaded and no data reaches it, even if you have consented to the Statistics category. This entry will be updated if and when we turn it on</li>
                  <li>PostHog Inc., product analytics and optional session replay (with CV content and every input field masked) — data processed and hosted in the EU region, only if you've consented to the Statistics category in the cookie banner</li>
                </ul>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">6. International Transfers</h2>
                <p>
                  Most of the processors listed above are based in the United States (Supabase&apos;s
                  data infrastructure can be configured in various regions, including within the EU;
                  PostHog Inc. processes and hosts this specific data in the EU region, and Aruba
                  S.p.A. is based in Italy, so none of these involve a non-EU transfer). For non-EU
                  processors, transfers are carried out under the safeguards of
                  Arts. 44–49 GDPR via Standard Contractual Clauses (SCC) adopted by the European
                  Commission.
                </p>
                <p className="mt-2">
                  In particular, our use of Anthropic PBC for CV text processing is governed by a
                  public Data Processing Addendum that incorporates the EU SCCs (European Commission
                  Decision 2021/914, Module Two and/or Module Three) and expressly states that
                  content submitted via the API is not used to train models, that customer data is
                  deleted within 30 days of contract termination, and that any security breach is
                  notified within 48 hours of discovery.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">7. Your Rights</h2>
                <p>Under Arts. 15–22 GDPR, you have the right to:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Access your personal data (Art. 15)</li>
                  <li>Rectify inaccurate data (Art. 16), your CV&apos;s personal details can be edited directly from your account page</li>
                  <li>Erasure / right to be forgotten (Art. 17), you can delete a single CV or your entire account yourself, without needing to request it from us (with the sole exception, for fraud-prevention purposes, of the email hash described in point 4)</li>
                  <li>Restriction of processing (Art. 18)</li>
                  <li>Data portability (Art. 20)</li>
                  <li>Object to processing (Art. 21)</li>
                  <li>Withdraw consent at any time without affecting prior lawful processing (Art. 7(3))</li>
                </ul>
                <p className="mt-2">
                  To exercise rights not available directly from your account page, write to{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="text-primary hover:underline">
                    {SUPPORT_EMAIL}
                  </a>
                  . We will respond within 30 days.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">8. Supervisory Authority</h2>
                <p>
                  You have the right to lodge a complaint with the Italian Data Protection Authority
                  (Garante per la Protezione dei Dati Personali,{' '}
                  <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    www.garanteprivacy.it
                  </a>
                  ) if you believe the processing infringes the GDPR.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">9. Cookies</h2>
                <p>
                  This website uses cookies strictly necessary for the service to function (e.g.
                  keeping you signed in, bot verification), always active, and (only with your
                  explicit consent) Statistics cookies to understand how the site is used. The only
                  statistics tool actually active is PostHog, with optional session replay; Google
                  Analytics 4 is integrated but not currently active (see point 5).
                  You can give, decline, or withdraw consent at any time from the
                  cookie banner or the &quot;Cookie preferences&quot; link at the bottom of the site.
                  For full details see our{' '}
                  <Link href="/cookies" className="text-primary hover:underline">Cookie Policy</Link>.
                </p>
              </div>

              <div>
                <h2 className="font-semibold text-foreground mb-2">10. Security</h2>
                <p>
                  Data is encrypted both at rest (at the database infrastructure level) and in
                  transit (HTTPS across the whole site). Access to your data by other users of the
                  service always requires authentication, and is technically restricted to only the
                  data they own via database-level access rules (Row Level Security), not just
                  application-level checks. Credentials with privileged data access are used
                  exclusively server-side and are never exposed to the browser. Your real contact
                  details (email and phone) are never published on the public web page generated by
                  the service, and stay visible only to you, inside your protected account.
                </p>
                <p className="mt-2">
                  For completeness: the Controller&apos;s authorised personnel can access account data
                  through internal administrative tooling (protected by dedicated credentials and used
                  exclusively server-side), for user support, abuse prevention, and running the
                  service, for example to check the credit balance of someone who wrote to support or
                  to read the ratings left in the feedback popup. These operations do not go through
                  the database-level access rules described above, which separate users from each
                  other rather than limiting the Controller: no service could be operated otherwise,
                  and we would rather say so explicitly than imply the opposite.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
