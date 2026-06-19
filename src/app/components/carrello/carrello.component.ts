import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../services/cart.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { CartItem } from 'src/app/core/interfaces/cartItem.interface';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.component.html',
  styleUrls: ['./carrello.component.scss']
})
export class CarrelloComponent implements OnInit {

  items: CartItem[] = [];
  userId: number = 0;
  saldo: number = 0;

  constructor(
    private cartService: CartService,
    private router: Router,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    const utente = JSON.parse(localStorage.getItem('utente') || sessionStorage.getItem('utente') || '{}');
    this.userId = utente.id;
    this.saldo = utente.saldo ?? 0;
    this.caricaCarrello();
  }

  caricaCarrello(): void {
    this.cartService.visualizzaCarrello(this.userId).subscribe({
      next: (items) => this.items = items,
      error: () => this.toast.error('Errore nel caricamento del carrello')
    });
  }

  aggiungiQuantita(item: CartItem): void {
    this.cartService.modificaQuantita(this.userId, item.id, item.quantita + 1).subscribe({
      next: () => this.caricaCarrello(),
      error: () => this.toast.error('Errore nella modifica quantità')
    });
  }

  riduciQuantita(item: CartItem): void {
    if (item.quantita === 1) {
      this.rimuovi(item.id);
      return;
    }
    this.cartService.modificaQuantita(this.userId, item.id, item.quantita - 1).subscribe({
      next: () => this.caricaCarrello(),
      error: () => this.toast.error('Errore nella modifica quantità')
    });
  }

  rimuovi(cartItemId: number): void {
    this.cartService.rimuoviProdotto(this.userId, cartItemId).subscribe({
      next: () => this.caricaCarrello(),
      error: () => this.toast.error('Errore nella rimozione del prodotto')
    });
  }

  get totale(): number {
    return this.items.reduce((acc, item) => acc + item.prezzoUnitario * item.quantita, 0);
  }

  get numeroArticoli(): number {
    return this.items.reduce((acc, item) => acc + item.quantita, 0);
  }

  get saldoInsuffuciente(): boolean {
    return this.saldo < this.totale;
  }

  checkout(): void {
    this.router.navigate(['/checkout']);
  }
}