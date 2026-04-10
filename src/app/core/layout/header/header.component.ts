import { Component, EventEmitter, Output } from "@angular/core";
import { Observable, combineLatest, map } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { Utente } from "../../interfaces/utente.model";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  isLoggedIn$: Observable<boolean>;
  user$: Observable<Utente | null>;
  userTooltip$: Observable<string>;
  accountIcon$: Observable<string>;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.user$ = this.authService.user$;

    this.userTooltip$ = this.user$.pipe(
      map((user) => {
        if (!user) return "";

        return [
          `ID Utente: ${user.id_utente ?? "-"}`,
          `Nome: ${user.nome_utente ?? "-"}`,
          `Cognome: ${user.cognome_utente ?? "-"}`,
          `Ruolo: ${user.ruolo ?? "-"}`
        ].join("\n");
      })
    );

    this.accountIcon$ = combineLatest([
      this.isLoggedIn$,
      this.user$
    ]).pipe(
      map(([isLoggedIn, user]) =>
        isLoggedIn && user ? "verified_user" : "account_circle"
      )
    );
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}