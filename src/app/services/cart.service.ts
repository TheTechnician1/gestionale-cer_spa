import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Cart } from '../models';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly apiUrl = environment.apiBaseUrl;
  private readonly emptyCart: Cart = { id: 0, userId: 0, totalItems: 0, totalAmount: 0, items: [] };
  private readonly cartSubject = new BehaviorSubject<Cart>(this.emptyCart);
  readonly cart$ = this.cartSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  currentCart(): Cart {
    return this.cartSubject.value;
  }

  count(): number {
    return this.currentCart().totalItems || this.currentCart().items.reduce((sum, item) => sum + item.quantita, 0);
  }

  total(): number {
    return Number(this.currentCart().totalAmount || 0);
  }

  load(userId: number): Observable<Cart> {
    return this.http.get<Cart>(`${this.apiUrl}/api/users/${userId}/cart`).pipe(tap((cart) => this.setCart(cart)));
  }

  add(userId: number, productId: number, quantita = 1): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/api/users/${userId}/cart/items`, { productId, quantita }).pipe(tap((cart) => this.setCart(cart)));
  }

  update(userId: number, cartItemId: number, quantita: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/api/users/${userId}/cart/items/${cartItemId}`, { quantita }).pipe(tap((cart) => this.setCart(cart)));
  }

  remove(userId: number, cartItemId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/api/users/${userId}/cart/items/${cartItemId}`).pipe(tap((cart) => this.setCart(cart)));
  }

  clearLocal(): void {
    this.cartSubject.next(this.emptyCart);
  }

  private setCart(cart: Cart): void {
    this.cartSubject.next({
      ...cart,
      totalAmount: Number(cart.totalAmount || 0),
      totalItems: Number(cart.totalItems || 0),
      items: (cart.items || []).map((item) => ({
        ...item,
        prezzoUnitario: Number(item.prezzoUnitario),
        quantita: Number(item.quantita),
        totaleRiga: Number(item.totaleRiga)
      }))
    });
  }
}
