import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductSummary, User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ErrorService } from '../../services/error.service';
import { I18nService } from '../../services/i18n.service';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './products-page.component.html',
  styleUrls: ['./products-page.component.scss']
})
export class ProductsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly i18n = inject(I18nService);
  products: ProductSummary[] = [];
  categories: string[] = [];
  loading = false;
  error = '';
  addingId: number | null = null;
  advancedOpen = false;
  private user: User | null = null;

  searchForm = this.fb.group({ name: [''] });
  advancedForm = this.fb.group({
    category: [''],
    minPrice: [null as number | null],
    maxPrice: [null as number | null],
    minQuantity: [null as number | null]
  });

  constructor(
    private readonly productService: ProductService,
    private readonly cart: CartService,
    private readonly auth: AuthService,
    private readonly errors: ErrorService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser();
    const query = this.route.snapshot.queryParamMap;
    const search = query.get('search') || '';
    const category = query.get('category') || '';
    if (search) {
      this.searchForm.patchValue({ name: search });
      this.simpleSearch();
      return;
    }
    if (category) {
      this.advancedForm.patchValue({ category });
      this.advancedOpen = true;
      this.advancedSearch();
      return;
    }
    this.loadAll();
  }

  loadAll(): void {
    this.loading = true;
    this.error = '';
    this.productService.list().subscribe({
      next: (items) => {
        this.setProducts(items);
        this.loading = false;
      },
      error: (err) => {
        this.error = this.errors.friendly(err);
        this.loading = false;
      }
    });
  }

  simpleSearch(): void {
    this.loading = true;
    this.error = '';
    this.productService.searchByName(this.searchForm.value.name || '').subscribe({
      next: (items) => {
        this.setProducts(items);
        this.loading = false;
      },
      error: (err) => {
        this.error = this.errors.friendly(err);
        this.loading = false;
      }
    });
  }

  advancedSearch(): void {
    const value = this.advancedForm.getRawValue();
    this.loading = true;
    this.error = '';
    this.productService.advancedSearch({
      category: value.category || undefined,
      minPrice: value.minPrice,
      maxPrice: value.maxPrice,
      minQuantity: value.minQuantity
    }).subscribe({
      next: (items) => {
        this.setProducts(items);
        this.loading = false;
      },
      error: (err) => {
        this.error = this.errors.friendly(err);
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.searchForm.reset({ name: '' });
    this.advancedForm.reset({ category: '', minPrice: null, maxPrice: null, minQuantity: null });
    this.loadAll();
  }

  stepFilter(controlName: 'minPrice' | 'maxPrice' | 'minQuantity', delta: number): void {
    const control = this.advancedForm.controls[controlName];
    const current = Number(control.value ?? 0);
    const precision = controlName === 'minQuantity' ? 0 : 2;
    const next = Math.max(0, Number((current + delta).toFixed(precision)));
    control.setValue(next);
  }

  addToCart(product: ProductSummary): void {
    if (!this.user) {
      this.router.navigate(['/sign-in']);
      return;
    }
    if (product.quantitaDisponibile <= 0) return;
    this.addingId = product.id;
    this.error = '';
    this.cart.add(this.user.id, product.id, 1).subscribe({
      next: () => this.addingId = null,
      error: (err) => {
        this.error = this.errors.friendly(err);
        this.addingId = null;
      }
    });
  }

  imageFor(product: ProductSummary): string {
    return this.productService.imageFor(product.immagine);
  }

  replaceImage(event: Event): void {
    (event.target as HTMLImageElement).src = this.productService.placeholderImage;
  }

  trackById(_: number, item: ProductSummary): number {
    return item.id;
  }

  private setProducts(items: ProductSummary[]): void {
    this.products = items;
    const nextCategories = Array.from(new Set(items.map((item) => item.categoria))).sort();
    this.categories = nextCategories.length ? nextCategories : this.categories;
  }
}
