import { Component } from '@angular/core';
import { Prodotto } from '../../interfaces/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtenteService } from '../../services/utente.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private productService: ProductService, private authService: UtenteService, private cartService: CartService, private route: Router, private snackBar: MatSnackBar) { }
  productsByCategory: Prodotto[] = [];
  categoria!: string | null;

  ngOnInit() {
    this.productService.getAllProducts().subscribe(products => {
      const map = new Map<string, Prodotto>();

      products.forEach(p => {
        if (!map.has(p.categoria!)) {
          map.set(p.categoria!, p);
        }
      });

      this.productsByCategory = Array.from(map.values());
    });
  }

  getAvailable(product: Prodotto): number {
    const inCart = this.cartService.getCartState(product.id!);
    return product.quantita! - inCart;
  }

  reloadProducts() {
    this.productService.getAllProducts().subscribe(products => {
      this.productsByCategory = products;
    });
  }

  details(id: number) {
    this.route.navigateByUrl(`/prodotto/${id}`);
  }

  addToCart(product: Prodotto) {
    const user = this.authService.currentUser;
    const available = this.getAvailable(product);

    if (available <= 0) {
      this.snackBar.open(
        'Quantità non disponibile',
        'OK',
        { duration: 2000 }
      );
      return;
    }

    if(user?.id === 26) {
      this.cartService.addGuestItem({
        productId: product.id!,
        quantita: 1
      } as any);
        this.snackBar.open(
        `${product.nomeProdotto} aggiunto al carrello`,
        'OK',
        {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        }
      );
      return;
    }

    this.cartService.addItem(user!.id!, {
      productId: product.id,
      quantity: 1
    }).subscribe({
    next: () => {
      this.snackBar.open(
        `${product.nomeProdotto} aggiunto al carrello (rimasti: ${this.getAvailable(product)})`, 'OK',
        {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        }
      );
      this.reloadProducts();
    },
    error: () => {
      this.snackBar.open(
        'Errore durante l\'aggiunta al carrello',
        'OK',
        { duration: 3000 }
      );
    }});
  }
}
