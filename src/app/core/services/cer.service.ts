import { Injectable } from '@angular/core';
import { CER } from '../interfaces/cer.model';
import { ApiService } from './api.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CERService {
  constructor(private apiService: ApiService) {}

  getCERS(payload: any): Observable<CER[]> {
    const endpoint = "cer/ricerca";
    return this.apiService.post<CER[]>(endpoint, payload);
  }

  getCER(params?: Partial<CER>): Observable<CER[]> {
    return this.apiService.get<CER[]>("cer", params as Record<string, string | number | boolean> | undefined);
  }

  createCER(payload: CER): Observable<CER> {
    console.log("CER creato con successo");
    const endpoint = "cer/inserimento";
    return this.apiService.post<CER>(endpoint, payload);
  }

  editCER(payload: CER) {
    console.log("CER modificato con successo");
    const endpoint = "cer/modifica";
    return this.apiService.put<CER>(endpoint, payload);
  }

  deleteCER(payload: CER): Observable<CER> {
    console.log('CER eliminato con successo')
    const endpoint = "cer/cancellazione";
    return this.apiService.put<CER>(endpoint, payload);
  }
}
