import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from "@angular/forms";
import { UtenteService } from "../../../services/utente.service";
import { Router } from "@angular/router";
import { ToastService } from "src/app/core/services/toast.service";

@Component({
  selector: "app-registrazione-utente",
  templateUrl: "./registrazione-utente.component.html",
  styleUrls: ["./registrazione-utente.component.scss"],
})
export class RegistrazioneUtenteComponent {
  constructor(private fb: FormBuilder, private authService: UtenteService, private route: Router, private toastService: ToastService) {}

  form = this.fb.group(
    {
      name: ["", [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      surname: ["", [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      email: ["", [Validators.required, Validators.email]],
      confirmEmail: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,64}$")]],
      confermaPassword: ["", [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{6,64}$")]]
    },
    { validators: [this.passwordMatchValidator, this.emailMatchValidator] },
  );

  hide = true;
  readonly nomeErrorMessages: Record<string, string>[] = [{ pattern: "Il nome puo contenere solo lettere." }];
  readonly cognomeErrorMessages: Record<string, string>[] = [{ pattern: "Il cognome puo contenere solo lettere." }];
  readonly passwordErrorMessages: Record<string, string>[] = [{ pattern: "Usa almeno una maiuscola, una minuscola, un numero e un carattere speciale." }];
  readonly confermaPasswordErrorMessages: Record<string, string>[] = [{ pattern: "Usa almeno una maiuscola, una minuscola, un numero e un carattere speciale." }, { passwordMismatch: "Le password non coincidono." }];

  ngOnInit() {}

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning("Compila correttamente tutti i campi obbligatori.", "Form non valido");
      return;
    }

    const { confermaPassword, confirmEmail, ...payload } = this.form.getRawValue();
    this.authService.createUtente(payload).subscribe({
      next: () => {
        this.toastService.success(
          "Sono stati accreditati 500€ sul tuo account.",
          "Registrazione completata"
        );
        this.form.reset();
        this.route.navigateByUrl("/login");
      },
      error: (error) => {
        console.error("Register error", error);
        this.toastService.error("Errore durante la registrazione.", "Errore");
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

  emailMatchValidator(form: AbstractControl) {
    const email = form.get("email")?.value;
    const confirmEmailControl = form.get("confirmEmail")?.value;
    const confirmEmail = confirmEmailControl?.value;

    if (!confirmEmailControl) return null;

    if (email && confirmEmail && email !== confirmEmail) {
      confirmEmailControl.setErrors({ emailMismatch: true });
    } else {
      if (confirmEmailControl.hasError("emailMismatch")) {
        confirmEmailControl.setErrors(null);
      }
    }

    return null;
  }
}
