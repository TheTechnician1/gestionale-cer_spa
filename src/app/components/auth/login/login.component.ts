import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AbstractControl, FormBuilder, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { AuthService } from "../../../core/services/auth.service";

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get("password")?.value as string | null;
  const confirmPassword = control.get("confirmPassword")?.value as string | null;

  if (!password || !confirmPassword) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  showPassword = true;
  form = this.fb.group(
    {
      utente_email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    },
    { validators: [passwordMatchValidator] },
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const email = this.form.get("utente_email")?.value as string | null;
    if (!email) {
      return;
    }

    const password = this.form.get("password")?.value as string | null;
    const forceError = password === "errore";

    const payload = { utente_email: email ?? "", password: password ?? "" };

    this.authService.loginMock(payload, false).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl("/dashboard");
      },
      error: (error) => {
        console.error("Login error", error);
      },
    });
  }

  onGuestLogin(): void {
    const payload = { utente_email: "guest@guest.guest", password: "guest" };

    this.authService.loginGuest(payload).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigateByUrl("/dashboard");
      },
      error: (error) => {
        console.error("Login error", error);
      },
    });
  }
}
