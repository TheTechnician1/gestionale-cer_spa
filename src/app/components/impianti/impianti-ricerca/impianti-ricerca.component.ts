import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ImpiantoService } from '../../services/impianto.service';
import {
  ImpiantoVista,
  STATI_IMPIANTO,
} from '../../../core/interfaces/impianto.model';

@Component({
  selector: 'app-impianti-ricerca',
  templateUrl: './impianti-ricerca.component.html',
  styleUrls: ['./impianti-ricerca.component.scss'],
})
export class ImpiantiRicercaComponent implements OnInit {
  impianti: ImpiantoVista[] = [];
  stati = STATI_IMPIANTO;

  form: FormGroup;
  mostraFiltri = false;
  vistaLista = false;

  colonneLista: string[] = [
    'codiceCabina',
    'tipologiaImpianto',
    'statoImpianto',
    'regione',
    'provincia',
    'comune',
    'potenzaNominaleKw',
    'presenzaAccumulo',
    'azioni',
  ];

  constructor(
    private router: Router,
    private impiantoService: ImpiantoService,
    private fb: FormBuilder,
  ) {
    this.form = this.fb.group({
      idCer: [null],
      codiceCabina: [null],
      tipologiaImpianto: [null],
      statoImpianto: [null],
      regione: [null],
      provincia: [null],
      comune: [null],
      presenzaAccumulo: [null],
      attivo: [null], // includi disattivati (ADM)
    });
  }

  ngOnInit(): void {
    this.cercaImpianti();
  }

  cercaImpianti(): void {
    this.impiantoService.ricerca(this.form.value).subscribe({
      next: (res) => (this.impianti = res ?? []),
      error: (err) => console.error('Errore caricamento impianti:', err),
    });
  }

  filtraImpianti(): void {
    this.cercaImpianti();
  }
  toggleFiltri(): void {
    this.mostraFiltri = !this.mostraFiltri;
  }
  toggleVista(): void {
    this.vistaLista = !this.vistaLista;
  }

  inserisciNuovo(): void {
    this.router.navigate(['/impianto/inserimento-impianto']);
  }
  dettaglioImpianto(id: number): void {
    this.router.navigate(['/impianto/dettaglio-impianto', id]);
  }
  modificaImpianto(id: number): void {
    this.router.navigate(['/impianto/modifica-impianto', id]);
  }

  eliminaImpianto(id: number): void {
    this.impiantoService.elimina(id).subscribe({
      next: () => this.cercaImpianti(),
      error: (err) => console.error('Errore eliminazione:', err),
    });
  }

  cambiaStato(id: number, stato: string): void {
    this.impiantoService.cambiaStato(id, stato).subscribe({
      next: () => this.cercaImpianti(),
      error: (err) => console.error('Errore cambio stato:', err),
    });
  }
}
