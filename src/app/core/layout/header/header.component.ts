import { Component, EventEmitter, Output } from "@angular/core";
import { UtenteService } from "../../services/utente.service";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  constructor(private authService: UtenteService,  private router: Router) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  isLoggedIn$: Observable<boolean>;

  searchTerm: string = "";

  ngOnInit() {}

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
}
