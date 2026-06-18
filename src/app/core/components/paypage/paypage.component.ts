import { Component } from '@angular/core';
import { UtenteService } from '../../services/utente.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { UtenteModel } from '../../interfaces/utente.model';

@Component({
  selector: 'app-paypage',
  templateUrl: './paypage.component.html',
  styleUrls: ['./paypage.component.scss']
})
export class PaypageComponent {
  constructor(
    private router: Router,
    private orderService: OrderService,
    private authService: UtenteService)
  {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as any;

    this.orderId = history.state?.orderId;
    this.total = history.state?.total ?? 0;

    this.user = this.authService.currentUser;
  }

  user: UtenteModel | null;
  orderId!: number;
  total!: number;
  loading = false;
  error = '';
  status: 'idle' | 'processing' | 'success' | 'error' = 'idle';

  countdown = 3;
  locked = false;

  retryCount = 0;
  maxRetry = 2;

  startPayment(): void {
    if (this.locked) return;

    this.locked = true;
    this.status = 'processing';
    this.countdown = 3;

    this.runCountdown();
  }

  runCountdown(): void {
    const interval = setInterval(() => {

      this.countdown--;

      if (this.countdown <= 0) {
        clearInterval(interval);
        this.confirmPayment();
      }

    }, 1000);
  }

  confirmPayment(): void {
    if (!this.user?.id || !this.orderId) return;

    this.loading = true;
    this.error = '';

    this.orderService.pay(this.user.id, this.orderId).subscribe({
      next: (res) => {
        this.loading = false;

        this.router.navigate(['/ordine-confermato'], {
          state: {
            orderId: res.orderId,
            total: this.total
          }
        });
      },
      error: (err) => {
        if (this.retryCount < this.maxRetry) {
          this.retryCount++;
          this.countdown = 2;
          this.runCountdown();
        } else {
          this.status = 'error';
          this.locked = false;
        }
      }
    });
  }
}
