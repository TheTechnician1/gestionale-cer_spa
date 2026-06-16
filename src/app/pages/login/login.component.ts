import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ErroreResponse } from '../../models/errore-response';
import { AuthService } from '../../services/auth.service';
import { UtenteStorageService } from '../../services/utente-storage.service';

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
    private router: Router,
    private utenteStorageService: UtenteStorageService,
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
        this.utenteStorageService.salvaUtente(utente);
        this.caricamento = false;
        this.router.navigate(['/home']);
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