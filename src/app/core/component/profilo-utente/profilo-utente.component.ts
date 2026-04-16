import { Component } from '@angular/core';
import { Utente } from '../../interfaces/utente.model';

@Component({
  selector: 'app-profilo-utente',
  templateUrl: './profilo-utente.component.html',
  styleUrls: ['./profilo-utente.component.scss']
})
export class ProfiloUtenteComponent {

  utente: Utente = {
    id_utente: 1,
    nome_utente: 'Mario',
    cognome_utente: 'Rossi',
    codice_fiscale: 'RSSMRA80A01H501U',
    email: 'mario@mail.com',
    password: '********',
    numero_telefono: '3331234567',
    ruolo: 'Admin'
    };
}
