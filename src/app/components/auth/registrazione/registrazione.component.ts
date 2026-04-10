import { Component } from "@angular/core";
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { RegexEnum } from "../../../core/util/regex.enum";

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get("password")?.value as string | null;
  const confirmPassword = control.get("confirmPassword")?.value as string | null;
  const confirmControl = control.get("confirmPassword");

  if (!password || !confirmPassword) {
    if (confirmControl?.hasError("passwordMismatch")) {
      const errors = { ...(confirmControl.errors ?? {}) };
      delete errors["passwordMismatch"];
      confirmControl.setErrors(Object.keys(errors).length ? errors : null);
    }
    return null;
  }

  if (password !== confirmPassword) {
    const errors = { ...(confirmControl?.errors ?? {}) };
    errors["passwordMismatch"] = true;
    confirmControl?.setErrors(errors);
    return { passwordMismatch: true };
  }

  if (confirmControl?.hasError("passwordMismatch")) {
    const errors = { ...(confirmControl.errors ?? {}) };
    delete errors["passwordMismatch"];
    confirmControl.setErrors(Object.keys(errors).length ? errors : null);
  }

  return null;
};

@Component({
  selector: "app-registrazione",
  templateUrl: "./registrazione.component.html",
  styleUrls: ["./registrazione.component.scss"],
})
export class RegistrazioneComponent {
  roles = [
    { code: "1", labelKey: "ADMIN" },
    { code: "2", labelKey: "GEST" },
  ];
  showPassword = true;
  showConfirmPassword = true;

  form = this.fb.group(
    {
      nome: [null, [Validators.required]],
      cognome: [null, [Validators.required]],
      codiceFiscale: [null, [Validators.required, Validators.pattern(new RegExp(RegexEnum.CODICE_FISCALE, "i"))]],
      telefono: [null, [Validators.required, Validators.pattern(new RegExp(RegexEnum.PHONE))]],
      email: [null, [Validators.required, Validators.email]],
      ruolo: [null, [Validators.required]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(16), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/)]],
      confirmPassword: [null, [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  constructor(private fb: FormBuilder) {}

  get passwordControl(): AbstractControl | null {
    return this.form.get("password");
  }

  get confirmPasswordControl(): AbstractControl | null {
    return this.form.get("confirmPassword");
  }

  isPasswordRuleValid(rule: "min" | "max" | "lower" | "upper" | "number" | "special"): boolean {
    const value = (this.passwordControl?.value as string | null) ?? "";

    switch (rule) {
      case "min":
        return value.length >= 8;
      case "max":
        return value.length <= 16;
      case "lower":
        return /[a-z]/.test(value);
      case "upper":
        return /[A-Z]/.test(value);
      case "number":
        return /\d/.test(value);
      case "special":
        return /[^A-Za-z0-9]/.test(value);
      default:
        return false;
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // TODO: inviare i dati al backend
    const payload = this.form.getRawValue();
    console.log("Registrazione payload", payload);
  }
}
