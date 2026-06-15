import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProdottoResponse } from '../models/prodotto-response';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdottoService {
  private readonly apiUrl = 'http://localhost:8080/api/prodotti';

  constructor(private httpClient: HttpClient) {}
  recuperaProdotti(): Observable<ProdottoResponse[]> {
    return this.httpClient.get<ProdottoResponse[]>(this.apiUrl);
  }
  recuperaProdottiPerCategoria(
    nomeCategoria: string,
  ): Observable<ProdottoResponse[]> {
    return this.httpClient.get<ProdottoResponse[]>(
      `${this.apiUrl}/categoria/${nomeCategoria}`,
    );
  }
}
