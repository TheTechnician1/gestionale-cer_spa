import { Injectable } from "@angular/core";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable, of } from "rxjs";
import { CerEnergy, DashboardEnergetica, DashboardInterfaces, DashboardTopCer } from "src/app/core/interfaces/dashboard.interfaces";
import { HttpClient } from '@angular/common/http';
import { DashboardImpianti } from "src/app/core/interfaces/dashboard.interfaces";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getDati(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "cer/ricerca";
    return this.api.postLogin<any[]>(endpoint, payload, options);
  }

  getSummary(anno?: number, anno2?: number): Observable<DashboardEnergetica> {
    const endpoint = "/api/dashboard/summary";

    const params: any = {};

    if (anno != null) params.anno = anno;
    if (anno2 != null) params.anno2 = anno2;

    return this.api.get<DashboardEnergetica>(endpoint, { params });
  }

getDashboardImpianti(): Observable<DashboardImpianti[]> {
  const endpoint = "/api/dashboard/impianti-per-stato";
  return this.api.get<DashboardImpianti[]>(endpoint);
}
getDashboardImpianti1(): Observable<DashboardImpianti[]> {
  const endpoint = "/api/dashboard/impianti-per-tipologia";
  return this.api.get<DashboardImpianti[]>(endpoint);
}
getDashboardAndamento(): Observable<CerEnergy[]> {
  const endpoint = "/api/dashboard/andamento-energetico";
  return this.api.get<CerEnergy[]>(endpoint);
}

getDashboardTopCer() {
  return of([
    {
      ragioneSociale: 'CER Energia Verde Roma',
      incentivi: 1200,
      energiaCondivisa: 450,
    },
    {
      ragioneSociale: 'CER Lazio Solare',
      incentivi: 900,
      energiaCondivisa: 300,
    },
    {
      ragioneSociale: 'CER Nomentano Power',
      incentivi: 1500,
      energiaCondivisa: 600,
    },
    {
      ragioneSociale: 'CER Italia Rinnovabile',
      incentivi: 700,
      energiaCondivisa: 250,
    },
    {
      ragioneSociale: 'CER Green Community',
      incentivi: 1100,
      energiaCondivisa: 520,
    },
  ]);
}
}
