import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ErroreResponse } from '../../models/errore-response';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  messaggioErrore = '';
  caricamento = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  login(): void {
    this.messaggioErrore = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.messaggioErrore = 'Compila correttamente email e password';
      return;
    }

    this.caricamento = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (utente) => {
        localStorage.setItem('utente', JSON.stringify(utente));
        this.caricamento = false;
        console.log('Login effettuato', utente);
      },
      error: (errore) => {
        const erroreResponse = errore.error as ErroreResponse;
        this.messaggioErrore =
          erroreResponse?.messaggio || 'Errore durante il login';
        this.caricamento = false;
      },
    });
  }
}
