import { Injectable } from '@angular/core';
import { Impianto } from '../interfaces/impianto.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpiantoService {
  constructor(private api: ApiService) { }

  getImpianti(): Observable<Impianto[]> {
    return this.api.get<Impianto[]>("ricercaImpianto");
  }

  getImpianto(params?: Partial<Impianto>): Observable<Impianto[]> {
    return this.api.get<Impianto[]>("impianto", params as Record<string, string | number | boolean> | undefined);
  }

  createImpianto(payload: Impianto): Observable<Impianto> {
    console.log("Impianto creato con successo");
    return this.api.post<Impianto>("impianto", payload);
  }

  editImpianto(payload: Impianto) {
    console.log("Impianto modificato con successo");
    return this.api.put<Impianto>(`modificaImpianto`, payload);
  }

  deleteImpianto(payload: Impianto): Observable<Impianto> {
    console.log('Impianto eliminato con successo')
    return this.api.put<Impianto>(`cancellazioneImpianto`, payload);
  }
}
