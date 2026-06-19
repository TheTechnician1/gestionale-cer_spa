# E-commerce Frontend

Frontend Angular per un'applicazione e-commerce full stack. La SPA gestisce autenticazione, catalogo prodotti, offerte, ricerca, carrello guest/utente, checkout, pagamento simulato, ordini, ricevute PDF e invio ricevuta via email.

Il backend atteso espone API REST su `http://localhost:8080`, configurato in [app-settings.ts](src/app/core/config/app-settings.ts).

## Indice

- [E-commerce Frontend](#e-commerce-frontend)
  - [Indice](#indice)
  - [Stack](#stack)
  - [Funzionalità principali](#funzionalità-principali)
    - [Autenticazione e profilo](#autenticazione-e-profilo)
    - [Catalogo prodotti](#catalogo-prodotti)
    - [Ricerca e offerte](#ricerca-e-offerte)
    - [Carrello e ordini](#carrello-e-ordini)
  - [Prerequisiti](#prerequisiti)
  - [Configurazione API](#configurazione-api)
  - [Installazione e avvio](#installazione-e-avvio)
  - [Script disponibili](#script-disponibili)
  - [Build](#build)
  - [Architettura frontend](#architettura-frontend)
    - [Responsabilità principali](#responsabilità-principali)
  - [Rotte principali](#rotte-principali)
  - [Servizi Angular](#servizi-angular)
  - [Gestione sessione](#gestione-sessione)
  - [Gestione carrello](#gestione-carrello)
    - [Guest](#guest)
    - [Utente loggato](#utente-loggato)
  - [Checkout e pagamento](#checkout-e-pagamento)
  - [Endpoint backend utilizzati](#endpoint-backend-utilizzati)
    - [Auth](#auth)
    - [Products](#products)
    - [Cart](#cart)
    - [Orders](#orders)
    - [Receipt](#receipt)
  - [Gestione errori](#gestione-errori)
  - [Note di sviluppo](#note-di-sviluppo)
  - [Note di allineamento con il backend](#note-di-allineamento-con-il-backend)
  - [Stato](#stato)

## Stack

- Angular 15
- TypeScript
- Angular Router
- Reactive Forms
- Angular Material
- RxJS
- HttpClient
- HTML
- SCSS
- localStorage / sessionStorage

## Funzionalità principali

### Autenticazione e profilo

- Registrazione utente con validazioni lato frontend.
- Login con opzione `Ricordami`.
- Persistenza sessione tramite `localStorage` o `sessionStorage`.
- Reset password tramite email.
- Visualizzazione profilo utente.
- Modifica dati profilo.
- Aggiornamento saldo utente.
- Protezione rotte tramite `AuthGuard`.

### Catalogo prodotti

- Dashboard prodotti.
- Visualizzazione immagine, nome, descrizione breve, prezzo, categoria e disponibilità.
- Pagina dettaglio prodotto.
- Selezione quantità dal dettaglio prodotto.
- Blocco aggiunta al carrello quando la quantità richiesta supera la disponibilità gestita lato frontend.

### Ricerca e offerte

- Ricerca semplice dall'header.
- Ricerca avanzata per:
  - categoria;
  - prezzo minimo;
  - prezzo massimo;
  - quantità minima disponibile.
- Pagina offerte con:
  - prezzo originale barrato;
  - prezzo scontato;
  - percentuale sconto;
  - risparmio calcolato.

### Carrello e ordini

- Carrello guest persistito in `localStorage`.
- Carrello utente sincronizzato con backend.
- Merge del carrello guest dopo login.
- Incremento, decremento e rimozione prodotti.
- Calcolo totale carrello e totale righe.
- Checkout con dati spedizione e metodo pagamento.
- Pagamento simulato tramite saldo utente.
- Conferma ordine.
- Lista ordini utente.
- Dettaglio ordine in dialog/pagina dedicata.
- Download ricevuta PDF.
- Invio ricevuta via email.

## Prerequisiti

- Node.js compatibile con Angular 15.
- npm.
- Angular CLI installato globalmente o eseguito tramite `npx`.
- Backend Spring Boot avviato su `http://localhost:8080`.
- Browser moderno.

## Configurazione API

La configurazione principale è in:

```text
src/app/core/config/app-settings.ts
```

Esempio:

```ts
export const APP_SETTINGS = {
  apiBaseUrl: 'http://localhost:8080',
  i18nBasePath: '/assets/i18n',
};
```

Se il backend usa host o porta diversi, modificare `apiBaseUrl`.

## Installazione e avvio

Installare le dipendenze:

```bash
npm install
```

Avviare il frontend in sviluppo:

```bash
npm start
```

oppure:

```bash
ng serve
```

Applicazione disponibile su:

```text
http://localhost:4200
```

## Script disponibili

| Comando | Descrizione |
| --- | --- |
| `npm start` | Avvia Angular in modalità sviluppo |
| `ng serve` | Avvia il server Angular CLI |
| `npm run build` | Genera la build di produzione |
| `npm test` | Esegue i test configurati |
| `npm run lint` | Esegue il lint, se configurato nel progetto |

Formattazione consigliata:

```bash
npx prettier --config prettier.config.json --write "{*,src/**/*}.{ts,html,js,scss,css,json,md,yaml,yml}"
```

## Build

```bash
npm run build
```

Gli artefatti vengono generati nella cartella `dist/`.

Se nel progetto compaiono ancora nomi come `gestionale-cer_spa`, è consigliato rinominare il progetto Angular in `ecommerce-frontend` dentro `angular.json` e aggiornare i riferimenti nel README.

## Architettura frontend

Struttura indicativa:

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

### Responsabilità principali

| Area | Responsabilità |
| --- | --- |
| `core/components` | Componenti principali dell'applicazione |
| `core/layout` | Header, navbar, layout generale |
| `core/services` | Comunicazione HTTP e gestione stato |
| `core/interfaces` | Modelli TypeScript usati dal frontend |
| `core/guard` | Protezione delle rotte private |
| `core/interceptor` | Gestione globale errori HTTP, toast e redirect |
| `shared` | Componenti e moduli riutilizzabili |
| `assets` | Immagini, traduzioni e risorse statiche |

## Rotte principali

| Rotta | Accesso | Descrizione |
| --- | --- | --- |
| `/` | Pubblico/utente | Dashboard prodotti |
| `/login` | Pubblico | Login |
| `/registrazione` | Pubblico | Registrazione |
| `/reset-password` | Pubblico | Reset password |
| `/profilo/:id` | Protetta | Profilo utente |
| `/modifica-profilo/:id` | Protetta | Modifica profilo |
| `/prodotto/:id` | Pubblico/utente | Dettaglio prodotto |
| `/carrello/:id` | Utente/guest gestito lato FE | Carrello |
| `/offerte` | Pubblico/utente | Prodotti in offerta |
| `/ricerca-avanzata` | Pubblico/utente | Ricerca avanzata |
| `/checkout` | Protetta | Checkout |
| `/payment` | Protetta | Pagamento simulato |
| `/ordine-confermato` | Protetta | Conferma ordine |
| `/ricevuta-ordine` | Protetta | Ricevuta ordine |
| `/ordini` | Protetta | Lista ordini |
| `/ordini/:id` | Protetta | Dettaglio ordine |
| `/not-authorized` | Pubblico | Accesso non autorizzato |

## Servizi Angular

| Servizio | Responsabilità |
| --- | --- |
| `ApiService` | Wrapper HTTP, base URL, params, response type `json`, `text` e `blob` |
| `UtenteService` | Login, logout, registrazione, reset password, profilo, saldo e sessione |
| `ProductService` | Catalogo prodotti, dettaglio prodotto, ricerca semplice e avanzata |
| `CartService` | Stato carrello, guest cart, merge guest, CRUD carrello utente |
| `OrderService` | Checkout, pagamento, completamento ordine, ordini, PDF e email ricevuta |
| `ToastService` | Feedback utente tramite snackbar/toast custom |

## Gestione sessione

Il login supporta due modalità:

- `Ricordami` selezionato: dati utente salvati in `localStorage`.
- `Ricordami` non selezionato: dati utente salvati in `sessionStorage`.

Il logout deve pulire entrambi gli storage e riportare lo stato utente a guest.

> Nota sicurezza: il backend attuale non usa JWT. La sessione è quindi gestita lato frontend tramite storage locale. Per un ambiente reale servirebbe un sistema di autenticazione più robusto.

## Gestione carrello

Il carrello usa due flussi:

### Guest

- Persistenza locale tramite chiave `guest_cart` in `localStorage`.
- Possibilità di aggiungere prodotti senza login.
- Merge verso il carrello backend dopo login.

### Utente loggato

- Persistenza su database tramite API backend.
- Aggiornamento reattivo dello stato tramite `BehaviorSubject`.
- Header aggiornato tramite stato carrello condiviso.

Il frontend conserva anche informazioni utili alla visualizzazione delle offerte:

- `prezzoOriginale`;
- `prezzoScontato`;
- `sconto`;
- `totaleRiga`.

## Checkout e pagamento

Il checkout invia al backend:

- dati di spedizione;
- metodo pagamento;
- prodotti;
- totale prodotti;
- costo spedizione;
- totale ordine.

Gli importi monetari vengono arrotondati a massimo 2 decimali prima dell'invio, per rispettare le validazioni backend.

Flusso previsto:

```text
Carrello -> Checkout -> Creazione ordine -> Pagamento -> Conferma -> Ricevuta
```

Dopo pagamento riuscito:

- il saldo utente locale viene aggiornato;
- il carrello locale viene svuotato;
- l'utente viene reindirizzato alla conferma ordine;
- sono disponibili download PDF e invio email della ricevuta.

## Endpoint backend utilizzati

Base URL:

```text
http://localhost:8080
```

### Auth

| Metodo | Endpoint | Descrizione |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login utente |
| `POST` | `/api/auth/register` | Registrazione utente |
| `POST` | `/api/auth/edit/{id}` | Modifica utente |
| `POST` | `/api/auth/edit/{id}/balance?balance={amount}` | Aggiunta saldo |
| `GET` | `/api/auth/reset-password/request/{email}` | Richiesta reset password |
| `POST` | `/api/auth/reset-password` | Reset password |

### Products

| Metodo | Endpoint | Descrizione |
| --- | --- | --- |
| `GET` | `/api/products/` | Lista prodotti |
| `GET` | `/api/products/{id}` | Dettaglio prodotto |
| `GET` | `/api/products/search/{term}` | Ricerca semplice per nome |
| `GET` | `/api/products/advanced-search` | Ricerca avanzata |

Parametri ricerca avanzata:

```text
category
minPrice
maxPrice
minQuantity
```

### Cart

| Metodo | Endpoint | Descrizione |
| --- | --- | --- |
| `GET` | `/api/users/{userId}/cart` | Recupera carrello utente |
| `POST` | `/api/users/{userId}/cart/items` | Aggiunge prodotto al carrello |
| `PUT` | `/api/users/{userId}/cart/items/{cartItemId}` | Aggiorna quantità item |
| `DELETE` | `/api/users/{userId}/cart/items/{cartItemId}` | Rimuove item |

Payload add/update item:

```json
{
  "productId": 1,
  "quantity": 2
}
```

### Orders

| Metodo | Endpoint | Descrizione |
| --- | --- | --- |
| `GET` | `/api/users/{userId}/orders` | Lista ordini utente |
| `GET` | `/api/orders/{orderId}` | Dettaglio ordine |
| `POST` | `/api/users/{userId}/orders/checkout` | Crea ordine in stato `CREATO` |
| `POST` | `/api/users/{userId}/orders/payment/{orderId}` | Paga ordine e passa a `PAGATO` |
| `POST` | `/api/users/{userId}/orders/completed/{orderId}` | Completa ordine e passa a `COMPLETATO` |

### Receipt

| Metodo | Endpoint | Response type | Descrizione |
| --- | --- | --- | --- |
| `GET` | `/api/orders/{orderId}/receipt/pdf` | `blob` | Download ricevuta PDF |
| `POST` | `/api/orders/{orderId}/receipt/email` | `text` | Invio ricevuta via email |

## Gestione errori

Gli errori HTTP vengono intercettati globalmente tramite interceptor e mostrati all'utente tramite toast/snackbar.

Il backend può restituire due formati principali:

Errore applicativo:

```json
{
  "error": "Saldo insufficiente",
  "status": "403 FORBIDDEN"
}
```

Errore di validazione:

```json
{
  "email": "Email non valida, deve contenere la @",
  "password": "La password deve contenere almeno una maiuscola, una minuscola, un numero e un carattere speciale"
}
```

Il frontend dovrebbe quindi gestire sia `error.error` sia mappe campo/messaggio.

## Note di sviluppo

- Il progetto usa form reattivi per login, registrazione, checkout e reset password.
- Gli errori HTTP sono gestiti tramite interceptor e toast.
- Il download PDF usa `responseType: "blob"`.
- L'invio ricevuta email usa `responseType: "text"`.
- Il carrello guest resta locale finche l'utente non effettua login.
- Alla login, se esiste un carrello guest, viene fuso nel carrello utente.

## Note di allineamento con il backend

- Il backend reale usa `/api/products/search/{term}`, non `/api/products/search?name={name}`.
- Il login restituisce una response wrappata in `ApiResponse<T>` con campi `message` e `data`.
- Il pagamento è diviso in tre step backend: `checkout`, `payment`, `completed`.
- Il download PDF richiede `responseType: 'blob'`.
- L'invio email ricevuta può restituire testo semplice, quindi usare `responseType: 'text'`.
- Gli importi devono avere massimo 2 decimali.

## Stato

- [x] Registrazione utente
- [x] Login con ricordami
- [x] Reset password
- [x] Profilo utente
- [x] Modifica profilo
- [x] Catalogo prodotti
- [x] Dettaglio prodotto
- [x] Offerte con sconto
- [x] Ricerca semplice
- [x] Ricerca avanzata
- [x] Carrello guest
- [x] Carrello utente
- [x] Merge carrello guest dopo login
- [x] Checkout
- [x] Pagamento simulato
- [x] Aggiornamento saldo
- [x] Conferma ordine
- [x] Lista ordini
- [x] Dettaglio ordine
- [x] Download ricevuta PDF
- [x] Invio ricevuta email
