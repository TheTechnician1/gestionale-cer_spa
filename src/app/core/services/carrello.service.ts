import { Injectable } from '@angular/core';
import { ArticoloCarrelloDTOModel, Carrello } from '../interfaces/carrello';
import { Observable } from 'rxjs';
import { ApiRequestOptions, ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {

  constructor(private api: ApiService) { }

  getCarrello(idUtente: number|null, options: ApiRequestOptions = {}): Observable<Carrello> {
    const endpoint = `api/users/${idUtente}/cart`;
    return this.api.get<Carrello>(endpoint, {}, options);
  }

  aggiuntaArticoloCarrello(idUtente: number|null,payload: ArticoloCarrelloDTOModel, options: ApiRequestOptions = {}): Observable<Carrello> {
    const endpoint = `api/users/${idUtente}/cart/items`;
    return this.api.postLogin<Carrello>(endpoint, payload, options);
  }
}
