import { UtenteLogin } from './../../interfaces/utente.model';
import { Component } from '@angular/core';
import { UtenteService } from '../../services/utente.service';
import { Router } from '@angular/router';
import { Utente, UtenteLoginModel } from '../../interfaces/utente.model';

@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss'],
})
export class UtenteComponent {
  constructor(
    private utenteService: UtenteService,
    private route: Router,
  ) {}

  utente: UtenteLogin | null = new UtenteLoginModel();

  ngOnInit() {
    this.loadUtente();
  }

  loadUtente() {
    const sessionState = this.utenteService.currentUser;
    if (sessionState) {
      if (sessionState.utente) {
        this.utente = sessionState.utente;
      } else {
        this.utente = sessionState;
      }
    }

    console.log('Profile data assigned to view template:', this.utente);
  }
}
