import { Injectable } from "@angular/core";
import { DatiEnergetici } from "../../core/interfaces/dati-energetici.model";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DatiEnergeticiService {
  constructor(private api: ApiService) {}

  getDati(payload: any, options: ApiRequestOptions = {}): Observable<DatiEnergetici[]> {
    const endpoint = "datiEnergetici/ricerca";
    return this.api.postLogin<DatiEnergetici[]>(endpoint, payload, options);
  }

  getDato(id: number, options: ApiRequestOptions = {}): Observable<DatiEnergetici[]> {
    const endpoint = `datiEnergetici/visualizza/${id}`;
    return this.api.get<DatiEnergetici[]>(endpoint, undefined, options);
  }

  createDatiEnergetici(payload: DatiEnergetici, options: ApiRequestOptions = {}): Observable<DatiEnergetici> {
    console.log("Dati Energetici creati con successo");
    const endpoint = "datiEnergetici/inserimento";
    return this.api.post<DatiEnergetici>(endpoint, payload, options);
  }

  editDatiEnergetici(payload: DatiEnergetici, options: ApiRequestOptions = {}) {
    console.log("Dati Energetici modificati con successo");
    const endpoint = "datiEnergetici/modifica";
    return this.api.put<DatiEnergetici>(endpoint, payload, options);
  }

  deleteDatiEnergetici(payload: any, options: ApiRequestOptions = {}): Observable<DatiEnergetici> {
    console.log("Dati Energetici eliminati con successo");
    const endpoint = "datiEnergetici/disattiva";
    return this.api.put<DatiEnergetici>(endpoint, payload, options);
  }
}
