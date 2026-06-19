import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap } from 'rxjs';
import { Order, ProductDetail, ProductSummary } from '../../models';
import { ErrorService } from '../../services/error.service';
import { I18nService } from '../../services/i18n.service';
import { OrderService } from '../../services/order.service';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation-page.component.html',
  styleUrls: ['./order-confirmation-page.component.scss']
})
export class OrderConfirmationPage implements OnInit {
  order: Order | null = null;
  relatedProducts: ProductSummary[] = [];
  message = '';
  error = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly orders: OrderService,
    private readonly errors: ErrorService,
    readonly i18n: I18nService,
    private readonly products: ProductService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orders.getOrder(id).subscribe({
      next: (order) => {
        this.order = order;
        this.loadRelatedProducts(order);
      },
      error: (err) => this.error = this.errors.friendly(err)
    });
  }

  sendEmail(): void {
    if (!this.order) return;
    this.error = '';
    this.message = '';
    this.orders.sendReceiptEmail(this.order.id).subscribe({
      next: () => this.message = this.i18n.t('receiptSent'),
      error: (err) => this.error = this.errors.friendly(err)
    });
  }

  downloadPdf(): void {
    if (!this.order) return;
    this.error = '';
    this.message = '';
    this.orders.downloadReceiptPdf(this.order.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `ricevuta-ordine-${this.order?.id}.pdf`;
        anchor.click();
        URL.revokeObjectURL(url);
        this.message = this.i18n.t('receiptDownloadStarted');
      },
      error: (err) => this.error = this.errors.friendly(err)
    });
  }

  imageFor(product: ProductSummary): string {
    return this.products.imageFor(product.immagine);
  }

  replaceImage(event: Event): void {
    (event.target as HTMLImageElement).src = this.products.placeholderImage;
  }

  trackById(_: number, product: ProductSummary): number {
    return product.id;
  }

  private loadRelatedProducts(order: Order): void {
    const purchasedIds = new Set(order.items.map((item) => item.productId));
    const detailRequests = order.items.map((item) =>
      this.products.detail(item.productId).pipe(catchError(() => of(null)))
    );

    this.products.list().pipe(
      switchMap((catalog) => {
        const details$ = detailRequests.length ? forkJoin(detailRequests) : of([]);
        return details$.pipe(map((details) => ({ catalog, details })));
      })
    ).subscribe({
      next: ({ catalog, details }) => {
        const categories = new Set(
          details
            .filter((detail): detail is ProductDetail => !!detail)
            .map((detail) => detail.categoria)
        );
        const relatedByCategory = catalog.filter((product) => !purchasedIds.has(product.id) && categories.has(product.categoria));
        const fallback = catalog.filter((product) => !purchasedIds.has(product.id));
        this.relatedProducts = (relatedByCategory.length ? relatedByCategory : fallback.length ? fallback : catalog).slice(0, 4);
      },
      error: () => {
        this.relatedProducts = [];
      }
    });
  }
}
