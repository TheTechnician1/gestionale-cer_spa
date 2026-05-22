# Gestionale CER

Gestionale per le Comunità Energetiche Rinnovabili (CER), scritto in Angular (CLI 15.1.6).
Progetto didattico: si gestiscono impianti, dati energetici e una dashboard di riepilogo.

> **Nota importante (leggere prima di tutto).**
> Il backend non è collegato. Per ora l'app gira con dati **mock** e finte chiamate HTTP:
> i service restituiscono `Observable` (come farebbe il vero `HttpClient`) ma i dati arrivano
> da un array in memoria, e dove serve vengono salvati nel **localStorage** del browser.
> Quando ci sarà il backend, basterà scommentare le righe `this.api...` nei service e togliere
> la parte mock — i componenti non cambiano, perché parlano già la lingua degli Observable.

## Avvio rapido

```bash
npm install
ng serve
```

App su `http://localhost:4200/`. Si ricarica da sola quando salvi un file.

Altri comandi utili:

- `ng build` → build di produzione in `dist/`
- `npm run lint` → controllo lint
- formattazione:
  ```bash
  npx prettier --config prettier.config.json --write "{*,src/**/*}.{ts,html,js,scss,css,json,md,yaml,yml}"
  ```

## Come sono organizzate le cartelle

- **`src/app/core`** — roba "di sistema": service singleton, guard, interceptor, configurazione, modelli, layout (header/sidebar/footer), login.
- **`src/app/shared`** — `SharedModule` con tutti i moduli Material e i componenti riutilizzabili (dialog di conferma, errori di form, toast).
- **`src/app/components`** — le pagine vere e proprie (dashboard, impianti, dati energetici, storico) e i loro service.
- **`src/assets/i18n`** — traduzioni `@ngx-translate` (italiano e inglese).

### Punti che vale la pena conoscere

- **`core/services/api.service.ts`** — wrapper sull'`HttpClient` (`get`, `postLogin`, `post`, `put`, ...). È quello che useranno i service quando tornerà il backend.
- **`core/services/storage.service.ts`** — wrapper su localStorage/sessionStorage (`setLocal`, `getLocal`, ...). Lo usiamo per far sopravvivere i dati mock al refresh.
- **`core/services/utente.service.ts`** — login e stato utente (BehaviorSubject).
- **`core/guard/auth.guard.ts`** — protegge le rotte in base al ruolo.
- **`core/interceptor/`** — uno inietta il token JWT, l'altro gestisce gli errori HTTP con i toast.

## Funzionalità

1. **Login e ruoli** — login JWT, token in localStorage, rotte protette dall'`AuthGuard`.
2. **Impianti** — lista, ricerca, inserimento, modifica, dettaglio, eliminazione.
3. **Dati Energetici** — lista con filtri a comparsa, inserimento, modifica, dettaglio (sola lettura), eliminazione.
4. **Dashboard** — riepilogo dati CER con tabella ordinabile e paginata.
5. **Storico** — ricerca dati storici.
6. **Internazionalizzazione** — italiano e inglese, cambio lingua al volo.
7. **Utenti** — registrazione (solo ADMIN) e profilo.

## Ruoli e permessi

Tre ruoli, definiti in `core/enum/role.enum.ts`:

- **ADMIN** — accesso completo (incluso registrazione utenti).
- **GEST** — gestisce impianti e dati energetici, vede la dashboard.
- **GUEST** — sola lettura (dashboard e dati energetici).

I permessi si applicano a tre livelli: rotta (`AuthGuard`), componente (controlli sul ruolo) e visibilità delle voci nella sidebar.

## Come funzionano i dati (stato attuale mock)

Lo schema è lo stesso per Impianti e Dati Energetici:

- il **service** tiene i dati in un array, li carica dal localStorage all'avvio e li risalva ad ogni
  inserimento/modifica/eliminazione (`StorageService`);
- ogni metodo restituisce un `Observable` simulando la rete con `of(...).pipe(delay(...))`;
- il **componente** consuma il service con `subscribe({ next, error })`.

Per azzerare i dati e tornare a quelli iniziali, da console del browser (F12):

```js
localStorage.removeItem("impianti");
localStorage.removeItem("datiEnergetici");
```

poi ricarica la pagina.

### Modelli usati (versione semplice del mock)

```typescript
// Impianto (impianto.service.ts)
interface Impianto {
  id: number;
  tipologia: string;
  potenzaNominale: number;
  regione: string;
  comune: string;
  indirizzo: string;
  cap: string;
  partitaIva: string;
  flgAccumulo: boolean;
}

// DatiEnergetici (dati-energetici.service.ts)
interface DatiEnergetici {
  idDati: number;
  idCer: number;
  anno: string;
  eProdotta: number; // energia prodotta
  ePrelevata: number; // energia prelevata
  eImmessa: number; // energia immessa
  eCondivisa: number; // energia condivisa
  eAutoCons: number; // energia autoconsumata
  tariffaPremium: number;
  calcoloCo2Automatico: number;
}
```

> C'è anche un modello "completo" `Impianto` in `core/interfaces/impianto.model.ts` (con ubicazione,
> categorie, ecc.) pensato per il backend reale. Per ora i componenti usano la versione semplice qui sopra;
> quando arriverà il backend si valuterà se passare a quello completo.

## Cosa fanno service e componenti, in dettaglio

Le due aree (Dati Energetici e Impianti) seguono lo stesso identico schema: un service che fa
da "finto backend" e dei componenti che lo consumano. Le spiego una per una.

### Dati Energetici

**Service — `dati-energetici.service.ts`**
È il finto backend. Tiene i dati in un array, li carica dal localStorage all'avvio (costruttore) e
li risalva dopo ogni modifica (`persisti()`). I metodi:

- `ricerca(payload)` — restituisce la lista. Se nel payload arrivano `anno` o `idCer` filtra l'array,
  altrimenti torna tutto. È la POST `datiEnergetici/ricerca`.
- `getDatoById(id)` — cerca un singolo dato per id (per modifica e dettaglio).
- `inserisci(dato)` — calcola un id nuovo (max esistente + 1), aggiunge il dato e salva.
- `modifica(id, dato)` — trova il dato per id, lo sovrascrive e salva.
- `elimina(id)` — toglie il dato dalla lista e salva.

Ogni metodo restituisce un `Observable` (`of(...).pipe(delay(...))`) per imitare la rete.

**Componente lista — `dati-energetici-ricerca`**
All'apertura (`ngOnInit`) chiama `cercaDatiEnergetici()`, che legge i filtri dal form reattivo e li
passa a `ricerca()`. I filtri sono **a comparsa** (bottone "Filtri" → `toggleFiltri()`), l'anno è una
tendina. Da qui parte anche l'inserimento (`inserisciNuovo()`), e ogni card ha Dettaglio, Modifica
ed Elimina (`eliminaDato()` cancella e rilancia la ricerca per aggiornare la lista).

**Componente form — `dati-energetici-form`**
Lo stesso componente serve per inserimento, modifica e dettaglio (lo capisce dall'URL: se c'è l'id è
modifica/dettaglio, se contiene `dettaglio-dati` è sola lettura → `datiForm.disable()`). In modifica
carica il dato con `getDatoById` e riempie il form con `patchValue`. Al salvataggio chiama `inserisci`
o `modifica` e torna alla lista. Qui c'è la **mappatura nomi** form↔service (`energiaProdotta` ↔ `eProdotta`).

### Impianti

**Service — `impianto.service.ts`**
Identico nello spirito a quello dei dati energetici, sugli impianti:

- `ricerca(payload)` — restituisce la lista impianti.
- `getById(id)` — un singolo impianto per id.
- `inserisci(impianto)` — id nuovo (max + 1), aggiunge e salva.
- `modifica(id, impianto)` — sovrascrive l'impianto e salva.
- `elimina(id)` — rimuove e salva.

Anche qui dati in localStorage e finte chiamate con `Observable`. Vantaggio rispetto ai dati
energetici: i nomi dei campi del form combaciano col modello, quindi **niente mappatura**.

**Componente lista — `impianti-ricerca`**
In `ngOnInit` chiama `cercaImpianti()` che pesca tutto dal service. Ogni card ha Dettaglio
(`dettaglioImpianto`), Modifica (`modificaImpianto`) ed Elimina (`eliminaImpianto`, che cancella e
ricarica la lista). In alto il bottone "Inserisci nuovo" (`inserisciNuovo`).

**Componente form — `impianti-form`**
Gestisce inserimento e modifica. Costruisce il form reattivo con le sue validazioni
(`tipologia` e `regione` obbligatorie, `cap` 5 cifre, `partita IVA` 11 cifre). In modifica carica
l'impianto con `getById` e lo mette nel form con `patchValue` (i nomi combaciano). Al salvataggio
(`salvaBozza`) chiama `inserisci` o `modifica` e torna alla lista.

**Componente dettaglio — `impianto-dettaglio`**
A differenza dei dati energetici, qui il dettaglio è un componente **separato** (sola visualizzazione).
Legge l'id dall'URL, carica l'impianto con `getById` e lo mostra. Ha i bottoni "Vai a modifica" e
"Torna alla lista".

## Moduli lazy-loaded

- `ImpiantoModule` → rotta `/impianto`
- `DatiEnergeticiModule` → rotta `/dati-energetici`

Entrambi importano lo `SharedModule`.

## Quando tornerà il backend

- URL previsto: `http://localhost:8081`
- Nei service, ogni metodo ha già la riga del backend pronta e **commentata** (es. `// return this.api.postLogin(...)`).
- Si scommenta quella riga, si elimina la parte mock + localStorage, e basta. I componenti restano invariati.

### Contratti JSON attesi dal backend — Dati Energetici

Inserimento / modifica:

```json
{
  "idDati": 0,
  "idCer": 0,
  "idConfig": 0,
  "anno": "string",
  "energiaProdotta": 0,
  "energiaPrelevata": 0,
  "energiaImmessa": 0,
  "energiaCondivisa": 0,
  "energiaAutoCons": 0,
  "tariffaPremium": 0.1,
  "corrPremioOtt": 0.1,
  "ridEmCo2": "string",
  "flgCancellazione": "string",
  "emailUtenteLoggato": "string"
}
```

Ricerca:

```json
{
  "idDati": 0,
  "anno": "string",
  "idCer": 0,
  "partitaIva": "string",
  "idConfig": 0,
  "codiceCabina": "string",
  "statoScheda": "string",
  "inizioAnno": "string",
  "fineAnno": "string"
}
```

Eliminazione logica: `idDati` + `emailUtenteLoggato`.
