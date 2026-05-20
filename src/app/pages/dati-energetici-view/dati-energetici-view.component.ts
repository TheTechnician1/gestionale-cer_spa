import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dati-energetici-view',
  templateUrl: './dati-energetici-view.component.html',
  styleUrls: ['./dati-energetici-view.component.scss']
})
export class DatiEnergeticiViewComponent implements OnInit {

  dettaglio = {
    cer: 'CER Roma Nord',
    cabina: 'CAB-001',
    configurazione: 'Configurazione Lazio',
    anno: 2025,

    energiaProdotta: 12000,
    energiaPrelevata: 3000,
    energiaImmessa: 5000,
    energiaCondivisa: 4500,
    energiaAutoconsumata: 3500,

    tariffaPremium: 0.12,
    corrispettivoPremio: 2400,

    riduzioneCO2: 85,

    stato: 'OK'
  };

  constructor() {}

  ngOnInit(): void {

  }

  tornaIndietro(): void {

    window.history.back();

  }

  calcolaCO2(): void {

  this.dettaglio.riduzioneCO2 =
    this.dettaglio.energiaCondivisa * 0.4;

}

}