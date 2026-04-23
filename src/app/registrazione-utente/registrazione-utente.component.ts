import { Component, inject } from '@angular/core';
import { FormControl, FormGroupDirective, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  RegistrazioneUtentePayload,
  RegistrazioneUtenteService,
} from '../core/services/registrazione-utente.service';

@Component({
  selector: 'app-registrazione-utente',
  templateUrl: './registrazione-utente.component.html',
  styleUrls: ['./registrazione-utente.component.scss'],
})
export class RegistrazioneUtenteComponent {
  public ultimoPayloadInviato: RegistrazioneUtentePayload | null = null;
  public rispostaBackend: string | null = null;

  nascondiPassword: boolean = true;
  nascondiConfermaPassword: boolean = true;
  formRegistrazione: FormGroup;

  private snackBar = inject(MatSnackBar);

  constructor(private registrazioneUtenteService: RegistrazioneUtenteService) {
    this.formRegistrazione =
      this.registrazioneUtenteService.creaFormRegistrazioneUtente();
  }

  get nome(): FormControl {
    return this.formRegistrazione.get('nome') as FormControl;
  }

  get cognome(): FormControl {
    return this.formRegistrazione.get('cognome') as FormControl;
  }

  get codiceFiscale(): FormControl {
    return this.formRegistrazione.get('codiceFiscale') as FormControl;
  }

  get email(): FormControl {
    return this.formRegistrazione.get('email') as FormControl;
  }

  get numeroTelefono(): FormControl {
    return this.formRegistrazione.get('numeroTelefono') as FormControl;
  }

  get ruolo(): FormControl {
    return this.formRegistrazione.get('ruolo') as FormControl;
  }

  get password(): FormControl {
    return this.formRegistrazione.get('password') as FormControl;
  }

  get confermaPassword(): FormControl {
    return this.formRegistrazione.get('confermaPassword') as FormControl;
  }

  get elencoRuoli(): string[] {
    return this.registrazioneUtenteService.elencoRuoli;
  }
  
  inviaModulo(formDirective: FormGroupDirective): void {
    if (this.formRegistrazione.invalid) {
      this.formRegistrazione.markAllAsTouched();
      return;
    }

    const datiUtente: RegistrazioneUtentePayload =
      this.registrazioneUtenteService.normalizzaPayload(this.formRegistrazione);

    this.ultimoPayloadInviato = datiUtente;
    console.log('Payload registrazione utente:', datiUtente);

    this.registrazioneUtenteService.registraUtente(datiUtente).subscribe({
      next: (risposta) => {
        this.rispostaBackend = risposta;

        this.snackBar.open(
          risposta || 'Utente registrato con successo',
          'Chiudi',
          {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top',
          }
        );

        formDirective.resetForm();
        this.formRegistrazione.reset();

        this.nascondiPassword = true;
        this.nascondiConfermaPassword = true;
      },
      error: (errore) => {
        const messaggioErrore =
          errore?.error ||
          'Errore durante l\'invio della registrazione al backend';

        console.error('Errore registrazione utente:', errore);
        this.rispostaBackend = messaggioErrore;

        this.snackBar.open(messaggioErrore, 'Chiudi', {
          duration: 4000,
          horizontalPosition: 'end',
          verticalPosition: 'top',
        });
      },
    });
  }
}
