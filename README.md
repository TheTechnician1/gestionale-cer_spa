# MajorBit Shop SPA

Frontend Angular di **MajorBit Shop**, progetto didattico che simula un piccolo e-commerce con login, registrazione, catalogo prodotti, preferiti, carrello, saldo virtuale, checkout e conferma ordine.

L'applicazione lavora insieme al backend Spring Boot `gestionalecersrv`, esposto in locale su `http://localhost:8080`.

## Tecnologie utilizzate

- Angular 15
- TypeScript
- Angular Router
- Reactive Forms
- HttpClient
- RxJS
- Bootstrap 5
- SCSS

## Avvio del progetto

Installare le dipendenze:

```bash
npm install
```

Avviare il frontend:

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

## Backend collegato

Il frontend comunica con le API REST del backend Spring Boot su:

```text
http://localhost:8080
```

Gli URL delle chiamate HTTP sono gestiti nei service presenti in:

```text
src/app/services
```

## Struttura del progetto

```text
src/app
├── components
│   ├── footer
│   ├── navbar
│   ├── product-card
│   └── toast
├── guards
│   └── auth.guard.ts
├── models
├── pages
│   ├── carrello
│   ├── dettaglio-prodotto
│   ├── fondi
│   ├── home
│   ├── login
│   ├── pagamento-completato
│   ├── prodotti
│   ├── profilo
│   └── registrazione
└── services
```

## Rotte principali

- `/login` - accesso utente
- `/registrazione` - creazione account
- `/home` - home con categorie e prodotti preferiti
- `/prodotti` - lista prodotti
- `/prodotti/categoria/:nomeCategoria` - prodotti filtrati per categoria
- `/prodotti/dettaglio/:idProdotto` - dettaglio prodotto
- `/carrello` - carrello dell'utente
- `/pagamento-completato` - conferma dell'ordine
- `/profilo` - dati dell'utente loggato
- `/fondi` - ricarica del saldo virtuale

Le pagine interne sono protette da `AuthGuard`: senza login l'utente viene rimandato alla schermata di accesso.

## Funzionalita principali

- Login e registrazione con controlli sui campi.
- Reindirizzamento al login dopo la registrazione.
- Salvataggio dell'utente loggato lato browser.
- Home con categorie e lista dei preferiti.
- Ricerca prodotti dalla navbar.
- Visualizzazione prodotti per categoria.
- Dettaglio prodotto con immagine, descrizione, prezzo, venditore e disponibilita.
- Aggiunta al carrello dalla lista prodotti e dal dettaglio.
- Blocco del tasto aggiungi se il prodotto e' esaurito.
- Gestione dei prodotti preferiti tramite cuore.
- Carrello con modifica quantita, rimozione prodotti e svuotamento.
- Profilo utente con dati principali e saldo virtuale.
- Ricarica fondi con controllo sull'importo inserito.
- Checkout e schermata di pagamento completato.
- Toast per messaggi di successo ed errore.

## Controlli lato frontend

Il frontend effettua alcuni controlli prima di chiamare il backend:

- email e password obbligatorie in login;
- campi obbligatori in registrazione;
- conferma password uguale alla password;
- importo fondi maggiore di zero;
- tasto aggiungi disabilitato se `quantitaDisponibile <= 0`;
- accesso alle rotte interne consentito solo a utente loggato.

## Comandi utili

Build del progetto:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

Test:

```bash
npm test
```

## Note sul progetto

Il pagamento e il saldo sono virtuali, perche' il progetto ha scopo didattico. La parte di ordine e ricevuta viene gestita dal backend.

## Autore

- Simone Zenobi
