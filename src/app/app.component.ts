import { Component } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { UtenteService } from "./core/services/utente.service";
import { CartService } from "./core/services/cart.service";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {

  constructor(private translate: TranslateService, private authService: UtenteService, private cartService: CartService) {
    this.translate.setDefaultLang("en");
    this.translate.use("en");
  }

  ngOnInit(): void {}
}
