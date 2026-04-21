import { UtenteLogin } from './../../interfaces/utente.model';
import { Component } from '@angular/core';
import { UtenteService } from '../../services/utente.service';
import { Router } from '@angular/router';
import { Utente, UtenteLoginModel } from '../../interfaces/utente.model';

@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss']
})
export class UtenteComponent {
  constructor(private utenteService: UtenteService, private route: Router) {}

  utente: UtenteLogin | null = new UtenteLoginModel();

  ngOnInit() {
    this.loadUtente();
  }

  loadUtente() {
    this.utente = this.utenteService.currentUser;
  }

  editUtente(user: any) {
    this.utente = { ...user };
    this.route.navigate(['/']);
  }

  deleteUtente(id: number) {
    this.utenteService.deleteUtente(id);
  }
}
