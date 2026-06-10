import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from "@angular/forms";
import { Ruolo } from "src/app/core/interfaces/ruolo.model";
import { UtenteService } from "../../../services/utente.service";
import { Router } from "@angular/router";
import { ToastService } from "src/app/core/services/toast.service";

@Component({
  selector: "app-registrazione-utente",
  templateUrl: "./registrazione-utente.component.html",
  styleUrls: ["./registrazione-utente.component.scss"],
})
export class RegistrazioneUtenteComponent {
  constructor(
    private fb: FormBuilder,
    private authService: UtenteService,
    private route: Router,
    private toastService: ToastService,
  ) {}

  form = this.fb.group(
    {
      nome: ["", [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      cognome: ["", [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      email: ["", [Validators.required, Validators.email]],
      pwd: ["", [Validators.required, Validators.minLength(8), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$")]],
      saldo: [0],
      id: [null],
    }
  );

  hide = true;
  readonly nomeErrorMessages: Record<string, string>[] = [{ pattern: "Il nome puo contenere solo lettere." }];
  readonly cognomeErrorMessages: Record<string, string>[] = [{ pattern: "Il cognome puo contenere solo lettere." }];
  readonly passwordErrorMessages: Record<string, string>[] = [{ pattern: "Usa almeno una maiuscola, una minuscola, un numero e un carattere speciale." }];
  ruoli: Ruolo[] = [
    { value: "ADMIN", viewValue: "Admin" },
    { value: "GEST", viewValue: "Gestore" },
  ];

  ngOnInit() {
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning("Compila correttamente tutti i campi obbligatori.", "Form non valido");
      return;
    }

    const payload = this.form.getRawValue();
    this.authService.createUtente(payload).subscribe({
      next: () => {
        this.form.reset();
        this.route.navigateByUrl("/dashboard");
      },
      error: (error) => {
        console.error("Register error", error);
      },
    });
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get("password")?.value;
    const confermaPasswordControl = form.get("confermaPassword");
    const confermaPassword = confermaPasswordControl?.value;

    if (!confermaPasswordControl) {
      return null;
    }

    const existingErrors: ValidationErrors = confermaPasswordControl.errors ?? {};
    const hasMismatchError = "passwordMismatch" in existingErrors;
    const hasMismatch = Boolean(password && confermaPassword && password !== confermaPassword);

    if (hasMismatch) {
      if (!hasMismatchError) {
        confermaPasswordControl.setErrors({ ...existingErrors, passwordMismatch: true });
      }
      return null;
    }

    if (hasMismatchError) {
      const { passwordMismatch, ...remainingErrors } = existingErrors;
      confermaPasswordControl.setErrors(Object.keys(remainingErrors).length > 0 ? remainingErrors : null);
    }

    return null;
  }
}
