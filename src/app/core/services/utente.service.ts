import { Injectable } from '@angular/core';
import { Utente } from '../interfaces/utente.model';

@Injectable({
  providedIn: 'root'
})
export class UtenteService {

  constructor() { }

  utenti: Utente[] = [];

  insertUtente(user: Utente){
    
  }
}
