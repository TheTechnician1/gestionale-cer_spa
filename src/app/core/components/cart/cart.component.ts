import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart, CartItem} from '../../interfaces/cart.model';
import { Observable, tap } from 'rxjs';
import { UtenteService } from '../../services/utente.service';
import { Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
    private authService: UtenteService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}
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
    this.cart$ = this.cartService.getCart(this.userId).pipe(
      tap(cart => {
        if (!cart.items) cart.items = [];
        this.cartService.hydrateFromCart(cart);
      })
    );
  }

  details(id: number) {
    this.router.navigateByUrl(`/prodotto/${id}`);
  }

  increase(item: CartItem) {
    this.productService.getProductById(item.productId!).subscribe(product => {
      const quantitaDisponibile = product.quantita;

      if (item.quantita! >= quantitaDisponibile!) {
        this.snackBar.open("Quantità massima disponibile raggiunta", "OK", { duration: 2000 });
        return;
      }

      const request = {
        productId: item.productId,
        quantity: item.quantita! + 1
      };

      this.cartService
        .updateItem(this.userId, item.id!, request)
        .subscribe(() => this.loadCart());
    });
  }

  decrease(item: CartItem) {
    const newQty = (item.quantita ?? 0) - 1;
    if (newQty <= 0) {
      const request = { productId: item.productId, quantity: 0 };
      this.cartService.remove(this.userId, item.id!).subscribe(() => this.loadCart());
      return;
    }

    const request = { productId: item.productId, quantity: newQty };
    this.cartService.updateItem(this.userId, item.id!, request).subscribe(() => this.loadCart());
  }

  removeItem(item: CartItem) {
    const request = { productId: item.productId, quantity: 0 };
    this.cartService.remove(this.userId, item.id!).subscribe(() => this.loadCart());
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
      this.router.navigate(['/login'], {
      queryParams: { returnUrl: '/checkout' }});
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
