import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cart, CartItem } from '../../interfaces/cart.model';
import { UtenteService } from '../../services/utente.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { UtenteModel } from '../../interfaces/utente.model';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  constructor(private authService: UtenteService, private cartService: CartService, private router: Router) {}
  user: UtenteModel | null = null;
  cart$!: Observable<Cart>;
  total$!: Observable<number>;

  shipping = {
    nome: '',
    cognome: '',
    indirizzo: '',
    cap: '',
    citta: '',
    provincia: ''
  };

  payment = {
    metodo: 'Saldo disponibile (Finto pagamento)',
    saldo: 0
  };

  order = {
    shippingCost: 10.00
  };

  ngOnInit(): void {
    this.user = this.authService.currentUser!;

    if(!this.user?.id) return;

    this.shipping.nome = this.user.name ?? '';
    this.shipping.cognome = this.user.surname ?? '';
    this.payment.saldo = this.user.balance ?? 0;

    this.cart$ = this.cartService.getCart(this.user.id!);

    this.total$ = this.cart$.pipe(
      map(cart =>
        (cart.items ?? []).reduce(
          (sum, item) => sum + (item.totaleRiga ?? 0),
          0
        )
      )
    );
  }

  hasEnoughBalance(total: number): boolean {
    return (this.user?.balance ?? 0) >= total;
  }

  getTotal(items: CartItem[] | null): number {
    return (items ?? []).reduce(
      (sum, item) => sum + (item.totaleRiga ?? 0),
      0
    );
  }

  getFinalTotal(items: CartItem[] | null): number {
    const subtotal = this.getTotal(items);
    return subtotal + this.order.shippingCost;
  }

  payNow(cart: Cart): void {
    const total = this.getFinalTotal(cart.items);

    if (!this.hasEnoughBalance(total)) {
      alert('Saldo insufficiente');
      return;
    }

    if (!this.user?.id) return;
    console.log('ORDER:', cart);

    this.router.navigate(['/ordine-confermato'], {
      state: { cart }
    });
  }
}
