import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs';

import { ProdottoResponse } from '../../models/prodotto-response';
import { ProdottoService } from '../../services/prodotto.service';
import { CarrelloService } from 'src/app/services/carrello.service';
import { PreferitoService } from 'src/app/services/preferito.service';
import { ToastService } from '../../services/toast.service';
import { UtenteStorageService } from '../../services/utente-storage.service';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.scss'],
})
export class ProdottiComponent implements OnInit {
  prodotti: ProdottoResponse[] = [];
  idProdottiPreferiti = new Set<number>();
  nomeCategoria = '';
  testoRicerca = '';
  caricamento = false;
  messaggioErrore = '';
  messaggioSuccesso = '';

  constructor(
    private prodottoService: ProdottoService,
    private activatedRoute: ActivatedRoute,
    private carrelloService: CarrelloService,
    private preferitoService: PreferitoService,
    private utenteStorageService: UtenteStorageService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.recuperaPreferitiUtente();

    combineLatest([
      this.activatedRoute.paramMap,
      this.activatedRoute.queryParamMap,
    ]).subscribe(([params, queryParams]) => {
      const categoria = params.get('nomeCategoria');
      const ricerca = queryParams.get('nome') || queryParams.get('ricerca');

      this.gestisciCaricamentoProdotti(categoria, ricerca);
    });
  }

  recuperaProdotti(): void {
    this.caricamento = true;
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    this.prodottoService.recuperaProdotti().subscribe({
      next: (prodotti) => {
        this.prodotti = prodotti;
        this.caricamento = false;
      },
      error: () => {
        this.prodotti = [];
        this.messaggioErrore = 'Errore durante il recupero dei prodotti';
        this.toastService.mostraErrore(this.messaggioErrore);
        this.caricamento = false;
      },
    });
  }

  recuperaProdottiPerCategoria(nomeCategoria: string): void {
    this.caricamento = true;
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    this.prodottoService.recuperaProdottiPerCategoria(nomeCategoria).subscribe({
      next: (prodotti) => {
        this.prodotti = prodotti;
        this.caricamento = false;
      },
      error: () => {
        this.prodotti = [];
        this.messaggioErrore =
          'Errore durante il recupero dei prodotti della categoria';
        this.toastService.mostraErrore(this.messaggioErrore);
        this.caricamento = false;
      },
    });
  }

  cercaProdotti(nome: string): void {
    this.caricamento = true;
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    this.prodottoService.cercaProdottiPerNome(nome).subscribe({
      next: (prodotti) => {
        this.prodotti = prodotti;
        this.caricamento = false;
      },
      error: (errore) => {
        console.error('Errore ricerca prodotti', errore);
        this.prodotti = [];
        this.messaggioErrore =
          errore.error?.messaggio ||
          `Errore durante la ricerca dei prodotti. Status: ${errore.status}`;
        this.toastService.mostraErrore(this.messaggioErrore, errore.status);
        this.caricamento = false;
      },
    });
  }

  recuperaTitoloPagina(): string {
    if (this.testoRicerca) {
      return 'Risultati per ' + this.testoRicerca;
    }

    if (this.nomeCategoria) {
      return this.nomeCategoria;
    }

    return 'Tutti i prodotti';
  }

  aggiungiAlCarrello(idProdotto: number): void {
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    const prodotto = this.prodotti.find((prodottoCorrente) => prodottoCorrente.idProdotto === idProdotto);

    if (prodotto && prodotto.quantitaDisponibile <= 0) {
      this.toastService.mostraErrore('Prodotto non disponibile');
      return;
    }

    const utente = this.recuperaUtenteLoggato();

    if (!utente) {
      this.messaggioErrore =
        'Devi effettuare il login per aggiungere prodotti al carrello';
        this.toastService.mostraErrore(this.messaggioErrore);
      return;
    }

    this.carrelloService
      .aggiungiProdottoAlCarrello(utente.id, idProdotto, 1)
      .subscribe({
        next: () => {
          if (prodotto) {
            prodotto.quantitaDisponibile = Math.max(prodotto.quantitaDisponibile - 1, 0);
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

  gestisciPreferito(idProdotto: number): void {
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    const utente = this.recuperaUtenteLoggato();

    if (!utente) {
      this.messaggioErrore =
        'Devi effettuare il login per gestire i prodotti preferiti';
        this.toastService.mostraErrore(this.messaggioErrore);
      return;
    }

    const eraPreferito = this.prodottoPreferito(idProdotto);
    const richiesta = eraPreferito
      ? this.preferitoService.rimuoviProdottoDaiPreferiti(utente.id, idProdotto)
      : this.preferitoService.aggiungiProdottoAiPreferiti(utente.id, idProdotto);

    richiesta.subscribe({
      next: (prodottiPreferiti) => {
        this.aggiornaPreferiti(prodottiPreferiti);
        this.messaggioSuccesso = eraPreferito
          ? 'Prodotto rimosso dai preferiti'
          : 'Prodotto aggiunto ai preferiti';
        this.toastService.mostraSuccesso(this.messaggioSuccesso);
      },
      error: (errore) => {
        this.messaggioErrore =
          errore.error?.messaggio || 'Errore durante la gestione dei preferiti';
        this.toastService.mostraErrore(this.messaggioErrore, errore.status);
      },
    });
  }

  prodottoPreferito(idProdotto: number): boolean {
    return this.idProdottiPreferiti.has(idProdotto);
  }

  private gestisciCaricamentoProdotti(
    categoria: string | null,
    ricerca: string | null,
  ): void {
    const ricercaPulita = ricerca?.trim() || '';

    if (categoria) {
      this.nomeCategoria = categoria;
      this.testoRicerca = '';
      this.recuperaProdottiPerCategoria(categoria);
      return;
    }

    if (ricercaPulita) {
      this.nomeCategoria = '';
      this.testoRicerca = ricercaPulita;
      this.cercaProdotti(ricercaPulita);
      return;
    }

    this.nomeCategoria = '';
    this.testoRicerca = '';
    this.recuperaProdotti();
  }

  private recuperaPreferitiUtente(): void {
    const utente = this.recuperaUtenteLoggato();

    if (!utente) {
      return;
    }

    this.preferitoService.recuperaProdottiPreferitiUtente(utente.id).subscribe({
      next: (prodottiPreferiti) => {
        this.aggiornaPreferiti(prodottiPreferiti);
      },
      error: () => {
        this.idProdottiPreferiti.clear();
      },
    });
  }

  private aggiornaPreferiti(prodottiPreferiti: ProdottoResponse[]): void {
    this.idProdottiPreferiti = new Set(
      prodottiPreferiti.map((prodotto) => prodotto.idProdotto),
    );
  }

  private recuperaUtenteLoggato() {
    return this.utenteStorageService.recuperaUtente();
  }
}

