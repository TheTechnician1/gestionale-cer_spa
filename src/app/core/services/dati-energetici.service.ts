import { Injectable } from '@angular/core';
import { DatiEnergetici } from '../interfaces/dati-energetici.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatiEnergeticiService {
  constructor(private api: ApiService) {}

  getDati(payload: any): Observable<DatiEnergetici[]> {
    const endpoint = "dati-energetici/ricerca";
    return this.api.postLogin<DatiEnergetici[]>(endpoint, payload);
  }

  getDato(payload: any): Observable<DatiEnergetici> {
    const endpoint = "dati-energetici/visualizzazione/{id}";
    return this.api.get<DatiEnergetici>(endpoint, payload);
  }

  createDatiEnergetici(payload: DatiEnergetici): Observable<DatiEnergetici> {
    console.log("Dati Energetici creati con successo");
    const endpoint = "dati-energetici/inserimento";
    return this.api.post<DatiEnergetici>(endpoint, payload);
  }

  editDatiEnergetici(payload: DatiEnergetici) {
    console.log("Dati Energetici modificati con successo");
    const endpoint = "dati-energetici/modifica";
    return this.api.put<DatiEnergetici>(endpoint, payload);
  }

  deleteDatiEnergetici(payload: DatiEnergetici): Observable<DatiEnergetici> {
    console.log('Dati Energetici eliminati con successo')
    const endpoint = "dati-energetici/cancellazione";
    return this.api.put<DatiEnergetici>(endpoint, payload);
  }
}
