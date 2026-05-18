import { Injectable } from "@angular/core";
import { DatiEnergetici } from "../../core/interfaces/dati-energetici.model";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";
import { of } from 'rxjs';

@Injectable({
  providedIn: "root",
})
export class DatiEnergeticiService {
  constructor(private api: ApiService) {}

  getDati(payload: any, options: ApiRequestOptions = {}): Observable<DatiEnergetici[]> {
    const endpoint = "datiEnergetici/ricerca";
    return this.api.postLogin<DatiEnergetici[]>(endpoint, payload, options);
  }

  // getDato(id: number, options: ApiRequestOptions = {}): Observable<DatiEnergetici[]> {
  //   const endpoint = `datiEnergetici/visualizza/${id}`;
  //   return this.api.get<DatiEnergetici[]>(endpoint, undefined, options);

    getDato(id: number): Observable<DatiEnergetici[]> {

  const mock: DatiEnergetici[] = [
    {
      idDati: id,
      idCer: 2,
      idConfig: 3,
      anno: 2024,
      eProdotta: 120,
      ePrelevata: 80,
      eImmessa: 40,
      eCondivisa: 60,
      eAutoCons: 50,
      tariffaPremium: 12,
      corrPremioOtt: 45,
      ridEmCo2: "12",
      calcoloCo2Automatic: 13,
      note: "MOCK",
      flgCancellazione: null
    }
  ];

  return of(mock);

  }

  createDatiEnergetici(payload: DatiEnergetici, options: ApiRequestOptions = {}): Observable<DatiEnergetici> {
    console.log("Dati Energetici creati con successo");
    const endpoint = "datiEnergetici/inserimento";
    return this.api.post<DatiEnergetici>(endpoint, payload, options);
  }

  // editDatiEnergetici(payload: DatiEnergetici, options: ApiRequestOptions = {}) {
  //   console.log("Dati Energetici modificati con successo");
  //   const endpoint = "datiEnergetici/modifica";
  //   return this.api.put<DatiEnergetici>(endpoint, payload, options);

    editDatiEnergetici(
  payload: DatiEnergetici,
  options: ApiRequestOptions = {}
): Observable<DatiEnergetici> {

  console.log("MOCK SALVATAGGIO:", payload);

  return of(payload);
}


  deleteDatiEnergetici(payload: any, options: ApiRequestOptions = {}): Observable<DatiEnergetici> {
    console.log("Dati Energetici eliminati con successo");
    const endpoint = "datiEnergetici/disattiva";
    return this.api.put<DatiEnergetici>(endpoint, payload, options);
  }
}
