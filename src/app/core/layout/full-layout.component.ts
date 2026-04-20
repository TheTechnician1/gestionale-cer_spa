import { Component } from "@angular/core";
import { UtenteService } from "../services/utente.service";
import { Observable } from "rxjs";


@Component({
  selector: "app-full-layout",
  templateUrl: "./full-layout.component.html",
  styleUrls: ["./full-layout.component.scss"],
})
export class FullLayoutComponent {
    constructor(private authService: UtenteService) {this.isLoggedIn$ = this.authService.isLoggedIn$;}

    isLoggedIn$: Observable<boolean>;

    ngOnInit() {}
}
