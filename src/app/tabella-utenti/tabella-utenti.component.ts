import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../core/services/login.service';
import { SharedModule } from "../shared/shared.module";
import { AnagraficaUtenti, User } from '../core/interfaces/user.model';


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
    'codiceFiscale',
    'numeroTelefono',
    'ruolo',
  ];

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    
    this.login.visualizzaTotUtenti().subscribe({
      next: (res) => {
        this.dataSource.data = res
        console.log(this.dataSource.data)
      },
      error: (error) => {

      }
      
    })
  
  }
  
  dataSource = new MatTableDataSource<User>();

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


