import { Component, NgModule } from '@angular/core';
import { FormBuilder, Validators  } from '@angular/forms';

@Component({
  selector: 'app-registrazione-utente',
  templateUrl: './registrazione-utente.component.html',
  styleUrls: ['./registrazione-utente.component.scss']
})
export class RegistrazioneUtenteComponent {
  constructor(private fb: FormBuilder) {}

  form = this.fb.group (
    {
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      codice_fiscale: ['', Validators.required],
      email: ['', Validators.required, Validators.email],
      telefono: ['', Validators.required],
      ruolo: ['']
    }
  )
}

