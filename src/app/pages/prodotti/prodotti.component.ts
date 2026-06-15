import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ProdottoResponse } from '../../models/prodotto-response';
import { ProdottoService } from '../../services/prodotto.service';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.scss'],
})
export class ProdottiComponent implements OnInit {
  prodotti: ProdottoResponse[] = [];
  nomeCategoria = '';
  caricamento = false;
  messaggioErrore = '';

  constructor(
    private prodottoService: ProdottoService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const categoria = params.get('nomeCategoria');

      if (categoria) {
        this.nomeCategoria = categoria;
        this.recuperaProdottiPerCategoria(categoria);
      } else {
        this.nomeCategoria = '';
        this.recuperaProdotti();
      }
    });
  }

  recuperaProdotti(): void {
    this.caricamento = true;
    this.messaggioErrore = '';

    this.prodottoService.recuperaProdotti().subscribe({
      next: (prodotti) => {
        this.prodotti = prodotti;
        this.caricamento = false;
      },
      error: () => {
        this.messaggioErrore = 'Errore durante il recupero dei prodotti';
        this.caricamento = false;
      },
    });
  }

  recuperaProdottiPerCategoria(nomeCategoria: string): void {
    this.caricamento = true;
    this.messaggioErrore = '';

    this.prodottoService.recuperaProdottiPerCategoria(nomeCategoria).subscribe({
      next: (prodotti) => {
        this.prodotti = prodotti;
        this.caricamento = false;
      },
      error: () => {
        this.messaggioErrore =
          'Errore durante il recupero dei prodotti della categoria';
        this.caricamento = false;
      },
    });
  }
}
