import { inject, Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { StorageService } from '../../core/services/storage.service';

export interface Impianto {
  id: number;
  tipologia: string;
  potenzaNominale: number;
  regione: string;
  comune: string;
  indirizzo: string;
  cap: string;
  partitaIva: string;
  flgAccumulo: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ImpiantoService {
  private impiantiMock: Impianto[] = [
    {
      id: 1,
      tipologia: 'Fotovoltaico',
      potenzaNominale: 120,
      regione: 'Lazio',
      comune: 'Roma',
      indirizzo: 'Via Roma 1',
      cap: '00100',
      partitaIva: '12345678901',
      flgAccumulo: true,
    },
    {
      id: 2,
      tipologia: 'Eolico',
      potenzaNominale: 300,
      regione: 'Campania',
      comune: 'Napoli',
      indirizzo: 'Via Napoli 20',
      cap: '80100',
      partitaIva: '98765432109',
      flgAccumulo: false,
    },
    {
      id: 3,
      tipologia: 'Idroelettrico',
      potenzaNominale: 520,
      regione: 'Piemonte',
      comune: 'Torino',
      indirizzo: 'Strada del Fiume 8',
      cap: '10100',
      partitaIva: '45612378901',
      flgAccumulo: true,
    },
    {
      id: 4,
      tipologia: 'Biomassa',
      potenzaNominale: 210,
      regione: 'Toscana',
      comune: 'Firenze',
      indirizzo: 'Via dei Mulini 14',
      cap: '50100',
      partitaIva: '74185296301',
      flgAccumulo: false,
    },
    {
      id: 5,
      tipologia: 'Agrivoltaico',
      potenzaNominale: 430,
      regione: 'Puglia',
      comune: 'Bari',
      indirizzo: 'Contrada Sole 22',
      cap: '70100',
      partitaIva: '96325874102',
      flgAccumulo: true,
    },
    {
      id: 6,
      tipologia: 'Fotovoltaico Industriale',
      potenzaNominale: 980,
      regione: 'Lombardia',
      comune: 'Milano',
      indirizzo: 'Via Energia 77',
      cap: '20100',
      partitaIva: '11223344556',
      flgAccumulo: true,
    },
    {
      id: 7,
      tipologia: 'Mini Eolico',
      potenzaNominale: 75,
      regione: 'Sardegna',
      comune: 'Cagliari',
      indirizzo: 'Via del Vento 3',
      cap: '09100',
      partitaIva: '66554433221',
      flgAccumulo: false,
    },
    {
      id: 8,
      tipologia: 'Geotermico',
      potenzaNominale: 640,
      regione: 'Sicilia',
      comune: 'Catania',
      indirizzo: 'Via Vulcano 55',
      cap: '95100',
      partitaIva: '10293847566',
      flgAccumulo: true,
    },
  ];

  private readonly RITARDO_RETE = 3000;
  private readonly STORAGE_KEY = 'impianti';

  constructor(private storage: StorageService) {
    const salvati = this.storage.getLocal<Impianto[]>(this.STORAGE_KEY);
    if (salvati) {
      this.impiantiMock = salvati;
    } else {
      this.persisti();
    }
  }

  private persisti(): void {
    this.storage.setLocal(this.STORAGE_KEY, this.impiantiMock);
  }

  ricerca(payload: any): Observable<Impianto[]> {
    const endpoint = 'impianto/ricerca';
    console.log('[MOCK] POST', endpoint, payload);

    // versione da scommentare con backend
    // return this.api.postLogin<Impianto[]>(endpoint, payload);

    return of(this.impiantiMock).pipe(delay(this.RITARDO_RETE));
  }
  getById(id: number): Observable<Impianto | undefined> {
    const endpoint = `impianto/visualizzazione/${id}`;
    console.log('[MOCK] GET', endpoint);

    // versione da scommentare con backend
    // return this.api.get<Impianto>(endpoint);

    const impianto = this.impiantiMock.find((i) => i.id === id);
    return of(impianto).pipe(delay(this.RITARDO_RETE));
  }
  inserisci(impianto: Impianto): Observable<Impianto> {
    const endpoint = 'impianto/inserimento';
    console.log('[MOCK] POST', endpoint, impianto);

    // versione da scommentare con backend
    // return this.api.post<Impianto>(endpoint, impianto);

    const prossimoId =
      this.impiantiMock.length > 0
        ? Math.max(...this.impiantiMock.map((i) => i.id)) + 1
        : 1;
    const nuovo: Impianto = { ...impianto, id: prossimoId };
    this.impiantiMock.push(nuovo);
    this.persisti();
    return of(nuovo).pipe(delay(this.RITARDO_RETE));
  }

  modifica(id: number, impianto: Impianto): Observable<Impianto> {
    const endpoint = 'impianto/modifica';
    console.log('[MOCK] PUT', endpoint, impianto);

    // versione da scommentare con backend
    // return this.api.put<Impianto>(endpoint, { ...impianto, id });

    const index = this.impiantiMock.findIndex((i) => i.id === id);
    if (index !== -1) {
      this.impiantiMock[index] = { ...impianto, id };
      this.persisti();
    }
    return of(this.impiantiMock[index]).pipe(delay(this.RITARDO_RETE));
  }

  elimina(id: number): Observable<boolean> {
    const endpoint = 'impianto/cancellazione';
    console.log('[MOCK] PUT', endpoint, id);

    // versione da scommentare con backend
    // return this.api.put<boolean>(endpoint, { id });

    this.impiantiMock = this.impiantiMock.filter((i) => i.id !== id);
    this.persisti();
    return of(true).pipe(delay(this.RITARDO_RETE));
  }
}

// import { Injectable } from "@angular/core";
// import { Impianto } from "../../core/interfaces/impianto.model";
// import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
// import { Observable } from "rxjs";

// @Injectable({
//   providedIn: "root",
// })
// export class ImpiantoService {
//   constructor(private api: ApiService) {}

//   getImpianti(payload: any, options: ApiRequestOptions = {}): Observable<Impianto[]> {
//     const endpoint = "impianto/ricerca";
//     return this.api.postLogin<Impianto[]>(endpoint, payload, options);
//   }

//   getImpianto(id: number, options: ApiRequestOptions = {}): Observable<Impianto[]> {
//     const endpoint = `impianto/visualizzazione/${id}`;
//     return this.api.get<Impianto[]>(endpoint, undefined, options);
//   }

//   createImpianto(payload: Impianto, options: ApiRequestOptions = {}): Observable<Impianto> {
//     console.log("Impianto creato con successo");
//     const endpoint = "impianto/inserimento";
//     return this.api.post<Impianto>(endpoint, payload, options);
//   }

//   editImpianto(payload: Impianto, options: ApiRequestOptions = {}) {
//     console.log("Impianto modificato con successo");
//     const endpoint = "impianto/modifica";
//     return this.api.put<Impianto>(endpoint, payload, options);
//   }

//   deleteImpianto(payload: Impianto, options: ApiRequestOptions = {}): Observable<Impianto> {
//     console.log("Impianto eliminato con successo");
//     const endpoint = "impianto/cancellazione";
//     return this.api.put<Impianto>(endpoint, payload, options);
//   }
// }
