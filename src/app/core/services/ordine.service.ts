import { Injectable } from '@angular/core';
import { ApiRequestOptions, ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Ordine } from '../interfaces/ordine';

@Injectable({
  providedIn: 'root'
})
export class OrdineService {

  constructor(private api: ApiService) { }

  visualizzaOrdine(orderId: number|null, options: ApiRequestOptions = {}): Observable<Ordine> {
      const endpoint = `api/orders/${orderId}`;
      return this.api.get<Ordine>(endpoint, {}, options);
  }
}
