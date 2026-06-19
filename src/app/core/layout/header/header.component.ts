import { Component } from "@angular/core";
import { UtenteService } from "../../services/utente.service";
import { combineLatest, map, Observable, switchMap } from "rxjs";
import { Router } from "@angular/router";
import { CartService } from "../../services/cart.service";
import { ApiService } from "../../services/api.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  constructor(private authService: UtenteService, private cartService: CartService, private apiService: ApiService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
  isLoggedIn$: Observable<boolean>;
  user$ = this.authService.user$;
  cartCount$!: Observable<number>;
  searchTerm: string = "";
  results: any[] = [];
  searchTimeout: any;
  balance!: number | null;
  editingBalance = false;
  newBalance!: number | null;

  ngOnInit(): void {
    this.cartCount$ = combineLatest([
    this.user$,
    this.cartService.cart$
    ]).pipe(
      map(([user, cart]) => {
        if (!user?.id) return 0;

        return (cart.items ?? []).reduce(
          (sum, item) => sum + (item.quantita ?? 0),
          0
        );
      })
    );
  }

  logout() {
    this.authService.logout();
    this.cartService.loadGuestCartState();
  }

  search() {
    const term = this.searchTerm.trim();
    if (!term) {
      this.router.navigate(['/ricerca-avanzata']);
      return;
    }

    this.apiService.get<any[]>(`/api/products/search/${term}`)
      .subscribe(res => {
        if (!res || res.length === 0) {
          this.router.navigate(['/ricerca-avanzata'], {
            queryParams: { q: term }
          });
          return;
        }
        this.results = res;
      });
  }

  goToProduct(id: number) {
    this.results = [];
    this.router.navigate(['/prodotto', id]);
  }

  onSearchChange() {
    clearTimeout(this.searchTimeout);
    if (this.searchTerm.trim().length < 2) {
      this.results = [];
      return;
    }
    this.searchTimeout = setTimeout(() => {
      this.apiService.get<any[]>(`/api/products/search/${this.searchTerm}`)
        .subscribe(res => {
          this.results = res;
        });
    }, 300);
  }

  advancedSearchElettronica() {
    this.router.navigate(['/ricerca-avanzata'], {
      queryParams: { category: 'Elettronica' }
    });
  }

  advancedSearchCasa() {
    this.router.navigate(['/ricerca-avanzata'], {
      queryParams: { category: 'Casa e Cucina' }
    });
  }

  advancedSearchLibri() {
    this.router.navigate(['/ricerca-avanzata'], {
      queryParams: { category: 'Libri' }
    });
  }

  advancedSearchModa() {
    this.router.navigate(['/ricerca-avanzata'], {
      queryParams: { category: 'Abbigliamento' }
    });
  }

  advancedSearchSport() {
    this.router.navigate(['/ricerca-avanzata'], {
      queryParams: { category: 'Sport e Fitness' }
    });
  }
}
