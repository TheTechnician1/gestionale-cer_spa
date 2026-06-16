import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, Observable, switchMap, tap } from 'rxjs';
import { Cart, CartItem } from '../interfaces/cart.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private api: ApiService) {}
  private cartSubject = new BehaviorSubject<void>(undefined);
  cartRefresh$ = this.cartSubject.asObservable();
  private guestCartKey = 'guest_cart';

  notifyCartChange() {
    this.cartSubject.next();
  }

  saveGuestCart(items: CartItem[]): void {
    localStorage.setItem(this.guestCartKey, JSON.stringify(items));
  }

  getGuestCart(): CartItem[] {
    const raw = localStorage.getItem(this.guestCartKey);
    return raw ? JSON.parse(raw) : [];
  }

  clearGuestCart(): void {
    localStorage.removeItem(this.guestCartKey);
  }

  mergeGuestCartIntoUser(userId: number): void {
    const guestItems = this.getGuestCart();

    if (!guestItems || guestItems.length === 0) return;
    guestItems.forEach(item => {
      this.addItem(userId, {
        productId: item.productId,
        quantity: item.quantita
      }).subscribe();
    });
    this.clearGuestCart();
    this.notifyCartChange();
  }

  clearCart(userId: number): Observable<void> {
    return this.getCart(userId).pipe(
      switchMap(cart => {
        const items = cart.items ?? [];

        return items.length
          ? forkJoin(
              items.map(i => this.remove(userId, i.id!))
            )
          : [];
      }),
      map(() => void 0)
    );
  }

  getCart(userId: number): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart`;
    return this.api.get<Cart>(endpoint);
  }

  addItem(userId: number, payload: any): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart/items`;
    return this.api.post<Cart>(endpoint, payload).pipe(
      tap(() => this.notifyCartChange()));
  }

  updateItem(userId: number, cartItemId: number, payload: any): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart/items/${cartItemId}`;
    return this.api.put<Cart>(endpoint, payload).pipe(
      tap(() => this.notifyCartChange()));
  }

  remove(userId: number, cartItemId: number): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart/items/${cartItemId}`;
    return this.api.delete<Cart>(endpoint).pipe(
      tap(() => this.notifyCartChange()));
  }
}
