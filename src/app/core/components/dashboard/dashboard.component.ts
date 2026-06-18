import { Component, ViewChild } from '@angular/core';
import { Prodotto } from '../../interfaces/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtenteService } from '../../services/utente.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(
    private productService: ProductService,
    private authService: UtenteService,
    private cartService: CartService,
    private route: Router,
    private snackBar: MatSnackBar) {}

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  products: Prodotto[] = [];
  pagedProducts: Prodotto[] = [];

  pageSize = 8;
  pageIndex = 0;
  totalProducts = 0;

  ngOnInit() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = this.shuffle(products).filter(p => p.quantita! > 0);
      this.totalProducts = this.products.length;
      this.setPage(0, this.pageSize);
    });
  }

  shuffle(array: Prodotto[]) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  setPage(pageIndex: number, pageSize: number) {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    this.pagedProducts = this.products.slice(start, end);
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.setPage(this.pageIndex, this.pageSize);
  }

  getAvailable(product: Prodotto): number {
    const inCart = this.cartService.getCartState(product.id!);
    return product.quantita! - inCart;
  }

  details(id: number) {
    this.route.navigateByUrl(`/prodotto/${id}`);
  }

  reloadProducts() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = this.shuffle(products);
      this.totalProducts = this.products.length;
      this.setPage(this.pageIndex, this.pageSize);
    });
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

    if(user?.id === 26) {
      this.cartService.addGuestItem({
        productId: product.id!,
        quantita: 1
      } as any);
        this.snackBar.open(
        `${product.nomeProdotto} aggiunto al carrello (rimasti: ${this.getAvailable(product)})`,
        'OK',
        {
          duration: 2000,
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          panelClass: ['snackbar-success']
        }
      );
      return;
    }

    this.cartService.addItem(user!.id!, {
      productId: product.id,
      quantity: 1
    }).subscribe({
    next: () => {
      this.snackBar.open(
        `${product.nomeProdotto} aggiunto al carrello (rimasti: ${this.getAvailable(product)})`, 'OK',
        {
          duration: 2000,
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
    }});
  }
}
