import { Injectable } from '@angular/core';
import { BehaviorSubject, map } from 'rxjs';
import { CartItem } from '../interfaces/cart.model';
import { Prodotto } from '../interfaces/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  constructor() {}
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  cartCount$ = this.cartItems$.pipe(
    map(items => items.reduce((tot, item) => tot + item.quantita!, 0))
  );

  add(product: Prodotto, quantita: number = 1) {
    const items = this.cartItemsSubject.value;
    const existingItem = items.find(i => i.productId === product.id);

    if(existingItem) {
      existingItem.quantita! += quantita;
    } else {
      items.push({
        id: null,
        productId: product.id!,
        nome: product.nomeProdotto!,
        prezzo: product.prezzo!,
        quantita: quantita,
        immagine: product.immagine!
      })
    }
    this.cartItemsSubject.next([...items]);
  }

  increase(productId: number) {
    const items = this.cartItemsSubject.value;
    const item = items.find(i => i.productId === productId);

    if (item) {
      item.quantita!++;
      this.cartItemsSubject.next([...items]);
    }
  }

  decrease(productId: number) {
    const items = this.cartItemsSubject.value;
    const item = items.find(i => i.productId === productId);

    if (item) {
      if (item.quantita! > 1) {
        item.quantita!--;
      } else {
        // se arriva a 0 lo rimuoviamo
        this.remove(productId);
        return;
      }
      this.cartItemsSubject.next([...items]);
    }
  }

  remove(productId: number) {
    const items = this.cartItemsSubject.value.filter(i => i.productId !== productId);
    this.cartItemsSubject.next(items);
  }

  clear() {
    this.cartItemsSubject.next([]);
  }
}
