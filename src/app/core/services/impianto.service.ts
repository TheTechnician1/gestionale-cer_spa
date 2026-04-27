import { Injectable } from '@angular/core';
import { Impianto } from '../interfaces/impianto.model';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImpiantoService {
  constructor(private api: ApiService) { }

  getImpianti(payload: any): Observable<Impianto[]> {
      const endpoint = "impianto/ricerca";
      return this.api.postLogin<Impianto[]>(endpoint, payload);
    }

    getImpianto(id: number): Observable<Impianto[]> {
      const endpoint = `impianto/visualizzazione/${id}`;
      return this.api.get<Impianto[]>(endpoint);
    }

    createImpianto(payload: Impianto): Observable<Impianto> {
      console.log("Impianto creato con successo");
      const endpoint = "impianto/inserimento";
      return this.api.post<Impianto>(endpoint, payload);
    }

    editImpianto(payload: Impianto) {
      console.log("Impianto modificato con successo");
      const endpoint = "impianto/modifica";
      return this.api.put<Impianto>(endpoint, payload);
    }

    deleteImpianto(payload: Impianto): Observable<Impianto> {
      console.log('Impianto eliminato con successo')
      const endpoint = "impianto/cancellazione";
      return this.api.put<Impianto>(endpoint, payload);
    }
}
