import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { OrderDTO, Ordini } from '../interfaces/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private api: ApiService) {}

  getAllOrders(id: number): Observable<any> {
    const endpoint = `/api/users/${id}/orders`;
    return this.api.get<Ordini[]>(endpoint);
  }

  getOrderById(orderId: number): Observable<any> {
    const endpoint = `api/orders/${orderId}`;
    return this.api.get<Ordini[]>(endpoint);
  }

  checkout(userId: number, payload: any) {
    const endpoint = `/api/users/${userId}/orders/checkout`;
    return this.api.post<OrderDTO>(endpoint, payload);
  }

  pay(userId: number, orderId: number) {
    const endpoint = `/api/users/${userId}/orders/payment/${orderId}`;
    return this.api.post<OrderDTO>(endpoint, {});
  }

  completeOrder(userId: number, orderId: number) {
    const endpoint = `/api/users/${userId}/orders/completed/${orderId}`;
    return this.api.post<OrderDTO>(endpoint, {});
  }

  downloadPDF(orderId: number) {
    const endpoint = `/api/orders/${orderId}/receipt/email`;
    return this.api.post<string>(endpoint, {}, { responseType: 'text' });
  }

  showOrderPDF(orderId: number) {
    const endpoint = `/api/orders/${orderId}/receipt/pdf`;
    return this.api.get<Blob>(endpoint, undefined, { responseType: 'blob' });
  }
}
