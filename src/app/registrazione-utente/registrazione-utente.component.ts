import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-registrazione-utente',
  templateUrl: './registrazione-utente.component.html',
  styleUrls: ['./registrazione-utente.component.scss'],
})
export class RegistrazioneUtenteComponent {
  nascondiPassword: boolean = true;
  nascondiConfermaPassword: boolean = true;

  formRegistrazione: FormGroup;

  elencoRuoli: string[] = ['ADMIN', 'GEST'];

  constructor(private costruttoreForm: FormBuilder) {
    this.formRegistrazione = this.costruttoreForm.group(
      {
        nome: ['', [Validators.required, Validators.minLength(2)]],
        cognome: ['', [Validators.required, Validators.minLength(2)]],
        codiceFiscale: [
          '',
          [Validators.required, Validators.pattern(/^[A-Z\s0-9]{16}$/)],
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

    this.formRegistrazione.reset();

    this.nascondiPassword = true;
    this.nascondiConfermaPassword = true;
  }
}