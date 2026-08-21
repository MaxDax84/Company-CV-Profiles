# Procedura Interna di Gestione dei Data Breach (art. 33-34 GDPR)

**BOZZA DI LAVORO — non è un documento legale definitivo.** Va rivisto e validato da un
consulente privacy/legale. Pensata per un titolare singolo (Massimo Dassano), senza un team
dedicato: il flusso è deliberatamente semplice, non calibrato su un'organizzazione con più persone.

Ultimo aggiornamento: 21 agosto 2026.

---

## Cos'è una violazione di dati personali (data breach)

Qualsiasi violazione di sicurezza che comporti, anche solo accidentalmente:
- **distruzione** di dati personali (es. cancellazione accidentale di un database senza backup funzionante);
- **perdita** di dati (es. accesso non più possibile a dati che non sono stati distrutti);
- **modifica non autorizzata** di dati;
- **divulgazione non autorizzata** (es. accesso di terzi non autorizzati a dati di utenti);
- **accesso non autorizzato** ai dati.

Esempi concreti rilevanti per Jobli: accesso non autorizzato al database Supabase, esposizione
accidentale di credenziali con accesso privilegiato (service-role key), un bug che permette a un
utente di vedere i dati di un altro utente (bypass delle policy RLS), un fornitore terzo (Anthropic,
Vercel, Supabase, Cloudflare) che comunica una violazione dal proprio lato.

---

## Passo 1 — Rilevazione e contenimento immediato (ore 0)

1. Appena si sospetta o si conferma un incidente, **annotare data e ora esatta** della scoperta.
2. Contenere l'incidente il prima possibile:
   - revocare/ruotare immediatamente le credenziali compromesse (chiavi API, service-role key, password);
   - disabilitare temporaneamente la funzionalità coinvolta se necessario (es. tramite feature flag o rollback del deploy);
   - se il problema è lato fornitore (Supabase/Vercel/Anthropic/Cloudflare), contattare il supporto del fornitore e richiedere dettagli scritti sull'incidente.
3. Non cancellare log o evidenze tecniche: servono per la valutazione e per l'eventuale notifica.

## Passo 2 — Valutazione del rischio (entro 24-48 ore dalla scoperta)

Rispondere per iscritto a queste domande (usare il template in fondo):

- Quali categorie di dati sono coinvolte? (es. email, CV, contenuti professionali, mai categorie particolari salvo inserimento volontario dell'utente)
- Quanti utenti sono coinvolti, anche solo potenzialmente?
- I dati erano cifrati/pseudonimizzati? Questo riduce il rischio concreto per gli interessati?
- Qual è la probabilità di un danno concreto per gli interessati (furto d'identità, discriminazione, danno reputazionale, esposizione di dati di contatto reali)?
- L'incidente è già contenuto, o è ancora in corso?

**Se il rischio per i diritti e le libertà delle persone fisiche NON è improbabile → si procede al Passo 3 (notifica al Garante).**
**Se il rischio è manifestamente improbabile (es. dati già pubblici, incidente interno senza reale esposizione a terzi) → documentare comunque la valutazione e la motivazione della non-notifica, per accountability.**

## Passo 3 — Notifica al Garante per la Protezione dei Dati Personali (entro 72 ore)

Termine: **72 ore dal momento in cui il Titolare è venuto a conoscenza della violazione** (art. 33 GDPR).

Canale: form online sul sito del Garante (garanteprivacy.it) o PEC.

La notifica deve contenere (anche se alcune informazioni non sono ancora complete — si può notificare
"a fasi", integrando appena disponibili):
- natura della violazione;
- categorie e numero approssimativo di interessati coinvolti;
- categorie e numero approssimativo di record coinvolti;
- nome e contatti del punto di riferimento (per Jobli: `[DA COMPLETARE]`);
- probabili conseguenze della violazione;
- misure adottate o proposte per porvi rimedio e attenuarne i possibili effetti negativi.

Se non è possibile notificare entro 72 ore, la notifica tardiva deve essere accompagnata dai motivi del ritardo.

## Passo 4 — Comunicazione agli interessati (se il rischio è elevato)

Necessaria (art. 34 GDPR) solo se la violazione presenta **un rischio elevato** per i diritti e le
libertà delle persone fisiche (non ogni violazione lo richiede).

Se necessaria, la comunicazione deve:
- essere scritta in linguaggio chiaro e semplice, non legalese;
- descrivere la natura della violazione;
- fornire il contatto del punto di riferimento;
- descrivere le probabili conseguenze;
- descrivere le misure adottate o proposte.

Canale suggerito per Jobli: email diretta agli utenti coinvolti (identificabili tramite il database), eventualmente affiancata da un avviso pubblico sul sito se il numero di utenti coinvolti è ampio o se non è possibile identificarli singolarmente.

**Eccezione**: non serve comunicare agli interessati se i dati erano già protetti da misure tecniche (es. cifratura) che li rendono incomprensibili a chi non è autorizzato ad accedervi, o se sono state successivamente adottate misure che escludono il concretizzarsi del rischio elevato.

## Passo 5 — Documentazione interna (sempre, indipendentemente dalla notifica)

Il GDPR richiede di documentare **ogni** violazione, anche quella non notificata al Garante
(principio di accountability, art. 33(5) GDPR). Usare il template sotto per ogni incidente,
notificato o meno.

---

## Template di registrazione incidente

```
INCIDENTE #___

Data/ora scoperta: 
Data/ora presunto inizio dell'incidente: 
Come è stato scoperto: 
Descrizione tecnica dell'incidente: 
Categorie di dati coinvolte: 
Numero approssimativo di interessati coinvolti: 
Causa (bug, configurazione errata, incidente lato fornitore, attacco esterno, errore umano): 
Misure di contenimento adottate e quando: 
Valutazione del rischio per gli interessati (bassa/media/alta) e motivazione: 
Notifica al Garante necessaria? Sì/No — motivazione: 
Se sì, data invio notifica: 
Comunicazione agli interessati necessaria? Sì/No — motivazione: 
Se sì, data e modalità di comunicazione: 
Misure correttive definitive adottate per prevenire il ripetersi: 
Responsabile della gestione dell'incidente: 
```

---

## Contatti utili

- Garante per la Protezione dei Dati Personali: https://www.garanteprivacy.it — sezione "Notifica violazione dati personali"
- Supporto Supabase: `[link supporto/dashboard]`
- Supporto Vercel: `[link supporto/dashboard]`
- Supporto Anthropic: `[link supporto/console]`
- Supporto Cloudflare: `[link supporto/dashboard]`
