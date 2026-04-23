import { Component, ViewChild } from '@angular/core';
import { DatiEnergetici } from '../../interfaces/dati-energetici.model';
import { MatTableDataSource } from '@angular/material/table';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-dati-energetici',
  templateUrl: './dati-energetici.component.html',
  styleUrls: ['./dati-energetici.component.scss']
})
export class DatiEnergeticiComponent {
  constructor(private datiService: DatiEnergeticiService, private _liveAnnouncer: LiveAnnouncer) {}
  tableDat: string[] = ['anno', 'flg_cancellazione', 'azioni'];

  datiEnergetici: DatiEnergetici[] = [];

  dataSource = new MatTableDataSource(this.datiEnergetici);

  sortedData: DatiEnergetici[] | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  filtro = {
    anno: '',
    flg_cancellazione: ''
  };

  listaFiltrata = [...this.datiEnergetici];
  isFiltering = false;

  ngOnInit() {
    this.loadDati();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadDati() {
    this.datiService.getDati(this.filtro).subscribe({
      next: (dati) => {
        this.datiEnergetici = dati;
        this.dataSource.data = [...this.datiEnergetici];
        this.listaFiltrata = [...this.datiEnergetici];
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  filtraDatiEnergetici() {
    this.isFiltering = true;
    this.loadDati();
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      anno: '',
      flg_cancellazione: ''
    };

    this.listaFiltrata = [...this.datiEnergetici];
  }

  sortData(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
