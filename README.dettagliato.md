# Gestionale CER

Frontend Angular (CLI 15.1.6) per la gestione di Comunità Energetiche Rinnovabili: utenti, impianti, dati energetici annuali e una dashboard di riepilogo.

L'app parla con un backend REST. Default `http://localhost:8081` (vedi `src/app/core/config/app-settings.ts`).

## Avvio rapido

```bash
npm install
ng serve
```

App su `http://localhost:4200/`. Si ricarica da sola al salvataggio.

Altri comandi utili:

- `ng build` → build di produzione in `dist/`
- `npm run lint`
- formattazione:
  ```bash
  npx prettier --config prettier.config.json --write "{*,src/**/*}.{ts,html,js,scss,css,json,md,yaml,yml}"
  ```

## Struttura cartelle

- `src/app/core` — service singleton, guard, interceptor, config, modelli, layout (header/sidebar/footer), login.
- `src/app/shared` — `SharedModule` con i moduli Material e componenti riutilizzabili (dialog di conferma, errori di form, toast).
- `src/app/components` — pagine vere e proprie (dashboard, impianti, dati energetici) e i loro service.
- `src/assets/i18n` — traduzioni `@ngx-translate` (italiano, inglese).

## Ruoli

Tre ruoli, riconosciuti tramite `PermessiService.normalizza`:

- **ADM** — può fare tutto: crea, modifica, elimina, cambia stato.
- **GEST** — crea e modifica impianti e dati energetici. Non elimina e non cambia stato. Sola lettura su CER e configurazioni.
- **GUEST** — sola lettura ovunque. Vede solo "Dettaglio".

I permessi si applicano a tre livelli:

- **rotte** (`canActivate: AuthGuard` + `data.role`)
- **componenti** — pulsanti nascosti con `*ngIf="permessi.puoXXX()"`. Se il ruolo non può fare l'azione, il bottone proprio non viene renderizzato.
- **sidebar** — voci filtrate per ruolo.

Dopo il login (sia normale che ospite) si finisce sempre su `/dashboard`. Il default path `""` rimanda anch'esso a `dashboard` e la rotta è aperta a tutti e tre i ruoli.

## Endpoint usati dal frontend

### Autenticazione (`/api/auth`)

- `POST /api/auth/login` — body `{ utenteEmail, password }` → `UtenteEntity`.
- `GET /api/auth/me?id=` → utente corrente.
- `POST /api/auth/logout?email=` → stringa di conferma.

### Utenti (`/utente`)

- `POST /utente/inserisci` — `UtenteRequestDto`, solo ADM.

### CER (`/cer`)

- `POST /cer/ricerca` — body con filtri opzionali → lista `VistaCerRicercaDTO` (usato per popolare la tendina CER nel form Dati Energetici).
- Endpoint CRUD pieni esistono lato backend ma non ancora gestiti a UI.

### Impianti (`/api/impianti`)

- `GET /api/impianti/` — query string per i filtri → lista.
- `GET /api/impianti/{id}` → `ImpiantoResponseDTO` (anagrafici come stringhe).
- `POST /api/impianti/create` — `ImpiantoRequestDTO` (regione/comune come oggetti `CodiceDescrizioneBase`, provincia/indirizzo/civico/cap come stringhe).
- `PUT /api/impianti/edit/{id}` — stesso body.
- `DELETE /api/impianti/delete/{id}?email=`
- `PATCH /api/impianti/{id}/stato?stato=&email=`

### Dati Energetici (`/api/dati-energetici`)

- `GET /api/dati-energetici/` — filtri come query string → lista.
- `GET /api/dati-energetici/{id}` → array di `DatiVisualizza` (il service estrae il primo).
- `POST /api/dati-energetici/create`, `PUT .../edit/{id}` — `DatiRequestDTO`.
- `DELETE /api/dati-energetici/delete/{id}?email=`
- `GET /api/dati-energetici/check?idConfigurazione=&anno=` — verifica duplicati prima dell'inserimento.
- `GET /api/dati-energetici/configurazioni/{id}` — serie storica per configurazione.

### Dashboard (`/api/dashboard`)

Tutte GET, senza body:

- `/summary?anno=&anno2=`
- `/impianti-per-stato`, `/impianti-per-tipologia`
- `/andamento-energetico`
- `/top-cer`
- `/alert`

### Codici (`/codici`)

- `GET /codici/{tabella}?parameter=` → lista di `CodiceDescrizioneBase`.
- Tabelle usate: `REGIONI`, `PROVINCE` (filtrate per codice regione), `COMUNI` (filtrate per codice provincia), `FORME_GIURIDICHE`, ecc.

## Convenzioni del backend

- Le date sono ISO `YYYY-MM-DD`.
- I flag binari sono `S`/`N` (es. `attivo`, `presenzaAccumulo`, `flagEsercizio`).
- Gli stati impianto sono `ATTIVO`, `IN_MANUTENZIONE`, `SOSPESO`, `DISMESSO`.
- Gli errori 4xx/5xx hanno spesso un body **testo** (non JSON): l'interceptor lo gestisce.
- `emailUtenteLoggato` è il pattern per tracciare l'autore dell'operazione: viene aggiunto in automatico ai body POST/PUT dall'`ApiService`.

## Funzionalità implementate

- **Login** con ruoli. Sia il login con credenziali che il pulsante "Accedi come ospite" rimandano a `/dashboard`. Route protette via `AuthGuard`.
- **Impianti** — lista (card / tabella con paginatore e sort), filtri server-side con reset, inserimento, modifica, dettaglio, eliminazione con conferma, cambio stato. Inserisci/Modifica/Cambia stato/Elimina sono mostrati o nascosti in base al ruolo.
- **Dati Energetici** — lista (card / tabella con paginatore e sort), filtri server-side con reset, inserimento con check duplicato, modifica, dettaglio in sola lettura, eliminazione con conferma. Stessa logica di gating per ruolo sui pulsanti d'azione.
- **Dashboard** — prima schermata dopo il login per ogni ruolo. KPI con click che porta alla lista filtrata, grafici Apex (andamento annuale, distribuzione per stato e per tipologia), Top CER, alert.
- **Tendine anagrafiche** — Regione → Provincia → Comune in cascata via `/codici`.
- **Toast** — messaggi di successo/errore mappati per codice HTTP con suggerimento "cosa fare".
- **Conferme** — dialog Material per eliminazione e reset form.
- **Sidebar** — voci filtrate in base al ruolo, aperture stabili.

## Moduli lazy-loaded

- `ImpiantoModule` → rotta `/impianto`
- `DatiEnergeticiModule` → rotta `/dati-energetici`

Entrambi importano lo `SharedModule`.

---

# Spiegazione del codice

Tutto quello che segue serve a capire cosa fa ogni pezzo senza dover leggere i sorgenti uno per uno.

## Service di `core/services`

### `ApiService` — `core/services/api.service.ts`

Wrapper su `HttpClient`. Tutti i service dell'app passano da qui invece di iniettare direttamente `HttpClient`. Mantiene la base URL in un unico posto e applica due piccole convenzioni del backend (`emailUtenteLoggato` automatico nei body POST/PUT e responseType `text` per gli endpoint che ritornano una stringa).

- `get<T>(path, params?, options?)` → GET JSON.
- `getText(path, params?, options?)` → GET con risposta in testo.
- `postLogin<T>(path, body, options?)` → POST JSON, **non** aggiunge l'email loggato (usato per il login).
- `post<T>(path, body, options?)` → POST JSON, aggiunge `body.emailUtenteLoggato`.
- `postText(path, body, options?)` → POST con risposta testo, aggiunge l'email loggato.
- `put<T>(path, body, options?)`, `putText(path, body, options?)` → analoghi a `post`/`postText` ma PUT.
- `putDelete<T>(path, body, options?)` → PUT che aggiunge `body.codiceFiscale` (pattern legacy del backend).
- `delete<T>(path, params?, options?)`, `deleteText(path, params?, options?)` → DELETE.
- `patchText(path, params?, options?)` → PATCH testuale (usato dal cambio stato impianto).

Internamente costruisce l'URL con `buildUrl`, gli `HttpParams` con `buildParams` e propaga il `SKIP_HTTP_SNACKBAR` (per disabilitare il toast su singole chiamate).

### `UtenteService` — `core/services/utente.service.ts`

Gestisce login, utente corrente e logout. Tiene lo stato in un `BehaviorSubject` e lo persiste nel `localStorage` (chiave `utente`).

- `login(payload)` → `POST /api/auth/login` rimappando i campi (`utente_email` → `utenteEmail`), persiste l'utente e restituisce `UtenteLoginModel`.
- `me(id)` → `GET /api/auth/me?id=`.
- `logout()` → chiama `POST /api/auth/logout?email=` (in fire-and-forget) e poi ripulisce `localStorage`.
- `createUtente(payload)` → `POST /utente/inserisci` (solo ADM).
- `getRole()` → ruolo dell'utente corrente (`null` se non loggato).
- `currentUser` (getter) e `user$` / `isLoggedIn$` (observable) → stato reattivo per i componenti.

### `PermessiService` — `core/services/permessi.service.ts`

Centralizza i controlli di permesso e normalizza il ruolo. Esiste perché il ruolo arriva con nomi diversi (`ADM`/`ADMIN`/`admin`, `GEST`/`GESTORE`, `GUEST`/`guest`) e non vogliamo `if` sparsi nei componenti.

- `normalizza(r)` → restituisce `'ADM' | 'GEST' | 'GUEST' | null`.
- `ruolo` (getter) → ruolo normalizzato dell'utente corrente.
- `isAdm()`, `isGest()`, `isGuest()`.
- `puoCreare()`, `puoModificare()` → vero per ADM e GEST.
- `puoEliminare()` → vero solo per ADM.
- `puoCambiareStato()` → vero solo per ADM (PATCH stato impianto).
- `haUnoDei(ruoli)` → usato dall'`AuthGuard` per matchare la lista di ruoli ammessi su una rotta.

### `CodiciService` — `core/services/codici.service.ts`

Wrapper su `GET /codici/{tabella}?parameter=` con cache in memoria (la stessa tabella non viene richiesta due volte).

- `list(tabella, parameter?)` → restituisce un `Observable<CodiceDescrizioneBase[]>`. `parameter` filtra (es. province per codice regione, comuni per codice provincia).
- `invalidate()` → svuota la cache.

### `StorageService` — `core/services/storage.service.ts`

Wrapper banale su `localStorage` e `sessionStorage` con serializzazione JSON.

### `ToastService` — `core/services/toast.service.ts`

Gestisce i toast (Material Snackbar) sia con chiamate dirette (`success`, `error`, `warning`, `info`) sia in automatico tramite l'interceptor HTTP. Quando il backend non restituisce un messaggio specifico, il service usa un fallback "cosa fare adesso" in base al codice HTTP (es. 401 → "Sessione scaduta. Effettua di nuovo il login", 403 → "Operazione non permessa…").

- `show(config)` → primitiva per mostrare un toast.
- `success/error/warning/info(message, title?)` → wrapper comodi.
- `showFromHttpSuccess(req, res)` e `showFromHttpError(req, err)` → chiamati dall'interceptor per costruire il messaggio in base al metodo HTTP e al codice.

## Guard e interceptor

### `AuthGuard` — `core/guard/auth.guard.ts`

Controlla che l'utente sia loggato e abbia uno dei ruoli richiesti dalla rotta (`route.data.role`). Se non loggato manda a `/login`, se loggato ma senza permessi manda a `/not-authorized`.

### `AuthInterceptor` — `core/interceptor/auth/auth.interceptor.ts`

Inietta `Authorization: Bearer <token>` se in `localStorage` c'è la chiave `auth_token` (oppure in `sessionStorage`).

### `HttpStatusInterceptor` — `core/interceptor/http-status/http-status.interceptor.ts`

Intercetta tutte le risposte HTTP. Su successo passa al `ToastService.showFromHttpSuccess`; su errore passa a `showFromHttpError` e, per i codici "critici", reindirizza l'utente (401 → `/login`, 403 → `/not-authorized`). Le singole chiamate possono disabilitare i toast passando l'opzione `skipToast: true`.

## Service di feature

### `ImpiantoService` — `components/services/impianto.service.ts`

- `ricerca(filtro)` → `GET /api/impianti/` con i filtri come query string.
- `getById(id)` → `GET /api/impianti/{id}`.
- `inserisci(payload)` → `POST /api/impianti/create`.
- `modifica(id, payload)` → `PUT /api/impianti/edit/{id}`.
- `elimina(id)` → `DELETE /api/impianti/delete/{id}?email=` (cancellazione logica).
- `cambiaStato(id, stato)` → `PATCH /api/impianti/{id}/stato?stato=&email=`.

### `DatiEnergeticiService` — `components/services/dati-energetici.service.ts`

- `ricerca(filtro)` → `GET /api/dati-energetici/` con filtri.
- `getById(id)` → `GET /api/dati-energetici/{id}` (il backend restituisce un array, il service estrae il primo elemento).
- `inserisci(payload)` → `POST /api/dati-energetici/create`.
- `modifica(id, payload)` → `PUT /api/dati-energetici/edit/{id}`.
- `elimina(id)` → `DELETE /api/dati-energetici/delete/{id}?email=`.
- `checkDuplicato(idConfigurazione, anno)` → `GET /api/dati-energetici/check?…` per verificare se esiste già una scheda; restituisce `{ duplicato, messaggio }`.
- `ricercaCer()` → `POST /cer/ricerca` per popolare la tendina CER nel form.
- `getStorico(idConfigurazione)` → `GET /api/dati-energetici/configurazioni/{id}` (serie storica per anno).

### `DashboardService` — `components/services/dashboard.service.ts`

- `summary(anno?, anno2?)` → `GET /api/dashboard/summary` (KPI principali).
- `impiantiPerStato()`, `impiantiPerTipologia()` → distribuzioni.
- `andamentoEnergetico()` → serie storica energia/incentivi per anno.
- `topCer()` → top CER per energia condivisa/incentivi.
- `alert()` → alert operativi (impianti sospesi, in manutenzione, schede mancanti).

## Componenti principali

### `LoginComponent` — `core/components/login/login/login.component.ts`

Form reattivo con email e password (più checkbox "ricordami"). Sia il submit normale (`onSubmit`) sia il pulsante "Accedi come ospite" (`guestIn`) passano dallo stesso `doLogin(payload)` interno: chiama `UtenteService.login`, persiste l'utente in `localStorage` e naviga su `/dashboard`. Nessuna deviazione in base al ruolo — la dashboard è la landing per ADM, GEST e GUEST. Mostra toast d'errore se i campi non sono validi o se il backend risponde male.

### `RegistrazioneUtenteComponent`

Form reattivo per creare un nuovo utente. Chiama `UtenteService.createUtente`. Accessibile solo ad ADM.

### `UtenteComponent`

Pagina profilo (sola lettura). Mostra i campi dell'utente corrente (`nome`, `cognome`, `codiceFiscale`, `mail`, `numTelefono`, `ruolo`).

### `SidebarComponent`

Albero di navigazione (`MatTree`). Le voci sono filtrate per ruolo (`filterNavItems`). L'albero viene costruito una sola volta per ogni cambio di ruolo (riferimenti nodo stabili → l'espansione resta coerente quando si naviga). I toggle usano `treeControl.toggle(node)` esplicito.

### `DashboardComponent`

All'avvio fa un `forkJoin` di tutte e 6 le GET della dashboard. Costruisce:

- **KPI cards** — array di `KpiCard`, ognuna con label, valore, icona, classe colore e callback `azione`. I click chiamano `vaiImpianti(stato?)`, `vaiDati()` o `vaiCer(id)` che usano `router.navigate(..., { queryParams })`.
- **Grafici Apex** — `andamentoSeries` (bar multi-serie energia per anno), `statoSeries` (donut), `tipologiaSeries` (bar orizzontale).
- **Top CER** — `mat-table`.
- **Alert** — `mat-list` con icona scelta da `iconaAlert(tipo)`.

Metodi utili:

- `totaleStato(stato)` → conta gli impianti per uno stato leggendo da `perStato`.
- `fmtNumero(v)` → formatta i numeri grandi in stile italiano.
- `ngOnInit()` → riusato dal pulsante di refresh in alto a destra.

### `ImpiantiRicercaComponent`

Lista impianti in due modalità (card / tabella). La preferenza è salvata in `localStorage` (`vistaLista`). Inietta `PermessiService` come `public permessi` per usarlo direttamente dal template.

- `cercaImpianti()` → chiama `ImpiantoService.ricerca` con il form dei filtri.
- `filtraImpianti()` → alias di `cercaImpianti` (legato al pulsante "Cerca").
- `resetFiltri()` → svuota il form e ricarica.
- `toggleFiltri()` / `toggleVista()` → mostra/nasconde pannello filtri e cambia vista.
- `inserisciNuovo()`, `dettaglioImpianto(id)`, `modificaImpianto(id)` → navigazione.
- `chiediElimina(id)` → apre il dialog di conferma; al confirm parte `onConfermaElimina(id)` che chiama `ImpiantoService.elimina`.
- `cambiaStato(id, stato)` → chiama il PATCH del backend.

In `ngOnInit` legge i `queryParamMap` e prepopola il form (così i click dei KPI della dashboard arrivano già filtrati) e mostra il pannello filtri.

Visibilità dei pulsanti, sia nelle card che nella tabella:

| Pulsante | Condizione | Chi lo vede |
| --- | --- | --- |
| Inserisci nuovo | `permessi.puoCreare()` | ADM, GEST |
| Dettaglio | sempre | ADM, GEST, GUEST |
| Modifica | `permessi.puoModificare()` | ADM, GEST |
| Cambia stato | `permessi.puoCambiareStato()` | ADM |
| Elimina | `permessi.puoEliminare()` | ADM |

GUEST si ritrova quindi un menu kebab con la sola voce "Dettaglio". GEST vede Dettaglio + Modifica ma né Cambia stato né Elimina.

### `ImpiantoFormComponent`

Form di inserimento / modifica. Le anagrafici sono tendine in cascata (`Regione → Provincia → Comune`) popolate da `/codici`.

- `buildForm()` → costruisce il `FormGroup`. Default `flagEsercizio: 'S'`, `presenzaAccumulo: 'N'`, `statoImpianto: 'ATTIVO'`.
- `caricaImpianto()` → solo in modifica, chiama `getById` e patcha i campi semplici, poi delega a `precompilaAnagrafica`.
- `precompilaAnagrafica(i)` → in cascata: carica REGIONI, cerca quella con `descrizione` corrispondente, patcha; poi PROVINCE filtrate per codice regione, ecc.
- `confrontaCodice` → `compareWith` per i `mat-select` che usano oggetti `CodiceDescrizioneBase` come valore.
- `buildPayload()` → costruisce il body `ImpiantoRequest`. Regione e comune restano oggetti; provincia viene mandata come **stringa** (codice ISO della provincia); indirizzo/civico/cap come stringhe.
- `salva()` → valida e chiama `inserisci` o `modifica`.
- `chiediReset()` → apre dialog; al confirm `onConfermaReset()` svuota il form e ripristina i default.

Le subscription a `valueChanges` su `presenzaAccumulo`, `regione`, `provincia` gestiscono rispettivamente la capacità accumulo condizionale e il caricamento a cascata delle tendine.

### `DettaglioComponent` (Impianto)

Mostra in sola lettura il dettaglio di un impianto. Carica i dati con `ImpiantoService.getById`. Inietta `PermessiService` come `public permessi`. Pulsante "Torna alla lista" sempre visibile; "Modifica Impianto" (`vaiAModifica()` → `/impianto/modifica-impianto/:id`) gated con `*ngIf="permessi.puoModificare()"`, quindi non compare al GUEST.

### `DatiEnergeticiRicercaComponent`

Lista schede energetiche, stessa struttura di `ImpiantiRicercaComponent` (card/tabella, paginatore, sort, kebab con azioni, conferma cancellazione).

- `cercaDatiEnergetici()` / `filtra()` / `resetFiltri()` come la ricerca impianti.
- `chiediElimina(id)` / `onConfermaElimina(id)` con dialog.
- Pre-filtra da `queryParams` (es. arrivo dalla dashboard cliccando una CER).

### `DatiEnergeticiFormComponent`

Form inserimento / modifica / dettaglio.

- All'avvio carica la lista CER (`ricercaCer`) per popolare la tendina.
- In modifica chiama `getById` e patcha i campi mappando i nomi del DTO `DatiVisualizza` su quelli del form (es. `geteProdotta` → `energiaProdottaMhw`).
- In modalità dettaglio disabilita tutto il form.
- Subscription su `calcoloCo2Automatico`: quando attivo disabilita il campo `riduzioneCo2Ton`.
- `salva()`: in inserimento chiama prima `checkDuplicato`; se esiste già una scheda per quella configurazione/anno mostra uno snackbar e blocca l'invio.
- `chiediReset()` / `onConfermaReset()` con dialog.
- `tornaAllaLista()` per navigare via.

## Convenzioni dei toast

- Sui POST/PUT/DELETE viene mostrato in automatico un toast in base alla risposta HTTP.
- Per le GET il toast è soppresso (non vogliamo conferme su ogni caricamento).
- Per silenziare una singola chiamata: `this.api.get(..., undefined, { skipToast: true })`.
