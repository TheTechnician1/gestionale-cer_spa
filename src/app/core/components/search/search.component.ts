import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Prodotto } from '../../interfaces/product.model';
import { Category } from '../../enum/category.enum';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent {
  constructor(private productService: ProductService, private cartService: CartService, private snackBar: MatSnackBar, private router: ActivatedRoute, private route: Router) {}
  categoria: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;
  minQuantity: number | null = null;
  products: Prodotto[] = [];

  categorie = Object.values(Category);

  ngOnInit(): void {
    this.router.queryParams.subscribe(params => {
      this.categoria = params['category'] || null;
      this.loadResults();
    });
  }

  loadResults() {
    this.productService.getProductsAdvancedSearch({
      category: this.categoria,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minQuantity: this.minQuantity
    }).subscribe(res => {
      this.products = res;
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
