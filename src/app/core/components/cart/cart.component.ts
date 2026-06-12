import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem, CartItemExtended } from '../../interfaces/cart.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  constructor(private cartService: CartService) {}
  cartItems$!: Observable<CartItemExtended[]>;

  displayedColumns: string[] = [
  'image',
  'name',
  'price',
  'quantity',
  'subtotal',
  'remove'
];

  ngOnInit(): void {
    this.cartItems$ = this.cartService.cartItems$;
    const raw = localStorage.getItem('pendingDiscount');
    if (raw) {
      const payload = JSON.parse(raw);
      localStorage.removeItem('pendingDiscount');
    }
  }

  increase(item: CartItem) {
    this.cartService.increase(item.productId!);
  }

  decrease(item: CartItem) {
    this.cartService.decrease(item.productId!);
  }

  remove(item: CartItem) {
    this.cartService.remove(item.productId!);
  }

  clearCart() {
    this.cartService.clear();
  }

  getTotal(items: CartItem[]): number {
    return items.reduce((tot, item) => tot + item.prezzo! * item.quantita!, 0);
  }

  hasAnyOriginalPrice(items: CartItemExtended[] | null | undefined): boolean {
    if (!items || items.length === 0) {
      return false;
    }
    return items.some(i => i.prezzoOriginale != null);
  }

  getTotalSavings(items: CartItemExtended[]): number {
    return items.reduce((tot, item) => {
      if (item.prezzoOriginale != null && item.prezzo != null) {
        const diff = item.prezzoOriginale - item.prezzo!;
        return tot + diff * item.quantita!;
      }
      return tot;
    }, 0);
  }
}
