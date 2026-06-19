import { UtenteLogin } from "./../../interfaces/utente.model";
import { Component } from "@angular/core";
import { UtenteService } from "../../services/utente.service";
import { Router } from "@angular/router";
import { UtenteLoginModel } from "../../interfaces/utente.model";
import Decimal from "decimal.js";
import { FormBuilder, Validators } from "@angular/forms";
import { ToastService } from "../../services/toast.service";


@Component({
  selector: "app-utente",
  templateUrl: "./utente.component.html",
  styleUrls: ["./utente.component.scss"],
})
export class UtenteComponent {
  constructor(
    private fb: FormBuilder,
    private utenteService: UtenteService,
    private route: Router,
    private toastService: ToastService,
  ) {}

  utente: UtenteLogin | null = new UtenteLoginModel();
  update: boolean = false;
  saldo?: Decimal | null;

  ngOnInit() {
    this.loadUtente();
  }

  loadUtente() {
    this.utente = this.utenteService.currentUser;
  }




  form = this.fb.group(
      {
        nuovoSaldo : ["", [Validators.required, Validators.min(0)]],
        email: [""]
      },
    );

   onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning("Inserisci un saldo sufficiente oppure, se hai cambiato idea, inserisci 0.", "Saldo non valido");
      return;
    }



    let payload = this.form.getRawValue().email!;
    payload = this.utente?.email!

    this.utenteService.updateSaldo(this.form.getRawValue().nuovoSaldo!, payload).subscribe({
      next: (result: any) => {
        console.log(result);
        this.form.reset();
        this.route.navigateByUrl("dashboard");
      },
      error: (error: any) => {
        console.error("UpdateSaldo error", error);
      },
    });
  }

}
