import { Component, EventEmitter, Output } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  isLoggedIn$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }
}
