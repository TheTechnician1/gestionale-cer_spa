import { Component, NgModule } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Ruolo } from 'src/app/core/interfaces/ruolo.model';
import { UtenteService } from '../../../services/utente.service';

@Component({
  selector: 'app-registrazione-utente',
  templateUrl: './registrazione-utente.component.html',
  styleUrls: ['./registrazione-utente.component.scss']
})
export class RegistrazioneUtenteComponent {
  constructor(private fb: FormBuilder, private authService: UtenteService) {}

  form = this.fb.group (
    {
      nome: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      cognome: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      codiceFiscale: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]{16}")]],
      mail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      confermaPassword: ['', [Validators.required]],
      numTelefono: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9+]{10,13}$")]],
      ruolo: [ null ],
      id_utente: [ null ]
    },
    { validators: this.passwordMatchValidator }
  )

  hide = true;
  ruoli: Ruolo[] = [
    { value: 'ADMIN', viewValue: 'Admin'},
    { value: 'GEST', viewValue: 'Gestore'}
  ]

  ngOnInit() {
    this.form.get('codiceFiscale')?.valueChanges.subscribe(value => {
      const upper = value?.toUpperCase() || '';
      if (upper !== value) {
      this.form.get('codiceFiscale')?.setValue(upper, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
    const { confermaPassword, ...payload } = this.form.getRawValue();
    this.authService.createUtente(payload).subscribe(user => {


    });
  }

  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password')?.value;
    const confermaPassword = form.get('confermaPassword')?.value;

    if(!password || !confermaPassword) return null;

    if (password !== confermaPassword) {
      form.get('confermaPassword')?.setErrors({ passwordMismatch: true });
    } else {
      form.get('confermaPassword')?.setErrors(null);
    }

    return null;
  }
}

