import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
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
  passwordVisibile = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private utenteStorageService: UtenteStorageService,
    private toastService: ToastService,
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  cambiaVisibilitaPassword(): void {
    this.passwordVisibile = !this.passwordVisibile;
  }

  login(): void {
    this.messaggioErrore = '';

    const email = this.loginForm.get('email');
    const password = this.loginForm.get('password');

    if (email?.invalid && password?.invalid) {
      this.loginForm.markAllAsTouched();
      this.messaggioErrore = 'Inserisci email e password';
      this.toastService.mostraErrore('Inserisci email e password');
      return;
    }

    if (password?.invalid) {
      this.loginForm.markAllAsTouched();
      this.messaggioErrore = 'Inserisci la password';
      this.toastService.mostraErrore('Inserisci la password');
      return;
    }

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.messaggioErrore = 'Inserisci email e password';
      this.toastService.mostraErrore('Inserisci email e password');
      return;
    }

    this.caricamento = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (utente) => {
        this.utenteStorageService.salvaUtente(utente);
        this.caricamento = false;
        this.toastService.mostraSuccesso('Accesso effettuato con successo');
        this.router.navigate(['/home']);
      },
      error: (errore) => {
        this.messaggioErrore = 'Email o password non valide';
        this.toastService.mostraErrore('Email o password non valide', errore.status);
        this.caricamento = false;
      },
    });
  }
}
