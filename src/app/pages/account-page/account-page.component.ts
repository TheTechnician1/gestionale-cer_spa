import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BrandSelectDirective } from '../../brand-select.directive';
import { AuthService } from '../../services/auth.service';
import { Currency, CurrencyService } from '../../services/currency.service';
import { Lang, LanguageService } from '../../services/language.service';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink, BrandSelectDirective],
  templateUrl: './account-page.component.html',
  styleUrls: ['./account-page.component.scss']
})
export class AccountPage {
  readonly auth = inject(AuthService);
  readonly currency = inject(CurrencyService);
  readonly lang = inject(LanguageService);
  private readonly router = inject(Router);
  editableName = this.auth.user()?.name ?? '';
  languageSelectOpen = false;
  currencySelectOpen = false;
  accountOrders = [{ id: 'VF-240616', date: '2026-06-16', totalEUR: 6.99, status: this.lang.t('completed') }];
  accountLicenses = [{ product: 'Videa Factory', key: 'VF-LIFE-2026-8K42' }];

  initials(name: string): string {
    return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase() || 'V';
  }

  copy(value: string): void {
    void navigator.clipboard?.writeText(value);
  }

  togglePreferenceSelect(type: 'language' | 'currency'): void {
    if (type === 'language') {
      this.languageSelectOpen = !this.languageSelectOpen;
    } else {
      this.currencySelectOpen = !this.currencySelectOpen;
    }
  }

  closePreferenceSelect(type: 'language' | 'currency'): void {
    if (type === 'language') {
      this.languageSelectOpen = false;
    } else {
      this.currencySelectOpen = false;
    }
  }

  preferenceSelectKeydown(event: KeyboardEvent, type: 'language' | 'currency'): void {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
      if (type === 'language') this.languageSelectOpen = true;
      if (type === 'currency') this.currencySelectOpen = true;
    }
    if (event.key === 'Escape' || event.key === 'Tab') {
      this.closePreferenceSelect(type);
    }
  }

  logout(): void {
    this.auth.logout();
    void this.router.navigate(['/']);
  }
}
