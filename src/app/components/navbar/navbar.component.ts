import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { ToastService } from '../../services/toast.service';
import { UtenteStorageService } from '../../services/utente-storage.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  menuAccountAperto = false;
  testoRicerca = '';

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private utenteStorageService: UtenteStorageService,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.aggiornaTestoRicercaDaUrl();

    this.router.events
      .pipe(filter((evento) => evento instanceof NavigationEnd))
      .subscribe(() => {
        this.aggiornaTestoRicercaDaUrl();
      });
  }

  cambiaStatoMenuAccount(): void {
    this.menuAccountAperto = !this.menuAccountAperto;
  }

  chiudiMenuAccount(): void {
    this.menuAccountAperto = false;
  }

  aggiornaTestoRicerca(evento: Event): void {
    const input = evento.target as HTMLInputElement;
    this.testoRicerca = input.value;
  }

  cercaProdotti(evento?: Event): void {
    evento?.preventDefault();

    const ricerca = this.testoRicerca.trim();

    if (!ricerca) {
      this.router.navigateByUrl('/prodotti');
      return;
    }

    this.router.navigateByUrl('/prodotti?nome=' + encodeURIComponent(ricerca));
  }

  logout(): void {
    this.utenteStorageService.rimuoviUtente();
    this.menuAccountAperto = false;
    this.toastService.mostraSuccesso('Logout effettuato correttamente');
    this.router.navigate(['/login']);
  }

  private aggiornaTestoRicercaDaUrl(): void {
    const queryParams = this.activatedRoute.snapshot.queryParamMap;
    this.testoRicerca = queryParams.get('nome') || queryParams.get('ricerca') || '';
  }
}