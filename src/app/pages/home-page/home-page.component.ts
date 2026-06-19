import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductSummary, User } from '../../models';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { ErrorService } from '../../services/error.service';
import { I18nService } from '../../services/i18n.service';
import { ProductService } from '../../services/product.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePage implements OnInit, AfterViewInit, OnDestroy {
  user: User | null = null;
  products: ProductSummary[] = [];
  categories: string[] = [];
  selectedCategory = '';
  hoveredCategory: string | null = null;
  featuredIndex = 0;
  carouselDirection: 'next' | 'prev' | '' = '';
  searchQuery = '';
  error = '';
  tabLeftPx = 8;
  tabWidthPx = 0;
  heroWaveX = 0;
  heroWaveY = 0;
  heroCategoryWave = false;
  heroCategoryPress = false;
  private heroLogoAngle = 0;
  private readonly baseHeroLogoSpeed = 32;
  private readonly maxHeroLogoSpeed = 560;
  private readonly heroLogoBoost = 90;
  private heroLogoSpeed = this.baseHeroLogoSpeed;
  private heroLogoFrame: number | undefined;
  private heroLogoLastFrame = 0;
  private heroWaveTimer: ReturnType<typeof setTimeout> | undefined;
  private heroPressTimer: ReturnType<typeof setTimeout> | undefined;
  private featuredAutoplayTimer: ReturnType<typeof setInterval> | undefined;
  @ViewChild('heroLogo') private readonly heroLogo?: ElementRef<HTMLImageElement>;
  @ViewChild('categoryTabs') private readonly categoryTabs?: ElementRef<HTMLElement>;
  @ViewChildren('categoryTab') private readonly categoryTabButtons?: QueryList<ElementRef<HTMLButtonElement>>;

  constructor(
    private readonly auth: AuthService,
    private readonly productsService: ProductService,
    private readonly cart: CartService,
    private readonly errors: ErrorService,
    readonly i18n: I18nService,
    private readonly router: Router,
    private readonly zone: NgZone
  ) {}

  get featuredProduct(): ProductSummary | null {
    return this.featuredProducts[this.featuredIndex] ?? null;
  }

  get previousFeaturedProduct(): ProductSummary | null {
    const items = this.featuredProducts;
    if (items.length < 2) return null;
    return items[(this.featuredIndex - 1 + items.length) % items.length] ?? null;
  }

  get nextFeaturedProduct(): ProductSummary | null {
    const items = this.featuredProducts;
    if (items.length < 2) return null;
    return items[(this.featuredIndex + 1) % items.length] ?? null;
  }

  get featuredProducts(): ProductSummary[] {
    return this.products.filter((product) => !this.selectedCategory || product.categoria === this.selectedCategory);
  }

  ngOnInit(): void {
    this.auth.user$.subscribe((user) => {
      this.user = user;
      if (user) this.loadProducts();
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.measureActiveTab(), 0);
    this.categoryTabButtons?.changes.subscribe(() => setTimeout(() => this.measureActiveTab(), 0));
    this.startFeaturedAutoplay();
    this.startHeroLogoSpin();
  }

  ngOnDestroy(): void {
    if (this.heroWaveTimer) clearTimeout(this.heroWaveTimer);
    if (this.heroPressTimer) clearTimeout(this.heroPressTimer);
    if (this.heroLogoFrame !== undefined) cancelAnimationFrame(this.heroLogoFrame);
    this.stopFeaturedAutoplay();
  }

  loadProducts(): void {
    this.productsService.list().subscribe({
      next: (products) => {
        this.products = products;
        this.categories = Array.from(new Set(products.map((product) => product.categoria))).slice(0, 6);
        this.featuredIndex = 0;
        setTimeout(() => this.measureActiveTab(), 0);
      },
      error: (err) => this.error = this.errors.friendly(err)
    });
  }

  visibleProducts(): ProductSummary[] {
    return this.products
      .filter((product) => !this.selectedCategory || product.categoria === this.selectedCategory)
      .slice(0, 6);
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.featuredIndex = 0;
    setTimeout(() => this.measureActiveTab(), 0);
  }

  setHoveredCategory(category: string | null): void {
    this.hoveredCategory = category;
    setTimeout(() => this.measureActiveTab(), 0);
  }

  selectHeroCategory(event: MouseEvent, category: string): void {
    this.selectCategory(category);
    this.triggerHeroWave(event.currentTarget as HTMLElement, event);
  }

  previousFeatured(): void {
    const items = this.featuredProducts;
    if (!items.length) return;
    if (this.carouselDirection) return;
    this.setFeaturedIndex((this.featuredIndex - 1 + items.length) % items.length, 'prev');
    this.restartFeaturedAutoplay();
  }

  nextFeatured(): void {
    const items = this.featuredProducts;
    if (!items.length) return;
    if (this.carouselDirection) return;
    this.setFeaturedIndex((this.featuredIndex + 1) % items.length, 'next');
    this.restartFeaturedAutoplay();
  }

  boostHeroLogo(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, input, a, select, textarea')) return;
    this.heroLogoSpeed = Math.min(this.maxHeroLogoSpeed, this.heroLogoSpeed + this.heroLogoBoost);
  }

  searchProducts(): void {
    const queryParams: Record<string, string> = {};
    if (this.searchQuery.trim()) queryParams['search'] = this.searchQuery.trim();
    if (this.selectedCategory) queryParams['category'] = this.selectedCategory;
    this.router.navigate(['/products'], { queryParams });
  }

  openCategory(category: string): void {
    this.router.navigate(['/products'], { queryParams: { category } });
  }

  addToCart(product: ProductSummary): void {
    if (!this.user) return;
    this.error = '';
    this.cart.add(this.user.id, product.id, 1).subscribe({
      error: (err) => this.error = this.errors.friendly(err)
    });
  }

  imageFor(product: ProductSummary): string {
    return this.productsService.imageFor(product.immagine);
  }

  replaceImage(event: Event): void {
    (event.target as HTMLImageElement).src = this.productsService.placeholderImage;
  }

  goToSignUp(): void {
    this.router.navigate(['/sign-up']);
  }

  goToSignIn(): void {
    this.router.navigate(['/sign-in']);
  }

  trackById(_: number, item: ProductSummary): number {
    return item.id;
  }

  private measureActiveTab(): void {
    const buttons = this.categoryTabButtons?.toArray().map((button) => button.nativeElement) || [];
    if (!buttons.length) return;
    const activeCategory = this.hoveredCategory !== null ? this.hoveredCategory : this.selectedCategory;
    const index = activeCategory === '' ? 0 : this.categories.findIndex((category) => category === activeCategory) + 1;
    const button = buttons[Math.max(0, index)] || buttons[0];
    this.tabLeftPx = button.offsetLeft;
    this.tabWidthPx = button.offsetWidth;
  }

  private triggerHeroWave(button: HTMLElement, event: MouseEvent): void {
    const rect = button.getBoundingClientRect();
    this.heroWaveX = event.clientX - rect.left;
    this.heroWaveY = event.clientY - rect.top;
    this.heroCategoryWave = false;
    this.heroCategoryPress = false;
    setTimeout(() => {
      this.heroCategoryWave = true;
      this.heroCategoryPress = true;
    }, 0);
    if (this.heroWaveTimer) clearTimeout(this.heroWaveTimer);
    if (this.heroPressTimer) clearTimeout(this.heroPressTimer);
    this.heroWaveTimer = setTimeout(() => this.heroCategoryWave = false, 760);
    this.heroPressTimer = setTimeout(() => this.heroCategoryPress = false, 180);
  }

  private startFeaturedAutoplay(): void {
    if (this.featuredAutoplayTimer) return;
    this.featuredAutoplayTimer = setInterval(() => {
      const items = this.featuredProducts;
      if (items.length > 1 && !this.carouselDirection) {
        this.setFeaturedIndex((this.featuredIndex + 1) % items.length, 'next');
      }
    }, 4800);
  }

  private stopFeaturedAutoplay(): void {
    if (!this.featuredAutoplayTimer) return;
    clearInterval(this.featuredAutoplayTimer);
    this.featuredAutoplayTimer = undefined;
  }

  private restartFeaturedAutoplay(): void {
    this.stopFeaturedAutoplay();
    setTimeout(() => this.startFeaturedAutoplay(), 900);
  }

  private setFeaturedIndex(index: number, direction: 'next' | 'prev'): void {
    this.featuredIndex = index;
    this.carouselDirection = '';
    setTimeout(() => this.carouselDirection = direction, 0);
    setTimeout(() => this.carouselDirection = '', 1160);
  }

  private startHeroLogoSpin(): void {
    if (this.heroLogoFrame !== undefined) return;
    this.zone.runOutsideAngular(() => {
      const rotate = (time: number) => {
        if (!this.heroLogoLastFrame) this.heroLogoLastFrame = time;
        const elapsedSeconds = Math.min((time - this.heroLogoLastFrame) / 1000, 0.08);
        this.heroLogoLastFrame = time;
        if (this.heroLogoSpeed > this.baseHeroLogoSpeed) {
          const slowdown = 150 * elapsedSeconds;
          this.heroLogoSpeed = Math.max(this.baseHeroLogoSpeed, this.heroLogoSpeed - slowdown);
        }
        this.heroLogoAngle = (this.heroLogoAngle + this.heroLogoSpeed * elapsedSeconds) % 360;
        const logo = this.heroLogo?.nativeElement;
        if (logo) logo.style.transform = `rotate(${this.heroLogoAngle}deg)`;
        this.heroLogoFrame = requestAnimationFrame(rotate);
      };
      this.heroLogoFrame = requestAnimationFrame(rotate);
    });
  }
}
