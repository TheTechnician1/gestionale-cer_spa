import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dati-energetici-ricerca',
  templateUrl: './dati-energetici-ricerca.component.html',
  styleUrls: ['./dati-energetici-ricerca.component.scss'],
})
export class DatiEnergeticiRicercaComponent {
  constructor(private router: Router) {}

  modificaDatiEnergetici(id: number): void {
    this.router.navigate(['/dati-energetici/modifica-dati', id]);
  }

  datiEnergetici = [
    {
      idDati: 1,
      idCer: 101,
      idConfig: 1001,
      anno: '2023',
      energiaProdotta: 125000,
      energiaPrelevata: 83000,
      energiaImmessa: 42000,
      energiaCondivisa: 31000,
      energiaAutoCons: 52000,
      tariffaPremium: 0.12,
      corrPremioOtt: 0.08,
      ridEmCo2: '18 tonnellate',
      flgCancellazione: 'N',
      emailUtenteLoggato: 'admin@cer.it',
    },

    {
      idDati: 2,
      idCer: 102,
      idConfig: 1002,
      anno: '2024',
      energiaProdotta: 98000,
      energiaPrelevata: 61000,
      energiaImmessa: 37000,
      energiaCondivisa: 28000,
      energiaAutoCons: 47000,
      tariffaPremium: 0.15,
      corrPremioOtt: 0.11,
      ridEmCo2: '14 tonnellate',
      flgCancellazione: 'N',
      emailUtenteLoggato: 'gestore@cer.it',
    },

    {
      idDati: 3,
      idCer: 103,
      idConfig: 1003,
      anno: '2022',
      energiaProdotta: 156000,
      energiaPrelevata: 99000,
      energiaImmessa: 57000,
      energiaCondivisa: 43000,
      energiaAutoCons: 64000,
      tariffaPremium: 0.1,
      corrPremioOtt: 0.07,
      ridEmCo2: '22 tonnellate',
      flgCancellazione: 'N',
      emailUtenteLoggato: 'utente1@cer.it',
    },

    {
      idDati: 4,
      idCer: 104,
      idConfig: 1004,
      anno: '2025',
      energiaProdotta: 87000,
      energiaPrelevata: 45000,
      energiaImmessa: 42000,
      energiaCondivisa: 26000,
      energiaAutoCons: 39000,
      tariffaPremium: 0.14,
      corrPremioOtt: 0.09,
      ridEmCo2: '12 tonnellate',
      flgCancellazione: 'N',
      emailUtenteLoggato: 'guest@cer.it',
    },

    {
      idDati: 5,
      idCer: 105,
      idConfig: 1005,
      anno: '2021',
      energiaProdotta: 203000,
      energiaPrelevata: 142000,
      energiaImmessa: 61000,
      energiaCondivisa: 49000,
      energiaAutoCons: 81000,
      tariffaPremium: 0.16,
      corrPremioOtt: 0.12,
      ridEmCo2: '31 tonnellate',
      flgCancellazione: 'N',
      emailUtenteLoggato: 'energy.manager@cer.it',
    },
  ];
}
