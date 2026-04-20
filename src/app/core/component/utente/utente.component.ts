import { Component } from '@angular/core';
import { UtenteService } from '../../services/utente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Utente } from '../../interfaces/utente.model';

@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss']
})
export class UtenteComponent {
  constructor(private utenteService: UtenteService, private router: ActivatedRoute, private route: Router) { }
  utenti: Utente[] = [];

  utente: Utente = {
    id_utente: 0,
    nome: '',
    cognome: '',
    codiceFiscale: '',
    mail: '',
    password: '',
    numTelefono: '',
    ruolo: null
  }

  ngOnInit() {
    this.loadUtente;
  }

  loadUtente() {
    this.utenteService.getUtente().subscribe({
      next: (utente) => {
        this.utenti = utente;
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  editUtente(user: any) {
    this.utente = { ...user };
    this.route.navigate(['/']);
  }

  deleteUtente(id: number) {
    this.utenteService.deleteUtente(id);
  }
}
