import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginComponent } from '../login/login.component';
import { LoginService } from '../core/services/login.service';
import { AnagraficaCER, GetListaCER } from '../core/interfaces/user.model';

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
    'partitaIVA',
    'formaGiuridica',
    'regioneLegale',
    'azioni',
  ];
  dataSource = new MatTableDataSource<GetListaCER>();



  constructor(private login: LoginService) {}
  // simone?: number
  // id = this.log.getid()
  // ruolo: string = ''

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getTabellaCER()
  }

  getRuolo(): string {
    let ruolo = this.login.currentUser?.ruolo;
    // console.log(ruolo);
    return ruolo!;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getTabellaCER(){
    this.login.getTabellaCER().subscribe({
      next: (res) => {
        this.dataSource.data = res
      },
      error: (error) => {

      }
      
    })
      
  }

}
