import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { UtenteService } from "src/app/core/services/utente.service";
import { ToastService } from "src/app/core/services/toast.service";
import { CartService } from "src/app/core/services/cart.service";
import { map, of, switchMap } from "rxjs";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  loginForm!: FormGroup;
  loginError = false;
  hide = false;
  readonly emailErrorMessages: Record<string, string>[] = [
    { required: "Email obbligatoria" },
    { email: "Inserisci un indirizzo email valido." }
  ];
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

    this.authService.login(this.loginForm.value).pipe(
      switchMap(user => { const guestItems = this.cartService.getGuestItems();
        return guestItems.length > 0
          ? this.cartService.mergeGuestCartIntoUser(user.id!).pipe(map(() => user))
          : of(user);
      })
    ).subscribe({
      next: (user) => {
        this.authService['userSubject'].next(user);
        this.cartService.clearGuestCart();
        this.cartService.notifyCartChange();
        this.loginError = false;
        this.route.navigate(['/']);
      },
      error: (err) => {
        this.loginError = true;
        this.toastService.warning("Credenziali non valide", "Login fallito");
      }
    });
  }
}

