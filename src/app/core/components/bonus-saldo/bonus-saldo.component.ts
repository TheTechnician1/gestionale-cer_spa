import { Component } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { Router } from '@angular/router';
import { SharedModule } from "src/app/shared/shared.module";

@Component({
  selector: 'app-bonus-saldo',
  templateUrl: './bonus-saldo.component.html',
  styleUrls: ['./bonus-saldo.component.scss'],
})
export class BonusSaldoComponent {
  constructor(private route: Router) {}

  onClick() {
    this.route.navigate(["login"]);
  }
}
