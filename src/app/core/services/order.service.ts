import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { Ordini } from '../interfaces/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private api: ApiService) {}

  getAllOrders(id: number, params: any): Observable<any> {
    const endpoint = `/api/orders/${id}`;
    return this.api.get<Ordini[]>(endpoint);
  }

  cancelOrder(id: number): Observable<any>  {
    const endpoint = `/api/orders/${id}`;
    return this.api.get<Ordini[]>(endpoint);
  }
}
