import { Component, OnInit } from '@angular/core';

import { ProdottoResponse } from '../../models/prodotto-response';
import { PreferitoService } from '../../services/preferito.service';
import { ToastService } from '../../services/toast.service';
import { UtenteStorageService } from '../../services/utente-storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  prodottiPreferiti: ProdottoResponse[] = [];
  caricamentoPreferiti = false;
  messaggioErrorePreferiti = '';

  categorie = [
    { nome: 'Elettronica', immagine: 'elettronica.png' },
    { nome: 'Informatica', immagine: 'informatica.png' },
    { nome: 'Telefonia', immagine: 'telefono.png' },
    { nome: 'Casa e cucina', immagine: 'Casa e cucina.png' },
    { nome: 'Abbigliamento', immagine: 'abbigliamento.png' },
    { nome: 'Calzature', immagine: 'Calzature.png' },
    { nome: 'Sport e fitness', immagine: 'Sport e fitness.png' },
    { nome: 'Beauty care', immagine: 'Beauty care.png' },
    { nome: 'Giocattoli', immagine: 'Giocattoli.png' },
    { nome: 'Alimentari', immagine: 'alimentari.png' },
  ];

  constructor(
    private preferitoService: PreferitoService,
    private utenteStorageService: UtenteStorageService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.recuperaProdottiPreferiti();
  }

  rimuoviDaiPreferiti(idProdotto: number): void {
    const utente = this.utenteStorageService.recuperaUtente();

    if (!utente) {
      this.messaggioErrorePreferiti =
        'Devi effettuare il login per gestire i prodotti preferiti';
        this.toastService.mostraErrore(this.messaggioErrorePreferiti);
      return;
    }

    this.messaggioErrorePreferiti = '';

    this.preferitoService
      .rimuoviProdottoDaiPreferiti(utente.id, idProdotto)
      .subscribe({
        next: (prodottiPreferiti) => {
          this.prodottiPreferiti = prodottiPreferiti;
          this.toastService.mostraSuccesso('Prodotto rimosso dai preferiti');
        },
        error: (errore) => {
          this.messaggioErrorePreferiti =
            errore.error?.messaggio ||
            'Errore durante la rimozione del preferito';
        this.toastService.mostraErrore(this.messaggioErrorePreferiti);
        },
      });
  }

  private recuperaProdottiPreferiti(): void {
    const utente = this.utenteStorageService.recuperaUtente();

    if (!utente) {
      return;
    }

    this.caricamentoPreferiti = true;
    this.messaggioErrorePreferiti = '';

    this.preferitoService.recuperaProdottiPreferitiUtente(utente.id).subscribe({
      next: (prodottiPreferiti) => {
        this.prodottiPreferiti = prodottiPreferiti;
        this.caricamentoPreferiti = false;
      },
      error: () => {
        this.prodottiPreferiti = [];
        this.caricamentoPreferiti = false;
        this.messaggioErrorePreferiti =
          'Errore durante il recupero dei preferiti';
        this.toastService.mostraErrore(this.messaggioErrorePreferiti);
      },
    });
  }
}