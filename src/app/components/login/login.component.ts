import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private toast: ToastService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      ricordami: [false],
    });
  }
  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.userService.login(this.loginForm.value).subscribe({
      next: (utente) => {
        if (this.loginForm.get('ricordami')?.value) {
          localStorage.setItem('utente', JSON.stringify(utente));
        } else {
          sessionStorage.setItem('utente', JSON.stringify(utente));
        }
        this.router.navigate(['/prodotti']);
      },
      error: () => {
        this.toast.error('Credenziali errate');
      },
    });
  }
}
