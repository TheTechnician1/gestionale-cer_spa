import { Component, NgModule } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { Ruolo } from 'src/app/core/interfaces/ruolo.model';

@Component({
  selector: 'app-registrazione-utente',
  templateUrl: './registrazione-utente.component.html',
  styleUrls: ['./registrazione-utente.component.scss']
})
export class RegistrazioneUtenteComponent {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group (
    {
      nome: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      cognome: ['', [Validators.required, Validators.pattern("^[a-zA-Z]{1,}$")]],
      codice_fiscale: ['', [Validators.required, Validators.pattern("^[a-zA-Z0-9]{16}")]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern("^[a-zA-Z0-9\d#@èé€çòà°ù§ì£$^!(/>{}'|/`~<)-_%*?&]{8,64}$")]],
      telefono: ['', [Validators.required, Validators.minLength(10), Validators.pattern("^[0-9+]{10,13}$")]],
      ruolo: ['']
    }
  )

  hide = true;
  ruoli: Ruolo[] = [
    { value: 'admin', viewValue: 'Admin'},
    { value: 'gestore', viewValue: 'Gestore'},
    { value: 'guest', viewValue: 'Ospite'}
  ]

  ngOnInit() {
    this.form.get('codice_fiscale')?.valueChanges.subscribe(value => {
      const upper = value?.toUpperCase() || '';
      if (upper !== value) {
      this.form.get('codice_fiscale')?.setValue(upper, { emitEvent: false });
      }
    });
  }

  onSubmit() {
    
  }
}

