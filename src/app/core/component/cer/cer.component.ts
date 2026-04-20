import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { CER } from '../../interfaces/cer.model';
import { CERService } from '../../services/cer.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-cer',
  templateUrl: './cer.component.html',
  styleUrls: ['./cer.component.scss']
})

export class CERComponent {
  constructor(private cerService: CERService, private _liveAnnouncer: LiveAnnouncer) {}
  tableCER: string[] = ['id_cer', 'ragione_sociale', 'partita_iva', 'forma_giuridica', 'azioni'];

  cer: CER[] = [
    {
      id_cer: 1,
      ragione_sociale: 'Associazione Solare Bologna',
      codice_fiscale: "",
      partita_iva: "7432636",
      comune_sede_legale: "",
      provincia_sede_legale: "",
      regione_legale: "",
      forma_giuridica: "Associazione non Riconosciuta",
      flag_cancellato: false,
      contatti: [
        {
          telefono: "",
          email: "",
          pec: "",
          sito_web: "",
          referente: ""
        }
      ],
    },
    {
      id_cer: 2,
      ragione_sociale: 'Associazione Rinnovabile Modena',
      codice_fiscale: "",
      partita_iva: "1823723",
      comune_sede_legale: "",
      provincia_sede_legale: "",
      regione_legale: "",
      forma_giuridica: "Associazione Riconosciuta",
      flag_cancellato: false,
      contatti: [
        {
          telefono: "",
          email: "",
          pec: "",
          sito_web: "",
          referente: ""
        }
      ],
    },
    {
      id_cer: 3,
      ragione_sociale: 'Cooperativa Energia Ferrara',
      codice_fiscale: "",
      partita_iva: "9489612",
      comune_sede_legale: "",
      provincia_sede_legale: "",
      regione_legale: "",
      forma_giuridica: "Cooperativa",
      flag_cancellato: false,
      contatti: [
        {
          telefono: "",
          email: "",
          pec: "",
          sito_web: "",
          referente: ""
        }
      ],
    }
];

  dataSource = new MatTableDataSource(this.cer);
  sortedData: CER[] | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtro = {
    ragione_sociale: '',
    partita_iva: '',
    forma_giuridica: ''
  };

  listaFiltrata = [...this.cer];
  isFiltering = false;

  ngOnInit() {
    this.loadCERS();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadCERS() {
    // this.cers = this.cerService.getCERS();
  }

  filtraCER() {
    this.listaFiltrata = this.cer.filter(p => {
      return (
        (this.filtro.ragione_sociale ? p.ragione_sociale?.toLowerCase().includes(this.filtro.ragione_sociale.toLowerCase()) : true) &&
        (this.filtro.partita_iva ? p.partita_iva?.toLowerCase().includes(this.filtro.partita_iva.toLowerCase()) : true) &&
        (this.filtro.forma_giuridica ? p.partita_iva?.toLowerCase().includes(this.filtro.partita_iva.toLowerCase()) : true)
      );
    });
    this.isFiltering = true;

    return this.listaFiltrata;
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      ragione_sociale: '',
      partita_iva: '',
      forma_giuridica: ''
    };

    this.listaFiltrata = [...this.cer];
  }

  sortData(sortState: Sort) {
    if(sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
