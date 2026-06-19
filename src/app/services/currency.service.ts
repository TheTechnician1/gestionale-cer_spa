import { Injectable, signal } from '@angular/core';
import { readStorage, writeStorage } from '../storage';

export type Currency = 'EUR' | 'USD' | 'GBP' | 'CHF';

const rates: Record<Currency, number> = {
  EUR: 1,
  USD: 1.08,
  GBP: 0.84,
  CHF: 0.96
};

const symbols: Record<Currency, string> = {
  EUR: '€',
  USD: '$',
  GBP: '£',
  CHF: 'CHF'
};

@Injectable({ providedIn: 'root' })
export class CurrencyService {
  readonly currency = signal<Currency>(readStorage<Currency>('videa_currency', 'EUR'));
  readonly currencies: Currency[] = ['EUR', 'USD', 'GBP', 'CHF'];

  setCurrency(currency: Currency): void {
    this.currency.set(currency);
    writeStorage('videa_currency', currency);
  }

  convert(eur: number): number {
    return eur * rates[this.currency()];
  }

  format(eur: number): string {
    const currency = this.currency();
    const amount = this.convert(eur);
    if (currency === 'CHF') {
      return `CHF ${amount.toFixed(2)}`;
    }
    return `${symbols[currency]}${amount.toFixed(2)}`;
  }
}
