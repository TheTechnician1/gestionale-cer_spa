import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ProdottoResponse } from '../models/prodotto-response';

@Injectable({
  providedIn: 'root',
})
export class ProdottoService {
  private readonly apiUrl = 'http://localhost:8080/api/prodotti';

  constructor(private httpClient: HttpClient) {}

  recuperaProdotti(): Observable<ProdottoResponse[]> {
    return this.httpClient
      .get<ProdottoResponse[]>(this.apiUrl)
      .pipe(map((prodotti) => this.normalizzaProdotti(prodotti)));
  }

  recuperaProdottoPerId(idProdotto: number): Observable<ProdottoResponse> {
    return this.httpClient
      .get<ProdottoResponse>(`${this.apiUrl}/${idProdotto}`)
      .pipe(map((prodotto) => this.normalizzaProdotto(prodotto)));
  }

  recuperaProdottiPerCategoria(
    nomeCategoria: string,
  ): Observable<ProdottoResponse[]> {
    return this.httpClient
      .get<ProdottoResponse[]>(`${this.apiUrl}/categoria/${nomeCategoria}`)
      .pipe(map((prodotti) => this.normalizzaProdotti(prodotti)));
  }

  cercaProdottiPerNome(nome: string): Observable<ProdottoResponse[]> {
    return this.httpClient
      .get<ProdottoResponse[]>(`${this.apiUrl}/ricerca`, {
        params: { nome },
      })
      .pipe(map((prodotti) => this.normalizzaProdotti(prodotti)));
  }

  private normalizzaProdotti(prodotti: ProdottoResponse[]): ProdottoResponse[] {
    return prodotti.map((prodotto) => this.normalizzaProdotto(prodotto));
  }

  private normalizzaProdotto(prodotto: ProdottoResponse): ProdottoResponse {
    if (!prodotto.immagine || prodotto.immagine.includes('loremflickr.com')) {
      return {
        ...prodotto,
        immagine: this.creaImmagineFallback(prodotto.nomeProdotto),
      };
    }

    return prodotto;
  }

  private creaImmagineFallback(nomeProdotto: string): string {
    const testo = encodeURIComponent(nomeProdotto || 'MajorBit Shop');
    return `https://placehold.co/800x800/f3f4f6/171717?text=${testo}`;
  }
}