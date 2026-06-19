import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { UserService } from '../services/user.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Order } from 'src/app/core/interfaces/order.interface';
import { UserResponse } from 'src/app/core/interfaces/user-response.interface';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.scss'],
})
export class ProfiloComponent implements OnInit {
  utente: UserResponse | null = null;
  ordini: Order[] = [];
  userId: number = 0;
  importoSaldo: number = 0;
  showSaldo = false;
  ordinamento: 'asc' | 'desc' = 'desc';

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const utenteStorage = JSON.parse(
      localStorage.getItem('utente') ||
        sessionStorage.getItem('utente') ||
        '{}',
    );
    this.userId = utenteStorage.id;
    this.utente = utenteStorage;
    this.caricaOrdini();
  }

  caricaOrdini(): void {
    this.orderService.listaOrdini(this.userId).subscribe({
      next: (ordini) => (this.ordini = ordini),
      error: () => this.toast.error('Errore nel caricamento degli ordini'),
    });
  }

  downloadPdf(orderId: number): void {
    this.orderService.downloadPdf(orderId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'ricevuta.pdf';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: () => this.toast.error('Errore nel download del PDF'),
    });
  }

  aggiungiSaldo(): void {
    if (this.importoSaldo <= 0) {
      this.toast.error('Inserisci un importo positivo');
      return;
    }
    const decimali = this.importoSaldo.toString().split('.')[1];
    if (decimali && decimali.length > 2) {
      this.toast.error('Puoi inserire al massimo 2 cifre decimali');
      return;
    }
    this.userService.aggiungiSaldo(this.userId, this.importoSaldo).subscribe({
      next: () => {
        this.toast.success('Saldo aggiornato');
        if (this.utente) {
          this.utente.saldo += this.importoSaldo;
          const storage = localStorage.getItem('utente') ? localStorage : sessionStorage;
          storage.setItem('utente', JSON.stringify(this.utente));
        }
        this.importoSaldo = 0;
      },
      error: () => this.toast.error('Errore aggiornamento saldo'),
    });
  }

  toggleOrdinamento(): void {
    this.ordinamento = this.ordinamento === 'asc' ? 'desc' : 'asc';
    this.ordini.sort((a, b) => {
      const dateA = new Date(a.dataOrdine).getTime();
      const dateB = new Date(b.dataOrdine).getTime();
      return this.ordinamento === 'asc' ? dateA - dateB : dateB - dateA;
    });
  }
}