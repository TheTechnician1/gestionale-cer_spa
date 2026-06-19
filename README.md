# Frontend E-commerce

Frontend Angular per un'applicazione e-commerce full stack. La SPA gestisce catalogo prodotti, offerte, ricerca, autenticazione, carrello guest/utente, checkout, pagamento simulato, ordini e ricevute.

Il backend atteso espone API REST su `http://localhost:8080`, configurato in [app-settings.ts](src/app/core/config/app-settings.ts).

## Stack

- Angular 15
- TypeScript
- Angular Router
- Reactive Forms
- Angular Material
- RxJS
- SCSS
- HttpClient
- localStorage/sessionStorage

## Funzionalita

- Registrazione utente con validazioni form.
- Login con opzione `Ricordami`.
- Sessione guest automatica.
- Catalogo prodotti nella dashboard.
- Dettaglio prodotto con selezione quantita.
- Ricerca semplice dall'header.
- Ricerca avanzata per categoria, prezzo minimo/massimo e quantita minima.
- Pagina offerte con prezzo scontato, prezzo originale barrato, percentuale sconto e risparmio.
- Carrello guest persistito in `localStorage`.
- Carrello utente sincronizzato con backend.
- Merge del carrello guest dopo login.
- Checkout con indirizzo spedizione e pagamento simulato tramite saldo.
- Aggiornamento saldo e svuotamento carrello dopo pagamento.
- Conferma ordine con codice ordine e totale.
- Lista ordini utente.
- Dettaglio ordine in dialog.
- Download ricevuta PDF.
- Invio ricevuta via email.
- Interceptor HTTP per toast, errori e redirect su 401/403.

## Sessione e "Ricordami"

Il login supporta due modalita:

- `Ricordami` selezionato: l'utente viene salvato in `localStorage` e resta loggato anche dopo la chiusura del browser.
- `Ricordami` non selezionato: l'utente viene salvato in `sessionStorage` e torna Guest alla chiusura della sessione browser.

Il logout pulisce entrambi gli storage.

## Carrello

Il carrello usa due flussi:

- Guest: gli item vengono salvati in `localStorage` con chiave `guest_cart`.
- Utente loggato: gli item vengono gestiti tramite API backend.

Il carrello mantiene uno stato locale reattivo tramite `BehaviorSubject`, usato anche dall'header per aggiornare il contatore.

Per le offerte, il frontend conserva anche:

- `prezzoOriginale`
- `prezzoScontato`
- `sconto`
- `totaleRiga`

Questi dati permettono di mostrare prezzo barrato, sconto e risparmio nel carrello e nel checkout.

## Checkout e pagamento

Il checkout invia al backend:

- dati spedizione;
- metodo pagamento;
- prodotti;
- totale prodotti;
- costo spedizione;
- totale ordine.

Gli importi monetari vengono arrotondati a massimo 2 decimali prima dell'invio, per rispettare la validazione backend.

Dopo pagamento riuscito:

- il saldo utente locale viene aggiornato;
- il carrello locale viene svuotato;
- l'utente viene portato alla pagina di conferma ordine.

## Rotte principali

| Rotta | Descrizione |
| --- | --- |
| `/` | Dashboard prodotti |
| `/login` | Login |
| `/registrazione` | Registrazione |
| `/reset-password` | Reset password |
| `/profilo/:id` | Profilo utente |
| `/modifica-profilo/:id` | Modifica profilo |
| `/prodotto/:id` | Dettaglio prodotto |
| `/carrello/:id` | Carrello |
| `/offerte` | Offerte |
| `/ricerca-avanzata` | Ricerca avanzata |
| `/checkout` | Checkout |
| `/payment` | Pagamento simulato |
| `/ordine-confermato` | Conferma ordine |
| `/ricevuta-ordine` | Ricevuta ordine |
| `/ordini` | Lista ordini |
| `/ordini/:id` | Dettaglio ordine |
| `/not-authorized` | Accesso non autorizzato |

Le rotte profilo, checkout, pagamento, ordini e ricevuta sono protette da `AuthGuard`.

## Servizi principali

| Servizio | Responsabilita |
| --- | --- |
| `ApiService` | Wrapper HTTP, URL base, params, response type JSON/text/blob |
| `UtenteService` | Login, logout, registrazione, sessione, saldo |
| `ProductService` | Prodotti, dettaglio, ricerca, ricerca avanzata |
| `CartService` | Stato carrello, guest cart, merge guest, CRUD carrello, offerte |
| `OrderService` | Checkout, pagamento, completamento ordine, ordini, ricevute |
| `ToastService` | Feedback utente tramite snackbar custom |

## Endpoint backend usati

| Area | Metodo | Endpoint |
| --- | --- | --- |
| Auth | `POST` | `/api/auth/login` |
| Auth | `POST` | `/api/auth/register` |
| Auth | `POST` | `/api/auth/edit/{id}` |
| Auth | `POST` | `/api/auth/edit/{id}/balance` |
| Auth | `GET` | `/api/auth/reset-password/request/{email}` |
| Auth | `POST` | `/api/auth/reset-password` |
| Products | `GET` | `/api/products/` |
| Products | `GET` | `/api/products/{id}` |
| Products | `GET` | `/api/products/search/{term}` |
| Products | `GET` | `/api/products/advanced-search` |
| Cart | `GET` | `/api/users/{userId}/cart` |
| Cart | `POST` | `/api/users/{userId}/cart/items` |
| Cart | `PUT` | `/api/users/{userId}/cart/items/{cartItemId}` |
| Cart | `DELETE` | `/api/users/{userId}/cart/items/{cartItemId}` |
| Orders | `GET` | `/api/users/{userId}/orders` |
| Orders | `GET` | `/api/orders/{orderId}` |
| Orders | `POST` | `/api/users/{userId}/orders/checkout` |
| Orders | `POST` | `/api/users/{userId}/orders/payment/{orderId}` |
| Orders | `POST` | `/api/users/{userId}/orders/completed/{orderId}` |
| Receipt | `GET` | `/api/orders/{orderId}/receipt/pdf` |
| Receipt | `POST` | `/api/orders/{orderId}/receipt/email` |

## Struttura progetto

```text
src/
  app/
    core/
      components/
      config/
      enum/
      guard/
      interceptor/
      interfaces/
      layout/
      services/
    shared/
      components/
      shared.module.ts
    app.module.ts
    app.routes.ts
  assets/
```

## Configurazione API

La configurazione principale e in:

```text
src/app/core/config/app-settings.ts
```

Valore attuale:

```ts
export const APP_SETTINGS = {
  apiBaseUrl: "http://localhost:8080",
  i18nBasePath: "/assets/i18n",
};
```

Se il backend gira su host o porta diversa, aggiornare `apiBaseUrl`.

## Installazione

```bash
npm install
```

## Avvio sviluppo

```bash
npm start
```

oppure:

```bash
ng serve
```

Aprire:

```text
http://localhost:4200
```

## Build

```bash
npm run build
```

Gli artefatti vengono generati in:

```text
dist/gestionale-cer_spa
```

## Test

```bash
npm test
```

## Lint

```bash
npm run lint
```

## Formattazione

```bash
npx prettier --config prettier.config.json --write "{*,src/**/*}.{ts,html,js,scss,css,json,md,yaml,yml}"
```

## Note di sviluppo

- Il progetto usa form reattivi per login, registrazione, checkout e reset password.
- Gli errori HTTP sono gestiti tramite interceptor e toast.
- Il download PDF usa `responseType: "blob"`.
- L'invio ricevuta email usa `responseType: "text"`.
- Il carrello guest resta locale finche l'utente non effettua login.
- Alla login, se esiste un carrello guest, viene fuso nel carrello utente.

## Stato

- [x] Registrazione
- [x] Login con ricordami
- [x] Catalogo prodotti
- [x] Dettaglio prodotto
- [x] Offerte con sconto
- [x] Ricerca avanzata
- [x] Carrello guest
- [x] Carrello utente
- [x] Checkout
- [x] Pagamento simulato
- [x] Aggiornamento saldo
- [x] Conferma ordine
- [x] Lista ordini
- [x] Dettaglio ordine
- [x] Download PDF
- [x] Invio ricevuta email
