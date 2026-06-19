import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories-page.component.html',
  styleUrls: ['./categories-page.component.scss']
})
export class CategoriesPage {
  readonly products = inject(ProductService);
  readonly lang = inject(LanguageService);
  readonly categories = computed(() => this.products.categories());

  productCount(slug: string): number {
    return this.products.getByCategory(slug).length;
  }
}
