import { Component } from '@angular/core';
import { UtenteService } from '../../services/utente.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-utente',
  templateUrl: './utente.component.html',
  styleUrls: ['./utente.component.scss']
})
export class UtenteComponent {
  constructor(private utenteService: UtenteService, private router: ActivatedRoute, private route: Router) { }

  utenti: any[] = [];

  utente: any = {
    id_utente: 0,
    nome_utente: '',
    cognome_utente: '',
    codice_fiscale: '',
    email: '',
    password: '',
    numero_telefono: '',
    ruolo: ''
  }

  ngOnInit() {
    const id = this.router.snapshot.paramMap.get('id');
    this.loadUtente(parseInt(id!));
  }

  loadUtente(id: number) {
    this.utenteService.getUtente(id);
  }

  loadUtenti() {
    this.utenti = this.utenteService.getUtenti();
  }

  getUtenti() {
    return this.utenti;
  }

  getUtente(id: number) {
    this.utente = this.utenti.filter(p => p.id_utente === id)[0];
    return this.utente;
  }

  createUtente(user: any){
    this.utente = this.utenteService.createUtente(user);
    this.route.navigate(['/']);
  }

  editUtente(user: any) {
    this.utente = { ...user };
    this.route.navigate(['/']);
  }

  updatePersonaggio() {
    this.utenteService.editUtente(this.utente);
    this.loadUtente(this.utente.id);
  }

  deleteUtente(id: number) {
    this.utenteService.deleteUtente(id);
  }
}
