import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../core/services/login.service';
import { SharedModule } from "../shared/shared.module";
import { AnagraficaUtenti } from '../core/interfaces/user.model';


/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-tabella-utenti',
  templateUrl: './tabella-utenti.component.html',
  styleUrls: ['./tabella-utenti.component.scss'],
  
  
})
export class TabellaUtentiComponent implements AfterViewInit {

  displayedColumns: string[] = [
    'nome',
    'cognome',
    'email',
    'ruolo',
    'azioni',
  ];
  
  dataSource = new MatTableDataSource<AnagraficaUtenti>(ELEMENT_DATA);

  constructor(private login: LoginService) {}
  // simone?: number
  // id = this.log.getid()
  // ruolo: string = ''

  getRuolo(): string {
    let ruolo = this.login.currentUser?.ruolo;
    // console.log(ruolo);
    return ruolo!;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}

const ELEMENT_DATA: AnagraficaUtenti[] = [
  {
    nome: 'Hydrogen',
    cognome: '1.0079',
    email: 'H',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Helium',
    cognome: '4.0026',
    email: 'He',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Lithium',
    cognome: '6.941',
    email: 'Li',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Beryllium',
    cognome: '9.0122',
    email: 'Be',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Boron',
    cognome: '10.811',
    email: 'B',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Carbon',
    cognome: '12.0107',
    email: 'C',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Nitrogen',
    cognome: '14.0067',
    email: 'N',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Oxygen',
    cognome: '15.9994',
    email: 'O',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Fluorine',
    cognome: '18.9984',
    email: 'F',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Neon',
    cognome: '20.1797',
    email: 'Ne',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Sodium',
    cognome: '22.9897',
    email: 'Na',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Magnesium',
    cognome: '24.305',
    email: 'Mg',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Aluminum',
    cognome: '26.9815',
    email: 'Al',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Silicon',
    cognome: '28.0855',
    email: 'Si',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Phosphorus',
    cognome: '30.9738',
    email: 'P',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Sulfur',
    cognome: '32.065',
    email: 'S',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Chlorine',
    cognome: '35.453',
    email: 'Cl',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Argon',
    cognome: '39.948',
    email: 'Ar',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Potassium',
    cognome: '39.0983',
    email: 'K',
    ruolo: '',
    azioni: '',
  },
  {
    nome: 'Calcium',
    cognome: '40.078',
    email: 'Ca',
    ruolo: '',
    azioni: '',
  },
];

