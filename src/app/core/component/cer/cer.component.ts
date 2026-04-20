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

  cer: CER[] = [];

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
    this.cerService.getCERS().subscribe({
      next: (cer) => {
        this.cer = cer;
      },
      error: (error) => {
        console.error("Login error", error);
      }
    });
  }

  filtraCER() {
    this.listaFiltrata = this.cer.filter(p => {
      return (
        (this.filtro.ragione_sociale ? p.ragioneSociale?.toLowerCase().includes(this.filtro.ragione_sociale.toLowerCase()) : true) &&
        (this.filtro.partita_iva ? p.partitaIva?.toLowerCase().includes(this.filtro.partita_iva.toLowerCase()) : true) &&
        (this.filtro.forma_giuridica ? p.formaGiuridica?.toLowerCase().includes(this.filtro.partita_iva.toLowerCase()) : true)
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
