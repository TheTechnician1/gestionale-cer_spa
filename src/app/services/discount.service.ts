import { Injectable, signal } from '@angular/core';
import { CartItem, DiscountCode } from '../models';
import { readStorage, writeStorage } from '../storage';
import { SaleService } from './sale.service';

@Injectable({ providedIn: 'root' })
export class DiscountService {
  readonly codes = signal<DiscountCode[]>(readStorage<DiscountCode[]>('videa_discount_codes', [
    { id: 1, code: 'VIDEA10', discountType: 'percentage', value: 10, scope: 'all', active: true, currentUses: 0 }
  ]));
  readonly appliedCode = signal<string | null>(readStorage<string | null>('videa_applied_discount', null));
  readonly message = signal<string>('');

  constructor(private readonly sales: SaleService) {}

  saveCode(code: DiscountCode): void {
    const normalized = { ...code, code: code.code.trim().toUpperCase() };
    const next = this.codes().some((item) => item.id === normalized.id)
      ? this.codes().map((item) => item.id === normalized.id ? normalized : item)
      : [...this.codes(), { ...normalized, id: Date.now() }];
    this.save(next);
  }

  deleteCode(id: number): void {
    this.save(this.codes().filter((code) => code.id !== id));
  }

  apply(code: string, items: CartItem[]): boolean {
    const found = this.findValid(code, items);
    if (!found) {
      this.message.set('invalidCode');
      this.appliedCode.set(null);
      writeStorage('videa_applied_discount', null);
      return false;
    }
    this.appliedCode.set(found.code);
    this.message.set('codeApplied');
    writeStorage('videa_applied_discount', found.code);
    return true;
  }

  remove(): void {
    this.appliedCode.set(null);
    this.message.set('');
    writeStorage('videa_applied_discount', null);
  }

  appliedDiscount(items: CartItem[]): number {
    const code = this.appliedCode();
    const found = code ? this.findValid(code, items) : undefined;
    if (!found) return 0;
    const eligible = this.eligibleTotal(found, items);
    return found.discountType === 'percentage' ? eligible * (found.value / 100) : Math.min(found.value, eligible);
  }

  findValid(code: string, items: CartItem[]): DiscountCode | undefined {
    const normalized = code.trim().toUpperCase();
    const found = this.codes().find((item) => item.code === normalized);
    if (!found || !found.active) return undefined;
    const now = Date.now();
    if (found.startsAt && new Date(found.startsAt).getTime() > now) return undefined;
    if (found.endsAt && new Date(found.endsAt).getTime() <= now) {
      this.message.set('codeExpired');
      return undefined;
    }
    if (found.maxUses && found.currentUses >= found.maxUses) return undefined;
    const eligible = this.eligibleTotal(found, items);
    if (!eligible || (found.minimumOrderAmount && eligible < found.minimumOrderAmount)) return undefined;
    return found;
  }

  private eligibleTotal(code: DiscountCode, items: CartItem[]): number {
    return items.reduce((sum, item) => {
      const eligible = code.scope === 'all'
        || (code.scope === 'product' && code.productId === item.product.id)
        || (code.scope === 'category' && code.categoryId === item.product.category.id);
      return eligible ? sum + this.sales.salePrice(item.product) * item.quantity : sum;
    }, 0);
  }

  private save(codes: DiscountCode[]): void {
    this.codes.set(codes);
    writeStorage('videa_discount_codes', codes);
  }
}
