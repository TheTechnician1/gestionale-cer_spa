import { Component, OnInit } from '@angular/core';

import { CarrelloResponse } from '../../models/carrello-response';
import { UserResponse } from '../../models/user-response';
import { CarrelloService } from '../../services/carrello.service';
import { UtenteStorageService } from '../../services/utente-storage.service';
import { Router } from '@angular/router';
import { OrdineService } from '../../services/ordine.service';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss'],
})
export class CarrelloComponent implements OnInit {
  elementiCarrello: CarrelloResponse[] = [];
  utente: UserResponse | null = null;

  caricamento = false;
  messaggioErrore = '';
  messaggioSuccesso = '';

  totaleCarrello = 0;
  numeroArticoliCarrello = 0;
  checkoutInCorso = false;

  constructor(
    private carrelloService: CarrelloService,
    private utenteStorageService: UtenteStorageService,
    private ordineService: OrdineService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.recuperaUtente();
    this.recuperaCarrello();
  }

  recuperaUtente(): void {
    this.utente = this.utenteStorageService.recuperaUtente();

    if (!this.utente) {
      this.messaggioErrore =
        'Devi effettuare il login per visualizzare il carrello';
    }
  }

  recuperaCarrello(): void {
    if (!this.utente) {
      return;
    }

    this.caricamento = true;
    this.messaggioErrore = '';

    this.carrelloService.recuperaCarrelloUtente(this.utente.id).subscribe({
      next: (elementiCarrello) => {
        this.elementiCarrello = elementiCarrello;
        this.aggiornaTotali();
        this.caricamento = false;
      },
      error: (errore) => {
        this.messaggioErrore =
          errore.error?.messaggio || 'Errore durante il recupero del carrello';
        this.caricamento = false;
      },
    });
  }

  aumentaQuantita(elemento: CarrelloResponse): void {
    this.modificaQuantita(elemento, elemento.quantita + 1);
  }

  diminuisciQuantita(elemento: CarrelloResponse): void {
    const nuovaQuantita = elemento.quantita - 1;

    if (nuovaQuantita <= 0) {
      this.rimuoviProdotto(elemento);
      return;
    }

    this.modificaQuantita(elemento, nuovaQuantita);
  }

  modificaQuantita(elemento: CarrelloResponse, nuovaQuantita: number): void {
    if (!this.utente) {
      return;
    }

    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    this.carrelloService
      .modificaQuantitaProdotto(
        this.utente.id,
        elemento.idProdotto,
        nuovaQuantita,
      )
      .subscribe({
        next: (elementiCarrello) => {
          this.elementiCarrello = elementiCarrello;
          this.aggiornaTotali();
        },
        error: (errore) => {
          this.messaggioErrore =
            errore.error?.messaggio || 'Errore durante la modifica quantita';
        },
      });
  }

  rimuoviProdotto(elemento: CarrelloResponse): void {
    if (!this.utente) {
      return;
    }

    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    this.carrelloService
      .rimuoviProdottoDalCarrello(this.utente.id, elemento.idProdotto)
      .subscribe({
        next: (elementiCarrello) => {
          this.elementiCarrello = elementiCarrello;
          this.aggiornaTotali();
          this.messaggioSuccesso = 'Prodotto rimosso dal carrello';
        },
        error: (errore) => {
          this.messaggioErrore =
            errore.error?.messaggio || 'Errore durante la rimozione prodotto';
        },
      });
  }

  svuotaCarrello(): void {
    if (!this.utente) {
      return;
    }

    this.carrelloService.svuotaCarrello(this.utente.id).subscribe({
      next: () => {
        this.elementiCarrello = [];
        this.aggiornaTotali();
        this.messaggioSuccesso = 'Carrello svuotato';
      },
      error: (errore) => {
        this.messaggioErrore =
          errore.error?.messaggio || 'Errore durante lo svuotamento carrello';
      },
    });
  }

  aggiornaTotali(): void {
    if (this.elementiCarrello.length === 0) {
      this.totaleCarrello = 0;
      this.numeroArticoliCarrello = 0;
      return;
    }

    this.totaleCarrello = this.elementiCarrello[0].totaleCarrello;
    this.numeroArticoliCarrello =
      this.elementiCarrello[0].numeroArticoliCarrello;
  }
  effettuaCheckout(): void {
    if (!this.utente) {
      this.messaggioErrore =
        'Devi effettuare il login per completare il pagamento';
      return;
    }
    if (this.elementiCarrello.length === 0) {
      this.messaggioErrore = 'Il carrello e vuoto';
      return;
    }
    this.checkoutInCorso = true;
    this.messaggioErrore = '';
    this.messaggioErrore = '';

    this.ordineService.effettuaCheckout(this.utente.id).subscribe({
      next: (ordine) => {
        const utenteAggiornato = {
          ...this.utente!,
          saldo: ordine.saldoResiduo,
        };
        this.utenteStorageService.salvaUtente(utenteAggiornato);

        this.elementiCarrello = [];
        this.aggiornaTotali();
        this.checkoutInCorso = false;

        this.router.navigate(['/pagamento-completato'], {
          state: { ordine },
        });
      },
      error: (errore) => {
        this.messaggioErrore =
          errore.error?.messaggio || 'Errore durante il checkout';
        this.checkoutInCorso = false;
      },
    });
  }
}
