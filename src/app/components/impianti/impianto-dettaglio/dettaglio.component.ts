import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

interface ImpiantoDettaglioView {
  id: string;
  tipologia: string;
  potenzaNominale: number;
  regione: string;
  comune: string;
  indirizzo: string;
  cap: string;
  partitaIva: string;
  accumulo: boolean;
}

@Component({
  selector: 'app-dettaglio',
  templateUrl: './dettaglio.component.html',
  styleUrls: ['./dettaglio.component.scss'],
})
export class DettaglioComponent implements OnInit {
  idImpianto: string | null = null;
  impianto: ImpiantoDettaglioView | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.idImpianto = this.route.snapshot.paramMap.get('id');
    this.loadMockDettaglio();
  }

  private loadMockDettaglio(): void {
    const id = this.idImpianto ?? 'N/D';

    this.impianto = {
      id,
      tipologia: 'Fotovoltaico',
      potenzaNominale: 12.5,
      regione: 'Lazio',
      comune: 'Roma',
      indirizzo: 'Via Appia 15',
      cap: '00179',
      partitaIva: '12345678901',
      accumulo: true,
    };
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
