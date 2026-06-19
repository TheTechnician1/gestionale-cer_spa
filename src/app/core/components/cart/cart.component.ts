import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Cart } from '../../interfaces/cart.model';
import { CartItem } from '../../interfaces/cart-item.model';
import { User } from '../../interfaces/user.model';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cart!: Cart;
  loading = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser;
    if (!user) return;

    this.loadCart(user.id);
  }

  loadCart(userId: number) {
    this.loading = true;

    this.cartService.getCart(userId).subscribe({
      next: (res) => {
        this.cart = res;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  increase(item: CartItem) {
  this.cartService.updateCartItem(item.id, item.quantita + 1)
    .subscribe(res => this.cart = res);
  }

  decrease(item: CartItem) {
    if (item.quantita <= 1) {
      this.remove(item);
      return;
    }
    this.cartService.updateCartItem(item.id, item.quantita - 1)
      .subscribe(res => this.cart = res);
  }

  remove(item: CartItem) {
    this.cartService.removeCartItem(item.id)
      .subscribe(res => this.cart = res);
  }

}