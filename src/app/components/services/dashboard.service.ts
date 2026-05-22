import { Injectable } from "@angular/core";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";


@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getDati(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "cer/ricerca";
    return this.api.postLogin<any[]>(endpoint, payload, options);
  }

  getSummary(payload: any, options: ApiRequestOptions = {}): Observable<any> {
    const endpoint = "api/dashboard/summary";
    return this.api.get<any>(endpoint, payload, options);
  }

  getImpiantiPerStato(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "api/dashboard/impianti-per-stato";
    return this.api.get<any[]>(endpoint, payload, options);
  }

  getImpiantiPerTipologia(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "api/dashboard/impianti-per-tipologia";
    return this.api.get<any[]>(endpoint, payload, options);
  }

  getAndamentoEnergetico(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "api/dashboard/andamento-energetico";
    return this.api.get<any[]>(endpoint, payload, options);
  }

  getTopCer(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "api/dashboard/top-cer";
    return this.api.get<any[]>(endpoint, payload, options);
  }

  getAlert(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "api/dashboard/alert";
    return this.api.get<any[]>(endpoint, payload, options);
  }
}

