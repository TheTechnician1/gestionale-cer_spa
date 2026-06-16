import { Component, OnInit } from '@angular/core';
import { ProdottiService } from '../../services/prodotti.service';
import { Prodotto } from '../../interfaces/prodotto.model';
import { filter, map, Observable, of, startWith } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.scss']
})
export class ProdottiComponent implements OnInit {

  prodotto$: Observable<Prodotto[]> = of([]);
  filterForm!: FormGroup;
  ricerca: string = '';

  constructor(
    private prodottiService: ProdottiService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.initForm();
  this.route.paramMap.subscribe(params => {
    this.ricerca = params.get('ricerca') ?? '';

    if (this.ricerca) {
      this.prodotto$ = this.prodottiService.getByName(this.ricerca);
    } else {
      this.prodotto$ = this.prodottiService.getProdotti();
    }
  });
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      categoria: [null, { required: false }],
      prezzoMin: [null, { required: false }],
      prezzoMax: [null, { required: false }],
      quantitaDisponibileMin: [null, { required: false }],
      quantitaDisponibileMax: [null, { required: false }]
    });
  }


  search(): void {
    const filters = this.filterForm.value;

    this.prodotto$ = this.prodottiService.getWithFilters(
      filters.categoria,
      filters.prezzoMin,
      filters.prezzoMax,
      filters.quantitaDisponibileMin,
      filters.quantitaDisponibileMax
    );
  }

  reset(): void {
    this.filterForm.reset();
    this.prodotto$ = this.prodottiService.getProdotti();
  }
}