import { Component } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-full-layout",
  templateUrl: "./full-layout.component.html",
  styleUrls: ["./full-layout.component.scss"],
})
export class FullLayoutComponent {
  isLogged: any;
  constructor(private authService: AuthService) {
    }

    ngOnInit() {
      this.authService.isLogged$.subscribe(status => {
        this.isLogged = status;
      });
    }
}
