import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BrandSelectDirective } from '../../brand-select.directive';
import { Product } from '../../models';
import { CartService } from '../../services/cart.service';
import { CurrencyService } from '../../services/currency.service';
import { LanguageService } from '../../services/language.service';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, BrandSelectDirective],
  templateUrl: './category-page.component.html',
  styleUrls: ['./category-page.component.scss']
})
export class CategoryPage {
  private readonly route = inject(ActivatedRoute);
  private readonly productService = inject(ProductService);
  readonly slug = this.route.snapshot.paramMap.get('slug') ?? '';
  readonly category = this.productService.categories().find((category) => category.slug === this.slug);
  readonly products = this.productService.getByCategory(this.slug);
  searchText = '';
  sortBy = 'custom';
  purchaseType: 'all' | 'subscription' | 'lifetime' = 'all';
  tagSearch = '';
  selectedTagSlugs: string[] = [];
  windowsOnly = false;
  minimumPrice: number | null = null;
  maximumPrice: number | null = null;
  showAdvancedFilters = false;
  readonly cart = inject(CartService);
  readonly currency = inject(CurrencyService);
  readonly lang = inject(LanguageService);
  readonly sales = inject(SaleService);

  readonly tagsByUse = computed(() => {
    const counts = new Map<string, { name: string; slug: string; count: number }>();
    for (const product of this.products) {
      for (const tag of product.tags) {
        const existing = counts.get(tag.slug);
        counts.set(tag.slug, { name: this.lang.tagName(tag), slug: tag.slug, count: (existing?.count ?? 0) + 1 });
      }
    }
    return [...counts.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  });

  visibleTags(): Array<{ name: string; slug: string; count: number }> {
    const query = this.tagSearch.trim().toLowerCase();
    return this.tagsByUse().filter((tag) => !query || tag.name.toLowerCase().includes(query));
  }

  toggleTag(slug: string): void {
    this.selectedTagSlugs = this.selectedTagSlugs.includes(slug)
      ? this.selectedTagSlugs.filter((item) => item !== slug)
      : [...this.selectedTagSlugs, slug];
  }

  filteredProducts(): Product[] {
    const query = this.searchText.trim().toLowerCase();
    const min = this.minimumPrice ?? Number.NEGATIVE_INFINITY;
    const max = this.maximumPrice ?? Number.POSITIVE_INFINITY;
    const filtered = this.products.filter((product) => {
      const matchesSearch = !query
        || this.lang.productName(product).toLowerCase().includes(query)
        || this.lang.productShort(product).toLowerCase().includes(query)
        || product.description.toLowerCase().includes(query)
        || product.tags.some((tag) => this.lang.tagName(tag).toLowerCase().includes(query));
      const matchesTags = !this.selectedTagSlugs.length || this.selectedTagSlugs.every((slug) => product.tags.some((tag) => tag.slug === slug));
      const matchesPurchase = this.purchaseType === 'all' || product.purchaseType === this.purchaseType;
      const matchesPrice = product.priceEUR >= min && product.priceEUR <= max;
      const matchesCompatibility = !this.windowsOnly || true;
      return matchesSearch && matchesTags && matchesPurchase && matchesPrice && matchesCompatibility;
    });
    return [...filtered].sort((a, b) => this.compareProducts(a, b));
  }

  private compareProducts(a: Product, b: Product): number {
    switch (this.sortBy) {
      case 'newest':
        return b.id - a.id;
      case 'price-low-high':
        return a.priceEUR - b.priceEUR;
      case 'price-high-low':
        return b.priceEUR - a.priceEUR;
      case 'highest-rated':
      case 'most-reviewed':
      case 'custom':
      default:
        return a.id - b.id;
    }
  }
}
