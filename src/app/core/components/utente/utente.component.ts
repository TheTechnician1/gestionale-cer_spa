import { Utente, UtenteModel } from "./../../interfaces/utente.model";
import { Component } from "@angular/core";
import { UtenteService } from "../../services/utente.service"
import { FormControl, Validators } from "@angular/forms";
import { finalize } from "rxjs";
import { MatSnackBar } from "@angular/material/snack-bar";

@Component({
  selector: "app-utente",
  templateUrl: "./utente.component.html",
  styleUrls: ["./utente.component.scss"],
})
export class UtenteComponent {
  constructor(private utenteService: UtenteService, private snackBar: MatSnackBar) {}

  utente: Utente | null = new UtenteModel();
  showPassword = false;
  balance!: number | null;
  editing = false;
  saving = false;
  originalBalance = 0;
  balanceControl = new FormControl<number | null>(null, [Validators.required, Validators.min(0)]);

  ngOnInit() {
    this.loadUtente();
    this.balance = this.utenteService.getBalance();
  }

  loadUtente() {
    this.utente = this.utenteService.currentUser;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  startEdit() {
    this.originalBalance = this.utente!.balance ?? 0;
    this.balanceControl.setValidators([Validators.required,Validators.min(this.originalBalance)]);
    this.balanceControl.updateValueAndValidity();
    this.balanceControl.setValue(this.originalBalance);
    this.editing = true;
  }

  cancelEdit() {
    this.editing = false;
    this.balanceControl.reset();
  }

  isLowerThanOriginal(): boolean {
    const val = Number(this.balanceControl.value);
    return isNaN(val) ? true : val < (this.originalBalance ?? 0);
  }

  saveBalance() {
    if (this.balanceControl.invalid) return;
    const newBalance = Number(this.balanceControl.value);
    if (isNaN(newBalance)) return;
    if (newBalance < (this.originalBalance ?? 0)) {
      this.snackBar.open(`Il saldo non può essere inferiore a ${this.originalBalance.toFixed(2)} €`, 'OK', { duration: 3000 });
      return;
    }
    const previous = this.utente!.balance;
    const id = this.utente?.id;
    this.utente!.balance = newBalance;
    this.saving = true;
    this.utenteService.updateBalance(id!, newBalance)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: () => {
          this.editing = false;
          this.snackBar.open('Saldo aggiornato', 'OK', { duration: 2000 });
        },
        error: (err) => {
          this.utente!.balance = previous;
          const msg = err?.error?.message || 'Errore durante l\'aggiornamento del saldo';
          this.snackBar.open(msg, 'OK', { duration: 3500 });
          console.error('updateBalance error', err);
        }
      });
  }
}
