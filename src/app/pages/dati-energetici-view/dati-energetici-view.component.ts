import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

const MOCK_DATI = [

  {
    idDati: 1,
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
  },

  {
    idDati: 2,
    cer: 'CER Milano',
    cabina: 'CAB-002',
    configurazione: 'Configurazione Lombardia',
    anno: 2024,
    energiaProdotta: 9000,
    energiaPrelevata: 2000,
    energiaImmessa: 4000,
    energiaCondivisa: 3000,
    energiaAutoconsumata: 2500,
    tariffaPremium: 0.10,
    corrispettivoPremio: 1800,
    riduzioneCO2: 65,
    stato: 'DA_VERIFICARE'
  }

];

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

  constructor(
     private route: ActivatedRoute
  ) {}

  ngOnInit(): void {

     const id = Number(
    this.route.snapshot.paramMap.get('id')
  );

  const datoTrovato = MOCK_DATI.find(
    dato => dato.idDati === id
  );

  if (datoTrovato) {

    this.dettaglio = datoTrovato;

  }
}

  tornaIndietro(): void {

    window.history.back();

  }

  calcolaCO2(): void {

  this.dettaglio.riduzioneCO2 =
    this.dettaglio.energiaCondivisa * 0.4;

}

  }
