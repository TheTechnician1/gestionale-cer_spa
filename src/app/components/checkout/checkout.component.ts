import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Order } from 'src/app/core/interfaces/order.interface';
import { CartService } from '../services/cart.service';
import { RicevutaDialogComponent } from '../ricevuta-dialog/ricevuta-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  ordine: Order | null = null;
  userId: number = 0;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private toast: ToastService,
    private cartService: CartService,
    private dialog:MatDialog
  ) {}

  ngOnInit(): void {
    const utente = JSON.parse(
      localStorage.getItem('utente') ||
        sessionStorage.getItem('utente') ||
        '{}',
    );
    this.userId = utente.id;
  }

  eseguiCheckout(): void {
    this.orderService.checkout(this.userId).subscribe({
      next: (ordine) => {
        this.ordine = ordine;
        this.cartService.svuotaCarrello();

        const storage = localStorage.getItem('utente')
          ? localStorage
          : sessionStorage;
        const utente = JSON.parse(storage.getItem('utente') || '{}');
        utente.saldo = utente.saldo - ordine.totaleOrdine;
        storage.setItem('utente', JSON.stringify(utente));

        this.toast.success('Ordine completato con successo');
      },
      error: () => {
        this.toast.error('Errore durante il checkout');
      },
    });
  }

  downloadPdf(): void {
  if (!this.ordine) return;
  this.orderService.downloadPdf(this.ordine.id).subscribe({
    next: (blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ricevuta.pdf';
      a.click();
      window.URL.revokeObjectURL(url);
      this.apriDialog('pdf');
    },
    error: () => this.toast.error('Errore nel download del PDF'),
  });
}

inviaEmail(): void {
  if (!this.ordine) return;
  this.orderService.inviaEmail(this.ordine.id).subscribe({
    next: () => this.apriDialog('email'),
    error: () => this.toast.error('Errore nell invio email'),
  });
}

  torna(): void {
    this.router.navigate(['/prodotti']);
  }

  private apriDialog(tipo: 'pdf' | 'email'): void {
    const dialogRef = this.dialog.open(RicevutaDialogComponent, {
      width: '400px',
      data: { tipo },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate(['/prodotti']);
    });
  }
}
