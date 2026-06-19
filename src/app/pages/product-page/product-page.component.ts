import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductDetail, User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ErrorService } from '../../services/error.service';
import { I18nService } from '../../services/i18n.service';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './product-page.component.html',
  styleUrls: ['./product-page.component.scss']
})
export class ProductPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  product: ProductDetail | null = null;
  user: User | null = null;
  loading = false;
  error = '';
  form = this.fb.group({
    quantita: [1, [Validators.required, Validators.min(1)]]
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly products: ProductService,
    private readonly cart: CartService,
    private readonly auth: AuthService,
    readonly i18n: I18nService,
    private readonly errors: ErrorService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.currentUser();
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.products.detail(id).subscribe({
      next: (product) => {
        this.product = product;
        this.form.controls.quantita.setValidators([Validators.required, Validators.min(1), Validators.max(product.quantitaDisponibile)]);
        this.form.controls.quantita.updateValueAndValidity();
      },
      error: (err) => this.error = this.errors.friendly(err)
    });
  }

  addToCart(): void {
    if (!this.product || this.form.invalid) return;
    if (!this.user) {
      this.router.navigate(['/sign-in']);
      return;
    }
    const quantita = Number(this.form.value.quantita || 1);
    if (quantita > this.product.quantitaDisponibile) {
      this.error = this.i18n.t('quantityTooHigh');
      return;
    }
    this.loading = true;
    this.error = '';
    this.cart.add(this.user.id, this.product.id, quantita).subscribe({
      next: () => this.router.navigate(['/cart']),
      error: (err) => {
        this.error = this.errors.friendly(err);
        this.loading = false;
      }
    });
  }

  imageFor(product: ProductDetail): string {
    return this.products.imageFor(product.immagine);
  }

  replaceImage(event: Event): void {
    (event.target as HTMLImageElement).src = this.products.placeholderImage;
  }
}
