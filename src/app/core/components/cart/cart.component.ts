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
  isGuest = false;

  displayedColumns: string[] = [
  'image',
  'name',
  'price',
  'quantity',
  'subtotal',
  'remove'
  ];

  ngOnInit(): void {
    this.cart$ = this.cartService.cart$;

    this.authService.user$.subscribe(user => {
      if (!user?.id) return;

      this.userId = user.id;
      this.isGuest = this.authService.isGuest(user);

      if (!this.isGuest) {
        this.cartService.refreshCartState(this.userId).subscribe();
      }
    });
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

      if (this.isGuest) {
        this.cartService.updateGuestItem(item.productId!, request.quantity);
        return;
      }

      this.cartService
        .updateItem(this.userId, item.id!, request)
        .subscribe();
    })
  }

  decrease(item: CartItem) {
    const newQty = (item.quantita ?? 0) - 1;
    if (this.isGuest) {
      this.cartService.updateGuestItem(item.productId!, newQty);
      return;
    }

    if (newQty <= 0) {
      this.cartService.remove(this.userId, item.id!).subscribe();
      return;
    }

    const request = { productId: item.productId, quantity: newQty };
    this.cartService.updateItem(this.userId, item.id!, request).subscribe();
  }

  removeItem(item: CartItem) {
    if (this.isGuest) {
      this.cartService.removeGuestItem(item.productId!);
      return;
    }

    this.cartService.remove(this.userId, item.id!).subscribe();
  }

  getTotal(items: CartItem[] | null): number {
    return (items ?? []).reduce(
      (sum, item) => sum + (item.totaleRiga ?? 0),
      0
    );
  }

  getTotalSaved(items: CartItem[] | null): number {
    return (items ?? []).reduce((sum, item) => {
      if (!item.sconto || !item.prezzoOriginale || !item.prezzoUnitario) return sum;
      return sum + ((item.prezzoOriginale - item.prezzoUnitario) * (item.quantita ?? 0));
    }, 0);
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
