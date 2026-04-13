import { Component, EventEmitter, Output } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  @Output() toggleSidebar = new EventEmitter<void>();
  constructor(private authService: AuthService) {}

  isLog = false;

  ngOnInit() {
    this.authService.isLogged$.subscribe(status => {
      this.isLog = status;
    });
  }

  logout() {
    this.authService.logout();
  }
}
