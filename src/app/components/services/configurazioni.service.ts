import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ConfigurazioneView } from 'src/app/core/interfaces/configurazione.model';
import { ApiRequestOptions, ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class ConfigurazioniService {

  constructor(private api : ApiService) { }

  //CHIAMATE BACK
  getAllConfigurazione(options: ApiRequestOptions = {}) : Observable<ConfigurazioneView[]>{
    const endpoint = 'configurazione/ricerca';
    return this.api.post<ConfigurazioneView[]>(endpoint, {}, options);
  }

  //MOCK CHIAMATE
  getConfigurazioneMock() : Observable<ConfigurazioneView[]>{
    return of(this.configurazioniViewMock);
  }

  //MOCK DATI
  configurazioniViewMock: ConfigurazioneView[] = [
    {
      codiceCabina: 'CAB-NA-001',
      idCer: 1,
      ragioneSociale: 'Energia Futura SRL',
      partitaIva: 'IT12345678901',
      regioneLegale: 'Campania',
      annoAttivazione: '2022',
      idConfig: 1
    },
    {
      codiceCabina: 'CAB-SA-014',
      idCer: 2,
      ragioneSociale: 'Green Power Cooperativa',
      partitaIva: 'IT98765432109',
      regioneLegale: 'Campania',
      annoAttivazione: '2021',
      idConfig: 2
    },
    {
      codiceCabina: 'CAB-RM-045',
      idCer: 3,
      ragioneSociale: 'Eco Energia SPA',
      partitaIva: 'IT45678912345',
      regioneLegale: 'Lazio',
      annoAttivazione: '2020',
      idConfig: 3
    },
    {
      codiceCabina: 'CAB-MI-120',
      idCer: 4,
      ragioneSociale: 'Solar Italia SRLS',
      partitaIva: 'IT74185296300',
      regioneLegale: 'Lombardia',
      annoAttivazione: '2023',
      idConfig: 4
    }
  ];
}
