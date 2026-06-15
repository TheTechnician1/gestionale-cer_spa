import { Component } from '@angular/core';
import { ProdottiService } from '../../services/prodotti.service';
import { Prodotto } from '../../interfaces/prodotto.model';
import { Observable, of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.scss']
})
export class ProdottiComponent {
  prodotto$: Observable<Prodotto[]>= of([]);
  constructor(private prodottiService: ProdottiService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.prodotto$=this.prodottiService.getProdotti();
  }

}
