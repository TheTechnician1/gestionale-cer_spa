import { Component, OnInit } from '@angular/core';
import { ProdottiService } from '../../services/prodotti.service';
import { Prodotto } from '../../interfaces/prodotto.model';
import { Observable, of } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-prodotti',
  templateUrl: './prodotti.component.html',
  styleUrls: ['./prodotti.component.scss']
})
export class ProdottiComponent implements OnInit {

  prodotto$: Observable<Prodotto[]> = of([]);
  filterForm!: FormGroup;

  constructor(
    private prodottiService: ProdottiService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadAll();
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

  loadAll(): void {
    this.prodotto$ = this.prodottiService.getProdotti();
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
    this.loadAll();
  }
}