import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from 'src/app/core/interfaces/product.interface';
import { APP_SETTINGS } from 'src/app/core/config/app-settings';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = APP_SETTINGS.apiBaseUrl + '/api/products';

  constructor(private http: HttpClient) {}

  listaProdotti(): Observable<Product[]> {
    return this.http.get<Product[]>(this.baseUrl);
  }

  dettaglioProdotto(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`);
  }

  ricercaSemplice(nomeProdotto: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/search`, {
      params: new HttpParams().set('nomeProdotto', nomeProdotto),
    });
  }

  ricercaAvanzata(
    categoria?: string,
    minPrezzo?: number,
    maxPrezzo?: number,
    minQuantita?: number,
  ): Observable<Product[]> {
    let params = new HttpParams();
    if (categoria) params = params.set('categoria', categoria);
    if (minPrezzo != null) params = params.set('minPrezzo', minPrezzo);
    if (maxPrezzo != null) params = params.set('maxPrezzo', maxPrezzo);
    if (minQuantita != null) params = params.set('minQuantita', minQuantita);
    return this.http.get<Product[]>(`${this.baseUrl}/advanced-search`, {
      params,
    });
  }

  categorie(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categorie`);
  }
}
