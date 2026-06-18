import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UtenteService } from "src/app/core/services/utente.service";
import { ToastService } from "src/app/core/services/toast.service";
import { CartService } from "src/app/core/services/cart.service";
import { of } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginError = false;
  hide = false;
  readonly passwordErrorMessages: Record<string, string>[] = [{ pattern: "Password non valida per formato o lunghezza." }];
  constructor(private fb: FormBuilder, private authService: UtenteService, private cartService: CartService, private route: Router, private toastService: ToastService) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required, Validators.minLength(6), Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{6,64}$")]]
    });
  }

  onSubmit() {
    if(!this.loginForm.valid) {
      this.loginForm.markAllAsTouched();
      this.toastService.warning("Controlla email e password prima di continuare.", "Form non valido");
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: (user) => {
        const guestItems = this.cartService.getGuestCart();
        const merge$ = guestItems.length > 0 ? this.cartService.mergeGuestCartIntoUser(user.id!) : of(null);
        merge$.subscribe({
          next: () => {
            this.cartService.clearGuestCart();
            this.authService['userSubject'].next(user);
            console.log("Login riuscito", user);
            this.cartService.notifyCartChange();
            this.loginError = false;
            this.route.navigate(['/']);
          },
          error: (err) => {
            console.error("Errore login:", err);
            this.loginError = true;
            this.toastService.warning("Credenziali non valide", "Login fallito");
            this.authService['userSubject'].next(user);
            this.route.navigate(['/']);
          }
        });
      }
    });
  }
}

