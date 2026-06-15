import { Injectable } from '@angular/core';
import { Prodotto } from '../interfaces/prodotto.model';
import { Observable } from 'rxjs';
import { ApiRequestOptions, ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProdottiService {

  constructor(private api: ApiService) { }
  getProdotti(options: ApiRequestOptions = {}): Observable<Prodotto[]> {
    const endpoint = "api/products/";
    return this.api.get<Prodotto[]>(endpoint, {}, options);
  }
}
