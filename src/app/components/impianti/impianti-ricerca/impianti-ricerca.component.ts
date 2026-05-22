import { Component, OnInit } from '@angular/core';
import { Impianto, ImpiantoService } from '../../services/impianto.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impianti-ricerca',
  templateUrl: './impianti-ricerca.component.html',
  styleUrls: ['./impianti-ricerca.component.scss'],
})
export class ImpiantiRicercaComponent implements OnInit {
  impianti: Impianto[] = [];

  constructor(
    private router: Router,
    private impiantoService: ImpiantoService,
  ) {}

  ngOnInit(): void {
    this.cercaImpianti();
  }
  cercaImpianti(): void {
    this.impiantoService.ricerca({}).subscribe({
      next: (res) => {
        this.impianti = res ?? [];
      },
      error: (err) => {
        console.error('Errore caricamento impianti:', err);
      },
    });
  }
  modificaImpianto(id: number): void {
    this.router.navigate(['/impianto/modifica-impianto', id]);
  }
  inserisciNuovo(): void {
    this.router.navigate(['/impianto/inserimento-impianto']);
  }

  dettaglioImpianto(id: number): void {
    this.router.navigate(['/impianto/dettaglio-impianto', id]);
  }

  eliminaImpianto(id: number): void {
    this.impiantoService.elimina(id).subscribe({
      next: () => this.cercaImpianti(),
      error: (err) => console.error('Errore eliminazione:', err),
    });
  }
}
