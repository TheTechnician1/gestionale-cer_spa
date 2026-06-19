import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { User } from './models';
import { AuthService } from './services/auth.service';
import { CartService } from './services/cart.service';
import { I18nService } from './services/i18n.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-loader" *ngIf="showLoader" aria-live="polite" [attr.aria-label]="i18n.t('loading')">
      <img src="assets/logo.png" alt="Videa">
    </div>
    <div class="cursor-glow" [class.cursor-grow]="cursorActive" [style.transform]="cursorTransform()"></div>
    <header class="site-header" [class.header-hidden]="headerHidden" [class.mobile-open]="mobileMenuOpen">
      <a class="brand" routerLink="/" aria-label="Videa home" (click)="goHome($event)">
        <img class="brand-logo" [class.logo-spin-once]="logoSpinning" src="assets/logo.png" alt="Videa logo">
        <span class="brand-word">Videa</span>
      </a>

      <button class="mobile-menu-toggle" type="button" aria-label="Menu" [attr.aria-expanded]="mobileMenuOpen" (click)="toggleMobileMenu()">
        <span></span><span></span><span></span>
      </button>

      <nav class="nav" [attr.aria-label]="i18n.t('mainNavigation')">
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }" (click)="goHome($event)">{{ i18n.t('home') }}</a>
        <ng-container *ngIf="user">
          <a routerLink="/products" routerLinkActive="active" (click)="closeMobileMenu()">{{ i18n.t('catalog') }}</a>
          <a routerLink="/cart" routerLinkActive="active" (click)="closeMobileMenu()">{{ i18n.t('cart') }}</a>
        </ng-container>
      </nav>

      <div class="header-tools">
        <label class="tool-select language-select" [attr.aria-label]="i18n.t('language')">
          <select [value]="i18n.current()" (change)="changeLanguage($event)">
            <option value="it">IT</option>
            <option value="en">EN</option>
            <option value="fr">FR</option>
          </select>
        </label>
        <ng-container *ngIf="!user; else logged">
          <button class="join-link" type="button" (click)="goToSignUp()">{{ i18n.t('signUp') }}</button>
          <button class="header-text-link plain-header-button" type="button" (click)="goToSignIn()">{{ i18n.t('signIn') }}</button>
        </ng-container>
        <ng-template #logged>
          <span class="header-text-link">{{ i18n.t('hello') }}, {{ user?.nome }}</span>
          <button class="icon-link" type="button" (click)="logout()" aria-label="Logout">{{ i18n.t('logout') }}</button>
        </ng-template>
        <a *ngIf="user" class="cart-icon-link" routerLink="/cart" [attr.aria-label]="i18n.t('cart')" (click)="closeMobileMenu()">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 18C5.9 18 5.01 18.9 5.01 20S5.9 22 7 22 9 21.1 9 20 8.1 18 7 18ZM1 2V4H3L6.6 11.59 5.25 14.04C4.52 15.37 5.48 17 7 17H19V15H7L8.1 13H15.55C16.3 13 16.96 12.59 17.3 11.97L20.88 5.48C21.25 4.82 20.77 4 20.01 4H5.21L4.27 2H1ZM17 18C15.9 18 15.01 18.9 15.01 20S15.9 22 17 22 19 21.1 19 20 18.1 18 17 18Z"/></svg>
          <strong>{{ cart.count() }}</strong>
        </a>
      </div>
    </header>

    <main>
      <router-outlet></router-outlet>
    </main>

    <footer class="footer">
      <span>&copy; Copyright 2026 Videa</span>
      <div class="footer-links">
        <a href="terms/">{{ i18n.t('terms') }}</a>
        <a href="privacy/">{{ i18n.t('privacy') }}</a>
        <a href="refund/">{{ i18n.t('refunds') }}</a>
        <a href="mailto:support@videa.tech">support@videa.tech</a>
      </div>
    </footer>
  `
})
export class AppComponent implements OnInit {
  user: User | null = null;
  cursorX = -100;
  cursorY = -100;
  cursorActive = false;
  headerHidden = false;
  mobileMenuOpen = false;
  showLoader = false;
  logoSpinning = false;
  private lastScrollY = 0;
  private loaderTimer: ReturnType<typeof setTimeout> | undefined;
  private logoTimer: ReturnType<typeof setTimeout> | undefined;

  constructor(
    readonly cart: CartService,
    readonly i18n: I18nService,
    private readonly auth: AuthService,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('videa_shop_seen_loader')) {
      sessionStorage.setItem('videa_shop_seen_loader', 'true');
      this.showLoader = true;
      setTimeout(() => this.showLoader = false, 1150);
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) this.startRouteLoader();
      if (event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError) this.stopRouteLoader();
    });
    this.auth.user$.subscribe((user) => {
      this.user = user;
      if (user) this.cart.load(user.id).subscribe({ error: () => undefined });
      else this.cart.clearLocal();
    });
  }

  cursorTransform(): string {
    return `translate3d(${this.cursorX}px, ${this.cursorY}px, 0) translate(-50%, -50%)`;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen = false;
  }

  goHome(event?: Event): void {
    event?.preventDefault();
    this.closeMobileMenu();
    this.spinLogo();
    this.router.navigate(['/']);
  }

  changeLanguage(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (value === 'it' || value === 'en' || value === 'fr') {
      this.i18n.setLanguage(value);
    }
  }

  goToSignUp(): void {
    this.closeMobileMenu();
    this.router.navigate(['/sign-up']);
  }

  goToSignIn(): void {
    this.closeMobileMenu();
    this.router.navigate(['/sign-in']);
  }

  logout(): void {
    this.auth.logout();
    this.closeMobileMenu();
    this.router.navigate(['/']);
  }

  private startRouteLoader(): void {
    if (this.loaderTimer) clearTimeout(this.loaderTimer);
    this.loaderTimer = setTimeout(() => this.showLoader = true, 180);
  }

  private stopRouteLoader(): void {
    if (this.loaderTimer) clearTimeout(this.loaderTimer);
    this.loaderTimer = undefined;
    setTimeout(() => this.showLoader = false, 160);
  }

  private spinLogo(): void {
    this.logoSpinning = false;
    if (this.logoTimer) clearTimeout(this.logoTimer);
    setTimeout(() => this.logoSpinning = true, 0);
    this.logoTimer = setTimeout(() => this.logoSpinning = false, 850);
  }

  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.cursorX = event.clientX;
    this.cursorY = event.clientY;
    const target = event.target as HTMLElement | null;
    this.cursorActive = Boolean(target?.closest('a, button, input, select, textarea, .product-card, .interactive'));
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const currentY = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
    const delta = currentY - this.lastScrollY;
    if (currentY < 20) this.headerHidden = false;
    else if (delta > 8) this.headerHidden = true;
    else if (delta < -8) this.headerHidden = false;
    this.lastScrollY = currentY;
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth > 900) this.closeMobileMenu();
  }
}
