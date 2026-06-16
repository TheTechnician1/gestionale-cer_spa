import { Injectable } from '@angular/core';

import { UserResponse } from '../models/user-response';

@Injectable({
  providedIn: 'root',
})
export class UtenteStorageService {
  private readonly chiaveUtente = 'utente';

  recuperaUtente(): UserResponse | null {
    const utenteSalvato = localStorage.getItem(this.chiaveUtente);

    if (!utenteSalvato) {
      return null;
    }

    try {
      const utente = JSON.parse(utenteSalvato) as UserResponse;

      if (!utente || !utente.id) {
        this.rimuoviUtente();
        return null;
      }

      return utente;
    } catch {
      this.rimuoviUtente();
      return null;
    }
  }

  salvaUtente(utente: UserResponse): void {
    localStorage.setItem(this.chiaveUtente, JSON.stringify(utente));
  }

  rimuoviUtente(): void {
    localStorage.removeItem(this.chiaveUtente);
  }
}