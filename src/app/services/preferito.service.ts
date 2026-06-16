import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProdottoResponse } from '../models/prodotto-response';

@Injectable({
  providedIn: 'root',
})
export class PreferitoService {
  private readonly apiUrl = 'http://localhost:8080/api/preferiti';

  constructor(private httpClient: HttpClient) {}

  recuperaProdottiPreferitiUtente(
    idUtente: number,
  ): Observable<ProdottoResponse[]> {
    return this.httpClient.get<ProdottoResponse[]>(
      `${this.apiUrl}/utente/${idUtente}`,
    );
  }

  aggiungiProdottoAiPreferiti(
    idUtente: number,
    idProdotto: number,
  ): Observable<ProdottoResponse[]> {
    return this.httpClient.post<ProdottoResponse[]>(
      `${this.apiUrl}/utente/${idUtente}/prodotti/${idProdotto}`,
      null,
    );
  }

  rimuoviProdottoDaiPreferiti(
    idUtente: number,
    idProdotto: number,
  ): Observable<ProdottoResponse[]> {
    return this.httpClient.delete<ProdottoResponse[]>(
      `${this.apiUrl}/utente/${idUtente}/prodotti/${idProdotto}`,
    );
  }
}