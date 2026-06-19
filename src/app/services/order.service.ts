import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Order, ReceiptEmailResponse } from '../models';

@Injectable({ providedIn: 'root' })
export class OrderService {
  private readonly apiUrl = `${environment.apiBaseUrl}/api`;

  constructor(private readonly http: HttpClient) {}

  checkout(userId: number): Observable<Order> {
    return this.http.post<Order>(`${this.apiUrl}/users/${userId}/orders/checkout`, {});
  }

  getOrder(orderId: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/orders/${orderId}`);
  }

  sendReceiptEmail(orderId: number): Observable<ReceiptEmailResponse> {
    return this.http.post<ReceiptEmailResponse>(`${this.apiUrl}/orders/${orderId}/receipt/email`, {});
  }

  downloadReceiptPdf(orderId: number): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/orders/${orderId}/receipt/pdf`, { responseType: 'blob' });
  }
}
