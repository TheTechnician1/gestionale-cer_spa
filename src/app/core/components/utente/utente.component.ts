import { UtenteLogin } from "./../../interfaces/utente.model";
import { Component } from "@angular/core";
import { UtenteService } from "../../services/utente.service"
import { UtenteLoginModel } from "../../interfaces/utente.model";

@Component({
  selector: "app-utente",
  templateUrl: "./utente.component.html",
  styleUrls: ["./utente.component.scss"],
})
export class UtenteComponent {
  constructor(
    private utenteService: UtenteService,
  ) {}

  utente: UtenteLogin | null = new UtenteLoginModel();

  ngOnInit() {
    this.loadUtente();
  }

  loadUtente() {
    this.utente = this.utenteService.currentUser;
  }
}
