import { Injectable } from '@angular/core';
import { BehaviorSubject, concatMap, forkJoin, from, map, Observable, of, switchMap, tap, toArray } from 'rxjs';
import { Cart, CartItem } from '../interfaces/cart.model';
import { ApiService } from './api.service';
import { Prodotto } from '../interfaces/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor(private api: ApiService) {
    this.loadGuestCart();
  }
  private guestCartKey = 'guest_cart';
  private cartSubject = new BehaviorSubject<Cart>({
    id: null,
    totale: 0,
    items: []
  });
  cart$ = this.cartSubject.asObservable();
  private refreshSubject = new BehaviorSubject<void>(undefined);
  refresh$ = this.refreshSubject.asObservable();
  private cartState = new Map<number, number>();

  private roundMoney(value: number | null | undefined): number {
    return Number((value ?? 0).toFixed(2));
  }

  private offerMetaKey(userId: number): string {
    return `cart_offer_meta_${userId}`;
  }

  private getOfferMeta(userId: number): Record<number, Partial<CartItem>> {
    const raw = localStorage.getItem(this.offerMetaKey(userId));
    return raw ? JSON.parse(raw) : {};
  }

  private saveOfferMeta(userId: number, meta: Record<number, Partial<CartItem>>): void {
    localStorage.setItem(this.offerMetaKey(userId), JSON.stringify(meta));
  }

  private rememberOfferMeta(userId: number, payload: any): void {
    if (!payload?.productId || !payload?.sconto) return;

    const meta = this.getOfferMeta(userId);
    meta[payload.productId] = {
      prezzoUnitario: payload.prezzoUnitario ?? payload.prezzoScontato,
      prezzoOriginale: payload.prezzoOriginale,
      prezzoScontato: payload.prezzoScontato ?? payload.prezzoUnitario,
      sconto: payload.sconto
    };

    this.saveOfferMeta(userId, meta);
  }

  private forgetOfferMeta(userId: number, productId: number | null | undefined): void {
    if (!productId) return;

    const meta = this.getOfferMeta(userId);
    delete meta[productId];
    this.saveOfferMeta(userId, meta);
  }

  private applyOfferMeta(userId: number, cart: Cart): Cart {
    const meta = this.getOfferMeta(userId);
    const items = (cart.items ?? []).map(item => {
      const offer = item.productId ? meta[item.productId] : null;
      if (!offer) return item;

      const prezzoUnitario = offer.prezzoUnitario ?? item.prezzoUnitario;
      return {
        ...item,
        prezzoUnitario,
        prezzoOriginale: offer.prezzoOriginale ?? item.prezzoOriginale,
        prezzoScontato: offer.prezzoScontato ?? prezzoUnitario,
        sconto: offer.sconto ?? item.sconto,
        totaleRiga: this.roundMoney((prezzoUnitario ?? 0) * (item.quantita ?? 0))
      };
    });

    return this.createCart(items, cart.id, this.roundMoney(items.reduce((sum, item) => sum + (item.totaleRiga ?? 0), 0)));
  }

  private createCart(items: CartItem[] = [], id: number | null = null, totale: number | null = null): Cart {
    return {
      id,
      totale: totale ?? this.roundMoney(items.reduce((sum, item) => sum + (item.totaleRiga ?? 0), 0)),
      items
    };
  }

  getCartState(productId: number): number {
    return this.cartState.get(productId) ?? 0;
  }

  getGuestItems(): CartItem[] {
    return [...(this.cartSubject.value.items ?? [])];
  }

  private updateCart(cart: Cart) {
    this.cartState.clear();

    (cart.items ?? []).forEach(i => {
      this.cartState.set(i.productId!, i.quantita!);
    });

    this.cartSubject.next({
      id: cart.id,
      totale: cart.totale,
      items: [...(cart.items ?? [])]
    });
  }

  private emit(cart: Cart) {
    this.updateCart(cart);
  }

  private loadGuestCart(): void {
    const raw = localStorage.getItem(this.guestCartKey);
    const items: CartItem[] = raw ? JSON.parse(raw) : [];
    this.emit(this.createCart(items));
  }

  private saveGuestCart(items: CartItem[]): void {
    localStorage.setItem(this.guestCartKey, JSON.stringify(items));
  }

  clearGuestCart(): void {
    localStorage.removeItem(this.guestCartKey);
    this.emit(this.createCart());
  }

  clearLocalCart(): void {
    this.emit(this.createCart());
  }

  addGuestProduct(
    product: Prodotto,
    quantity = 1,
    price = product.prezzo,
    discount: number | null = null,
    originalPrice = product.prezzo
  ): void {
    this.addGuestItem({
      id: product.id,
      productId: product.id,
      productName: product.nomeProdotto,
      quantita: quantity,
      prezzoUnitario: price,
      immagine: product.immagine,
      totaleRiga: this.roundMoney((price ?? 0) * quantity),
      sellerName: null,
      sconto: discount,
      prezzoOriginale: originalPrice,
      prezzoScontato: price
    });
  }

  addGuestItem(item: CartItem): void {
    const items = [...(this.cartSubject.value.items ?? [])];
    const existing = items.find(p => p.productId === item.productId);

    if (existing) {
      existing.quantita = (existing.quantita ?? 0) + (item.quantita ?? 1);
      existing.productName = existing.productName ?? item.productName;
      existing.prezzoUnitario = item.sconto ? item.prezzoUnitario : existing.prezzoUnitario ?? item.prezzoUnitario;
      existing.prezzoOriginale = item.sconto ? item.prezzoOriginale : existing.prezzoOriginale ?? item.prezzoOriginale;
      existing.prezzoScontato = item.sconto ? item.prezzoScontato : existing.prezzoScontato ?? item.prezzoScontato;
      existing.immagine = existing.immagine ?? item.immagine;
      existing.sellerName = existing.sellerName ?? item.sellerName;
      existing.sconto = item.sconto ?? existing.sconto;
      existing.totaleRiga = this.roundMoney((existing.prezzoUnitario ?? 0) * (existing.quantita ?? 0));
    } else {
      items.push({
        ...item,
        id: item.id ?? item.productId,
        totaleRiga: item.totaleRiga ?? this.roundMoney((item.prezzoUnitario ?? 0) * (item.quantita ?? 0))
      });
    }

    this.saveGuestCart(items);
    this.emit(this.createCart(items));
  }

  updateGuestItem(productId: number, quantity: number): void {
    const items = (this.cartSubject.value.items ?? [])
      .map(item => item.productId === productId
        ? {
            ...item,
            quantita: quantity,
            totaleRiga: this.roundMoney((item.prezzoUnitario ?? 0) * quantity)
          }
        : item
      )
      .filter(item => (item.quantita ?? 0) > 0);

    this.saveGuestCart(items);
    this.emit(this.createCart(items));
  }

  removeGuestItem(productId: number): void {
    const items = (this.cartSubject.value.items ?? [])
      .filter(item => item.productId !== productId);

    this.saveGuestCart(items);
    this.emit(this.createCart(items));
  }

  getCart(userId: number): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart`;
    return this.api.get<Cart>(endpoint).pipe(
      map(cart => this.applyOfferMeta(userId, cart))
    );
  }

  refreshCartState(userId: number): Observable<Cart> {
    return this.getCart(userId).pipe(
      tap(cart => this.updateCart(cart))
    );
  }

  hydrateFromCart(cart: Cart) {
    this.updateCart(cart);
  }

  addItem(userId: number, payload: any): Observable<Cart> {
    const current = this.cartState.get(payload.productId) ?? 0;
    this.cartState.set(payload.productId, current + payload.quantity);
    this.rememberOfferMeta(userId, payload);
    const endpoint = `/api/users/${userId}/cart/items`;
    return this.api.post<Cart>(endpoint, payload).pipe(
      map(cart => this.applyOfferMeta(userId, cart)),
      tap(cart => this.updateCart(cart))
    );
  }

  updateItem(userId: number, cartItemId: number, payload: any): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart/items/${cartItemId}`;
    if ((payload.quantity ?? 0) <= 0) {
      this.forgetOfferMeta(userId, payload.productId);
    }

    return this.api.put<Cart>(endpoint, payload).pipe(
      map(cart => this.applyOfferMeta(userId, cart)),
      tap(cart => this.updateCart(cart))
    );
  }

  remove(userId: number, cartItemId: number): Observable<Cart> {
    const endpoint = `/api/users/${userId}/cart/items/${cartItemId}`;
    const productId = this.cartSubject.value.items?.find(item => item.id === cartItemId)?.productId;
    this.forgetOfferMeta(userId, productId);

    return this.api.delete<Cart>(endpoint).pipe(
      map(cart => this.applyOfferMeta(userId, cart)),
      tap(cart => this.updateCart(cart))
    );
  }

  clearCart(userId: number): Observable<void> {
    return this.getCart(userId).pipe(
      switchMap(cart => {
        const items = cart.items ?? [];

        if (!items.length) return of(void 0);

        return forkJoin(
          items.map(i =>
            this.updateItem(userId, i.id!, {
              productId: i.productId,
              quantity: 0
            })
          )
        ).pipe(
          tap(() => this.clearLocalCart()),
          map(() => void 0)
        );
      })
    );
  }

  mergeGuestCartIntoUser(userId: number): Observable<any> {
    const guestItems = this.getGuestItems();

    if (!guestItems.length) return of(null);

    return from(guestItems).pipe(
      concatMap(item =>
        this.addItem(userId, {
          productId: item.productId,
          quantity: item.quantita
        })
      ),
      toArray(),
      switchMap(() => {
        this.clearGuestCart();
        return of(null);
      })
    );
  }

  notifyCartChange() {
    this.refreshSubject.next();
  }
}
