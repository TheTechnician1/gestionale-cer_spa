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
}
