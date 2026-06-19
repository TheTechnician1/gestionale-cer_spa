import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Prodotto } from '../../interfaces/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtenteService } from '../../services/utente.service';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
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

  private sub = new Subscription();

  currentUser = this.authService.currentUser;

  ngOnInit() {
    this.sub.add(
      this.authService.user$.subscribe(user => {
        this.currentUser = user;
      })
    );
    this.sub.add(
      this.cartService.cart$.subscribe(() => {
        this.setPage(this.pageIndex, this.pageSize);
      })
    );
    this.loadProducts();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe(products => {
      this.products = this.shuffle(products).filter(p => p.quantita! > 0);
      this.setPage(0, this.pageSize);
    });
  }

  reloadProducts() {
    this.loadProducts();
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
    const availableProducts = this.products.filter(p => this.getAvailable(p) > 0);
    const maxPageIndex = Math.max(Math.ceil(availableProducts.length / pageSize) - 1, 0);
    const nextPageIndex = Math.min(pageIndex, maxPageIndex);
    this.pageIndex = nextPageIndex;
    this.totalProducts = availableProducts.length;
    this.pagedProducts = availableProducts.slice(nextPageIndex * pageSize, nextPageIndex * pageSize + pageSize);

    if (this.paginator && this.paginator.pageIndex !== nextPageIndex) {
      this.paginator.pageIndex = nextPageIndex;
    }
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


  addToCart(product: Prodotto) {
    const available = this.getAvailable(product);

    if (available <= 0) {
      this.snackBar.open(
        'Quantità non disponibile',
        'OK',
        { duration: 2000 }
      );
      return;
    }

    if (this.authService.isGuest(this.currentUser)) {
      this.cartService.addGuestProduct(product);
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

    this.cartService.addItem(this.currentUser!.id!, {
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

  details(id: number) {
    this.route.navigateByUrl(`/prodotto/${id}`);
  }
}
