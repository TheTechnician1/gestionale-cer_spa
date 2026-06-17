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

  getById(id: number, options: ApiRequestOptions = {}): Observable<Prodotto> {
    const endpoint = `api/products/${id}`;
    return this.api.get<Prodotto>(endpoint, {}, options);
  }

  getByName(name: string, options: ApiRequestOptions = {}): Observable<Prodotto[]> {
    const endpoint = `api/products/search`;
    return this.api.get<Prodotto[]>(endpoint, { name }, options);
  }

  getWithFilters(
    categoria?: string,
    prezzoMin?: number,
    prezzoMax?: number,
    quantitaDisponibileMin?: number,
    quantitaDisponibileMax?: number,
    nomeProdotto?: string,
    options: ApiRequestOptions = {}
  ): Observable<Prodotto[]> {
    const endpoint = "api/products/advanced-search";
    const params: any = {};

    if (categoria!== undefined && categoria !== null && categoria.trim() !== '' ) params.categoria = categoria;
    if (prezzoMin !== undefined  && prezzoMin !== null) params.prezzoMin = prezzoMin;
    if (prezzoMax !== undefined && prezzoMax !== null) params.prezzoMax = prezzoMax;
    if (quantitaDisponibileMin !== undefined && quantitaDisponibileMin !== null) params.quantitaDisponibileMin = quantitaDisponibileMin;
    if (quantitaDisponibileMax !== undefined && quantitaDisponibileMax !== null) params.quantitaDisponibileMax = quantitaDisponibileMax;
    if ( nomeProdotto !== undefined && nomeProdotto !== null && nomeProdotto.trim() !== '' ) params.nomeProdotto = nomeProdotto;
    return this.api.get<Prodotto[]>(endpoint, params, options);
  }
}
