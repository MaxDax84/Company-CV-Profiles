# Registro delle Attività di Trattamento (art. 30 GDPR)

**BOZZA DI LAVORO — non è un documento legale definitivo.** Va rivisto e validato da un consulente
privacy/legale prima di essere considerato il registro ufficiale del Titolare, in particolare per
le parti segnate `[DA COMPLETARE]`.

Ultimo aggiornamento: 21 agosto 2026.

---

## Titolare del trattamento

- Nome/denominazione: Jobli Srl (in costituzione)
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
- **Termine di conservazione**: fino a cancellazione dell'account da parte dell'utente (self-service, immediata).
- **Misure di sicurezza**: HTTPS, cifratura a riposo, Row Level Security, credenziali privilegiate solo server-side.

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
- **Destinatari**: Google LLC (Gmail, ricezione email).
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

---

## Elenco sintetico sub-processor (fornitori terzi)

| Fornitore | Ruolo | Sede | Trasferimento extra-UE | DPA verificato |
|---|---|---|---|---|
| Supabase Inc. | Database, autenticazione, storage | USA (regione dati configurabile) | Sì (salvo regione EU configurata) | `[DA VERIFICARE]` |
| Vercel Inc. | Hosting applicazione | USA | Sì | `[DA VERIFICARE]` |
| Anthropic PBC | Elaborazione AI del testo del CV | USA | Sì (SCC Modulo 2/3, EU 2021/914) | Sì — DPA pubblico incorporato nei Commercial Terms, verificato 21/08/2026 |
| Cloudflare Inc. | Verifica anti-bot (Turnstile) | USA (rete globale) | Sì | `[DA VERIFICARE]` |
| Google LLC | Ricezione email modulo contatto (Gmail) | USA | Sì | Google offre DPA standard per Workspace/Gmail — verificare se applicabile all'account usato |
| Google Ireland Limited | Google Analytics 4 (solo previo consenso) | UE (Irlanda), dati minimizzati | Parziale (infrastruttura Google globale) | Google fornisce DPA standard per GA4 |

**Prossimo passo consigliato**: richiedere/verificare formalmente il DPA (Data Processing Agreement) di ciascun fornitore sopra elencato dove non già confermato, e archiviarne una copia.
