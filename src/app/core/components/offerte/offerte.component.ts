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
  private offersKey = 'offers_cache';

  ngOnInit(): void {
    const cached = sessionStorage.getItem(this.offersKey);
    if(cached) {
      this.offers = JSON.parse(cached);
      return;
    }
    this.loadOffers();
  }

  loadOffers(): void {
    this.productService.getAllProducts().subscribe(products => {
      const offers = this.buildOffers(products);
      this.offers = offers;
      sessionStorage.setItem(this.offersKey, JSON.stringify(offers));
    });
  }

  details(id: number) {
    this.route.navigateByUrl(`/prodotto/${id}`);
  }

  getAvailable(product: Prodotto): number {
    return product.quantita! - this.cartService.getCartState(product.id!);
  }

  buildOffers(products: Prodotto[]): Offerta[] {
    const shuffled = [...products].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, 8);
    return selected.map(p => {
      const discount = Math.floor(Math.random() * 80) + 10;
      return {
        ...p,
        prezzoOriginale: p.prezzo,
        prezzoScontato: Number(
          (p.prezzo! - (p.prezzo! * discount / 100)).toFixed(2)
        ),
        sconto: discount
      };
    });
  }
  addToCart(product: Prodotto) {
    const user = this.authService.currentUser;
    const available = this.getAvailable(product);
    if (available <= 0) {
      this.snackBar.open('Quantità non disponibile', 'OK', { duration: 2000 });
      return;
    }

    this.cartService.addItem(user!.id!, { productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.snackBar.open(`${product.nomeProdotto} aggiunto al carrello (rimasti: ${this.getAvailable(product)})`,
        'OK',
          {
            duration: 2500,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: ['snackbar-success']
          }
        );
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
  /*
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
    */
}
