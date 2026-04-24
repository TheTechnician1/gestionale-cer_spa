import { Component, ViewChild } from '@angular/core';
import { Impianto } from '../../interfaces/impianto.model';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ImpiantoService } from '../../services/impianto.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';

@Component({
  selector: 'app-impianto',
  templateUrl: './impianto.component.html',
  styleUrls: ['./impianto.component.scss']
})
export class ImpiantoComponent {
  constructor(private impiantoService: ImpiantoService, private _liveAnnouncer: LiveAnnouncer) {}
  tableImp: string[] = ['annoAttivazione', 'partitaIva', 'regione', 'provincia', 'comune', 'codiceCabina', 'codiceTipologia', 'codCategoriaProduttore', 'codInstallazione', 'azioni'];

  impianti: Impianto[] = [];

  dataSource = new MatTableDataSource(this.impianti);

  sortedData: Impianto[] | undefined;

  filtro = {
    annoAttivazione: '',
    partitaIva: '',
    regione: '',
    provincia: '',
    comune: '',
    codiceCabina: '',
    codiceTipologia: '',
    codCategoriaProduttore: '',
    codInstallazione: ''
  }

  listaFiltrata = [...this.impianti];
  isFiltering = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.loadImpianti();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadImpianti() {
    this.impiantoService.getImpianti(this.filtro).subscribe({
      next: (impianti) => {
        this.impianti = impianti;
        this.dataSource.data = [...this.impianti];
        this.listaFiltrata = [...this.impianti];
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  sortData(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filtraImpianto() {
    this.isFiltering = true;
    this.loadImpianti();
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      annoAttivazione: '',
      partitaIva: '',
      regione: '',
      provincia: '',
      comune: '',
      codiceCabina: '',
      codiceTipologia: '',
      codCategoriaProduttore: '',
      codInstallazione: ''
    };

    this.listaFiltrata = [...this.impianti];
    this.loadImpianti();
  }
}
