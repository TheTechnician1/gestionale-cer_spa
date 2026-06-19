import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ProdottoResponse } from '../../models/prodotto-response';
import { CarrelloService } from '../../services/carrello.service';
import { PreferitoService } from '../../services/preferito.service';
import { ProdottoService } from '../../services/prodotto.service';
import { ToastService } from '../../services/toast.service';
import { UtenteStorageService } from '../../services/utente-storage.service';

@Component({
  selector: 'app-dettaglio-prodotto',
  templateUrl: './dettaglio-prodotto.component.html',
  styleUrls: ['./dettaglio-prodotto.component.scss'],
})
export class DettaglioProdottoComponent implements OnInit {
  prodotto?: ProdottoResponse;
  prodottoPreferito = false;
  caricamento = false;
  messaggioErrore = '';
  messaggioSuccesso = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private prodottoService: ProdottoService,
    private carrelloService: CarrelloService,
    private preferitoService: PreferitoService,
    private utenteStorageService: UtenteStorageService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    const idProdotto = Number(this.activatedRoute.snapshot.paramMap.get('idProdotto'));

    if (!idProdotto) {
      this.router.navigate(['/prodotti']);
      return;
    }

    this.recuperaProdotto(idProdotto);
    this.verificaPreferito(idProdotto);
  }

  aggiungiAlCarrello(): void {
    if (!this.prodotto) {
      return;
    }

    if (this.prodotto.quantitaDisponibile <= 0) {
      this.toastService.mostraErrore('Prodotto non disponibile');
      return;
    }

    const utente = this.utenteStorageService.recuperaUtente();

    if (!utente) {
      this.router.navigate(['/login']);
      return;
    }

    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    this.carrelloService
      .aggiungiProdottoAlCarrello(utente.id, this.prodotto.idProdotto, 1)
      .subscribe({
        next: () => {
          if (this.prodotto) {
            this.prodotto.quantitaDisponibile = Math.max(this.prodotto.quantitaDisponibile - 1, 0);
          }

          this.messaggioSuccesso = 'Prodotto aggiunto al carrello';
          this.toastService.mostraSuccesso('Prodotto aggiunto al carrello');
        },
        error: (errore) => {
          this.messaggioErrore =
            errore.error?.messaggio || 'Errore durante aggiunta al carrello';
        this.toastService.mostraErrore(this.messaggioErrore, errore.status);
        },
      });
  }

  gestisciPreferito(): void {
    if (!this.prodotto) {
      return;
    }

    const utente = this.utenteStorageService.recuperaUtente();

    if (!utente) {
      this.router.navigate(['/login']);
      return;
    }

    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    const richiesta = this.prodottoPreferito
      ? this.preferitoService.rimuoviProdottoDaiPreferiti(
          utente.id,
          this.prodotto.idProdotto,
        )
      : this.preferitoService.aggiungiProdottoAiPreferiti(
          utente.id,
          this.prodotto.idProdotto,
        );

    richiesta.subscribe({
      next: (prodottiPreferiti) => {
        this.prodottoPreferito = prodottiPreferiti.some(
          (prodotto) => prodotto.idProdotto === this.prodotto?.idProdotto,
        );
        this.messaggioSuccesso = this.prodottoPreferito
          ? 'Prodotto aggiunto ai preferiti'
          : 'Prodotto rimosso dai preferiti';
        this.toastService.mostraSuccesso(this.messaggioSuccesso);
      },
      error: (errore) => {
        this.messaggioErrore =
          errore.error?.messaggio || 'Errore durante la gestione dei preferiti';
        this.toastService.mostraErrore(this.messaggioErrore, errore.status);
      },
    });
  }

  private recuperaProdotto(idProdotto: number): void {
    this.caricamento = true;
    this.messaggioErrore = '';

    this.prodottoService.recuperaProdottoPerId(idProdotto).subscribe({
      next: (prodotto) => {
        this.prodotto = prodotto;
        this.caricamento = false;
      },
      error: (errore) => {
        this.messaggioErrore =
          errore.error?.messaggio || 'Errore durante il recupero del prodotto';
        this.toastService.mostraErrore(this.messaggioErrore, errore.status);
        this.caricamento = false;
      },
    });
  }

  private verificaPreferito(idProdotto: number): void {
    const utente = this.utenteStorageService.recuperaUtente();

    if (!utente) {
      return;
    }

    this.preferitoService.recuperaProdottiPreferitiUtente(utente.id).subscribe({
      next: (prodottiPreferiti) => {
        this.prodottoPreferito = prodottiPreferiti.some(
          (prodotto) => prodotto.idProdotto === idProdotto,
        );
      },
    });
  }
}


