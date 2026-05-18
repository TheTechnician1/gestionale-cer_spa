import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-impianti-ricerca',
  templateUrl: './impianti-ricerca.component.html',
  styleUrls: ['./impianti-ricerca.component.scss'],
})
export class ImpiantiRicercaComponent {
  constructor(private router: Router) {}

  modificaImpianto(id: number): void {
    this.router.navigate(['/impianto/modifica-impianto', id]);
  }

  impianti = [
    {
      id: 1,
      tipologia: 'Fotovoltaico',
      potenzaNominale: 120,
      regione: 'Lazio',
      comune: 'Roma',
      indirizzo: 'Via Roma 1',
      cap: '00100',
      partitaIva: '12345678901',
      flgAccumulo: true,
    },
    {
      id: 2,
      tipologia: 'Eolico',
      potenzaNominale: 300,
      regione: 'Campania',
      comune: 'Napoli',
      indirizzo: 'Via Napoli 20',
      cap: '80100',
      partitaIva: '98765432109',
      flgAccumulo: false,
    },
    {
      id: 3,
      tipologia: 'Idroelettrico',
      potenzaNominale: 520,
      regione: 'Piemonte',
      comune: 'Torino',
      indirizzo: 'Strada del Fiume 8',
      cap: '10100',
      partitaIva: '45612378901',
      flgAccumulo: true,
    },
    {
      id: 4,
      tipologia: 'Biomassa',
      potenzaNominale: 210,
      regione: 'Toscana',
      comune: 'Firenze',
      indirizzo: 'Via dei Mulini 14',
      cap: '50100',
      partitaIva: '74185296301',
      flgAccumulo: false,
    },
    {
      id: 5,
      tipologia: 'Agrivoltaico',
      potenzaNominale: 430,
      regione: 'Puglia',
      comune: 'Bari',
      indirizzo: 'Contrada Sole 22',
      cap: '70100',
      partitaIva: '96325874102',
      flgAccumulo: true,
    },
    {
      id: 6,
      tipologia: 'Fotovoltaico Industriale',
      potenzaNominale: 980,
      regione: 'Lombardia',
      comune: 'Milano',
      indirizzo: 'Via Energia 77',
      cap: '20100',
      partitaIva: '11223344556',
      flgAccumulo: true,
    },
    {
      id: 7,
      tipologia: 'Mini Eolico',
      potenzaNominale: 75,
      regione: 'Sardegna',
      comune: 'Cagliari',
      indirizzo: 'Via del Vento 3',
      cap: '09100',
      partitaIva: '66554433221',
      flgAccumulo: false,
    },
    {
      id: 8,
      tipologia: 'Geotermico',
      potenzaNominale: 640,
      regione: 'Sicilia',
      comune: 'Catania',
      indirizzo: 'Via Vulcano 55',
      cap: '95100',
      partitaIva: '10293847566',
      flgAccumulo: true,
    },
  ];
}
