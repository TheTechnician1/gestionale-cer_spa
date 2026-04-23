import { Injectable } from '@angular/core';
import { Configurazione } from '../interfaces/configurazione.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurazioneService {
  constructor(private api: ApiService) { }

  getConfigurazioni(payload: any): Observable<Configurazione[]> {
    const endpoint = "configurazione/ricerca";
    return this.api.postLogin<Configurazione[]>(endpoint, payload);
  }

  getConfigurazione(payload: any): Observable<Configurazione> {
    const endpoint = "configurazione/visualizza/{id}";
    return this.api.post<Configurazione>(endpoint, payload);
  }

  createConfigurazione(payload: Configurazione): Observable<Configurazione> {
    console.log("Configurazione creato con successo");
    const endpoint = "configurazione/inserimento";
    return this.api.post<Configurazione>(endpoint, payload);
  }

  editConfigurazione(payload: Configurazione) {
    console.log("Configurazione modificato con successo");
    const endpoint = "configurazione/modifica";
    return this.api.put<Configurazione>(endpoint, payload);
  }

  deleteConfigurazione(payload: Configurazione): Observable<Configurazione> {
    console.log('Configurazione eliminato con successo');
    const endpoint = "configurazione/disattiva";
    return this.api.put<Configurazione>(endpoint, payload);
  }
}
