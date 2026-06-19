import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { ToastService } from 'src/app/core/services/toast.service';
import { Product } from 'src/app/core/interfaces/product.interface';
import { CartService } from '../services/cart.service';
import { CartItem } from 'src/app/core/interfaces/cartItem.interface';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.scss'],
})
export class ProdottiComponent implements OnInit {
  prodotti: Product[] = [];
  prodottiPaginati: Product[] = [];
  categorie: string[] = [];
  cartItems: CartItem[] = [];
  mostraRicercaAvanzata = false;
  searchForm: FormGroup;
  advancedSearchForm: FormGroup;
  userId: number = 0;
  pageSize = 8;
  pageIndex = 0;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private toast: ToastService,
    private cartService: CartService,
  ) {
    this.searchForm = this.fb.group({
      nomeProdotto: [''],
    });

    this.advancedSearchForm = this.fb.group({
      categoria: [''],
      minPrezzo: [''],
      maxPrezzo: [''],
      minQuantita: [''],
    });
  }

  ngOnInit(): void {
    const utente = JSON.parse(
      localStorage.getItem('utente') ||
        sessionStorage.getItem('utente') ||
        '{}',
    );
    this.userId = utente.id;
    this.caricaProdotti();
    this.caricaCategorie();
    this.caricaCarrello();
  }

  caricaProdotti(): void {
    this.productService.listaProdotti().subscribe({
      next: (prodotti) => {
        this.prodotti = prodotti;
        this.pageIndex = 0;
        this.aggiornaPaginazione();
      },
      error: () => this.toast.error('Errore nel caricamento dei prodotti'),
    });
  }

  caricaCategorie(): void {
    this.productService.categorie().subscribe({
      next: (categorie) => (this.categorie = categorie),
      error: () => this.toast.error('Errore nel caricamento delle categorie'),
    });
  }

  caricaCarrello(): void {
    this.cartService.visualizzaCarrello(this.userId).subscribe({
      next: (items) => (this.cartItems = items),
      error: () => {},
    });
  }

  aggiornaPaginazione(): void {
    const start = this.pageIndex * this.pageSize;
    this.prodottiPaginati = this.prodotti.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.aggiornaPaginazione();
  }

  disponibilitaEffettiva(prodotto: Product): number {
    const itemInCarrello = this.cartItems.find(
      (i) => i.idProduct === prodotto.idProdotto,
    );
    return (
      prodotto.quantitaDisponibile -
      (itemInCarrello ? itemInCarrello.quantita : 0)
    );
  }

  ricerca(): void {
    const nome = this.searchForm.get('nomeProdotto')?.value;
    if (!nome) {
      this.caricaProdotti();
      return;
    }
    this.productService.ricercaSemplice(nome).subscribe({
      next: (prodotti) => {
        this.prodotti = prodotti;
        this.pageIndex = 0;
        this.aggiornaPaginazione();
      },
      error: () => this.toast.error('Errore nella ricerca'),
    });
  }

  ricercaAvanzata(): void {
    const { categoria, minPrezzo, maxPrezzo, minQuantita } =
      this.advancedSearchForm.value;

    if (minPrezzo < 0 || maxPrezzo < 0 || minQuantita < 0) {
      this.toast.error('I valori non possono essere negativi');
      return;
    }

    this.productService
      .ricercaAvanzata(categoria, minPrezzo, maxPrezzo, minQuantita)
      .subscribe({
        next: (prodotti) => {
          this.prodotti = prodotti;
          this.pageIndex = 0;
          this.aggiornaPaginazione();
        },
        error: () => this.toast.error('Errore nella ricerca avanzata'),
      });
  }

  resetRicerca(): void {
    this.searchForm.reset();
    this.advancedSearchForm.reset();
    this.mostraRicercaAvanzata = false;
    this.caricaProdotti();
  }

  vaiADettaglio(id: number): void {
    this.router.navigate(['/prodotti', id]);
  }

  aggiungiAlCarrello(productId: number): void {
    this.cartService.aggiungiProdotto(this.userId, productId, 1).subscribe({
      next: () => {
        this.caricaCarrello();
      },
      error: () => this.toast.error('Errore nell aggiunta al carrello'),
    });
  }
}
