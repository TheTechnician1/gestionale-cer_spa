import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { UtenteService } from '../../services/utente.service';
import { UtenteModel } from '../../interfaces/utente.model';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss']
})
export class ConfirmOrderComponent {
  constructor(private router: Router, private orderService: OrderService, private authService: UtenteService) {
    this.orderId = history.state?.orderId;
    this.total = history.state?.total ?? 0;

    this.user = this.authService.currentUser;
  }
  user: UtenteModel | null;
  orderId!: number;
  total!: number;
  order = {
    code: '',
    total: 0
  };
  userId!: number;

  ngOnInit(): void {
    this.loadOrder();
  }

  loadOrder() {
    this.user = this.authService.currentUser;
    this.userId = this.user?.id!;

    this.orderId = history.state.orderId;
    this.total = history.state.total ?? 0;

    const savedOrder = localStorage.getItem('lastOrder');
    if (savedOrder) {
      this.order = JSON.parse(savedOrder);
    }

    if (!this.orderId) {
      console.error('orderId non presente');
      return;
    }

    localStorage.setItem('lastOrderId', String(this.orderId));

    this.orderService.completeOrder(this.userId, this.orderId).subscribe({
      next: (res) => {
        console.log("Ordine completato:", res);
        this.loadOrderDetails();
      },
      error: (err) => {
        console.error("Errore completamento ordine:", err);
        this.loadOrderDetails();
      }
    });
  }

  loadOrderDetails(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = {
          code: order.codiceOrdine ?? order.code ?? String(this.orderId),
          total: order.totaleOrdine ?? order.total ?? this.total
        };
        localStorage.setItem('lastOrder', JSON.stringify(this.order));
        localStorage.setItem('lastOrderId', String(this.orderId));
      },
      error: (err) => {
        console.error("Errore caricamento ordine:", err);
        this.order = {
          code: String(this.orderId),
          total: this.total
        };
      }
    });
  }

  viewOrder(): void {
    this.router.navigate(['/ricevuta-ordine'], {
      state: {
        orderId: this.orderId,
        total: this.total
      }
    });
  }

  backToShop() {
    this.router.navigate(['/'], {
      state: {
        orderId: this.orderId,
        total: this.total
      }
    });
  }
}
