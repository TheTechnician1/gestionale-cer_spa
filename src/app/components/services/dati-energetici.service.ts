// import { Injectable } from '@angular/core';
// import { DatiEnergetici } from '../../core/interfaces/dati-energetici.model';
// import { ApiRequestOptions, ApiService } from '../../core/services/api.service';
// import { Observable } from 'rxjs';
// import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs';
import { StorageService } from '../../core/services/storage.service';

// @Injectable({
//   providedIn: 'root',
// })
// export class DatiEnergeticiService {
//   getDatiEnergetici() {
//     throw new Error('Method not implemented.');
//   }
//   constructor(private api: ApiService) {}

//   getDati(
//     payload: any,
//     options: ApiRequestOptions = {},
//   ): Observable<DatiEnergetici[]> {
//     const endpoint = 'datiEnergetici/ricerca';y
//     return this.api.postLogin<DatiEnergetici[]>(endpoint, payload, options);
//   }

//   getDato(
//     id: number,
//     options: ApiRequestOptions = {},
//   ): Observable<DatiEnergetici[]> {
//     const endpoint = `datiEnergetici/visualizza/${id}`;
//     return this.api.get<DatiEnergetici[]>(endpoint, undefined, options);
//   }

//   createDatiEnergetici(
//     payload: DatiEnergetici,
//     options: ApiRequestOptions = {},
//   ): Observable<DatiEnergetici> {
//     console.log('Dati Energetici creati con successo');
//     const endpoint = 'datiEnergetici/inserimento';
//     return this.api.post<DatiEnergetici>(endpoint, payload, options);
//   }

//   editDatiEnergetici(payload: DatiEnergetici, options: ApiRequestOptions = {}) {
//     console.log('Dati Energetici modificati con successo');
//     const endpoint = 'datiEnergetici/modifica';
//     return this.api.put<DatiEnergetici>(endpoint, payload, options);
//   }

//   deleteDatiEnergetici(
//     payload: any,
//     options: ApiRequestOptions = {},
//   ): Observable<DatiEnergetici> {
//     console.log('Dati Energetici eliminati con successo');
//     const endpoint = 'datiEnergetici/disattiva';
//     return this.api.put<DatiEnergetici>(endpoint, payload, options);
//   }
// }

// creiamo un interfaccia per definire l'oggetto che ci arriva per sostituire il backend
export interface DatiEnergetici {
  idDati: number;
  idCer: number;
  anno: string;
  eProdotta: number;
  ePrelevata: number;
  eImmessa: number;
  eCondivisa: number;
  eAutoCons: number;
  tariffaPremium: number;
  calcoloCo2Automatico: number;
}

@Injectable({
  providedIn: 'root',
})
export class DatiEnergeticiService {
  private datiMock: DatiEnergetici[] = [
    {
      idDati: 1,
      idCer: 101,
      anno: '2024',
      eProdotta: 12000,
      ePrelevata: 5000,
      eImmessa: 7000,
      eCondivisa: 4500,
      eAutoCons: 3000,
      tariffaPremium: 0.12,
      calcoloCo2Automatico: 1800,
    },
    {
      idDati: 2,
      idCer: 102,
      anno: '2025',
      eProdotta: 15000,
      ePrelevata: 6000,
      eImmessa: 9000,
      eCondivisa: 5200,
      eAutoCons: 4000,
      tariffaPremium: 0.14,
      calcoloCo2Automatico: 2200,
    },
  ];

  private readonly RITARDO_RETE = 300;
  // simulo delay per far finta sia collegato al back

  // chiave con cui salvo/leggo i dati nel localStorage
  private readonly STORAGE_KEY = 'datiEnergetici';

  constructor(private storage: StorageService) {
    // all'avvio guardo se ci sono gia dati salvati nel localStorage
    const salvati = this.storage.getLocal<DatiEnergetici[]>(this.STORAGE_KEY);
    if (salvati) {
      // se ci sono, parto da quelli (cosi sopravvivono al refresh)
      this.datiMock = salvati;
    } else {
      // se non ci sono, salvo i dati iniziali la prima volta
      this.persisti();
    }
  }

  // scrive lo stato attuale dei dati nel localStorage
  private persisti(): void {
    this.storage.setLocal(this.STORAGE_KEY, this.datiMock);
  }

  ricerca(payload: any): Observable<DatiEnergetici[]> {
    const endpoint = 'datiEnergetici/ricerca';
    console.log('[MOCK] POST', endpoint, payload);

    // versione da scommentare con backend
    // return this.api.postLogin<DatiEnergetici[]>(endpoint, payload);

    let risultati = this.datiMock;

    if (payload?.anno) {
      risultati = risultati.filter((d) => d.anno === payload.anno);
    }
    if (payload?.idCer) {
      risultati = risultati.filter((d) => d.idCer === Number(payload.idCer));
    }

    return of(risultati).pipe(delay(this.RITARDO_RETE));
  }

  getDatoById(id: number): Observable<DatiEnergetici | undefined> {
    const endpoint = 'datiEnergetici/visualizza/${id}';
    console.log('[MOck] get', endpoint);

    // da scommentare con backend attivo
    // return this.api.get<DatiEnergetici>(endpoint);

    const dato = this.datiMock.find((d) => d.idDati === id);
    return of(dato).pipe(delay(this.RITARDO_RETE));
  }

  inserisci(dato: DatiEnergetici): Observable<DatiEnergetici> {
    const endpoint = 'datiEnergetici/inserimento';
    console.log('[MOCK] POST', endpoint, dato);

    // da scommentare con backend
    // return this.api.post<DatiEnergetici>(endpoint,dato);
    // id robusto: prendo l'id piu alto presente e aggiungo 1
    const prossimoId =
      this.datiMock.length > 0
        ? Math.max(...this.datiMock.map((d) => d.idDati)) + 1
        : 1;
    const nuovo: DatiEnergetici = {
      ...dato,
      idDati: prossimoId,
    };
    this.datiMock.push(nuovo);
    this.persisti();
    return of(nuovo).pipe(delay(this.RITARDO_RETE));
  }

  modifica(id: number, dato: DatiEnergetici): Observable<DatiEnergetici> {
    const endpoint = 'datiEnergetici/modifica';
    console.log('[MOCK] PUT', endpoint, dato);

    // da scommentare con backend
    // return this.api.put<DatiEnergetici>(endpoint, { ...dato, idDati: id });

    const index = this.datiMock.findIndex((d) => d.idDati === id);
    if (index !== -1) {
      this.datiMock[index] = { ...dato, idDati: id };
      this.persisti();
    }
    return of(this.datiMock[index]).pipe(delay(this.RITARDO_RETE));
  }
  elimina(id: number): Observable<boolean> {
    const endpoint = 'datiEnergetici/disattiva';
    console.log('[MOCK] PUT', endpoint, id);

    // da scommentare con backend
    // return this.api.put<boolean>(endpoint, { idDati: id });

    this.datiMock = this.datiMock.filter((d) => d.idDati !== id);
    this.persisti();
    return of(true).pipe(delay(this.RITARDO_RETE));
  }
}

//   dettaglio(id: number): Observable<DatiEnergetici | undefined> {
//     return of(this.datiMock.find((d) => d.idDati === id));
//   }
//   inserisci(dato: DatiEnergetici): Observable<DatiEnergetici> {
//     const nuovo = {
//       ...dato,
//       // SPREAD operator REST operator
//       // Serve a prendere gli elementi dentro qualcosa e “spargerli”.
//       // raccoglie più valori insieme.

//       idDati: this.datiMock.length + 1,
//     };
//     this.datiMock.push(nuovo);
//     return of(nuovo);
//   }
//   modifica(id: number, dato: DatiEnergetici): Observable<DatiEnergetici> {
//     const index = this.datiMock.findIndex((d) => d.idDati === id);
//     if (index !== -1) {
//       this.datiMock[index] = {
//         ...dato,
//         idDati: id,
//       };
//     }
//     return of(this.datiMock[index]);
//   }
//   getDatoById(id: number): Observable<DatiEnergetici | undefined> {
//     return of(this.datiMock.find((dato) => dato.idDati === id));
//   }
//   elimina(id: number): Observable<boolean> {
//     this.datiMock = this.datiMock.filter(
//       (d: DatiEnergetici) => d.idDati !== id,
//     );
//     return of(true);
//   }
