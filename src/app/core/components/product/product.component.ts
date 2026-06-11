import { Component } from '@angular/core';
import { Prodotto } from '../../interfaces/product.model';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  constructor(private route: ActivatedRoute, private productService: ProductService, private cartService: CartService, private snackBar: MatSnackBar) {}
  prodotto!: Prodotto | null;
  loading = true;
  quantity = 1;
  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));

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

  addToCart(product: Prodotto, qty: number) {
    this.cartService.add(product, qty);

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
