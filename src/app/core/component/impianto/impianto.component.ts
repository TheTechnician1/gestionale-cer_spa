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
  tableImp: string[] = ['id_impianto', 'codice_cabina', 'data_entrata_esercizio', 'azioni'];

  impianto: Impianto[] = [
    { id_impianto: '37',
      id_configurazione: "",
      codice_cabina: "7d8h2",
      data_entrata_esercizio: "12/3/26",
      flag_impianto: false,
      tipologia_impianto: "",
      potenza_nominale: "",
      presenza_accumulo: "",
      capacita_accumulo: "",
      tipologia_produttore: "",
      categoria_produttore: "",
      ubicazione_impianto: [
        {
          regione: "",
          provincia: "",
          comune: "",
          indirizzo: "",
          numero_civico: "",
          cap: "",
          tipologia_sito: ""
        }
      ]
    }
  ]

  dataSource = new MatTableDataSource(this.impianto);
  
    sortedData: Impianto[] | undefined;
  
    @ViewChild(MatPaginator) paginator!: MatPaginator;
    @ViewChild(MatSort) sort!: MatSort;
  
    ngAfterViewInit() {
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    }


  deleteImp() {

  }

  sortData(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  filtro = {
    tipologia_impianto: "",
    potenza_nominale: "",
    presenza_accumulo: "",
  }

  listaFiltrata = [...this.impianto];
  isFiltering = false;


  filtraImpianto() {
    console.log(this.filtro);
    this.listaFiltrata = this.impianto.filter(p => {
      return (
        (this.filtro.tipologia_impianto ? p.tipologia_impianto?.toLowerCase().includes(this.filtro.tipologia_impianto.toLowerCase()) : true) &&
        (this.filtro.potenza_nominale ? p.potenza_nominale?.toLowerCase().includes(this.filtro.potenza_nominale.toLowerCase()) : true) &&
        (this.filtro.presenza_accumulo ? p.presenza_accumulo?.toLowerCase().includes(this.filtro.presenza_accumulo.toLowerCase()) : true)
      );
    });

    console.log(this.listaFiltrata);

    this.isFiltering = true;

    return this.listaFiltrata;
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      tipologia_impianto: "",
      potenza_nominale: "",
      presenza_accumulo: ""
    };

    this.listaFiltrata = [...this.impianto];
  }
}
