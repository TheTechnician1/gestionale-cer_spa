import { Injectable } from "@angular/core";
import { DatiEnergetici } from "../../core/interfaces/dati-energetici.model";
import { ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getDati(payload: any): Observable<any[]> {
    const endpoint = "datiEnergetici/ricerca";
    return this.api.postLogin<any[]>(endpoint, payload);
  }
}
