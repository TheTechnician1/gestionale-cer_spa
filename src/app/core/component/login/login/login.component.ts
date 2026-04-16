import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  loginForm!: FormGroup;
  loginError = false;
  constructor(private fb: FormBuilder, private authService: AuthService, private router: ActivatedRoute, private route: Router) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      rememberMe: [false]
    });
  }

  hide = true;

  onSubmit() {
    if (this.loginForm.valid) {

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe(user => {
        console.log(user, "sono qui");

        this.authService.isAuthenticated(user)

        if(user) {
          console.log('Login riuscito');
          this.loginError = false;
          console.log('Ruolo:', user.role);
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
    this.authService.login("guest@guest.guest", "guest").subscribe(user => {
      console.log(user, "sono qui");

      this.authService.isAuthenticated(user)

      if(user) {
        console.log('Login riuscito');
        this.loginError = false;
        console.log('Ruolo:', user.role);
        this.route.navigate(['/dashboard']);
      } else {
        console.log('Credenziali errate');
        this.loginError = true;
      }
    });
    console.log(this.loginForm.value);
  }
}
