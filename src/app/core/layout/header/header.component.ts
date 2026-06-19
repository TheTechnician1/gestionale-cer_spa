import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/components/services/cart.service';
import { CartItem } from 'src/app/core/interfaces/cartItem.interface';
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  cartItems: CartItem[] = [];
  nomeUtente: string = '';
  cognomeUtente: string = '';
  emailUtente: string = '';
  private cartMenuTimeout: any;
  private profiloMenuTimeout: any;

  @ViewChild('cartMenuTrigger') cartMenuTrigger!: MatMenuTrigger;
  @ViewChild('profiloMenuTrigger') profiloMenuTrigger!: MatMenuTrigger;

  constructor(
    private router: Router,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    if (this.isLoggedIn) {
      const utente = JSON.parse(
        localStorage.getItem('utente') ||
          sessionStorage.getItem('utente') ||
          '{}',
      );
      this.nomeUtente = utente.nome ?? '';
      this.cognomeUtente = utente.cognome ?? '';
      this.emailUtente = utente.email ?? '';
      this.caricaCarrello(utente.id);
      this.cartService.cartAggiornato$.subscribe(() => {
        this.caricaCarrello(utente.id);
      });
    }
  }

  caricaCarrello(userId: number): void {
    this.cartService.visualizzaCarrello(userId).subscribe({
      next: (items) => (this.cartItems = items),
      error: () => {},
    });
  }

  get isLoggedIn(): boolean {
    return (
      !!localStorage.getItem('utente') || !!sessionStorage.getItem('utente')
    );
  }

  logout(): void {
    localStorage.removeItem('utente');
    sessionStorage.removeItem('utente');
    this.router.navigate(['/login']);
  }

  onCartEnter(): void {
    clearTimeout(this.cartMenuTimeout);
    this.cartMenuTrigger.openMenu();
  }

  onCartLeave(): void {
    this.cartMenuTimeout = setTimeout(
      () => this.cartMenuTrigger.closeMenu(),
      200,
    );
  }

  onCartMenuEnter(): void {
    clearTimeout(this.cartMenuTimeout);
  }

  onCartMenuLeave(): void {
    this.cartMenuTimeout = setTimeout(
      () => this.cartMenuTrigger.closeMenu(),
      200,
    );
  }

  onProfiloEnter(): void {
    clearTimeout(this.profiloMenuTimeout);
    this.profiloMenuTrigger.openMenu();
  }

  onProfiloLeave(): void {
    this.profiloMenuTimeout = setTimeout(
      () => this.profiloMenuTrigger.closeMenu(),
      200,
    );
  }

  onProfiloMenuEnter(): void {
    clearTimeout(this.profiloMenuTimeout);
  }

  onProfiloMenuLeave(): void {
    this.profiloMenuTimeout = setTimeout(
      () => this.profiloMenuTrigger.closeMenu(),
      200,
    );
  }

  vaiAlCarrello(): void {
    this.cartMenuTrigger.closeMenu();
    this.router.navigate(['/carrello']);
  }

rimuoviDalCarrello(cartItemId: number): void {
  const utente = JSON.parse(
    localStorage.getItem('utente') || sessionStorage.getItem('utente') || '{}'
  );
  this.cartService.rimuoviProdotto(utente.id, cartItemId).subscribe({
    next: () => {
      this.cartItems = this.cartItems.filter(i => i.id !== cartItemId);
    },
    error: () => {}
  });
}
}
