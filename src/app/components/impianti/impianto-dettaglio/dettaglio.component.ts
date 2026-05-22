import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpiantoService, Impianto } from '../../services/impianto.service';

@Component({
  selector: 'app-dettaglio',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.scss'],
})
export class DettaglioComponent implements OnInit {
  idImpianto: string | null = null;
  impianto: Impianto | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private impiantoService: ImpiantoService,
  ) {}

  ngOnInit(): void {
    this.idImpianto = this.route.snapshot.paramMap.get('id');
    this.caricaImpianto();
  }

  private caricaImpianto(): void {
    const id = Number(this.idImpianto);

    this.impiantoService.getById(id).subscribe({
      next: (impianto) => {
        this.impianto = impianto ?? null;
      },
      error: (err) => {
        console.error('Errore caricamento impianto:', err);
      },
    });
  }

  vaiAModifica(): void {
    if (!this.idImpianto) {
      return;
    }
    this.router.navigate(['/impianto/modifica-impianto', this.idImpianto]);
  }

  tornaAllaLista(): void {
    this.router.navigate(['/impianto']);
  }
}
