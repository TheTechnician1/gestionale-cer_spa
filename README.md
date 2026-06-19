# Videa Shop Frontend

Frontend Angular per un'applicazione e-commerce collegata al backend REST Shopland Online Shop.
La SPA gestisce navigazione utente, autenticazione, catalogo prodotti, ricerca, dettaglio prodotto, carrello, checkout e conferma ordine con download/invio ricevuta.

## Che progetto e'

Il sistema frontend permette di:

- visualizzare la home page dello shop;
- registrare un nuovo utente;
- autenticare un utente tramite email e password;
- salvare la sessione utente lato browser;
- proteggere le pagine riservate con guardia di autenticazione;
- visualizzare il catalogo dei prodotti disponibili;
- ricercare prodotti per nome;
- filtrare prodotti per categoria, prezzo e quantita disponibile;
- visualizzare il dettaglio di un prodotto;
- aggiungere prodotti al carrello;
- modificare la quantita dei prodotti nel carrello;
- rimuovere prodotti dal carrello;
- completare il checkout;
- visualizzare la pagina di pagamento completato;
- inviare la ricevuta via email;
- scaricare la ricevuta in formato PDF;
- mostrare messaggi di errore leggibili per l'utente.

## Tecnologie utilizzate

- Angular 15.2
- Angular CLI 15.2
- TypeScript 4.9
- RxJS 7.8
- Angular Router
- Angular HttpClient
- Reactive Forms
- Template-driven Forms
- HTML
- SCSS / CSS
- sessionStorage
- localStorage

## Ambienti e route principali

Ambiente locale:

```txt
Frontend: http://localhost:4200
Backend API: http://localhost:8080
```

Configurazione ambiente:

```ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:8080'
};
```

Comandi principali:

```bash
npm install
npm start
npm run build
```

Script disponibili:

```json
{
  "start": "ng serve --host localhost --port=4200",
  "build": "ng build"
}
```

## Schema progetto

```txt
src
|
+-- app
|   +-- app.component.ts
|   +-- app.routes.ts
|   +-- guards.ts
|   +-- models.ts
|   +-- storage.ts
|   +-- brand-select.directive.ts
|   |
|   +-- pages
|   |   +-- home-page
|   |   +-- sign-in-page
|   |   +-- sign-up-page
|   |   +-- products-page
|   |   +-- product-page
|   |   +-- cart-page
|   |   +-- checkout-page
|   |   +-- order-confirmation-page
|   |   +-- account-page
|   |   +-- categories-page
|   |   +-- category-page
|   |   +-- support-page
|   |   +-- about-page
|   |   +-- admin-page
|   |   +-- change-password-page
|   |
|   +-- services
|       +-- auth.service.ts
|       +-- product.service.ts
|       +-- cart.service.ts
|       +-- order.service.ts
|       +-- error.service.ts
|       +-- i18n.service.ts
|       +-- language.service.ts
|       +-- currency.service.ts
|       +-- discount.service.ts
|       +-- sale.service.ts
|
+-- environments
|   +-- environment.ts
|   +-- environment.prod.ts
|
+-- main.ts
+-- styles.css
```

## Routing applicativo

Le route principali sono definite in `src/app/app.routes.ts`.

| Route | Pagina | Accesso |
| --- | --- | --- |
| `/` | Home page | Pubblico |
| `/sign-in` | Login | Pubblico |
| `/sign-up` | Registrazione | Pubblico |
| `/products` | Catalogo prodotti | Protetto |
| `/product/:id` | Dettaglio prodotto | Protetto |
| `/cart` | Carrello | Protetto |
| `/checkout` | Checkout | Protetto |
| `/order-completed/:id` | Conferma ordine | Protetto |

Alias supportati:

- `/login` -> `/sign-in`
- `/signin` -> `/sign-in`
- `/register` -> `/sign-up`
- `/signup` -> `/sign-up`

Le pagine protette usano `authGuard`, che verifica la presenza dell'utente autenticato in sessione.

## Modelli frontend

I principali modelli TypeScript sono definiti in `src/app/models.ts`.

### User

Rappresenta l'utente autenticato.

Campi principali:

- `id`
- `nome`
- `cognome`
- `email`
- `saldo`
- `createdAt`

### AuthResponse

Risposta ricevuta da login e registrazione.

Campi principali:

- `message`
- `user`
- `sessionToken`

### ProductSummary

Rappresenta un prodotto nel catalogo.

Campi principali:

- `id`
- `nomeProdotto`
- `descrizioneBreve`
- `prezzo`
- `quantitaDisponibile`
- `categoria`
- `immagine`

### ProductDetail

Rappresenta il dettaglio completo di un prodotto.

Campi principali:

- `descrizioneCompleta`
- `seller`

### Cart

Rappresenta il carrello utente.

Campi principali:

- `id`
- `userId`
- `createdAt`
- `updatedAt`
- `totalItems`
- `totalAmount`
- `items`

### CartItem

Rappresenta una riga del carrello.

Campi principali:

- `id`
- `productId`
- `nomeProdotto`
- `prezzoUnitario`
- `quantita`
- `totaleRiga`

### Order

Rappresenta un ordine completato.

Campi principali:

- `id`
- `userId`
- `codiceOrdine`
- `dataOrdine`
- `stato`
- `totaleOrdine`
- `items`

## API di accesso

Tutte le chiamate HTTP partono da:

```txt
environment.apiBaseUrl = http://localhost:8080
```

Il frontend usa `HttpClientModule`, importato in `src/main.ts`.

## Auth API frontend

Service: `AuthService`

### Registrazione

```http
POST /api/auth/register
```

Payload inviato:

```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@example.com",
  "password": "demo123",
  "saldo": 1000
}
```

Pagina:

```txt
/sign-up
```

Validazioni frontend:

- nome obbligatorio;
- cognome obbligatorio;
- email obbligatoria e valida;
- password obbligatoria con lunghezza minima 6;
- saldo obbligatorio e non negativo.

Flusso:

1. l'utente compila il form;
2. Angular valida i campi;
3. il frontend invia la richiesta al backend;
4. in caso di successo reindirizza a `/sign-in`;
5. in caso di errore mostra un messaggio leggibile.

### Login

```http
POST /api/auth/login
```

Payload inviato:

```json
{
  "email": "demo@example.com",
  "password": "demo123"
}
```

Pagina:

```txt
/sign-in
```

Flusso:

1. l'utente inserisce email e password;
2. il frontend invia la richiesta al backend;
3. in caso di successo salva utente e token in `sessionStorage`;
4. l'utente viene reindirizzato a `/products`.

## Product API frontend

Service: `ProductService`

### Lista prodotti

```http
GET /api/products
```

Pagina:

```txt
/products
```

Il frontend normalizza i valori numerici e mostra solo prodotti con `quantitaDisponibile > 0`.

Informazioni visualizzate:

- immagine;
- nome prodotto;
- descrizione breve;
- prezzo;
- quantita disponibile;
- categoria;
- pulsante dettagli.

### Dettaglio prodotto

```http
GET /api/products/{id}
```

Pagina:

```txt
/product/:id
```

Informazioni visualizzate:

- immagine;
- nome prodotto;
- descrizione completa;
- prezzo;
- quantita disponibile;
- categoria;
- venditore;
- controllo quantita;
- pulsante aggiungi al carrello.

Validazioni frontend:

- quantita minima: `1`;
- quantita massima: `quantitaDisponibile`;
- pulsante disabilitato se prodotto non disponibile.

### Ricerca semplice

```http
GET /api/products/search?name={name}
```

La ricerca semplice e disponibile nella pagina catalogo e dalla home.

### Ricerca avanzata

```http
GET /api/products/advanced-search
```

Parametri supportati:

- `category`
- `minPrice`
- `maxPrice`
- `minQuantity`

I filtri sono gestiti tramite Reactive Forms nella pagina catalogo.

## Cart API frontend

Service: `CartService`

### Caricamento carrello

```http
GET /api/users/{userId}/cart
```

Pagina:

```txt
/cart
```

Informazioni visualizzate:

- nome prodotto;
- immagine;
- prezzo unitario;
- quantita;
- totale riga;
- totale articoli;
- totale carrello;
- pulsanti incremento, decremento e rimozione.

### Aggiunta prodotto

```http
POST /api/users/{userId}/cart/items
```

Payload:

```json
{
  "productId": 1,
  "quantita": 1
}
```

Se l'utente non e autenticato, viene reindirizzato alla pagina login.

### Modifica quantita

```http
PUT /api/users/{userId}/cart/items/{cartItemId}
```

Payload:

```json
{
  "quantita": 2
}
```

Se la quantita diventa `0`, il frontend richiama la rimozione del prodotto.

### Rimozione prodotto

```http
DELETE /api/users/{userId}/cart/items/{cartItemId}
```

Il carrello locale viene aggiornato con la risposta del backend.

## Order API frontend

Service: `OrderService`

### Checkout

```http
POST /api/users/{userId}/orders/checkout
```

Pagina:

```txt
/checkout
```

Flusso:

1. il frontend carica il carrello corrente;
2. se il carrello e vuoto mostra errore;
3. invia la richiesta di checkout;
4. svuota lo stato locale del carrello;
5. reindirizza a `/order-completed/:id`.

### Dettaglio ordine

```http
GET /api/orders/{orderId}
```

Pagina:

```txt
/order-completed/:id
```

Informazioni visualizzate:

- messaggio di pagamento completato;
- codice ordine;
- data ordine;
- totale ordine;
- azione invio email;
- azione download PDF.

### Invio ricevuta email

```http
POST /api/orders/{orderId}/receipt/email
```

Il frontend mostra un messaggio di conferma o un errore leggibile.

### Download ricevuta PDF

```http
GET /api/orders/{orderId}/receipt/pdf
```

Il frontend riceve un `Blob`, crea un link temporaneo e avvia il download del file:

```txt
ricevuta-ordine-{orderId}.pdf
```

## Gestione sessione

La sessione utente viene salvata in `sessionStorage`.

Chiave utilizzata:

```txt
videa_shop_session
```

Contenuto:

```json
{
  "user": {
    "id": 1,
    "nome": "Mario",
    "cognome": "Rossi",
    "email": "mario.rossi@example.com",
    "saldo": 1000
  },
  "sessionToken": "..."
}
```

La preferenza lingua viene salvata in `localStorage`.

## Gestione errori

Service: `ErrorService`

Il frontend intercetta gli errori HTTP e prova a trasformarli in messaggi leggibili.

Casi gestiti:

- email gia registrata;
- credenziali errate;
- quantita insufficiente o prodotto non disponibile;
- saldo insufficiente;
- carrello vuoto;
- ordine non trovato;
- errore generazione PDF;
- errore invio email;
- prodotto non disponibile;
- errore generico.

Esempio risposta backend attesa:

```json
{
  "timestamp": "2026-06-19T11:49:35.9807392",
  "status": 404,
  "error": "Not Found",
  "message": "Prodotto inesistente o non trovato",
  "path": "/api/products/999999"
}
```

## Componenti e pagine principali

### HomePage

Pagina pubblica iniziale dello shop.
Contiene ricerca rapida, categorie e collegamenti verso catalogo e autenticazione.

### SignInPage

Gestisce il login tramite Reactive Forms.

### SignUpPage

Gestisce la registrazione tramite Reactive Forms e validazioni lato frontend.

### ProductsPage

Mostra il catalogo prodotti, ricerca semplice e filtri avanzati.

### ProductPage

Mostra il dettaglio prodotto e permette l'aggiunta al carrello.

### CartPage

Mostra e modifica il carrello utente.

### CheckoutPage

Mostra il riepilogo del carrello e avvia il checkout.

### OrderConfirmationPage

Mostra la conferma ordine, invia la ricevuta email e avvia il download PDF.

## Avvio progetto

Prerequisiti:

- Node.js compatibile con Angular 15;
- npm;
- backend attivo su `http://localhost:8080`.

Installazione dipendenze:

```bash
npm install
```

Avvio in locale:

```bash
npm start
```

Build produzione:

```bash
npm run build
```

Output build:

```txt
dist/
```

## Note implementative

- Il progetto usa componenti standalone Angular.
- Le route sono definite centralmente in `app.routes.ts`.
- Le pagine riservate sono protette tramite `authGuard`.
- I form di login, registrazione, catalogo e dettaglio prodotto usano Reactive Forms.
- Le chiamate REST sono isolate nei service.
- Lo stato carrello e utente viene esposto tramite `BehaviorSubject`.
- Le immagini prodotto usano un placeholder locale se il backend non fornisce un URL valido.
- Il frontend si aspetta che il backend esponga le API su `localhost:8080`.
