# Registro delle Attività di Trattamento (art. 30 GDPR)

**BOZZA DI LAVORO — non è un documento legale definitivo.** Va rivisto e validato da un consulente
privacy/legale prima di essere considerato il registro ufficiale del Titolare, in particolare per
le parti segnate `[DA COMPLETARE]`.

Ultimo aggiornamento: 1 settembre 2026.

---

## Titolare del trattamento

- Nome/denominazione: Jobli Srls (in costituzione)
- Forma giuridica: società a responsabilità limitata, **in fase di costituzione** — non ancora
  iscritta al Registro delle Imprese al 21 agosto 2026. Fino al perfezionamento dell'iscrizione, la
  società non ha personalità giuridica autonoma: verificare con un notaio/commercialista se, nel
  frattempo, il titolare effettivo debba essere formalmente indicato come il socio fondatore/i
  fondatori in proprio (prassi comune per le società "in costituzione").
- Sede legale: Milano, Italia — indirizzo completo `[DA COMPLETARE]`
- Codice fiscale/P.IVA: `[DA COMPLETARE — verosimilmente non ancora assegnata fino al
  perfezionamento della costituzione]`
- Email di contatto: info@jobli.it
- PEC (se presente): `[DA COMPLETARE]`
- DPO: non nominato — da valutare se applicabile in base a volumi/natura del trattamento

## Responsabile della protezione dei dati (DPO)

Non nominato allo stato attuale. Da rivalutare se il trattamento dovesse assumere carattere di
monitoraggio sistematico su larga scala o includere trattamenti massivi di categorie particolari.

---

## 1. Gestione account e autenticazione

- **Finalità**: creazione e gestione dell'account utente, autenticazione, gestione crediti.
- **Base giuridica**: art. 6(1)(b) GDPR (esecuzione di un contratto).
- **Categorie di interessati**: utenti registrati.
- **Categorie di dati**: email, password (hash, gestita da Supabase Auth), data creazione account, saldo crediti, storico transazioni.
- **Destinatari**: Supabase Inc. (responsabile ex art. 28).
- **Trasferimenti extra-UE**: sì, verso gli USA, tramite SCC. Regione dati Supabase da confermare: `[DA COMPLETARE]`.
- **Termine di conservazione**: fino a cancellazione dell'account da parte dell'utente (self-service, immediata), con un'unica eccezione riportata sotto.
- **Misure di sicurezza**: HTTPS, cifratura a riposo, Row Level Security, credenziali privilegiate solo server-side.

**Sotto-trattamento distinto — prevenzione abuso del credito di benvenuto** (tabella `welcome_credit_grants`, migrazione `0032_welcome_credit_email_hash.sql`, 2026-09-02): al momento della registrazione viene calcolato e conservato un hash SHA-256 dell'email (mai l'email in chiaro), usato solo per riconoscere se quell'email ha già ricevuto in passato il credito di benvenuto e impedire che venga assegnato una seconda volta cancellando e ricreando l'account. Base giuridica: legittimo interesse (art. 6(1)(f) GDPR), distinta dal contratto che copre il resto di questa sezione. Non è collegata alla cancellazione dell'account: è l'unica eccezione al "fino a cancellazione dell'account" di cui sopra, perché la sua funzione esiste proprio per sopravvivere a quella cancellazione. Non reversibile nell'email originale, nessun destinatario terzo (resta solo su Supabase).

## 2. Caricamento ed estrazione del CV

- **Finalità**: estrazione strutturata del contenuto del CV (esperienze, formazione, competenze) per generare il profilo.
- **Base giuridica**: art. 6(1)(b) GDPR (misure precontrattuali/esecuzione del servizio richiesto).
- **Categorie di interessati**: utenti (candidati).
- **Categorie di dati**: contenuto del CV, nome del file, email/telefono reali (non oscurati), eventuali link social.
- **Categorie particolari (art. 9)**: non richieste; possibili solo se l'utente le inserisce volontariamente nel documento caricato (vedi Privacy Policy, sez. 2).
- **Destinatari**: Anthropic PBC (elaborazione testo, responsabile ex art. 28 — **DPA da verificare**, vedi nota sotto), Supabase Inc. (storage), Vercel Inc. (hosting/anteprime temporanee).
- **Trasferimenti extra-UE**: sì (Anthropic, Vercel, Supabase se regione USA) — tramite SCC.
- **Termine di conservazione**: anteprima non collegata ad account, 1 ora; CV collegato ad account, senza scadenza automatica fino a cancellazione da parte dell'utente.

> **Verificato il 21 agosto 2026** — Anthropic pubblica un Data Processing Addendum (DPA) pubblico
> all'indirizzo anthropic.com/legal/data-processing-addendum, incorporato per riferimento nei
> Commercial Terms of Service (anthropic.com/legal/commercial-terms). Punti rilevanti confermati
> direttamente dal testo pubblico:
> - **Ruolo**: Anthropic agisce come responsabile del trattamento (processor), il cliente come
>   titolare (controller) per i dati personali trattati tramite l'API (Sezione B.1 del DPA).
> - **Nessun training sui dati**: i Commercial Terms of Service dichiarano esplicitamente che
>   Anthropic non addestra i propri modelli sui contenuti inviati tramite l'API ("Anthropic may not
>   train models on Customer Content from Services").
> - **Trasferimenti extra-UE**: il DPA incorpora le Standard Contractual Clauses UE (Decisione
>   Comm. 2021/914), Modulo Due (controller-to-processor) e/o Modulo Tre (processor-to-processor),
>   con le opzioni previste dalla legge irlandese (Clausola 17, Opzione 1).
> - **Sub-responsabili**: elenco pubblico e aggiornato su anthropic.com/subprocessors; i clienti
>   ricevono notifica e hanno 15 giorni per opporsi a un nuovo sub-responsabile.
> - **Conservazione**: cancellazione dei dati cliente entro 30 giorni dalla cessazione del
>   rapporto contrattuale, salvo obblighi legali di conservazione o necessità di risolvere
>   controversie.
> - **Notifica violazioni**: entro 48 ore dalla scoperta di un incidente di sicurezza (più stringente
>   delle 72 ore previste dall'art. 33 GDPR per la notifica al Garante).
> - **Sicurezza**: cifratura AES-256 a riposo, TLS 1.2+ in transito, audit di terze parti annuali,
>   report SOC 2 disponibili su trust.anthropic.com.
>
> **Resta da verificare** `[DA VERIFICARE]`: se l'account Anthropic effettivamente utilizzato da
> Jobli ha formalmente accettato questi Commercial Terms of Service (tipicamente avviene
> automaticamente all'attivazione di un account API a uso commerciale, ma va confermato lato
> account/fatturazione), e se è stata richiesta/negoziata una DPA firmata separatamente (di solito
> non necessaria: il DPA pubblico si applica per incorporazione ai Commercial Terms).

## 3. Generazione e pubblicazione della pagina profilo

- **Finalità**: creazione di una pagina web pubblica, condivisibile, contenente una versione del CV.
- **Base giuridica**: art. 6(1)(b) GDPR — su richiesta esplicita dell'utente, che sceglie di generare la pagina.
- **Particolarità**: dal 21 agosto 2026 l'utente può rendere la pagina privata (non raggiungibile da terzi) mantenendo il CV salvato — vedi `ProfileVisibilityToggle`. Tutte le pagine profilo sono inoltre escluse dall'indicizzazione dei motori di ricerca (`noindex`).
- **Dati minimizzati**: email e telefono reali non compaiono mai sulla pagina pubblica (solo versioni oscurate).
- **Termine di conservazione**: come il CV collegato.

## 4. Adattamento del CV a un annuncio di lavoro (tailoring)

- **Finalità**: generare una versione del CV adattata a uno specifico annuncio fornito dall'utente.
- **Base giuridica**: art. 6(1)(b) GDPR.
- **Categorie di dati**: contenuto del CV, testo dell'annuncio di lavoro (incollato o recuperato da URL).
- **Destinatari**: Anthropic PBC.
- **Termine di conservazione**: il testo dell'annuncio non viene conservato oltre l'elaborazione; il CV adattato risultante viene conservato come le altre versioni del CV.

## 5. Download PDF/Word, lettera di presentazione, traduzione

- **Finalità**: generare ed esportare documenti scaricabili (PDF, Word, lettera di presentazione, traduzioni).
- **Base giuridica**: art. 6(1)(b) GDPR.
- **Destinatari**: Anthropic PBC (generazione contenuto testuale), Supabase (storage metadati di download).
- **Termine di conservazione**: come il CV collegato.

## 6. Modulo di contatto / supporto

- **Finalità**: rispondere a richieste di informazioni o supporto inviate volontariamente dall'utente.
- **Base giuridica**: art. 6(1)(b) GDPR (misure precontrattuali su richiesta dell'interessato) o art. 6(1)(f) GDPR (legittimo interesse a rispondere), a seconda del contesto della richiesta.
- **Categorie di dati**: nome, email, testo del messaggio, eventuale CV allegato.
- **Destinatari**: Aruba S.p.A. (ricezione email tramite la casella info@jobli.it).
- **Termine di conservazione**: non archiviato in un database; conservato solo nella casella email di destinazione secondo le policy di retention email standard.

## 7. Cookie e analytics

- **Finalità**: funzionamento del sito (cookie necessari); statistiche aggregate di utilizzo (Analytics, previo consenso).
- **Base giuridica**: esecuzione del servizio (cookie necessari, esenti da consenso ex Linee Guida Garante 2021); consenso esplicito (art. 6(1)(a) GDPR) per Analytics e Marketing.
- **Destinatari**: Google Ireland Limited (Google Analytics 4, solo previo consenso).
- **Dettaglio completo**: vedi Cookie Policy pubblica (`/cookies`), che include una tabella nome/provider/finalità/durata per ogni cookie.

## 8. Verifica anti-bot (Cloudflare Turnstile)

- **Finalità**: prevenire abusi automatizzati dei moduli di caricamento CV e adattamento annuncio.
- **Base giuridica**: art. 6(1)(f) GDPR (legittimo interesse alla sicurezza e integrità del servizio).
- **Destinatari**: Cloudflare Inc.
- **Trasferimenti extra-UE**: sì, tramite SCC.

## 9. Comunicazioni di servizio via email

- **Finalità**: informare il titolare di un account sullo stato del proprio utilizzo del servizio —
  email di benvenuto al primo accesso, avviso quando i crediti sono esauriti, promemoria se il CV
  caricato non è mai stato scaricato entro 7 giorni. Aggiunta il 1 settembre 2026 (v. audit legale
  interno); prima di questa data l'unica corrispondenza email andava dall'utente verso il Titolare
  (moduli contatti e richiesta dominio), mai in direzione opposta.
- **Base giuridica**: legittimo interesse a mantenere l'utente informato sull'uso del servizio
  richiesto (art. 6(1)(f) GDPR). Il promemoria di inattività, per il contenuto e per l'iniziativa
  che è del Titolare e non dell'utente, si avvicina più delle altre due a una comunicazione di
  re-engagement: per questo tutte e tre le email, non solo questa, includono un meccanismo di
  opposizione a ogni invio (v. sotto), in applicazione prudenziale dell'art. 130 Codice Privacy.
- **Categorie di interessati**: utenti registrati che non hanno disattivato questa categoria di
  comunicazioni.
- **Categorie di dati**: indirizzo email, stato dell'account (saldo crediti, data di creazione,
  presenza di download/lettere), usati solo per decidere se e quale email inviare — mai inclusi nel
  corpo del messaggio oltre a quanto strettamente pertinente.
- **Meccanismo di opposizione**: link di disiscrizione non autenticato in calce a ogni email
  (`app/api/account/unsubscribe`, token univoco per utente) più un interruttore nelle impostazioni
  dell'account (`account_settings.lifecycle_emails_opt_out`); l'opposizione ha effetto immediato su
  tutte e tre le comunicazioni insieme.
- **Destinatari**: Aruba S.p.A., invio tecnico del messaggio tramite la casella info@jobli.it.
- **Termine di conservazione**: l'indirizzo email non viene conservato separatamente per questa
  finalità (è già il dato di accesso all'account); la sola data dell'ultimo invio di ciascun tipo di
  email è conservata finché l'account esiste, per garantire che ogni email sia inviata al massimo
  una volta.

## 10. Prova tecnica di accettazione delle policy

- **Finalità**: dimostrare che l'interessato ha effettivamente accettato la Privacy Policy e/o i
  Termini di Servizio prima di un'azione che condivide propri dati con il Titolare (creazione
  dell'account, caricamento del CV, adattamento a un annuncio, moduli di contatto e supporto).
  Aggiunta il 2026-09-02: prima di questa data le caselle "ho letto e accetto" erano solo un blocco
  lato interfaccia (disabilitano il pulsante di invio) senza alcuna registrazione persistente di chi
  avesse accettato, cosa, e quando — stesso gap poi colmato per il consenso cookie con
  `cookie_consent_log` (punto 7), qui esteso alle altre caselle dell'app. La casella era assente del
  tutto nel flusso di creazione account via email/password: aggiunta contestualmente.
- **Base giuridica**: legittimo interesse del Titolare alla responsabilizzazione (accountability) ex
  artt. 5(2) e 7(1) GDPR — provare che un dato consenso/accettazione è realmente avvenuto.
- **Categorie di interessati**: chiunque acceda a un modulo che raccoglie dati personali sul sito,
  autenticato o meno.
- **Categorie di dati**: identificativo account (se disponibile), contesto dell'azione, versione
  della policy accettata, indirizzo IP (troncato), user agent, data e ora.
- **Tabella**: `policy_acceptance_log` (`supabase/migrations/0033_policy_acceptance_log.sql`), RLS
  attiva senza alcuna policy per `authenticated` — scritta solo dal client service-role
  dell'endpoint `app/api/policy-acceptance-log`, mai raggiungibile direttamente dal browser.
- **Destinatari**: Supabase Inc. (responsabile ex art. 28).
- **Termine di conservazione**: 5 anni dalla data della scelta, in linea con gli ordinari termini di
  prescrizione.

---

## Elenco sintetico sub-processor (fornitori terzi)

| Fornitore | Ruolo | Sede | Trasferimento extra-UE | DPA verificato |
|---|---|---|---|---|
| Supabase Inc. | Database, autenticazione, storage | USA (regione dati configurabile) | Sì (salvo regione EU configurata) | Sì — verificato 01/09/2026, v. sotto |
| Vercel Inc. | Hosting applicazione, rate limiting IP | USA | Sì | Sì (piano da confermare) — verificato 01/09/2026, v. sotto |
| Anthropic PBC | Elaborazione AI del testo del CV | USA | Sì (SCC Modulo 2/3, EU 2021/914) | Sì — DPA pubblico incorporato nei Commercial Terms, verificato 21/08/2026 |
| Cloudflare Inc. | Verifica anti-bot (Turnstile) | USA (rete globale) | Sì | Sì (probabile, v. nota) — verificato 01/09/2026, v. sotto |
| Aruba S.p.A. | Ricezione/invio email (casella info@jobli.it) | Italia | No — fornitore italiano | Sì, in via generale — verificato 01/09/2026, nomina formale da confermare, v. sotto |
| Google Ireland Limited | Google Analytics 4 (solo previo consenso) | UE (Irlanda), dati minimizzati | Parziale (infrastruttura Google globale) | Sì, se Jobli è stabilita in UE/SEE/UK/Svizzera — verificato 01/09/2026, v. sotto |

> **Verificato il 1 settembre 2026** — letti i DPA pubblici di ciascun fornitore. Punti rilevanti:
>
> - **Supabase**: DPA pubblico su supabase.com/legal/dpa, si applica automaticamente all'accettazione
>   dei Termini (nessuna firma separata necessaria). Supabase processor, cliente controller. SCC
>   incorporate; su richiesta il cliente può indirizzare l'elaborazione a una regione specifica.
>   Elenco sub-responsabili pubblico, preavviso di 30 giorni per nuovi sub-responsabili, 5 giorni per
>   opporsi. Notifica incidenti di sicurezza entro 48 ore. **Da confermare**: in quale regione dati è
>   effettivamente configurato il progetto Supabase usato da Jobli.
> - **Vercel**: DPA pubblico su vercel.com/legal/dpa, si applica automaticamente all'accettazione dei
>   Termini. Vercel processor per i "Customer Data" sui piani **Pro ed Enterprise** — il testo del DPA
>   non specifica esplicitamente se e come si applica al piano Hobby/gratuito. SCC Modulo Due
>   incorporate. Elenco sub-responsabili pubblico su security.vercel.com, preavviso 30 giorni,
>   5 giorni per opporsi. Notifica incidenti "senza ingiustificato ritardo" (nessun termine fisso in
>   ore dichiarato pubblicamente). **Da confermare**: su quale piano Vercel gira il progetto Jobli —
>   se Hobby, verificare con il supporto Vercel se il DPA si applica comunque.
> - **Cloudflare**: DPA pubblico su cloudflare.com/cloudflare-customer-dpa/, cliente controller e
>   Cloudflare processor. SCC Modulo Due/Tre incorporate. Elenco sub-responsabili pubblico, preavviso
>   30 giorni, 10 giorni per opporsi. Notifica incidenti "senza ingiustificato ritardo". Il testo non
>   distingue esplicitamente Turnstile (prodotto gratuito) dagli altri servizi Cloudflare a pagamento
>   — ragionevole ritenere che il DPA generale si applichi comunque tramite l'accordo standard che si
>   accetta creando un account Cloudflare, ma non è stato trovato un riferimento esplicito a Turnstile.
> - **Google — Google Analytics 4**: le "Data Processing Terms" di Google per i servizi pubblicitari/
>   di misurazione **si applicano automaticamente, senza bisogno di accettazione manuale**, alle
>   aziende stabilite nell'UE/SEE, nel Regno Unito o in Svizzera — condizione soddisfatta da Jobli in
>   quanto attività con sede in Italia. Le aziende stabilite altrove devono invece accettarle
>   manualmente dalle impostazioni dell'account. Nessuna azione necessaria per Jobli su questo punto.
> - **Aruba (invio/ricezione email)**: sostituisce Google LLC/Gmail dal 1 settembre 2026 — la casella
>   info@jobli.it, ospitata da Aruba S.p.A. (Ponte San Pietro, BG, Italia), è ora l'unico indirizzo
>   usato sia per la corrispondenza in arrivo (moduli contatti, richieste dominio/crediti) sia per le
>   comunicazioni di servizio in uscita verso gli utenti. Aruba tratta i dati dei clienti in qualità di
>   responsabile del trattamento ex art. 28 GDPR, con nomina prevista dal contratto di fornitura del
>   servizio. Essendo un fornitore con sede in Italia, questo trattamento **non comporta alcun
>   trasferimento extra-UE** — un miglioramento reale rispetto alla situazione precedente con Gmail
>   (USA). **Da confermare**: che la nomina formale di Aruba a responsabile del trattamento sia stata
>   effettivamente accettata in fase di attivazione della casella (normalmente inclusa nelle condizioni
>   generali di fornitura, ma vale la pena verificarlo nel pannello di gestione del servizio Aruba).

**Prossimo passo consigliato**: confermare il piano Vercel in uso e la nomina formale di Aruba a
responsabile del trattamento (le due uniche caselle rimaste aperte sopra); archiviare una copia o un
link permanente di ciascun DPA citato.
