import { Component } from "@angular/core";
import { UtenteService } from "../../services/utente.service"
import { FormControl, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-utente",
  templateUrl: "./utente.component.html",
  styleUrls: ["./utente.component.scss"],
})
export class UtenteComponent {
  constructor(private utenteService: UtenteService, private snackBar: MatSnackBar) {}
  utente$ = this.utenteService.user$;
  showPassword = false;

  addControl = new FormControl<number | null>(0, [Validators.min(0)]);

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  addBalance() {
    const amount = Number(this.addControl.value);
    if (isNaN(amount) || amount <= 0) return;
    const id = this.utenteService.currentUser!.id;

    this.utenteService.updateBalance(id!, amount).subscribe({
      next: () => {
        this.snackBar.open("Saldo aggiunto con successo", "OK", { duration: 2000 });
        this.addControl.setValue(0);
      },
      error: () => {
        this.snackBar.open("Errore durante l'aggiornamento del saldo", "OK", { duration: 3000 });
      }
    });
  }
}
