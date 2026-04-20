import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../core/services/login.service';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-tabella-cer',
  templateUrl: './tabella-cer.component.html',
  styleUrls: ['./tabella-cer.component.scss'],
})
export class TabellaCERComponent implements AfterViewInit {
  displayedColumns: string[] = [
    'ragioneSociale',
    'p_iva',
    'formaGiuridica',
    'stato',
    'azioni',
  ];
  dataSource = new MatTableDataSource<AnagraficaCER>(ELEMENT_DATA);

  constructor(private login: LoginService) {}
  // simone?: number
  // id = this.log.getid()
  // ruolo: string = ''

  getRuolo(): string {
    let ruolo = this.login.currentUser?.ruolo;
    console.log(ruolo);
    return ruolo!;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

export interface AnagraficaCER {
  ragioneSociale: string;
  p_iva: number;
  formaGiuridica: string;
  stato: string;
  azioni: any;
}

const ELEMENT_DATA: AnagraficaCER[] = [
  {
    ragioneSociale: 'Hydrogen',
    p_iva: 1,
    formaGiuridica: '1.0079',
    stato: 'H',
    azioni: '',
  },
  {
    ragioneSociale: 'Helium',
    p_iva: 2,
    formaGiuridica: '4.0026',
    stato: 'He',
    azioni: '',
  },
  {
    ragioneSociale: 'Lithium',
    p_iva: 3,
    formaGiuridica: '6.941',
    stato: 'Li',
    azioni: '',
  },
  {
    ragioneSociale: 'Beryllium',
    p_iva: 4,
    formaGiuridica: '9.0122',
    stato: 'Be',
    azioni: '',
  },
  {
    ragioneSociale: 'Boron',
    p_iva: 5,
    formaGiuridica: '10.811',
    stato: 'B',
    azioni: '',
  },
  {
    ragioneSociale: 'Carbon',
    p_iva: 6,
    formaGiuridica: '12.0107',
    stato: 'C',
    azioni: '',
  },
  {
    ragioneSociale: 'Nitrogen',
    p_iva: 7,
    formaGiuridica: '14.0067',
    stato: 'N',
    azioni: '',
  },
  {
    ragioneSociale: 'Oxygen',
    p_iva: 8,
    formaGiuridica: '15.9994',
    stato: 'O',
    azioni: '',
  },
  {
    ragioneSociale: 'Fluorine',
    p_iva: 9,
    formaGiuridica: '18.9984',
    stato: 'F',
    azioni: '',
  },
  {
    ragioneSociale: 'Neon',
    p_iva: 10,
    formaGiuridica: '20.1797',
    stato: 'Ne',
    azioni: '',
  },
  {
    ragioneSociale: 'Sodium',
    p_iva: 11,
    formaGiuridica: '22.9897',
    stato: 'Na',
    azioni: '',
  },
  {
    ragioneSociale: 'Magnesium',
    p_iva: 12,
    formaGiuridica: '24.305',
    stato: 'Mg',
    azioni: '',
  },
  {
    ragioneSociale: 'Aluminum',
    p_iva: 13,
    formaGiuridica: '26.9815',
    stato: 'Al',
    azioni: '',
  },
  {
    ragioneSociale: 'Silicon',
    p_iva: 14,
    formaGiuridica: '28.0855',
    stato: 'Si',
    azioni: '',
  },
  {
    ragioneSociale: 'Phosphorus',
    p_iva: 15,
    formaGiuridica: '30.9738',
    stato: 'P',
    azioni: '',
  },
  {
    ragioneSociale: 'Sulfur',
    p_iva: 16,
    formaGiuridica: '32.065',
    stato: 'S',
    azioni: '',
  },
  {
    ragioneSociale: 'Chlorine',
    p_iva: 17,
    formaGiuridica: '35.453',
    stato: 'Cl',
    azioni: '',
  },
  {
    ragioneSociale: 'Argon',
    p_iva: 18,
    formaGiuridica: '39.948',
    stato: 'Ar',
    azioni: '',
  },
  {
    ragioneSociale: 'Potassium',
    p_iva: 19,
    formaGiuridica: '39.0983',
    stato: 'K',
    azioni: '',
  },
  {
    ragioneSociale: 'Calcium',
    p_iva: 20,
    formaGiuridica: '40.078',
    stato: 'Ca',
    azioni: '',
  },
];
