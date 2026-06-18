import { Injectable } from '@angular/core';
import { ApiRequestOptions, ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Ordine } from '../interfaces/ordine';
import { ArticoloCarrelloDTO } from '../interfaces/carrello';

@Injectable({
  providedIn: 'root'
})
export class OrdineService {

  constructor(private api: ApiService) { }

  visualizzaOrdine(orderId: number|null, options: ApiRequestOptions = {}): Observable<Ordine> {
      const endpoint = `api/orders/${orderId}`;
      return this.api.get<Ordine>(endpoint, {}, options);
  }

  creaOrdine(userId?:number ,ordini? : ArticoloCarrelloDTO[], options: ApiRequestOptions = {}): Observable<Ordine>{
    const endpoint = `api/orders/${userId}/orders/checkout`;
    return this.api.postLogin<Ordine>(endpoint,ordini, options);
  }
}
