import { Injectable } from '@angular/core';
import { DatiEnergetici } from '../../core/interfaces/dati-energetici.model';
import { ApiRequestOptions, ApiService } from '../../core/services/api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatiEnergeticiService {
  private mockDatiDatabase: DatiEnergetici[] = [
    {
      idDati: 101,
      idCer: 10,
      idConfigurazione: 2,
      anno: '2024',
      energiaProdotta: 4500,
      energiaPrelevata: 3100,
      energiaImmessa: 1400,
      energiaCondivisa: 950,
      energiaAutoCons: 2000,
      tariffaPremium: 0.11,
      corrPremioOtt: 104.5,
      ridEmCo2: '520 kg',
      flgCancellazione: 'N',
    },
    {
      idDati: 102,
      idCer: 10,
      idConfigurazione: 2,
      anno: '2025',
      energiaProdotta: 6200,
      energiaPrelevata: 4100,
      energiaImmessa: 2100,
      energiaCondivisa: 1500,
      energiaAutoCons: 2800,
      tariffaPremium: 0.12,
      corrPremioOtt: 180.0,
      ridEmCo2: '715 kg',
      flgCancellazione: 'N',
    },
  ];

  constructor(private api: ApiService) {}

  getDati(
    payload: any,
    options: ApiRequestOptions = {},
  ): Observable<DatiEnergetici[]> {
    return of(this.mockDatiDatabase);

    // const endpoint = "datiEnergetici/ricerca";
    // return this.api.postLogin<DatiEnergetici[]>(endpoint, payload, options);
  }

  deleteDatiEnergetici(id: number): Observable<boolean> {
    this.mockDatiDatabase = this.mockDatiDatabase.filter(
      (item) => item.idDati != id,
    );
    console.log('Service: Record ${id} rimosso dal database finto.');
    return of(true);
  }

  getDato(
    id: number,
    options: ApiRequestOptions = {},
  ): Observable<DatiEnergetici[]> {
    const endpoint = `datiEnergetici/visualizza/${id}`;
    return this.api.get<DatiEnergetici[]>(endpoint, undefined, options);
  }

  createDatiEnergetici(
    payload: DatiEnergetici,
    options: ApiRequestOptions = {},
  ): Observable<DatiEnergetici> {
    console.log('Dati Energetici creati con successo');
    const endpoint = 'datiEnergetici/inserimento';
    return this.api.post<DatiEnergetici>(endpoint, payload, options);
  }

  editDatiEnergetici(payload: DatiEnergetici, options: ApiRequestOptions = {}) {
    console.log('Dati Energetici modificati con successo');
    const endpoint = 'datiEnergetici/modifica';
    return this.api.put<DatiEnergetici>(endpoint, payload, options);
  }

  // deleteDatiEnergetici(payload: any, options: ApiRequestOptions = {}): Observable<DatiEnergetici> {
  //   console.log("Dati Energetici eliminati con successo");
  //   const endpoint = "datiEnergetici/disattiva";
  //   return this.api.put<DatiEnergetici>(endpoint, payload, options);
  // }
}
