import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../interfaces/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor() { }

  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);

  cartItems$ = this.cartItemsSubject.asObservable();

  cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((tot, item) => tot + item.quantity, 0))
  );
}
