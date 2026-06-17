import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CarrelloResponse } from '../models/carrello-response';

@Injectable({
  providedIn: 'root',
})
export class CarrelloService {
  private readonly apiUrl = 'http://localhost:8080/api/carrello';

  constructor(private httpClient: HttpClient) {}

  recuperaCarrelloUtente(idUtente: number): Observable<CarrelloResponse[]> {
    return this.httpClient.get<CarrelloResponse[]>(`${this.apiUrl}/${idUtente}`);
  }

  aggiungiProdottoAlCarrello(
    idUtente: number,
    idProdotto: number,
    quantita: number,
  ): Observable<CarrelloResponse[]> {
    return this.httpClient.post<CarrelloResponse[]>(
      `${this.apiUrl}/${idUtente}/prodotti/${idProdotto}?quantita=${quantita}`,
      null,
    );
  }

  modificaQuantitaProdotto(
    idUtente: number,
    idProdotto: number,
    quantita: number,
  ): Observable<CarrelloResponse[]> {
    return this.httpClient.put<CarrelloResponse[]>(
      `${this.apiUrl}/${idUtente}/prodotti/${idProdotto}?quantita=${quantita}`,
      null,
    );
  }

  rimuoviProdottoDalCarrello(
    idUtente: number,
    idProdotto: number,
  ): Observable<CarrelloResponse[]> {
    return this.httpClient.delete<CarrelloResponse[]>(
      `${this.apiUrl}/${idUtente}/prodotti/${idProdotto}`,
    );
  }

  svuotaCarrello(idUtente: number): Observable<void> {
    return this.httpClient.delete<void>(`${this.apiUrl}/${idUtente}`);
  }
}