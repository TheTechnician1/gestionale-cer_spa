import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Cart, CartItem, User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ErrorService } from '../../services/error.service';
import { I18nService } from '../../services/i18n.service';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.scss']
})
export class CartPage implements OnInit {
  cart: Cart = { id: 0, userId: 0, totalItems: 0, totalAmount: 0, items: [] };
  user: User | null = null;
  error = '';

  constructor(
    private readonly auth: AuthService,
    private readonly cartService: CartService,
    private readonly products: ProductService,
    readonly i18n: I18nService,
    private readonly errors: ErrorService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser();
    this.cartService.cart$.subscribe((cart) => this.cart = cart);
    if (this.user) {
      this.cartService.load(this.user.id).subscribe({ error: (err) => this.error = this.errors.friendly(err) });
    }
  }

  change(item: CartItem, quantita: number): void {
    if (!this.user) return;
    this.error = '';
    if (quantita <= 0) {
      this.remove(item);
      return;
    }
    this.cartService.update(this.user.id, item.id, quantita).subscribe({ error: (err) => this.error = this.errors.friendly(err) });
  }

  remove(item: CartItem): void {
    if (!this.user) return;
    this.cartService.remove(this.user.id, item.id).subscribe({ error: (err) => this.error = this.errors.friendly(err) });
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
