import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from "@angular/forms";
import { AuthService } from "../../../services/auth.service";
import { Router } from "@angular/router";
import { ToastService } from "src/app/core/services/toast.service";

@Component({
  selector: "app-registrazione",
  templateUrl: "./registrazione.component.html",
  styleUrls: ["./registrazione.component.scss"],
})
export class RegistrazioneComponent {
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private toastService: ToastService,
  ) {}

  form = this.fb.group(
    {
      nome: ["", [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      cognome: ["", [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      confermaPassword: ["", [Validators.required, Validators.minLength(6)]],
      saldo: [0, [Validators.required, Validators.min(0)]],
    },
    { validators: this.passwordMatchValidator },
  );

  hide = true;
  readonly nomeErrorMessages: Record<string, string>[] = [{ pattern: "Il nome puo contenere solo lettere." }];
  readonly cognomeErrorMessages: Record<string, string>[] = [{ pattern: "Il cognome puo contenere solo lettere." }];
  readonly emailErrorMessages: Record<string, string>[] = [{ pattern: ""}]
  readonly passwordErrorMessages: Record<string, string>[] = [{ pattern: "Usa almeno una maiuscola, una minuscola, un numero e un carattere speciale." }];
  readonly confermaPasswordErrorMessages: Record<string, string>[] = [{ pattern: "Usa almeno una maiuscola, una minuscola, un numero e un carattere speciale." }, { passwordMismatch: "Le password non coincidono." }];

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.toastService.warning("Compila correttamente tutti i campi obbligatori.", "Form non valido");
      return;
    }

   const raw = this.form.getRawValue();

const payload = {
  nome: raw.nome ?? "",
  cognome: raw.cognome ?? "",
  email: raw.email ?? "",
  password: raw.password ?? "",
  saldo: raw.saldo ?? 0,
};
    this.authService.register(payload).subscribe({
      next: () => {
        this.form.reset();
        this.route.navigateByUrl("/login");
      },
      error: (err) => console.error("Register error", err),
    });
  }

  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get("password")?.value;
    const confermaPassword = form.get("confermaPassword")?.value;


    if (password !== confermaPassword) {
      form.get("confermaPassword")?.setErrors({ passwordMismatch: true});
      return { passwordMismatch: true };
    }

    return null;
  }
}
