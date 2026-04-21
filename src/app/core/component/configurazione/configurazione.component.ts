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
  tableConf: string[] = ['codice_cabina', 'anno_attivazione', 'partitaIva', 'azioni'];

  configurazioni: Configurazione[] = [];

  dataSource = new MatTableDataSource(this.configurazioni);

  sortedData: Configurazione[] | undefined;

  filtro = {
    codice_cabina: "",
    anno_attivazione: "",
    partitaIva: ""
  }

  listaFiltrata = [...this.configurazioni];
  isFiltering = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadConfig();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadConfig() {
    this.confService.getConfigurazioni().subscribe({
      next: (config) => {
        this.configurazioni = config;
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  filtraConfigurazione() {
    this.listaFiltrata = this.configurazioni.filter(p => {
      return (
      (this.filtro.codice_cabina ? p.codice_cabina?.toLowerCase().includes(this.filtro.codice_cabina.toLowerCase()) : true) &&
      (this.filtro.anno_attivazione ? p.anno_attivazione?.toLowerCase().includes(this.filtro.anno_attivazione.toLowerCase()) : true) &&
      (this.filtro.partitaIva ? p.partitaIva?.toLowerCase().includes(this.filtro.partitaIva.toLowerCase()) : true)
      );
    });
    this.isFiltering = true;
    return this.listaFiltrata;
  }

  resetFiltro() {
    this.isFiltering = false;
    this.filtro = {
      codice_cabina: "",
      anno_attivazione: "",
      partitaIva: ""
    };
    this.listaFiltrata = [...this.configurazioni];
  }

  sortData(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
