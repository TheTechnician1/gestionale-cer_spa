import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroupDirective,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from '../core/services/api.service';

interface RegistrazioneUtentePayload {
  nome: string;
  cognome: string;
  codiceFiscale: string;
  email: string;
  numeroTelefono: string;
  ruolo: string;
  password: string;
}

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
  elencoRuoli: string[] = ['ADMIN', 'GEST'];

  private snackBar = inject(MatSnackBar);

  constructor(
    private costruttoreForm: FormBuilder,
    private apiService: ApiService
  ) {
    this.formRegistrazione = this.costruttoreForm.group(
      {
        nome: ['', [Validators.required, Validators.minLength(2)]],
        cognome: ['', [Validators.required, Validators.minLength(2)]],
        codiceFiscale: [
          '',
          [Validators.required, Validators.pattern(/^[A-Z,a-z,0-9]{16}$/)],
        ],
        email: ['', [Validators.required, Validators.email, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)]],
        numeroTelefono: [
          '',
          [Validators.required, Validators.pattern(/^\+?[0-9\s]{8,15}$/)],
        ],
        ruolo: ['', [Validators.required]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/),
          ],
        ],
        confermaPassword: ['', [Validators.required]],
      },
      {
        validators: this.validatorePasswordCoincidenti(),
      }
    );
  }

  validatorePasswordCoincidenti(): ValidatorFn {
    return (controllo: AbstractControl): ValidationErrors | null => {
      const password = controllo.get('password')?.value;
      const confermaPassword = controllo.get('confermaPassword')?.value;

      if (!password || !confermaPassword) {
        return null;
      }

      if (password !== confermaPassword) {
        return { passwordNonCoincidenti: true };
      }

      return null;
    };
  }

  inviaModulo(): void {
    if (this.formRegistrazione.invalid) {
      this.formRegistrazione.markAllAsTouched();
      return;
    }

    const payload = this.formRegistrazione.getRawValue();

    console.log('Utente registrato:', payload);

    this.apiService.post<string>('Utente/crea-utente', payload).subscribe({
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

        //formDirective.resetForm();
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
