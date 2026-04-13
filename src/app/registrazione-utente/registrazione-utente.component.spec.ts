import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-registrazione-utente',
  templateUrl: './registrazione-utente.component.html',
  styleUrls: ['./registrazione-utente.component.scss']
})
export class RegistrazioneUtenteComponent {
  nascondiPassword: boolean = true;
  nascondiConfermaPassword: boolean = true;

  formRegistrazione: FormGroup;

  constructor(private generatoreForm: FormBuilder) {
    this.formRegistrazione = this.generatoreForm.group(
      {
        nome: ['', [Validators.required, Validators.minLength(2)]],
        cognome: ['', [Validators.required, Validators.minLength(2)]],
        codiceFiscale: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[A-Z0-9]{16}$/)
          ]
        ],
        email: ['', [Validators.required, Validators.email]],
        numeroTelefono: [
          '',
          [
            Validators.required,
            Validators.pattern(/^[0-9+\s]{8,15}$/)
          ]
        ],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/)
          ]
        ],
        confermaPassword: ['', [Validators.required]]
      },
      {
        validators: this.validatoreCorrispondenzaPassword()
      }
    );
  }

  validatoreCorrispondenzaPassword(): ValidatorFn {
    return (form: AbstractControl): ValidationErrors | null => {
      const valorePassword = form.get('password')?.value;
      const valoreConfermaPassword = form.get('confermaPassword')?.value;

      if (!valorePassword || !valoreConfermaPassword) {
        return null;
      }

      return valorePassword === valoreConfermaPassword
        ? null
        : { passwordNonCoincidenti: true };
    };
  }

  get nome(): AbstractControl | null {
    return this.formRegistrazione.get('nome');
  }

  get cognome(): AbstractControl | null {
    return this.formRegistrazione.get('cognome');
  }

  get codiceFiscale(): AbstractControl | null {
    return this.formRegistrazione.get('codiceFiscale');
  }

  get email(): AbstractControl | null {
    return this.formRegistrazione.get('email');
  }

  get numeroTelefono(): AbstractControl | null {
    return this.formRegistrazione.get('numeroTelefono');
  }

  get password(): AbstractControl | null {
    return this.formRegistrazione.get('password');
  }

  get confermaPassword(): AbstractControl | null {
    return this.formRegistrazione.get('confermaPassword');
  }

  inviaModulo(): void {
    if (this.formRegistrazione.invalid) {
      this.formRegistrazione.markAllAsTouched();
      return;
    }

    const datiUtente = {
      nome: this.formRegistrazione.value.nome,
      cognome: this.formRegistrazione.value.cognome,
      codiceFiscale: this.formRegistrazione.value.codiceFiscale,
      email: this.formRegistrazione.value.email,
      numeroTelefono: this.formRegistrazione.value.numeroTelefono,
      password: this.formRegistrazione.value.password
    };

    console.log('Utente registrato:', datiUtente);

    this.formRegistrazione.reset();

    this.nascondiPassword = true;
    this.nascondiConfermaPassword = true;
  }
}