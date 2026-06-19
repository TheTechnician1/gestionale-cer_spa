import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from 'src/app/core/interfaces/order.interface';
import { APP_SETTINGS } from 'src/app/core/config/app-settings';

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    private baseUrl = APP_SETTINGS.apiBaseUrl;

    constructor(private http: HttpClient) {}

    checkout(userId: number): Observable<Order> {
        return this.http.post<Order>(`${this.baseUrl}/api/users/${userId}/orders/checkout`, null);
    }

    dettaglioOrdine(orderId: number): Observable<Order> {
        return this.http.get<Order>(`${this.baseUrl}/api/orders/${orderId}`);
    }

    downloadPdf(orderId: number): Observable<Blob> {
        return this.http.get(`${this.baseUrl}/api/orders/${orderId}/receipt/pdf`, { responseType: 'blob' });
    }

    inviaEmail(orderId: number): Observable<string> {
        return this.http.post(`${this.baseUrl}/api/orders/${orderId}/receipt/email`, null, { responseType: 'text' });
    }

    listaOrdini(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}/api/users/${userId}/orders`);
}
}