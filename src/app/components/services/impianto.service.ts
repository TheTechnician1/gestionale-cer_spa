import { Injectable } from "@angular/core";
import { Impianto } from "../../core/interfaces/impianto.model";
import { ApiRequestOptions, ApiService } from "../../core/services/api.service";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class ImpiantoService {
  constructor(private api: ApiService) {}

  getImpianti(payload: any, options: ApiRequestOptions = {}): Observable<Impianto[]> {
    const endpoint = "impianto/ricerca";
    return this.api.postLogin<Impianto[]>(endpoint, payload, options);
  }

  getImpianto(id: number, options: ApiRequestOptions = {}): Observable<Impianto[]> {
    const endpoint = `impianto/visualizzazione/${id}`;
    return this.api.get<Impianto[]>(endpoint, undefined, options);
  }

  createImpianto(payload: Impianto, options: ApiRequestOptions = {}): Observable<Impianto> {
    console.log("Impianto creato con successo");
    const endpoint = "impianto/inserimento";
    return this.api.post<Impianto>(endpoint, payload, options);
  }

  editImpianto(payload: Impianto, options: ApiRequestOptions = {}) {
    console.log("Impianto modificato con successo");
    const endpoint = "impianto/modifica";
    return this.api.put<Impianto>(endpoint, payload, options);
  }

  deleteImpianto(payload: Impianto, options: ApiRequestOptions = {}): Observable<Impianto> {
    console.log("Impianto eliminato con successo");
    const endpoint = "impianto/cancellazione";
    return this.api.put<Impianto>(endpoint, payload, options);
  }
}
