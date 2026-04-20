import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtenteService } from 'src/app/core/services/utente.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm!: FormGroup;
  loginError = false;
  constructor(private fb: FormBuilder, private authService: UtenteService, private router: ActivatedRoute, private route: Router) {}

  hide = true;

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      utente_email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      rememberMe: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const payload = this.loginForm.value;
      this.authService.login(payload).subscribe(user => {
        this.authService.isAuthenticated(user);

        if(user) {
          console.log('Login riuscito');
          this.loginError = false;
          this.route.navigate(['/dashboard']);
        } else {
          console.log('Credenziali errate');
          this.loginError = true;
        }
      });
      console.log(this.loginForm.value);
    }
  }

  guestIn() {
    const payload = { utente_email: "guest@guest.guest", password: "guest" }
    this.authService.loginGuest(payload).subscribe(user => {

      this.authService.isAuthenticated(user)

      if(user) {
        console.log('Login riuscito, come guest');
        this.loginError = false;
        this.route.navigate(['/dashboard']);
      } else {
        console.log('Credenziali errate');
        this.loginError = true;
      }
    });
  }
}
