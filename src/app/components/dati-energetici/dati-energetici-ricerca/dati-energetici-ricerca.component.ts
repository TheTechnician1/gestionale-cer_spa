import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { PermessiService } from '../../../core/services/permessi.service';
import { DatiEnergeticiVista } from '../../../core/interfaces/dati-energetici.model';

@Component({
  selector: 'app-dati-energetici-ricerca',
  templateUrl: './dati-energetici-ricerca.component.html',
  styleUrls: ['./dati-energetici-ricerca.component.scss'],
})
export class DatiEnergeticiRicercaComponent implements OnInit {
  datiEnergetici: DatiEnergeticiVista[] = [];
  dataSource = new MatTableDataSource<DatiEnergeticiVista>([]);
  anni: string[] = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];

  form: FormGroup;
  mostraFiltri = false;
  vistaLista = false;

  colonneLista: string[] = [
    'codiceCabina',
    'annoRiferimento',
    'idCer',
    'idConfigurazione',
    'partitaIva',
    'attivo',
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
    private datiEnergeticiService: DatiEnergeticiService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public permessi: PermessiService,
  ) {
    this.form = this.fb.group({
      annoRiferimento: [null],
      idCer: [null],
      idConfigurazione: [null],
      codiceCabina: [null],
      partitaIva: [null],
    });
  }

  ngOnInit(): void {
    const valoreSalvato = localStorage.getItem('vistaLista');
    if (valoreSalvato !== null) {
      this.vistaLista = JSON.parse(valoreSalvato);
    }
    // Pre-filtri da queryParams (es. click sui KPI della dashboard).
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
    this.cercaDatiEnergetici();
  }

  cercaDatiEnergetici(): void {
    this.datiEnergeticiService.ricerca(this.form.value).subscribe({
      next: (res) => {
        this.datiEnergetici = res ?? [];
        this.dataSource.data = this.datiEnergetici;
      },
      error: (err) => console.error('Errore caricamento dati:', err),
    });
  }

  filtra(): void {
    this.cercaDatiEnergetici();
  }

  /** Svuota tutti i filtri e ricarica la lista intera. */
  resetFiltri(): void {
    this.form.reset({
      annoRiferimento: null,
      idCer: null,
      idConfigurazione: null,
      codiceCabina: null,
      partitaIva: null,
    });
    this.cercaDatiEnergetici();
  }

  toggleFiltri(): void {
    this.mostraFiltri = !this.mostraFiltri;
  }

  toggleVista(): void {
    this.vistaLista = !this.vistaLista;
    localStorage.setItem('vistaLista', JSON.stringify(this.vistaLista));
  }

  inserisciNuovo(): void {
    this.router.navigate(['/dati-energetici/inserimento-dati']);
  }

  dettaglioDatiEnergetici(id: number): void {
    this.router.navigate(['/dati-energetici/dettaglio-dati', id]);
  }

  modificaDatiEnergetici(id: number): void {
    this.router.navigate(['/dati-energetici/modifica-dati', id]);
  }

  chiediElimina(id: number): void {
    this.dlgElimina.open(id);
  }

  onConfermaElimina(id: unknown): void {
    this.datiEnergeticiService.elimina(Number(id)).subscribe({
      next: () => this.cercaDatiEnergetici(),
      error: (err) => console.error('Errore eliminazione:', err),
    });
  }
}
