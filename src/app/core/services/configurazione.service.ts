import { Injectable } from '@angular/core';
import { Configurazione } from '../interfaces/configurazione.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConfigurazioneService {
  constructor(private api: ApiService) { }

  getConfigurazioni(): Observable<Configurazione[]> {
    return this.api.get<Configurazione[]>("ricercaConfigurazione");
  }

  getConfigurazione(params?: Partial<Configurazione>): Observable<Configurazione[]> {
    return this.api.get<Configurazione[]>("configurazione", params as Record<string, string | number | boolean> | undefined);
  }

  createConfigurazione(payload: Configurazione): Observable<Configurazione> {
    console.log("CER creato con successo");
    return this.api.post<Configurazione>("configurazione", payload);
  }

  editConfigurazione(payload: Configurazione) {
    console.log("CER modificato con successo");
    return this.api.put<Configurazione>(`modificaConfigurazione`, payload);
  }

  deleteConfigurazione(payload: Configurazione): Observable<Configurazione> {
    console.log('CER eliminato con successo')
    return this.api.put<Configurazione>(`cancellazioneConfigurazione`, payload);
  }
}
