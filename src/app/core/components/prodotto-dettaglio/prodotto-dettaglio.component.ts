import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProdottiService } from '../../services/prodotti.service';
import { CarrelloService } from '../../services/carrello.service';
import { map, Observable, of } from 'rxjs';
import { ArticoloCarrelloDTOModel, Carrello } from '../../interfaces/carrello';
import { Utente } from '../../interfaces/utente.model';


@Component({
  selector: 'app-prodotto-dettaglio',
  templateUrl: './prodotto-dettaglio.component.html'
})
export class ProdottoDettaglioComponent implements OnInit {

  prodotto: any;
  quantita: number = 1;
  carrello: Carrello | null = null;
  utente: Utente | null = null;
  constructor(
    private route: ActivatedRoute,
    private prodottiService: ProdottiService,
    private carrelloService: CarrelloService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.utente = localStorage.getItem('utente') ? JSON.parse(localStorage.getItem('utente')!) : null;
    this.prodottiService.getById(id).subscribe(res => {
      this.prodotto = res;
    });

    this.carrelloService.getCarrello(this.utente ? this.utente.id : null).subscribe({
      next: (carrello) => {
        this.carrello = carrello;
      },
      error: (err) => {
        console.error('Errore caricamento carrello', err);
      }
    });
  }

  aggiungiAlCarrello(): void {
    this.carrelloService.aggiuntaArticoloCarrello(this.utente ? this.utente.id : null, new ArticoloCarrelloDTOModel({
      quantita: this.quantita,
      prezzoUnitario: this.prodotto.prezzo,
      idCarrello: this.carrello?.id,
      idProdotto: this.prodotto.idProdotto
    })).subscribe({
      next: () => {
        this.router.navigate(['/prodotti']);
      },
      error: (err) => {
        console.error('Errore inserimento carrello', err);
      }
    });
  }
}