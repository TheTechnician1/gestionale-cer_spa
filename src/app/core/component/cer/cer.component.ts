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
  tableCER: string[] = ['ragioneSociale', 'codiceFiscale', 'comuneLegale', ' provinciaLegale', 'regioneLegale', 'azioni'];

  cer: CER[] = [];

  dataSource = new MatTableDataSource(this.cer);
  sortedData: CER[] | undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  filtro = {
    ragioneSociale: '',
    codiceFiscale: '',
    comuneLegale: '',
    provinciaLegale: '',
    regioneLegale: ''
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
    this.cerService.getCERS(this.filtro).subscribe({
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
        (this.filtro.ragioneSociale ? p.ragioneSociale?.toLowerCase().includes(this.filtro.ragioneSociale.toLowerCase()) : true) &&
        (this.filtro.codiceFiscale ? p.codiceFiscale?.toLowerCase().includes(this.filtro.codiceFiscale.toLowerCase()) : true) &&
        (this.filtro.comuneLegale ? p.comuneLegale?.descrizione?.toLowerCase().includes(this.filtro.comuneLegale.toLowerCase()) : true) &&
        (this.filtro.provinciaLegale ? p.provinciaLegale?.descrizione?.toLowerCase().includes(this.filtro.provinciaLegale.toLowerCase()) : true) &&
        (this.filtro.regioneLegale ? p.regioneLegale?.descrizione?.toLowerCase().includes(this.filtro.regioneLegale.toLowerCase()) : true)
      );
    });
    this.isFiltering = true;

    return this.listaFiltrata;
  }

  resetFiltro() {
    this.isFiltering = false;

    this.filtro = {
      ragioneSociale: '',
      codiceFiscale: '',
      comuneLegale: '',
      provinciaLegale: '',
      regioneLegale: ''
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
