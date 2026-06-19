import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CurrencyService } from '../../services/currency.service';
import { ProductService } from '../../services/product.service';
import { DiscountCode, Product, SaleCampaign } from '../../models';
import { DiscountService } from '../../services/discount.service';
import { SaleService } from '../../services/sale.service';
import { BrandSelectDirective } from '../../brand-select.directive';

@Component({
  standalone: true,
  imports: [FormsModule, BrandSelectDirective],
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPage {
  readonly auth = inject(AuthService);
  readonly products = inject(ProductService);
  readonly currency = inject(CurrencyService);
  readonly discounts = inject(DiscountService);
  readonly sales = inject(SaleService);
  editing = false;
  categoryName = '';
  categoryDescription = '';
  tagName = '';
  categorySlug = this.products.categories()[0]?.slug ?? '';
  tagSlugs: string[] = [];
  itShort = '';
  frShort = '';
  draft: Product = this.blank();
  discountDraft: DiscountCode = this.blankDiscount();
  saleDraft: SaleCampaign = this.blankSale();

  save(): void {
    const category = this.products.categories().find((item) => item.slug === this.categorySlug) ?? this.products.categories()[0];
    const tags = this.products.tags().filter((tag) => this.tagSlugs.includes(tag.slug));
    this.products.saveProduct({
      ...this.draft,
      category,
      tags,
      image: this.draft.image || 'assets/logo.png',
      slug: this.products.slugify(this.draft.name),
      translations: {
        ...this.draft.translations,
        it: { ...this.draft.translations?.it, shortDescription: this.itShort },
        fr: { ...this.draft.translations?.fr, shortDescription: this.frShort }
      }
    });
    this.draft = this.blank();
    this.tagSlugs = [];
    this.itShort = '';
    this.frShort = '';
    this.editing = false;
  }

  edit(product: Product): void {
    this.draft = { ...product, tags: [...product.tags] };
    this.categorySlug = product.category.slug;
    this.tagSlugs = product.tags.map((tag) => tag.slug);
    this.itShort = product.translations?.it?.shortDescription ?? '';
    this.frShort = product.translations?.fr?.shortDescription ?? '';
    this.editing = true;
  }

  addCategory(): void {
    this.products.addCategory(this.categoryName, this.categoryDescription);
    this.categoryName = '';
    this.categoryDescription = '';
  }

  addTag(): void {
    this.products.addTag(this.tagName);
    this.tagName = '';
  }

  saveDiscountCode(): void {
    this.discounts.saveCode(this.discountDraft);
    this.discountDraft = this.blankDiscount();
  }

  editDiscount(code: DiscountCode): void {
    this.discountDraft = { ...code };
  }

  saveSale(): void {
    this.sales.saveSale(this.saleDraft);
    this.saleDraft = this.blankSale();
  }

  editSale(sale: SaleCampaign): void {
    this.saleDraft = { ...sale };
  }

  private blank(): Product {
    const category = this.products.categories()[0] ?? { id: 1, name: 'Video-editing tools', slug: 'video-editing-tools', description: 'Workflow tools.' };
    return {
      id: 0,
      name: '',
      slug: '',
      priceEUR: 6.99,
      category,
      tags: [],
      shortDescription: '',
      description: '',
      image: 'assets/logo.png',
      features: ['Digital toolkit', 'Instant download', 'Creator workflow'],
      purchaseType: 'lifetime'
    };
  }

  private blankDiscount(): DiscountCode {
    return { id: 0, code: 'VIDEA10', discountType: 'percentage', value: 10, scope: 'all', active: true, currentUses: 0 };
  }

  private blankSale(): SaleCampaign {
    return { id: 0, name: 'Launch sale', discountType: 'percentage', value: 15, scope: 'all', active: true };
  }
}
