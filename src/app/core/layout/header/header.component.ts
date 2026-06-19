import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { CartService } from "../../services/cart.service";
import { User } from "../../interfaces/user.model";
import { Cart } from "../../interfaces/cart.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent implements OnInit {

  user: User | null = null;
  cart: Cart | null = null;

  userName = "";
  cartCount = 0;

  constructor(
    private authService: AuthService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {

    // UTENTE
    this.authService.user$.subscribe(user => {
      this.user = user;

      if (user) {
        this.userName = user.nome + " " + user.cognome;
      } else {
        this.userName = "";
      }
    });

    // CARRELLO
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;

      if (cart && cart.items) {
        this.cartCount = cart.items.length;
      } else {
        this.cartCount = 0;
      }
    });
  }

  logout() {
    this.authService.logout();
  }
}