import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/core/services/auth.service";
import { ToastService } from "src/app/core/services/toast.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  loginError = false;
  hide = true;

  readonly passwordErrorMessages: Record<string, string>[] = [{ pattern: "Password non valida per formato o lunghezza." }];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this .loginForm.markAllAsTouched();
      this.toastService.warning("Controlla email e password","Form non valido");
      return;
    }
      
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loginError = false;
        this.route.navigate(["/products"]);
      },
      error: (err) => {
        console.log("ERRORE LOGIN");
        console.log(err);

        this.loginError = true;
        this.toastService.warning("Credenziali errate", "Login fallito");
      }
    });
  }
}
