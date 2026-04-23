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
  tableConf: string[] = ['codiceCabina', 'annoAttivazione', 'pIva', 'regioneLegale', 'azioni'];

  configurazioni: Configurazione[] = [];

  dataSource = new MatTableDataSource(this.configurazioni);

  sortedData: Configurazione[] | undefined;

  filtro = {
    codiceCabina: "",
    annoAttivazione: "",
    pIva: "",
    regioneLegale: ""
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
    this.confService.getConfigurazioni(this.filtro).subscribe({
      next: (config) => {
        this.configurazioni = config;
        this.dataSource.data = [...this.configurazioni];
        this.listaFiltrata = [...this.configurazioni];
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  filtraConfigurazione() {
    this.isFiltering = true;
    this.loadConfig();
  }

  resetFiltro() {
    this.isFiltering = false;
    this.filtro = {
      codiceCabina: "",
      annoAttivazione: "",
      pIva: "",
      regioneLegale: ""
    };
    this.listaFiltrata = [...this.configurazioni];
    this.loadConfig();
  }

  sortData(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
