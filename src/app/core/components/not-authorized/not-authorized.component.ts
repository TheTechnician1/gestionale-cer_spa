import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-not-authorized",
  templateUrl: "./not-authorized.component.html",
  styleUrls: ["./not-authorized.component.scss"],
})
export class NotAuthorizedComponent {
  constructor(private route: Router) {}

  onClick() {
    if(localStorage.getItem("utente"))
      this.route.navigate(["/prodotti"]);
    else
      this.route.navigate(["/login"]);
  }
}
