import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiRequestOptions, ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurazioneService {
  /*
     private mockConfigurazioni: any[] = [
  { idConfig: 200, codiceCabina: 'ABC123DEF45', idCer: 100 },
  { idConfig: 201, codiceCabina: 'XYZ987LMN12', idCer: 101 },
  { idConfig: 202, codiceCabina: 'KLM456QWE78', idCer: 102 },

  ];

  constructor(private api: ApiService) {}

  ricercaConfigurazione(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    if (payload.idCer != null) {
      return of(this.mockConfigurazioni.filter(c => c.idCer === payload.idCer));
    }
    return of(this.mockConfigurazioni);
  }

  visualizzaConfigurazione(id: number, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = `configurazione/visualizza/${id}`;
    return this.api.get<any[]>(endpoint, undefined, options);
  }
}
*/
  constructor(private api: ApiService) {}

  ricercaConfigurazione(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = 'configurazione/ricerca';
    return this.api.postLogin<any[]>(endpoint, payload, options);
  }

  visualizzaConfigurazione(id: number, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = `configurazione/visualizza/${id}`;
    return this.api.get<any[]>(endpoint, undefined, options);
  }
}
