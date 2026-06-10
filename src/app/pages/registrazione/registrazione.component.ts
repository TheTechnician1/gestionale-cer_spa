import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErroreResponse } from 'src/app/models/errore-response';
import { RegisterRequest } from 'src/app/models/register-request';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-registrazione',
  templateUrl: './registrazione.component.html',
  styleUrls: ['./registrazione.component.scss'],
})
export class RegistrazioneComponent {
  registrazioneForm: FormGroup;
  messaggioErrore = '';
  messaggioSuccesso = '';
  caricamento = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.registrazioneForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confermaPassword: ['', [Validators.required]],
    });
  }

  registrati(): void {
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    if (this.registrazioneForm.invalid) {
      this.registrazioneForm.markAllAsTouched();
      this.messaggioErrore = 'Compila tutti i campi correttamente';
      return;
    }

    if (
      this.registrazioneForm.value.password !==
      this.registrazioneForm.value.confermaPassword
    ) {
      this.messaggioErrore = 'Le password non coincidono';
      return;
    }

    const request: RegisterRequest = {
      nome: this.registrazioneForm.value.nome,
      cognome: this.registrazioneForm.value.cognome,
      email: this.registrazioneForm.value.email,
      password: this.registrazioneForm.value.password,
      saldo: 500,
    };

    this.caricamento = true;

    this.authService.register(request).subscribe({
      next: () => {
        this.caricamento = false;
        this.messaggioSuccesso = 'Registrazione completata';
        this.registrazioneForm.reset();
      },
      error: (errore) => {
        const erroreResponse = errore.error as ErroreResponse;
        this.messaggioErrore =
          erroreResponse?.messaggio || 'Errore durante la registrazione';
        this.caricamento = false;
      },
    });
  }
}
