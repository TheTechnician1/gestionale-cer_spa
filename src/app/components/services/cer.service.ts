import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiRequestOptions, ApiService } from 'src/app/core/services/api.service';

@Injectable({
  providedIn: 'root'
})
export class CerService {


    private mockCer: any[] = [
    { idCer: 100, ragSociale: 'CER Napoli' },
    { idCer: 101, ragSociale: 'CER Milano' },
    { idCer: 102, ragSociale: 'CER Roma' },
  ];

  constructor(private api: ApiService) {}

  ricercaCer(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    return of(this.mockCer);
  }

  visualizzaCer(id: number, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = `cer/visualizzazione/${id}`;
    return this.api.get<any[]>(endpoint, undefined, options);
  }
}


/*
  constructor(private api: ApiService) {}

  ricercaCer(payload: any, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = 'cer/ricerca';
    return this.api.postLogin<any[]>(endpoint, payload, options);
  }

  visualizzaCer(id: number, options: ApiRequestOptions = {}): Observable<any[]> {
    const endpoint = `cer/visualizzazione/${id}`;
    return this.api.get<any[]>(endpoint, undefined, options);
  }
}
  */