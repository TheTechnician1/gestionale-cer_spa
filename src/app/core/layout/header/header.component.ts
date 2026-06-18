import { Component, EventEmitter, Output } from "@angular/core";
import { UtenteService } from "../../services/utente.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  constructor(private authService: UtenteService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  isLoggedIn$: Observable<boolean>;

  ngOnInit() {}

  logout() {
    this.authService.logout();
  }

  search(){
    
  }
}
