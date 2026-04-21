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
    const endpoint = "Configurazione/ricerca";
    return this.api.post<Configurazione[]>(endpoint, payload);
  }

  getConfigurazione(params?: Partial<Configurazione>): Observable<Configurazione[]> {
    return this.api.get<Configurazione[]>("configurazione", params as Record<string, string | number | boolean> | undefined);
  }

  createConfigurazione(payload: Configurazione): Observable<Configurazione> {
    console.log("Configurazione creato con successo");
    const endpoint = "Configurazione/inserimento";
    return this.api.post<Configurazione>(endpoint, payload);
  }

  editConfigurazione(payload: Configurazione) {
    console.log("Configurazione modificato con successo");
    const endpoint = "Configurazione/modifica";
    return this.api.put<Configurazione>(endpoint, payload);
  }

  deleteConfigurazione(payload: Configurazione): Observable<Configurazione> {
    console.log('Configurazione eliminato con successo');
    const endpoint = "Configurazione/disattiva";
    return this.api.put<Configurazione>(endpoint, payload);
  }
}
