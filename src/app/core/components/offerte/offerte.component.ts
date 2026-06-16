import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { Prodotto } from '../../interfaces/product.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UtenteService } from '../../services/utente.service';

type Offerta = Prodotto & {
  prezzoOriginale: number | null;
  prezzoScontato: number | null;
  sconto: number | null;
};
@Component({
  selector: 'app-offerte',
  templateUrl: './offerte.component.html',
  styleUrls: ['./offerte.component.scss']
})
export class OfferteComponent {
  constructor(private productService: ProductService, private authService: UtenteService, private cartService: CartService, private snackBar: MatSnackBar, private route: Router) {}
  offers: Offerta[] = [];
  productsByCategory: Prodotto[] = [];
  categoria!: string | null;

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe(products => {
      const shuffled = products.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 8);

      this.offers = selected.map(p => {
        const discount = Math.floor(Math.random() * 80) + 10;
        const prezzoScontato = Number((p.prezzo! - (p.prezzo! * discount / 100)).toFixed(2));
        return {
          ...p,
          prezzoOriginale: p.prezzo,
          prezzoScontato,
          sconto: discount
        } as Offerta;
      });
    });
  }

  details(id: number) {
    this.route.navigateByUrl(`/prodotto/${id}`);
  }

  addToCart(product: Offerta) {
    const discountedProduct = {
      ...product,
      prezzoOriginale: product.prezzoOriginale,
      prezzo: product.prezzoScontato,
      sconto: product.sconto
    };
    localStorage.setItem('pendingDiscount', JSON.stringify(discountedProduct));
    const user = this.authService.currentUser;
    this.cartService.addItem(user!.id!, discountedProduct);

    if (discountedProduct.quantita && discountedProduct.quantita  > 0) {
      discountedProduct.quantita--;
    }

    this.snackBar.open(
      `${discountedProduct.nomeProdotto} aggiunto al carrello (rimasti: ${discountedProduct.quantita})`,
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
