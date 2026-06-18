import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ErroreResponse } from 'src/app/models/errore-response';
import { RegisterRequest } from 'src/app/models/register-request';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

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
    private toastService: ToastService,
  ) {
    this.registrazioneForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      cognome: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confermaPassword: ['', [Validators.required]],
    });
  }

  registrati(): void {
    this.messaggioErrore = '';
    this.messaggioSuccesso = '';

    const messaggioValidazione = this.recuperaMessaggioValidazione();

    if (messaggioValidazione) {
      this.registrazioneForm.markAllAsTouched();
      this.messaggioErrore = messaggioValidazione;
      this.toastService.mostraErrore(messaggioValidazione);
      return;
    }

    if (
      this.registrazioneForm.value.password !==
      this.registrazioneForm.value.confermaPassword
    ) {
      this.messaggioErrore = 'Le password inserite non coincidono';
      this.toastService.mostraErrore('Le password inserite non coincidono');
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
        this.messaggioSuccesso = 'Account creato con successo';
        this.toastService.mostraSuccesso('Account creato con successo');
        this.registrazioneForm.reset();
      },
      error: (errore) => {
        const erroreResponse = errore.error as ErroreResponse;
        const messaggioErrore = this.mappaErroreRegistrazione(
          erroreResponse?.messaggio,
        );

        this.messaggioErrore = messaggioErrore;
        this.toastService.mostraErrore(messaggioErrore);
        this.caricamento = false;
      },
    });
  }

  private recuperaMessaggioValidazione(): string {
    const nome = this.registrazioneForm.get('nome');
    const cognome = this.registrazioneForm.get('cognome');
    const email = this.registrazioneForm.get('email');
    const password = this.registrazioneForm.get('password');

    if (nome?.hasError('required')) {
      return 'Inserisci il nome';
    }

    if (cognome?.hasError('required')) {
      return 'Inserisci il cognome';
    }

    if (email?.hasError('required')) {
      return 'Inserisci la mail';
    }

    if (email?.hasError('email')) {
      return 'Inserisci un indirizzo email valido';
    }

    if (password?.hasError('required')) {
      return 'Inserisci la password';
    }

    if (password?.hasError('minlength')) {
      return 'La password deve contenere almeno 8 caratteri';
    }

    if (this.registrazioneForm.invalid) {
      return 'Compila tutti i campi obbligatori';
    }

    return '';
  }

  private mappaErroreRegistrazione(messaggioBackend?: string): string {
    if (!messaggioBackend) {
      return 'Utente giÃ  registrato';
    }

    const messaggioNormalizzato = messaggioBackend.toLowerCase();

    if (
      messaggioNormalizzato.includes('email') &&
      (messaggioNormalizzato.includes('uso') ||
        messaggioNormalizzato.includes('registr'))
    ) {
      return 'Esiste giÃ  un account associato a questa email';
    }

    if (messaggioNormalizzato.includes('registr')) {
      return 'Utente giÃ  registrato';
    }

    if (messaggioNormalizzato.includes('password')) {
      return messaggioBackend;
    }

    return messaggioBackend;
  }
}