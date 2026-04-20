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
  tableDat: string[] = ['id_dati', 'energia_prodotta', 'energia_prelevata', 'azioni'];

  datiEnergetici: DatiEnergetici[] = [];

  dataSource = new MatTableDataSource(this.datiEnergetici);

  sortedData: DatiEnergetici[] | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;



  filtro = {
    energia_prodotta: 0,
    energia_prelevata: 0,
    energia_immessa: 0
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
    this.datiService.getDati().subscribe({
      next: (dati) => {
        this.datiEnergetici = dati;
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  filtraDatiEnergetici() {
    console.log(this.filtro);
    this.listaFiltrata = this.datiEnergetici.filter(p => {
      return (
        (this.filtro.energia_prodotta ? p.energia_prodotta! >= this.filtro.energia_prodotta : true) &&
        (this.filtro.energia_prelevata ? p.energia_prelevata! >= this.filtro.energia_prelevata : true) &&
        (this.filtro.energia_immessa ? p.energia_immessa! >= this.filtro.energia_immessa : true)
      );
    });

    console.log(this.listaFiltrata);

    this.isFiltering = true;

    return this.listaFiltrata;
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      energia_prodotta: 0,
      energia_prelevata: 0,
      energia_immessa: 0
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
