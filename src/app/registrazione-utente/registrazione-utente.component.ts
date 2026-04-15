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

  inviaModulo(): void {
    if (this.formRegistrazione.invalid) {
      this.formRegistrazione.markAllAsTouched();
      return;
    }

    const datiUtente = {
      x: this.formRegistrazione.getRawValue(),
      nome: this.nome.value,
      cognome: this.cognome.value,
      codiceFiscale: this.codiceFiscale.value,
      email: this.email.value,
      numeroTelefono: this.numeroTelefono.value,
      ruolo: this.ruolo.value,
      password: this.password.value,
    };

    console.log('Utente registrato:', datiUtente);

    this.formRegistrazione.reset();

    this.nascondiPassword = true;
    this.nascondiConfermaPassword = true;
  }
}