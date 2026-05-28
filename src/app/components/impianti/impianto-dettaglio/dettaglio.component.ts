import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ImpiantoService } from '../../services/impianto.service';
import { ImpiantoDettaglio } from '../../../core/interfaces/impianto.model';
import { PermessiService } from '../../../core/services/permessi.service';

@Component({
  selector: 'app-dettaglio',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.scss'],
})
export class DettaglioComponent implements OnInit {
  idImpianto: string | null = null;
  impianto: ImpiantoDettaglio | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private impiantoService: ImpiantoService,
    public permessi: PermessiService,
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
