import { Injectable, signal } from '@angular/core';
import { Product, SaleCampaign } from '../models';
import { readStorage, writeStorage } from '../storage';

@Injectable({ providedIn: 'root' })
export class SaleService {
  readonly sales = signal<SaleCampaign[]>(readStorage<SaleCampaign[]>('videa_sales', []));

  saveSale(sale: SaleCampaign): void {
    const next = this.sales().some((item) => item.id === sale.id)
      ? this.sales().map((item) => item.id === sale.id ? sale : item)
      : [...this.sales(), { ...sale, id: Date.now() }];
    this.save(next);
  }

  deleteSale(id: number): void {
    this.save(this.sales().filter((sale) => sale.id !== id));
  }

  activeSaleFor(product: Product): SaleCampaign | undefined {
    const now = Date.now();
    return this.sales().find((sale) => {
      if (!sale.active) return false;
      if (sale.startsAt && new Date(sale.startsAt).getTime() > now) return false;
      if (sale.endsAt && new Date(sale.endsAt).getTime() <= now) return false;
      if (sale.scope === 'all') return true;
      if (sale.scope === 'product') return sale.productId === product.id;
      return sale.categoryId === product.category.id;
    });
  }

  salePrice(product: Product): number {
    const sale = this.activeSaleFor(product);
    if (!sale) return product.priceEUR;
    const discount = sale.discountType === 'percentage' ? product.priceEUR * (sale.value / 100) : sale.value;
    return Math.max(0, product.priceEUR - discount);
  }

  discountAmount(product: Product): number {
    return Math.max(0, product.priceEUR - this.salePrice(product));
  }

  endsIn(sale: SaleCampaign): string {
    if (!sale.endsAt) return '';
    const diff = Math.max(0, new Date(sale.endsAt).getTime() - Date.now());
    const hours = Math.floor(diff / 3600000).toString().padStart(2, '0');
    const minutes = Math.floor((diff % 3600000) / 60000).toString().padStart(2, '0');
    const seconds = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  private save(sales: SaleCampaign[]): void {
    this.sales.set(sales);
    writeStorage('videa_sales', sales);
  }
}
