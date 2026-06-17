import { Component, OnInit } from '@angular/core';
import { ProdottiService } from '../../services/prodotti.service';
import { Prodotto } from '../../interfaces/prodotto.model';
import { filter, map, Observable, of, startWith } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

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
    private route: ActivatedRoute,
    private toast: ToastService
  ) {
  }

  ngOnInit(): void {
    this.initForm();
    this.route.paramMap.subscribe(params => {
      this.ricerca = params.get('ricerca') ?? '';
      this.search();
      this.filterForm.reset();
    });
    
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      categoria: [null],
      prezzoMin: [null, Validators.min(0)],
      prezzoMax: [null, Validators.min(0)],
      quantitaDisponibileMin: [null, Validators.min(1)],
      quantitaDisponibileMax: [null, Validators.min(1)]
    });
  }


  search(): void {
    if(this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }
    const filters = this.filterForm.value;

    this.prodotto$ = this.prodottiService.getWithFilters(
      filters.categoria,
      filters.prezzoMin,
      filters.prezzoMax,
      filters.quantitaDisponibileMin,
      filters.quantitaDisponibileMax,
      this.ricerca
    );
  }

  reset(): void {
    this.filterForm.reset();
    this.prodotto$ = this.prodottiService.getByName(this.ricerca);
  }

  copyEmail(email: string): void {
    navigator.clipboard.writeText(email).then(() => {
      this.toast.info('Email copiata negli appunti');
    }).catch(err => {
      this.toast.error('Errore durante la copia dell\'email');
      console.error('Errore durante la copia dell\'email', err);
    });
  }
}