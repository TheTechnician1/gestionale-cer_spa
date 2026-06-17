import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ProdottoResponse } from '../models/prodotto-response';

@Injectable({
  providedIn: 'root',
})
export class ProdottoService {
  private readonly apiUrl = 'http://localhost:8080/api/prodotti';

  constructor(private httpClient: HttpClient) {}

  recuperaProdotti(): Observable<ProdottoResponse[]> {
    return this.httpClient.get<ProdottoResponse[]>(this.apiUrl);
  }

  recuperaProdottoPerId(idProdotto: number): Observable<ProdottoResponse> {
    return this.httpClient.get<ProdottoResponse>(`${this.apiUrl}/${idProdotto}`);
  }

  recuperaProdottiPerCategoria(
    nomeCategoria: string,
  ): Observable<ProdottoResponse[]> {
    return this.httpClient.get<ProdottoResponse[]>(
      `${this.apiUrl}/categoria/${nomeCategoria}`,
    );
  }

  cercaProdottiPerNome(nome: string): Observable<ProdottoResponse[]> {
    return this.httpClient.get<ProdottoResponse[]>(`${this.apiUrl}/ricerca`, {
      params: { nome },
    });
  }
}