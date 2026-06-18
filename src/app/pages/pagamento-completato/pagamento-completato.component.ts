import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { OrdineResponse } from '../../models/ordine-response';
import { OrdineService } from '../../services/ordine.service';
import { ToastService } from '../../services/toast.service';

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
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.ordine = history.state.ordine || null;

    if (!this.ordine) {
      this.router.navigate(['/carrello']);
      return;
    }

    this.toastService.mostraSuccesso('Pagamento completato');
    this.toastService.mostraSuccesso('Transazione riuscita');
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
      error: (errore) => {
        this.messaggioErrore = 'Errore durante il download della ricevuta';
        this.toastService.mostraErrore(this.messaggioErrore, errore.status);
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
        this.toastService.mostraSuccesso('Ricevuta inviata via email');
      },
      error: (errore) => {
        this.messaggioErrore = 'Errore durante invio ricevuta email';
        this.toastService.mostraErrore(this.messaggioErrore, errore.status);
      },
    });
  }
}
