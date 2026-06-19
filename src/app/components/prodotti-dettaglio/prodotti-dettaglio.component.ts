import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { ToastService } from 'src/app/core/services/toast.service';
import { Product } from 'src/app/core/interfaces/product.interface';
import { CartService } from '../services/cart.service';
import { CartItem } from 'src/app/core/interfaces/cartItem.interface';

@Component({
  selector: 'app-prodotti-dettaglio',
  templateUrl: './prodotti-dettaglio.component.html',
  styleUrls: ['./prodotti-dettaglio.component.scss'],
})
export class ProdottiDettaglioComponent implements OnInit {
  prodotto: Product | null = null;
  prodottiSimili: Product[] = [];
  cartItems: CartItem[] = [];
  userId: number = 0;
  quantita: number = 1;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private toast: ToastService,
  ) {}

  ngOnInit(): void {
    const utente = JSON.parse(
      localStorage.getItem('utente') ||
        sessionStorage.getItem('utente') ||
        '{}',
    );
    this.userId = utente.id;
    this.caricaCarrello();

    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      this.quantita = 1;
      this.prodotto = null;
      this.prodottiSimili = [];
      this.productService.dettaglioProdotto(id).subscribe({
        next: (prodotto) => {
          this.prodotto = prodotto;
          this.caricaProdottiSimili(prodotto.categoria);
        },
        error: () => {
          this.toast.error('Errore nel caricamento del prodotto');
        },
      });
    });
  }

  caricaCarrello(): void {
    this.cartService.visualizzaCarrello(this.userId).subscribe({
      next: (items) => (this.cartItems = items),
      error: () => {},
    });
  }

  disponibilitaEffettiva(): number {
    if (!this.prodotto) return 0;
    const itemInCarrello = this.cartItems.find(
      (i) => i.idProduct === this.prodotto!.idProdotto,
    );
    return this.prodotto.quantitaDisponibile - (itemInCarrello ? itemInCarrello.quantita : 0);
  }

  caricaProdottiSimili(categoria: string): void {
    this.productService.ricercaAvanzata(categoria).subscribe({
      next: (prodotti) => {
        this.prodottiSimili = prodotti.filter(
          (p) => p.idProdotto !== this.prodotto?.idProdotto,
        );
      },
      error: () => {},
    });
  }

  aggiungiAlCarrello(): void {
    if (!this.prodotto) return;
    this.cartService
      .aggiungiProdotto(this.userId, this.prodotto.idProdotto, this.quantita)
      .subscribe({
        next: () => {
          this.quantita = 1;
          this.caricaCarrello();
        },
        error: () => this.toast.error('Errore nell aggiunta al carrello'),
      });
  }

  incrementa(): void {
    if (this.prodotto && this.quantita < this.disponibilitaEffettiva()) {
      this.quantita++;
    }
  }

  decrementa(): void {
    if (this.quantita > 1) {
      this.quantita--;
    }
  }

  vaiADettaglio(id: number): void {
    this.router.navigate(['/prodotti', id]);
  }

  torna(): void {
    this.router.navigate(['/prodotti']);
  }
}