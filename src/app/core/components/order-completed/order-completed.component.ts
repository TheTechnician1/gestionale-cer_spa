import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { UtenteService } from '../../services/utente.service';
import { UtenteModel } from '../../interfaces/utente.model';

@Component({
  selector: 'app-order-completed',
  templateUrl: './order-completed.component.html',
  styleUrls: ['./order-completed.component.scss']
})
export class OrderCompletedComponent {
  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: UtenteService
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as any;

    this.orderId = history.state?.orderId;
    this.user = this.authService.currentUser;
  }
  user: UtenteModel | null;
  orderId!: number;
  order: any = null;
  userId!: number;

  ngOnInit(): void {
    const user = this.authService.currentUser;
    this.userId = user?.id!;

    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      this.order = JSON.parse(savedOrder);
    }
  }

  sendEmail(): void {
    console.log("Invio email...");
    this.orderService.downloadPDF(this.orderId).subscribe({
      next: (res) => {
        console.log("Invio Email completato:", res);
      },
      error: (err) => {
        console.error("Errore completamento invio email:", err);
      }
    });
  }

  downloadPDF(): void {
    console.log("PDF in caricamento...");
    this.orderService.showOrderPDF(this.orderId).subscribe({
      next: (pdfBlob: Blob) => {
        console.log("Caricamento PDF completato:");
        const fileURL = URL.createObjectURL(pdfBlob);
        window.open(fileURL, '_blank');
      },
      error: (err) => {
        console.error("Errore nel caricamento PDF:", err);
      }
    });
  }
}
