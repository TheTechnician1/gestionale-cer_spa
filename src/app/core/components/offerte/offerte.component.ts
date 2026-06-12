import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Prodotto } from '../../interfaces/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-offerte',
  templateUrl: './offerte.component.html',
  styleUrls: ['./offerte.component.scss']
})
export class OfferteComponent {
  constructor(private productService: ProductService, private cartService: CartService, private snackBar: MatSnackBar, private route: Router) {}
  offers: any[] = [];
  productsByCategory: Prodotto[] = [];
  categoria!: string | null;

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {

    const shuffled = products.sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);

    this.offers = selected.map(p => {
      const discount = Math.floor(Math.random() * 81) + 10;
      const prezzoScontato = (p.prezzo! - (p.prezzo! * discount / 100)).toFixed(2);
      return {
        ...p,
        prezzoOriginale: p.prezzo,
        prezzoScontato: prezzoScontato,
        sconto: discount
      };
    });
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
