import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  inject,
} from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LoginService } from '../core/services/login.service';
import { AnagraficaCER, GetListaCER } from '../core/interfaces/user.model';
import { CerElemento, FiltroService } from '../core/services/filtro.service';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-tabella-cer',
  templateUrl: './tabella-cer.component.html',
  styleUrls: ['./tabella-cer.component.scss'],
})
export class TabellaCERComponent implements AfterViewInit, OnChanges {
  readonly displayedColumns: string[] = [
    'ragioneSociale',
    'partitaIVA',
    'formaGiuridica',
    'comune',
    'provincia',
    'regione',
    'azioni',
  ];


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

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['risultatiFiltrati']) {
  //     this.dataSource.data = this.risultatiFiltrati;

  //     if (this.dataSource.paginator) {
  //       this.dataSource.paginator.firstPage();
  //     }
  //   }
  // }

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
