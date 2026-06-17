import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrdineResponse } from '../../models/ordine-response';
import { OrdineService } from '../../services/ordine.service';

@Component({
  selector: 'app-pagamento-completato',
  templateUrl: './pagamento-completato.component.html',
  styleUrls: ['./pagamento-completato.component.scss'],
})
export class PagamentoCompletatoComponent implements OnInit {
  ordine: OrdineResponse | null = null;
  messaggioErrore = '';
  messaggioSuccesso = '';

  constructor(
    private router: Router,
    private ordineService: OrdineService,
  ) {}

  ngOnInit(): void {
    this.ordine = history.state.ordine || null;

    if (!this.ordine) {
      this.router.navigate(['/carrello']);
    }
  }

  scaricaRicevuta(): void {
    if (!this.ordine) {
      return;
    }

    this.ordineService.scaricaRicevutaPdf(this.ordine.idOrdine).subscribe({
      next: (pdf) => {
        const url = window.URL.createObjectURL(pdf);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ricevuta-${this.ordine?.codiceOrdine}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => {
        this.messaggioErrore = 'Errore durante il download della ricevuta';
      },
    });
  }

  inviaRicevutaEmail(): void {
    if (!this.ordine) {
      return;
    }

    this.ordineService.inviaRicevutaEmail(this.ordine.idOrdine).subscribe({
      next: () => {
        this.messaggioSuccesso = 'Ricevuta inviata via email';
      },
      error: () => {
        this.messaggioErrore = 'Errore durante invio ricevuta email';
      },
    });
  }
}
