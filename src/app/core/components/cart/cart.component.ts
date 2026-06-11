import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CartItem } from '../../interfaces/cart.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  constructor(private cartService: CartService) {}
  cartItems$!: Observable<CartItem[]>;

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
}
