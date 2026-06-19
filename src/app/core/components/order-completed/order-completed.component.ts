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
    this.orderId = this.resolveOrderId();
    this.user = this.authService.currentUser;
  }
  user: UtenteModel | null;
  orderId!: number;
  order: any = null;
  userId!: number;

  ngOnInit(): void {
    const user = this.authService.currentUser;
    this.userId = user?.id!;
    this.orderId = this.resolveOrderId();

    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      this.order = JSON.parse(savedOrder);
      return;
    }

    if (this.orderId) {
      this.orderService.getOrderById(this.orderId).subscribe({
        next: (order) => {
          this.order = {
            code: order.codiceOrdine ?? order.code ?? String(this.orderId),
            total: order.totaleOrdine ?? order.total ?? history.state?.total ?? 0
          };
          localStorage.setItem('lastOrder', JSON.stringify(this.order));
        },
        error: (err) => {
          console.error("Errore caricamento ordine:", err);
        }
      });
    }
  }

  private resolveOrderId(): number {
    const stateOrderId = Number(history.state?.orderId);
    if (stateOrderId) return stateOrderId;

    const savedOrderId = Number(localStorage.getItem('lastOrderId'));
    return savedOrderId || 0;
  }

  sendEmail(): void {
    this.orderId = this.resolveOrderId();
    if (!this.orderId) {
      console.error("orderId non presente per invio email");
      return;
    }

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
    this.orderId = this.resolveOrderId();
    if (!this.orderId) {
      console.error("orderId non presente per download PDF");
      return;
    }

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
