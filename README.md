# MyStore Frontend

## Descrizione

MyStore è un'applicazione web sviluppata con Angular che simula una piattaforma e-commerce. L'applicazione consente agli utenti di registrarsi, effettuare il login, consultare il catalogo prodotti, visualizzare i dettagli di ciascun prodotto e gestire un carrello personale.

Il progetto è stato realizzato con un'architettura modulare basata su componenti, servizi e rotte di navigazione.

## Funzionalità Implementate

### Autenticazione Utente

- Registrazione nuovi utenti
- Login tramite email e password
- Persistenza sessione tramite Local Storage
- Logout
- Protezione delle rotte tramite Auth Guard

### Catalogo Prodotti

- Visualizzazione elenco prodotti disponibili
- Visualizzazione:
    - nome prodotto
    - descrizione breve
    - prezzo
    - disponibilità
    - immagine prodotto
- Navigazione verso la pagina di dettaglio

### Dettaglio Prodotto

- Visualizzazione informazioni complete
- Visualizzazione immagine prodotto
- Gestione disponibilità prodotto
- Aggiunta al carrello

### Carrello

- Visualizzazione prodotti inseriti
- Modifica quantità
- Rimozione articoli
- Calcolo automatico totale ordine
- Aggiornamento dinamico del numero articoli

### Header Dinamico

- Visualizzazione utente autenticato
- Numero articoli presenti nel carrello
- Accesso rapido al carrello
- Logout

# Stack Tecnologico

## Tecnologie Utilizzate

### Frontend:

Angular
TypeScript
RxJS
Angular Router
Angular Reactive Forms
Angular Material Icons
SCSS

### Backend:

Java
Spring Boot
Spring Data JPA
Hibernate
Maven
MySQL

### Tool Utilizzati

Git
GitHub
Postman
Visual Studio Code
Eclipse

# Architettura del Progetto

src/
│
├── components/
│   ├── header/
│   ├── lista-prodotti/
│   ├── dettaglio-prodotti/
│   ├── cart/
│   ├── login/
│   └── registrazione/
│
├── services/
│   ├── api.service.ts
│   ├── product.service.ts
│   ├── cart.service.ts
│   ├── user.service.ts
│   └── toast.service.ts
│
├── interfaces/
│   ├── product.model.ts
│   ├── user.model.ts
│   ├── cart.model.ts
│   └── cart-item.model.ts
│
├── guards/
│   └── auth.guard.ts
│
└── assets/
    └── products/
Gestione dello Stato

# API Utilizzate

L'applicazione comunica con il backend tramite API REST.

## Base URL

```http
http://localhost:8080
```

---

# AUTH

## Registrazione Utente

### Endpoint

```http
POST /api/auth/register
```

### Descrizione

Consente la registrazione di un nuovo utente.

### Request Body

```json
{
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@email.it",
  "password": "123456",
  "saldo": 500.00
}
```

### Response Success

**200 OK**

```json
{
  "id": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@email.it",
  "saldo": 500.00
}
```

### Status Code

| Codice | Descrizione              |
| ------ | ------------------------ |
| 200    | Registrazione completata |
| 500    | Email già registrata     |

---

## Login

### Endpoint

```http
POST /api/auth/login
```

### Request Body

```json
{
  "email": "mario.rossi@email.it",
  "password": "123456"
}
```

### Response Success

**200 OK**

```json
{
  "id": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "email": "mario.rossi@email.it",
  "saldo": 500.00
}
```

### Status Code

| Codice | Descrizione               |
| ------ | ------------------------- |
| 200    | Login effettuato          |
| 500    | Utente non trovato        |
| 500    | Password errata           |
| 500    | Email o password mancanti |

---

# PRODOTTI

## Lista Prodotti

### Endpoint

```http
GET /api/products
```

### Parametri

Nessuno.

### Response

**200 OK**

```json
[
  {
    "idProdotto": 1,
    "nomeProdotto": "Laptop Lenovo",
    "descrizioneBreve": "Notebook",
    "descrizioneCompleta": "Notebook Lenovo i7",
    "prezzo": 899.99,
    "quantitaDisponibile": 10,
    "categoria": "INFORMATICA",
    "immagine": "laptop.jpg"
  }
]
```

### Status Code

| Codice | Descrizione      |
| ------ | ---------------- |
| 200    | Lista restituita |

---

## Dettaglio Prodotto

### Endpoint

```http
GET /api/products/{id}
```

### Esempio

```http
GET /api/products/1
```

### Response

**200 OK**

```json
{
  "idProdotto": 1,
  "nomeProdotto": "Laptop Lenovo",
  "descrizioneBreve": "Notebook",
  "descrizioneCompleta": "Notebook Lenovo i7",
  "prezzo": 899.99,
  "quantitaDisponibile": 10,
  "categoria": "INFORMATICA",
  "immagine": "laptop.jpg"
}
```

### Status Code

| Codice | Descrizione          |
| ------ | -------------------- |
| 200    | Prodotto trovato     |
| 404    | Prodotto non trovato |

---

## Ricerca Prodotto per Nome

### Endpoint

```http
GET /api/products/search?name=laptop
```

### Query Param

| Parametro | Tipo   |
| --------- | ------ |
| name      | String |

### Status Code

| Codice | Descrizione        |
| ------ | ------------------ |
| 200    | Ricerca completata |

---

## Ricerca Avanzata

### Endpoint

```http
GET /api/products/advanced-search
```

### Query Param

```http
/api/products/advanced-search?categoria=INFORMATICA&prezzoMin=100&prezzoMax=1000&quantitaMin=1
```

### Parametri

| Parametro   | Tipo          |
| ----------- | ------------- |
| categoria   | CategoriaEnum |
| prezzoMin   | BigDecimal    |
| prezzoMax   | BigDecimal    |
| quantitaMin | Integer       |

### Status Code

| Codice | Descrizione        |
| ------ | ------------------ |
| 200    | Ricerca completata |

---

# CARRELLO

## Visualizza Carrello

### Endpoint

```http
GET /api/users/{userId}/cart
```

### Esempio

```http
GET /api/users/1/cart
```

### Response

```json
{
  "id": 1,
  "totalItems": 2,
  "totalPrice": 1799.98,
  "items": [
    {
      "id": 1,
      "productId": 1,
      "productName": "Laptop Lenovo",
      "quantita": 2,
      "prezzoUnitario": 899.99,
      "totaleRiga": 1799.98,
      "imageUrl": "laptop.jpg"
    }
  ]
}
```

### Status Code

| Codice | Descrizione         |
| ------ | ------------------- |
| 200    | Carrello recuperato |
| 500    | Utente non trovato  |

---

## Aggiunta Prodotto al Carrello

### Endpoint

```http
POST /api/users/{userId}/cart/items
```

### Request Body

```json
{
  "productId": 1,
  "quantity": 2
}
```

### Status Code

| Codice | Descrizione              |
| ------ | ------------------------ |
| 200    | Prodotto aggiunto        |
| 500    | Utente non trovato       |
| 500    | Prodotto non trovato     |
| 500    | Quantità non disponibile |
| 500    | Stock insufficiente      |

---

## Modifica Quantità Prodotto

### Endpoint

```http
PUT /api/users/{userId}/cart/items/{cartItemId}
```

### Request Body

```json
{
  "quantity": 3
}
```

### Status Code

| Codice | Descrizione         |
| ------ | ------------------- |
| 200    | Quantità aggiornata |
| 500    | Item non trovato    |

---

## Rimozione Prodotto dal Carrello

### Endpoint

```http
DELETE /api/users/{userId}/cart/items/{cartItemId}
```

### Esempio

```http
DELETE /api/users/1/cart/items/5
```

### Status Code

| Codice | Descrizione      |
| ------ | ---------------- |
| 200    | Prodotto rimosso |
| 500    | Item non trovato |

---

# ORDINI

## Checkout Ordine

### Endpoint

```http
POST /api/users/{userId}/orders/checkout
```

### Esempio

```http
POST /api/users/1/orders/checkout
```

### Body

Nessuno.

### Status Code

| Codice | Descrizione          |
| ------ | -------------------- |
| 200    | Ordine creato        |
| 500    | Carrello non trovato |
| 500    | Carrello vuoto       |

---

## Dettaglio Ordine

### Endpoint

```http
GET /api/orders/{orderId}
```

### Esempio

```http
GET /api/orders/1
```

### Response

```json
{
  "id": 1,
  "codiceOrdine": "ORD-20250619-001",
  "dataOrdine": "2025-06-19T10:00:00",
  "stato": "CREATO",
  "totaleOrdine": 899.99
}
```

### Status Code

| Codice | Descrizione        |
| ------ | ------------------ |
| 200    | Ordine trovato     |
| 500    | Ordine non trovato |

---

## Download Ricevuta PDF

### Endpoint

```http
GET /api/orders/{orderId}/receipt/pdf
```

### Stato Implementazione

Endpoint presente ma non ancora implementato.

### Status Code

| Codice | Descrizione |
| ------ | ----------- |
| 200    | Placeholder |

---

## Invio Ricevuta via Email

### Endpoint

```http
POST /api/orders/{orderId}/receipt/email
```

### Stato Implementazione

Endpoint presente ma non ancora implementato.

### Status Code

| Codice | Descrizione |
| ------ | ----------- |
| 200    | Placeholder |

---

# Gestione Errori

## Errori Gestiti

| Eccezione                  | Status Code |
| -------------------------- | ----------- |
| ResourceNotFoundException  | 404         |
| ProductNotFoundException   | 404         |
| CartNotFoundException      | 404         |
| EmptyCartException         | 400         |
| InsufficientStockException | 400         |
| Exception                  | 500         |

### Esempio Risposta Errore

```json
"Prodotto con id 999 non trovato"
```


