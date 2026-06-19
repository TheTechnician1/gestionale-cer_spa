import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product.model';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-dettaglio-prodotti',
  templateUrl: './dettaglio-prodotti.component.html',
  styleUrls: ['./dettaglio-prodotti.component.scss']
})
export class DettaglioProdottiComponent implements OnInit {

  product?: Product;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadProduct();
  }

  loadProduct(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (!id) return;

    this.loading = true;

    this.productService.getProductById(+id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: () => {
        console.log("Errore prodotto");
        this.loading = false;
      }
    });
  }

  addToCart(): void {

    const user = this.authService.currentUser;

    if (!user || !this.product) {
      alert("Login richiesto");
      return;
    }

    this.cartService.addToCart(user.id, this.product.idProdotto)
      .subscribe({
        next: () => {
          alert("Aggiunto al carrello");
        },
        error: () => {
          alert("Errore");
        }
      });
  }
}