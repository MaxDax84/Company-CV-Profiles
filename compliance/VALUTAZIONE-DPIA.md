# Valutazione sulla necessità di una DPIA (art. 35 GDPR)

**BOZZA DI LAVORO — non è un documento legale definitivo.** Va rivisto e validato da un consulente
privacy/legale prima di essere considerato la posizione ufficiale del Titolare. Segue la metodologia
dei 9 criteri del Gruppo di Lavoro Articolo 29 (parere WP248 rev.01), lo stesso standard richiamato
dalle Linee Guida del Garante italiano.

Ultimo aggiornamento: 1 settembre 2026.

---

## Trattamento valutato

Il punteggio automatizzato assegnato a un CV caricato dall'utente (criteri: risultati quantificati,
chiarezza, struttura ATS, competenze specifiche), calcolato in parte tramite regole deterministiche e
in parte tramite un modello di intelligenza artificiale (Anthropic Claude), e i suggerimenti di ruolo
correlati. È il trattamento di Jobli più vicino alle categorie che tipicamente richiedono una DPIA,
motivo per cui viene valutato specificamente qui piuttosto che nel Registro dei Trattamenti generale.

## I 9 criteri WP248 rev.01

| # | Criterio | Soddisfatto? | Motivazione |
|---|---|---|---|
| 1 | Valutazione o attribuzione di punteggio (incluso profiling) | **Sì** | È letteralmente un punteggio su aspetti professionali della persona. |
| 2 | Processo decisionale automatizzato con effetto giuridico o significativamente analogo | No | Il punteggio è informazione che l'utente legge e usa su se stesso; nessuna decisione viene presa nei suoi confronti da un soggetto terzo (es. un datore di lavoro) sulla base del punteggio. Vedi anche l'analisi già presente nei Termini di Servizio (§3) sull'art. 22 GDPR. |
| 3 | Monitoraggio sistematico | No | Elaborazione puntuale, innescata da un'azione volontaria dell'utente (caricare un CV), non osservazione continuativa di comportamento o localizzazione. |
| 4 | Dati sensibili o di natura altamente personale | No, per progettazione | Le categorie particolari (art. 9) non sono richieste né utilizzate per il punteggio; se presenti incidentalmente nel CV, sono ignorate ai fini del calcolo (v. Privacy Policy §2). |
| 5 | Trattamento su larga scala | **No, allo stato attuale** | Base utenti attualmente ridotta (fase beta). Criterio da rivalutare periodicamente man mano che il numero di utenti cresce — non è una conclusione permanente. |
| 6 | Combinazione o raffronto di insiemi di dati (dataset matching) | No | Nessun incrocio tra dataset di utenti diversi; l'elaborazione riguarda solo i dati che un singolo utente carica per se stesso. |
| 7 | Dati relativi a interessati vulnerabili | **Parzialmente sì** | Il servizio è accessibile anche a minori di età compresa tra 14 e 17 anni (v. Termini di Servizio, età minima 14 anni) — categoria che il WP248 considera potenzialmente vulnerabile nel contesto di un trattamento automatizzato. |
| 8 | Uso innovativo o applicazione di nuove soluzioni tecnologiche | **Sì** | Utilizzo di un modello di intelligenza artificiale generativa per l'elaborazione, categoria che il WP248 considera tipicamente innovativa. |
| 9 | Il trattamento impedisce di per sé l'esercizio di un diritto o l'accesso a un servizio/contratto | No | Nessun effetto di sbarramento: l'utente può sempre scaricare, modificare o eliminare il proprio CV indipendentemente dal punteggio ottenuto; il punteggio non è un requisito d'accesso imposto da terzi. |

**Criteri soddisfatti: 2 pieni (1, 8) + 1 parziale (7).**

## Applicazione della soglia

Le Linee Guida WP248 indicano che, in via generale, il soddisfacimento di **due o più criteri**
suggerisce l'opportunità di una DPIA. Questa soglia è un **indicatore, non un automatismo**: il
Gruppo di Lavoro Articolo 29 ammette esplicitamente che il titolare possa concludere diversamente,
purché motivi per iscritto la propria valutazione del rischio residuo — che è esattamente lo scopo di
questo documento.

### Fattori che riducono il rischio concreto

- Il criterio 2 (l'unico che tipicamente pesa di più nella pratica) **non è soddisfatto**: non esiste
  alcun effetto decisionale di terzi sull'interessato basato sul punteggio.
- Il criterio 4 non è soddisfatto per progettazione, non per assenza occasionale.
- Il criterio 5 non è soddisfatto oggi, ma è l'unico dei nove per cui una crescita futura del
  servizio potrebbe cambiare la risposta.
- Il criterio 9 non è soddisfatto: non c'è alcuna funzione di gatekeeping.

### Fattori che mantengono un margine di attenzione

- Il criterio 7 (minori 14-17) meriterebbe, indipendentemente dalla DPIA, un'attenzione specifica nel
  design del prodotto (linguaggio del punteggio non giudicante, nessuna pressione a fornire più dati
  di quelli necessari).
- Il criterio 8 (uso di AI) è per natura destinato a restare soddisfatto: non è un fattore che si
  "risolve", va tenuto sotto osservazione insieme all'evoluzione della guidance interpretativa
  sull'AI Act già monitorata nel Registro dei Trattamenti.

## Conclusione

**Una DPIA formale e completa non risulta necessaria allo stato attuale**, per la combinazione di:
assenza di un effetto decisionale automatizzato su terzi (criterio più pesante non soddisfatto),
assenza di dati sensibili per progettazione, scala attualmente ridotta, e assenza di qualunque
effetto di sbarramento all'esercizio di diritti. La posizione è coerente con l'analisi già presente
nei Termini di Servizio sull'art. 22 GDPR e con la valutazione già effettuata sull'AI Act (non
applicabile per lo stesso motivo — assenza di uso da parte di un "deployer" terzo).

**Questa conclusione non è definitiva.** Va rivalutata se si verifica anche uno solo di questi eventi:

- il numero di utenti cresce in modo da rendere plausibile la soglia di "larga scala" (criterio 5);
- il punteggio o i suoi risultati vengono resi visibili o accessibili a un soggetto terzo (es. un
  recruiter, un datore di lavoro) in qualunque forma, anche solo facoltativa;
- viene introdotta una funzionalità che usa il punteggio per prendere o influenzare una decisione
  sull'utente (es. filtrare l'accesso a una funzionalità in base al punteggio stesso).

## Riferimenti

- Gruppo di Lavoro Articolo 29, parere WP248 rev.01 ("Linee guida sulla valutazione d'impatto sulla
  protezione dei dati")
- Elenco del Garante per la Protezione dei Dati Personali dei trattamenti soggetti a DPIA
- `app/terms/page.tsx` §3 — analisi già pubblicata su AI Act e art. 22 GDPR, coerente con questa valutazione
