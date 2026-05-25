import { Injectable } from "@angular/core";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";
import { DashboardInterfaces } from "src/app/core/interfaces/dashboard.interfaces";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  constructor(private api: ApiService) {}

  getDati(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = "cer/ricerca";
    return this.api.postLogin<any[]>(endpoint, payload, options);
  }

  getSummary(anno?: number, anno2?: number): Observable<DashboardInterfaces> {
    const endpoint = "/api/dashboard/summary";

    const params: any = {};

    if (anno != null) params.anno = anno;
    if (anno2 != null) params.anno2 = anno2;

    return this.api.get<DashboardInterfaces>(endpoint, { params });
  }
}