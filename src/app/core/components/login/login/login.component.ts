import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UtenteService } from "src/app/core/services/utente.service";
import { ToastService } from "src/app/core/services/toast.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginError = false;
  readonly passwordErrorMessages: Record<string, string>[] = [{ pattern: "Password non valida per formato o lunghezza." }];
  constructor(
    private fb: FormBuilder,
    private authService: UtenteService,
    private route: Router,
    private toastService: ToastService,
  ) {}

  hide = true;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(8), Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const payload = this.loginForm.value;
      this.doLogin(payload);

      console.log(this.loginForm.value);
      return;
    }

    this.loginForm.markAllAsTouched();
    this.toastService.warning("Controlla email e password prima di continuare.", "Form non valido");
  }

  private doLogin(payload: any) {
    this.authService.login(payload).subscribe({
      next: (user) => {
        this.authService.isAuthenticated(user);

        if (user) {
          console.log("Login riuscito");
          this.loginError = false;
          this.route.navigate(["/dashboard"]);
        } else {
          console.log("Credenziali errate");
          this.loginError = true;
        }
      },
      error: (err) => {
        console.error("Errore login:", err);
        this.loginError = true;
      },
    });
  }
}
