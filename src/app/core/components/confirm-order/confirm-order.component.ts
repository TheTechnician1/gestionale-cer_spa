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
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as any;

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

    this.orderService.completeOrder(this.userId, this.orderId).subscribe({
      next: (res) => {
        console.log("Ordine completato:", res);
      },
      error: (err) => {
        console.error("Errore completamento ordine:", err);
      }
    });
  }

  viewOrder(): void {
    this.router.navigate(['/ricevuta-ordine', this.order.code]);
  }
}
