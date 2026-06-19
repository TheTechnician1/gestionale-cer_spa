import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Cart, CartItem, User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ErrorService } from '../../services/error.service';
import { I18nService } from '../../services/i18n.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss']
})
export class CheckoutPage implements OnInit {
  cart: Cart = { id: 0, userId: 0, totalItems: 0, totalAmount: 0, items: [] };
  user: User | null = null;
  loading = false;
  error = '';
  private readonly minimumLoaderMs = 950;

  constructor(
    private readonly auth: AuthService,
    private readonly cartService: CartService,
    private readonly orders: OrderService,
    private readonly products: ProductService,
    private readonly errors: ErrorService,
    readonly i18n: I18nService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser();
    this.cartService.cart$.subscribe((cart) => this.cart = cart);
    if (this.user) this.cartService.load(this.user.id).subscribe({ error: (err) => this.error = this.errors.friendly(err) });
  }

  checkout(): void {
    if (!this.user) return;
    if (!this.cart.items.length) {
      this.error = this.i18n.t('emptyCart');
      return;
    }
    this.loading = true;
    this.error = '';
    const startedAt = performance.now();
    this.orders.checkout(this.user.id).subscribe({
      next: (order) => {
        this.cartService.clearLocal();
        const remainingDelay = Math.max(250, this.minimumLoaderMs - (performance.now() - startedAt));
        setTimeout(() => this.router.navigate(['/order-completed', order.id]), remainingDelay);
      },
      error: (err) => {
        this.error = this.errors.friendly(err);
        this.loading = false;
      }
    });
  }

  imageFor(image?: string | null): string {
    return this.products.imageFor(image);
  }

  replaceImage(event: Event): void {
    (event.target as HTMLImageElement).src = this.products.placeholderImage;
  }

  trackById(_: number, item: CartItem): number {
    return item.id;
  }
}
