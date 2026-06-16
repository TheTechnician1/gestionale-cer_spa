import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem} from '../../interfaces/cart.model';
import { Observable } from 'rxjs';
import { UtenteService } from '../../services/utente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  constructor(private cartService: CartService, private authService: UtenteService, private router: Router) {}
  cart$!: Observable<Cart>;
  userId!: number;

  displayedColumns: string[] = [
  'image',
  'name',
  'price',
  'quantity',
  'subtotal',
  'remove'
  ];

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      if (user) {
        this.userId = user.id!;
        this.loadCart();
      }
    });
  }

  loadCart(): void {
    this.cart$ = this.cartService.getCart(this.userId);
  }

  increase(item: CartItem) {
    const request = {
    productId: item.productId,
    quantity: item.quantita! + 1
  };
    this.cartService
      .updateItem(this.userId, item.id!, request)
      .subscribe(() => this.loadCart());
  }

  decrease(item: CartItem) {
    const request = {
    productId: item.productId,
    quantity: item.quantita! - 1
  };

    if (request.quantity <= 0) {
      this.removeItem(item);
      return;
    }

    this.cartService
      .updateItem(this.userId, item.id!, request)
      .subscribe(() => this.loadCart());
  }

  removeItem(item: CartItem) {
    this.cartService
      .remove(this.userId, item.id!)
      .subscribe(() => this.loadCart());
  }

  getTotal(items: CartItem[] | null): number {
    return (items ?? []).reduce(
      (sum, item) => sum + (item.totaleRiga ?? 0),
      0
    );
  }
  goToCheckout(cart: Cart): void {
    const user = this.authService.currentUser;

    if (user?.id === 26) {
      this.cartService.saveGuestCart(cart.items ?? []);
      this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/checkout' }});
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
