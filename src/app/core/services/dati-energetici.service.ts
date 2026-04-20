import { Injectable } from '@angular/core';
import { DatiEnergetici } from '../interfaces/dati-energetici.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatiEnergeticiService {
  constructor(private api: ApiService) {}

  getDati(): Observable<DatiEnergetici[]> {
    return this.api.get<DatiEnergetici[]>("ricercaDatiEnergetici");
  }

  getDato(params?: Partial<DatiEnergetici>): Observable<DatiEnergetici[]> {
    return this.api.get<DatiEnergetici[]>("datiEnergetici", params as Record<string, string | number | boolean> | undefined);
  }

  createDatiEnergetici(payload: DatiEnergetici): Observable<DatiEnergetici> {
    console.log("Dati Energetici inseriti con successo");
    return this.api.post<DatiEnergetici>("datiEnergetici", payload);
  }

  editDatiEnergetici(payload: DatiEnergetici) {
    console.log("Dati Energetici modificati con successo");
    return this.api.put<DatiEnergetici>(`modificaDatiEnergetici`, payload);
  }

  deleteDatiEnergetici(payload: DatiEnergetici): Observable<DatiEnergetici> {
    console.log('Dati Energetici eliminati con successo')
    return this.api.put<DatiEnergetici>(`cancellazioneDatiEnergetici`, payload);
  }
}
