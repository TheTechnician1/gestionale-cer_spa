import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Configurazione } from '../../interfaces/configurazione.model';
import { ConfigurazioneService } from '../../services/configurazione.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';

@Component({
  selector: 'app-configurazione',
  templateUrl: './configurazione.component.html',
  styleUrls: ['./configurazione.component.scss']
})
export class ConfigurazioneComponent {
  constructor(private confService: ConfigurazioneService, private _liveAnnouncer: LiveAnnouncer) {}
  tableConf: string[] = ['id_configurazione', 'codice_cabina', 'anno_attivazione', 'azioni'];

  configurazione: Configurazione[] = [];

  dataSource = new MatTableDataSource(this.configurazione);

  sortedData: Configurazione[] | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  deleteConf() {

  }

  filtro = {
    codice_cabina: "",
    anno_attivazione: ""
  }

  listaFiltrata = [...this.configurazione];
  isFiltering = false;

  filtraConfigurazione() {
    console.log(this.filtro);
    this.listaFiltrata = this.configurazione.filter(p => {
      return (
      (this.filtro.codice_cabina ? p.codice_cabina?.toLowerCase().includes(this.filtro.codice_cabina.toLowerCase()) : true) &&
      (this.filtro.anno_attivazione ? p.anno_attivazione?.toLowerCase().includes(this.filtro.anno_attivazione.toLowerCase()) : true)
      );
    });

    console.log(this.listaFiltrata);

    this.isFiltering = true;

    return this.listaFiltrata;
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      codice_cabina: "",
      anno_attivazione: ""
    };

    this.listaFiltrata = [...this.configurazione];
  }

  sortData(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
