import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  menuAccountAperto = false;

  constructor(private router: Router) {}

  cambiaStatoMenuAccount(): void {
    this.menuAccountAperto = !this.menuAccountAperto;
  }

  chiudiMenuAccount(): void {
    this.menuAccountAperto = false;
  }

  cercaProdotti(testoRicerca: string): void {
    const ricerca = testoRicerca.trim();

    if (!ricerca) {
      this.router.navigate(['/prodotti']);
      return;
    }

    this.router.navigate(['/prodotti'], {
      queryParams: { ricerca },
    });
  }
}