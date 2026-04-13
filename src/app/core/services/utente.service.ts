import { Injectable } from '@angular/core';
import { Utente } from '../interfaces/utente.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {
  constructor(private http: HttpClient) { }

  private utenti: Utente[] = [];

  utente: Utente = {
    id_utente: 0,
    nome_utente: '',
    cognome_utente: '',
    codice_fiscale: '',
    email: '',
    password: '',
    numero_telefono: '',
    ruolo: ''
  }

  getRisultati(): any {
    let risultato;

    this.http.get('www.url').subscribe((res: any) => {
      risultato = res;
      
      console.log(res);
    });
    return risultato;
  }

  getUtenti() {
    return this.utenti;
  }

  getUtente(id: number) {
    this.utente = this.utenti.filter(p => p.id_utente === id)[0];
    return this.utente;
  }

  createUtente(user: Utente){
    this.utenti.push(user);
    return console.log("Utente inserito con successo");
  }

  editUtente(user: Utente) {
    this.utenti = this.utenti.map(p => {
      if(p.id_utente === user.id_utente) {
        return user;
      }
      return p;
    });
  }

  deleteUtente(id: number) {
    this.utenti = this.utenti.filter(p => p.id_utente !== id);
    return console.log('Utente eliminato con successo');
  }
}
