import { Component, OnDestroy } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Prodotto } from '../../interfaces/product.model';
import { Category } from '../../enum/category.enum';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtenteService } from '../../services/utente.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnDestroy {
  constructor(private productService: ProductService, private authService: UtenteService, private cartService: CartService, private snackBar: MatSnackBar, private router: ActivatedRoute, private route: Router) {}
  categoria: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minQuantity: number | null = null;
  products: Prodotto[] = [];
  visibleProducts: Prodotto[] = [];
  private sub = new Subscription();

  categorie = Object.values(Category);

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.categoria = params['category'] || null;
      this.loadResults();
    });
    this.sub.add(
      this.cartService.cart$.subscribe(() => this.updateVisibleProducts())
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  loadResults() {
    this.productService.getProductsAdvancedSearch({
      category: this.categoria,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minQuantity: this.minQuantity
    }).subscribe(res => {
      this.products = res;
      this.updateVisibleProducts();
    });
  }

  updateVisibleProducts(): void {
    this.visibleProducts = this.products.filter(p => this.getAvailable(p) > 0);
  }

  getAvailable(product: Prodotto): number {
    const inCart = this.cartService.getCartState(product.id!);
    return product.quantita! - inCart;
  }

  reloadProducts() {
    this.productService.getProductsAdvancedSearch({
      category: this.categoria,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minQuantity: this.minQuantity
    }).subscribe(res => {
      this.products = res;
      this.updateVisibleProducts();
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

    if (this.authService.isGuest(user)) {
      this.cartService.addGuestProduct(product);
      this.snackBar.open(
        `${product.nomeProdotto} aggiunto al carrello (rimasti: ${this.getAvailable(product)})`, 'OK',
        {
          duration: 2500,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        }
      );
      return;
    }

    this.cartService.addItem(user!.id!, { productId: product.id, quantity: 1 }).subscribe({
      next: () => {
        this.snackBar.open(
          `${product.nomeProdotto} aggiunto al carrello (rimasti: ${this.getAvailable(product)})`, 'OK',
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

  applyFilters() {
    this.loadResults();
  }

  resetFilters() {
    this.categoria = null;
    this.minPrice = null;
    this.maxPrice = null;
    this.minQuantity = null;
    this.loadResults();
  }
}
