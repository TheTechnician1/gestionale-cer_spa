import { Component } from '@angular/core';
import { Prodotto } from '../../interfaces/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';
import { UtenteService } from '../../services/utente.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  constructor(private route: ActivatedRoute, private authService: UtenteService, private productService: ProductService, private cartService: CartService, private snackBar: MatSnackBar) {}
  prodotto!: Prodotto | null;
  loading = true;
  quantity = 1;

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      this.loadProduct(id);
    });
  }

  getAvailable(product: Prodotto): number {
    return product.quantita! - this.cartService.getCartState(product.id!);
  }

  reloadProduct(id: number) {
    this.loadProduct(id, false);
  }

  private loadProduct(id: number, resetQuantity = true) {
    if (!id) {
      this.prodotto = null;
      this.loading = false;
      return;
    }

    this.loading = true;
    if (resetQuantity) {
      this.quantity = 1;
    }

    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.prodotto = data;
        this.loading = false;
      },
      error: () => {
        this.prodotto = null;
        this.loading = false;
      }
    });
  }

  addToCart(product: Prodotto) {
    const available = this.getAvailable(product);
    if(this.quantity > available) {
      this.snackBar.open(
        `Disponibili solo ${product.quantita} pezzi`,
        'OK',
        { duration: 3000 }
      );
      return;
    }
    const user = this.authService.currentUser;

    if (this.authService.isGuest(user)) {
      this.cartService.addGuestProduct(product, this.quantity);
      this.snackBar.open(`${product.nomeProdotto} aggiunto al carrello ${this.quantity}`, 'OK',
        {
          duration: 2500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        }
      );
      return;
    }

    this.cartService.addItem(user!.id!, { productId: product.id, quantity: this.quantity }).subscribe({
      next: () => {
        this.snackBar.open(`${product.nomeProdotto} aggiunto al carrello ${this.quantity}`, 'OK',
          {
            duration: 2500,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success']
          }
        );
        this.reloadProduct(product.id!);
      },
      error: () => {
        this.snackBar.open(
          'Errore durante l\'aggiunta al carrello',
          'OK',
          { duration: 3000 }
        );
      }
    });
  }
}
