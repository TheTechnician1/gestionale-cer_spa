import { Component, EventEmitter, Output } from "@angular/core";
import { UtenteService } from "../../services/utente.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { CartService } from "../../services/cart.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  constructor(private authService: UtenteService, private cartService: CartService, private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  isLoggedIn$: Observable<boolean>;
  user$ = this.authService.user$;
  cartCount$ = this.cartService.cartCount$;
  searchTerm: string = "";
  balance = 0;

  ngOnInit() {
    this.user$.subscribe(user => {
    if (user) {
      this.balance = user.balance!;
    }
  });
  }

  logout() {
    this.authService.logout();
  }

  search(): void {
    if (!this.searchTerm.trim()) {
      return;
    }

    this.router.navigate(['/products'], {
      queryParams: { search: this.searchTerm }
    });
  }

  addBalance(event: Event) {
    event.stopPropagation();
    this.balance += 10;
  }
}
