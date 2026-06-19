import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../interfaces/product.model';
import { Cart } from '../../interfaces/cart.model';

@Component({
  selector: 'app-lista-prodotti',
  templateUrl: './lista-prodotti.component.html',
  styleUrls: ['./lista-prodotti.component.scss']
})
export class ListaProdottiComponent implements OnInit {

  products: Product[] = [];
  cart!: Cart;
  loading = false;

  constructor(
    private productService: ProductService,
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;

    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        console.log("Errore caricamento prodotti");
        this.loading = false;
      }
    });
  }

  addToCart(product: Product) {

    const user = this.authService.currentUser;

    if (!user) {
      alert("Devi essere loggato");
      return;
    }

    this.cartService.addToCart(user.id, product.idProdotto)
      .subscribe({
        next: () => {
          alert("Prodotto aggiunto al carrello");

          // ricarico carrello
          this.cartService.getCart(user.id)
            .subscribe(res => {
              this.cart = res;
            });
        },
        error: () => {
          alert("Errore aggiunta al carrello");
        }
      });
  }
}