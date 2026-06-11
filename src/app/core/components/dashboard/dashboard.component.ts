import { Component } from '@angular/core';
import { Prodotto } from '../../interfaces/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private productService: ProductService, private cartService: CartService, private route: Router, private snackBar: MatSnackBar) { }
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

  details(id: number) {
    this.route.navigateByUrl(`/prodotto/${id}`);
  }

  addToCart(product: Prodotto) {
    this.cartService.add(product);

    if (product.quantita && product.quantita > 0) {
      product.quantita--;
    }

    this.snackBar.open(
      `${product.nomeProdotto} aggiunto al carrello (rimasti: ${product.quantita})`,
      'OK',
      {
        duration: 2500,
        horizontalPosition: 'right',
        verticalPosition: 'bottom',
        panelClass: ['snackbar-success']
      }
    );
  }
}
