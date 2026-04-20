import { Injectable } from '@angular/core';
import { CER } from '../interfaces/cer.model';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CERService {
  constructor(private apiService: ApiService) {}

  getCERS(): Observable<CER[]> {
    return this.apiService.get<CER[]>("ricercaCer");
  }

  getCER(params?: Partial<CER>): Observable<CER[]> {
    return this.apiService.get<CER[]>("cer", params as Record<string, string | number | boolean> | undefined);
  }

  createCER(payload: CER): Observable<CER> {
    console.log("CER creato con successo");
    return this.apiService.post<CER>("cer", payload);
  }

  editCER(payload: CER) {
    console.log("CER modificato con successo");
    return this.apiService.put<CER>(`modificaCer`, payload);
  }

  deleteCER(payload: CER): Observable<CER> {
    console.log('CER eliminato con successo')
    return this.apiService.put<CER>(`cancellazioneCer`, payload);
  }
}
