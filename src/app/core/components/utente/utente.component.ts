import { Utente, UtenteModel } from "./../../interfaces/utente.model";
import { Component } from "@angular/core";
import { UtenteService } from "../../services/utente.service"

@Component({
  selector: "app-utente",
  templateUrl: "./utente.component.html",
  styleUrls: ["./utente.component.scss"],
})
export class UtenteComponent {
  constructor(private utenteService: UtenteService) {}

  utente: Utente | null = new UtenteModel();
  showPassword = false;

  ngOnInit() {
    this.loadUtente();
  }

  loadUtente() {
    this.utente = this.utenteService.currentUser;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
