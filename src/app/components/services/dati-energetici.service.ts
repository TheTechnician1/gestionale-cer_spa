import { Injectable } from "@angular/core";
import { DatiEnergetici } from "../../core/interfaces/dati-energetici.model";
import {
  ApiRequestOptions,
  ApiService
} from "../../core/services/api.service";

import { Observable, of } from "rxjs";

import { DatiEnergeticiView } from
  "src/app/core/interfaces/dati-energetici-view";
import { HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class DatiEnergeticiService {

  constructor(
    private api: ApiService,

  ) {}

  // =========================================
  // MOCK DATI
  // =========================================

  // private MOCK_DATI: DatiEnergeticiView[] = [

  //   {
  //     idSchedaEnergetica: 1,
  //     annoRiferimento: "2025",
  //     idCer: 2,
  //     partitaIva: "12345678901",
  //     idConfigurazione: 10,
  //     codiceCabina: "CAB-001",
  //     attivo: "OK",
    
  //   },

  //   {
  //     idSchedaEnergetica: 2,
  //     annoRiferimento: "2024",
  //     idCer: 3,
  //     partitaIva: "10987654321",
  //     idConfigurazione: 11,
  //     codiceCabina: "CAB-002",
  //     attivo: "DA_VERIFICARE",
      
  //   },

  //   {
  //     idSchedaEnergetica: 3,
  //     annoRiferimento: "2023",
  //     idCer: null,
  //     partitaIva: null,
  //     idConfigurazione: 12,
  //     codiceCabina: "CAB-003",
  //     attivo: "IN_BOZZA",
    
  //   }

  //];

    getDatiFilter(filter: Record<string, string | number | boolean>[], options: ApiRequestOptions = {}): Observable<DatiEnergeticiView[]> {
      const endpoint = "/api/dati-energetici/";
      console.log("filtro inviato al back: " + JSON.stringify(Object.assign({}, ...filter)));
      return this.api.get<DatiEnergeticiView[]>(endpoint, Object.assign({}, ...filter), options);
    }

  // =========================================
  // GET LISTA
  // =========================================

getDati(filters: any): Observable<DatiEnergetici[]> {

  return this.api.get<DatiEnergetici[]>(
    'api/dati-energetici/filtro',
    {
      idCer: filters.idCer,
      idCabina: filters.idCabina,
      annoDa: filters.annoDa,
      annoA: filters.annoA
    }
  );
}

  // =========================================
  // GET DETTAGLIO
  // =========================================

  getDato(
    id: number,
    options: ApiRequestOptions = {}
  ): Observable<DatiEnergeticiView> {

    const endpoint =
      `datiEnergetici/visualizza/${id}`;

    return this.api.get<
      DatiEnergeticiView
    >(
      endpoint,
      undefined,
      options
    );

  }

  getDatiById(id: number, options: ApiRequestOptions = {}): Observable<DatiEnergeticiView[]> {
  return this.api.get<DatiEnergeticiView[]>(
    `api/dati-energetici/${id}`,
    undefined,
    options
  );
}
  // =========================================
  // VERSIONE MOCK COMMENTATA
  // =========================================

  /*
  getDato(id: number): Observable<DatiEnergeticiView> {

    const dato:
      DatiEnergeticiView | undefined =

      this.MOCK_DATI.find(
        d => d.idDati === id
      );

    if (!dato) {

      throw new Error(
        "Dato non trovato"
      );

    }

    return of(dato);

  }
  */

  // =========================================
  // CREATE
  // =========================================

  createDatiEnergetici(
    payload: DatiEnergetici,
    options: ApiRequestOptions = {}
  ): Observable<DatiEnergetici> {

    console.log(
      "Dati Energetici creati con successo"
    );

    const endpoint =
      "datiEnergetici/inserimento";

    return this.api.post<
      DatiEnergetici
    >(
      endpoint,
      payload,
      options
    );

  }

  // =========================================
  // UPDATE BACKEND
  // =========================================

  putDato(
    id: number,
    payload: DatiEnergetici,
    options: ApiRequestOptions = {}
  ): Observable<DatiEnergetici> {

    console.log(
      "UPDATE BACKEND:",
      payload
    );

    const endpoint =
      `datiEnergetici/modifica/${id}`;

    return this.api.put<
      DatiEnergetici
    >(
      endpoint,
      payload,
      options
    );

  }

  // =========================================
  // VERSIONE MOCK COMMENTATA
  // =========================================

  /*
  editDatiEnergetici(
    payload: DatiEnergetici,
    options: ApiRequestOptions = {}
  ): Observable<DatiEnergetici> {

    console.log(
      "MOCK SALVATAGGIO:",
      payload
    );

    return of(payload);

  }
  */

  // =========================================
  // DELETE
  // =========================================

  deleteDatiEnergetici(
    payload: any,
    options: ApiRequestOptions = {}
  ): Observable<DatiEnergetici> {

    console.log(
      "Dati Energetici eliminati con successo"
    );

    const endpoint =
      "datiEnergetici/disattiva";

    return this.api.put<
      DatiEnergetici
    >(
      endpoint,
      payload,
      options
    );

  }

}