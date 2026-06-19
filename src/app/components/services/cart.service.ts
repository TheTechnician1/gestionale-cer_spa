import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, tap } from 'rxjs';
import { CartItem } from 'src/app/core/interfaces/cartItem.interface';
import { APP_SETTINGS } from 'src/app/core/config/app-settings';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private baseUrl = APP_SETTINGS.apiBaseUrl;
  cartAggiornato$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  visualizzaCarrello(userId: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(
      `${this.baseUrl}/api/users/${userId}/cart`,
    );
  }

  aggiungiProdotto(
    userId: number,
    productId: number,
    quantita: number,
  ): Observable<CartItem[]> {
    return this.http
      .post<CartItem[]>(
        `${this.baseUrl}/api/users/${userId}/cart/items`,
        null,
        {
          params: new HttpParams()
            .set('productId', productId)
            .set('quantita', quantita),
        },
      )
      .pipe(tap(() => this.cartAggiornato$.next()));
  }

  modificaQuantita(
    userId: number,
    cartItemId: number,
    quantita: number,
  ): Observable<CartItem> {
    return this.http
      .put<CartItem>(
        `${this.baseUrl}/api/users/${userId}/cart/items/${cartItemId}`,
        null,
        {
          params: new HttpParams().set('quantita', quantita),
        },
      )
      .pipe(tap(() => this.cartAggiornato$.next()));
  }

  rimuoviProdotto(userId: number, cartItemId: number): Observable<CartItem[]> {
    return this.http
      .delete<
        CartItem[]
      >(`${this.baseUrl}/api/users/${userId}/cart/items/${cartItemId}`)
      .pipe(tap(() => this.cartAggiornato$.next()));
  }

  svuotaCarrello(): void {
    this.cartAggiornato$.next();
  }
}
