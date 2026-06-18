import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, forkJoin, from, map, Observable, of, switchMap, tap, toArray } from 'rxjs';
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
  private guestCartSubject = new BehaviorSubject<CartItem[]>(this.getGuestCart());
  guestCart$ = this.guestCartSubject.asObservable();
  private cartState = new Map<number, number>();

  getCartState(productId: number): number {
    return this.cartState.get(productId) ?? 0;
  }

  hydrateFromCart(cart: Cart) {
    this.cartState.clear();
    cart.items?.forEach(i => { this.cartState.set(i.productId!, i.quantita!); });
  }

  refreshCartState(userId: number): Observable<Cart> {
    return this.getCart(userId).pipe(
      tap(cart => this.hydrateFromCart(cart))
    );
  }

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

  addGuestItem(item: CartItem): void {
    const cart = this.getGuestCart();
    const existing = cart.find(p => p.productId === item.productId);

    if(existing) {
      existing.quantita = (existing.quantita ?? 0) + (item.quantita ?? 0);
    } else {
      cart.push(item);
    }

    localStorage.setItem(this.guestCartKey, JSON.stringify(cart));
    this.guestCartSubject.next([...cart]);
    this.notifyCartChange();
  }

  mergeGuestCartIntoUser(userId: number): Observable<any> {
    const guestItems = this.getGuestCart();
    if(!guestItems.length) return of(null);
    return from(guestItems).pipe(
      concatMap(item => this.addItem(userId, { productId: item.productId, quantity: item.quantita })),
      toArray(),
      switchMap(() => {
        this.clearGuestCart();
        this.notifyCartChange();
        return of(null);
      })
    );
  }

  clearCart(userId: number): Observable<void> {
    return this.getCart(userId).pipe(
      switchMap(cart => {
        const items = cart.items ?? [];
        return items.length ? forkJoin(items.map(i => this.updateItem(userId, i.id!, {
          productId: i.productId,
          quantity: 0
        }))) : [];
      }),
      map(() => void 0)
    );
  }

  getCart(userId: number): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart`;
    return this.api.get<Cart>(endpoint);
  }

  addItem(userId: number, payload: any): Observable<Cart> {
    const current = this.cartState.get(payload.productId) ?? 0;
    this.cartState.set(payload.productId, current + payload.quantity);
    const endpoint = `/api/users/${userId}/cart/items`;
    return this.api.post<Cart>(endpoint, payload).pipe(
      tap(() => this.notifyCartChange()));
  }

  updateItem(userId: number, cartItemId: number, payload: any): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart/items/${cartItemId}`;
    return this.api.put<Cart>(endpoint, payload).pipe(
      tap(cart => {
        this.hydrateFromCart(cart);
        this.notifyCartChange();
      })
    );
  }

  remove(userId: number, cartItemId: number): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart/items/${cartItemId}`;
    return this.api.delete<Cart>(endpoint).pipe(
      tap(cart => {
        this.hydrateFromCart(cart)
        this.notifyCartChange()
      })
    );
  }
}
