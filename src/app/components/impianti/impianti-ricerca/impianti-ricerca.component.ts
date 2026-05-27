import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ImpiantoService } from '../../services/impianto.service';
import {
  ImpiantoVista,
  STATI_IMPIANTO,
} from '../../../core/interfaces/impianto.model';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-impianti-ricerca',
  templateUrl: './impianti-ricerca.component.html',
  styleUrls: ['./impianti-ricerca.component.scss'],
})
export class ImpiantiRicercaComponent implements OnInit {
  impianti: ImpiantoVista[] = [];
  dataSource = new MatTableDataSource<ImpiantoVista>([]);
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

  @ViewChild(MatPaginator) set paginator(p: MatPaginator) {
    if (p) this.dataSource.paginator = p;
  }
  @ViewChild(MatSort) set sort(s: MatSort) {
    if (s) this.dataSource.sort = s;
  }

  @ViewChild('dlgElimina') private dlgElimina!: ConfirmationDialogComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
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
      attivo: [null],
    });
  }

  ngOnInit(): void {
    const valoreSalvato = localStorage.getItem('vistaLista');
    if (valoreSalvato !== null) {
      this.vistaLista = JSON.parse(valoreSalvato);
    }
    const qp = this.route.snapshot.queryParamMap;
    const patch: Record<string, string | number> = {};
    qp.keys.forEach((k) => {
      if (this.form.contains(k)) {
        const v = qp.get(k);
        if (v !== null && v !== '') {
          patch[k] = isNaN(Number(v)) ? v : Number(v);
        }
      }
    });
    if (Object.keys(patch).length > 0) {
      this.form.patchValue(patch);
      this.mostraFiltri = true;
    }
    this.cercaImpianti();
  }

  cercaImpianti(): void {
    this.impiantoService.ricerca(this.form.value).subscribe({
      next: (res) => {
        this.impianti = res ?? [];
        this.dataSource.data = this.impianti;
      },
      error: (err) => console.error('Errore caricamento impianti:', err),
    });
  }

  filtraImpianti(): void {
    this.cercaImpianti();
  }

  resetFiltri(): void {
    this.form.reset({
      idCer: null,
      codiceCabina: null,
      tipologiaImpianto: null,
      statoImpianto: null,
      regione: null,
      provincia: null,
      comune: null,
      presenzaAccumulo: null,
      attivo: null,
    });
    this.cercaImpianti();
  }

  toggleFiltri(): void {
    this.mostraFiltri = !this.mostraFiltri;
  }
  toggleVista(): void {
    this.vistaLista = !this.vistaLista;
    localStorage.setItem('vistaLista', JSON.stringify(this.vistaLista));
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

  chiediElimina(id: number): void {
    this.dlgElimina.open(id);
  }

  onConfermaElimina(id: unknown): void {
    this.impiantoService.elimina(Number(id)).subscribe({
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
