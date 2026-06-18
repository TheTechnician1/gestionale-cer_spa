import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Cart, CartItem } from '../../interfaces/cart.model';
import { UtenteService } from '../../services/utente.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { UtenteModel } from '../../interfaces/utente.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent {
  constructor(
    private fb: FormBuilder,
    private authService: UtenteService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}
  user: UtenteModel | null = null;
  cart$!: Observable<Cart>;
  total$!: Observable<number>;
  checkoutForm!: FormGroup;

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
    this.checkoutForm = this.fb.group({
      nome: [this.user.name ?? '', Validators.required],
      cognome: [this.user.surname ?? '', Validators.required],
      indirizzo: ['', Validators.required],
      cap: ['', [Validators.required, Validators.pattern("^[0-9]{5}$")]],
      citta: ['', Validators.required],
      provincia: ['', [Validators.required, Validators.pattern("^[A-Z]{2}$")]]
    });

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

  isShippingValid(): boolean {
    return this.checkoutForm.valid;
  }

  onCapInput(): void {
    this.shipping.cap = (this.shipping.cap || '').replace(/\D/g, '').slice(0, 5);
  }

  onProvinciaInput(): void {
    const control = this.checkoutForm.get('provincia');
    if (!control) return;
    const value = (control.value || '').toUpperCase().replace(/[^A-Z]/g, '').slice(0, 2);
    control.setValue(value, { emitEvent: false });
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
    if (!this.checkoutForm.valid) return;

    const shipping = this.checkoutForm.value;
    const items = cart.items ?? [];
    const totaleProdotti = this.getTotal(items);
    const costoSpedizione = this.order.shippingCost;
    const totaleOrdine = totaleProdotti + costoSpedizione;

    const payload = {
      shipping: {
        nome: shipping.nome,
        cognome: shipping.cognome,
        indirizzo: shipping.indirizzo,
        cap: shipping.cap,
        citta: shipping.citta,
        provincia: shipping.provincia
      },

      payment: {
        metodoPagamento: "saldo"
      },

      prodotti: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        sellerName: item.sellerName ?? null,
        quantity: item.quantita,
        prezzoUnitario: item.prezzoUnitario,
        sconto: item.sconto ?? 0,
        totaleRiga: item.totaleRiga
      })),

      totaleProdotti: totaleProdotti,
      costoSpedizione: this.order.shippingCost,
      totaleOrdine: totaleOrdine
    };

    console.log("PAYLOAD CHECKOUT:", payload);

    this.orderService.checkout(this.user!.id!, payload).subscribe({
      next: (res) => {
        console.log("ORDER CREATED:", res);

        this.router.navigate(['/payment'], {
          state: {
            orderId: res.orderId,
            total: totaleOrdine
          }
        });
      },
      error: (err) => {
        console.error("CHECKOUT ERROR:", err);
        alert("Errore durante il checkout");
      }
    });
  }
}
