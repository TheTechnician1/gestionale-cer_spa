import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LoginService } from '../core/services/login.service';
import { GetListaCER } from '../core/interfaces/user.model';

/**
 * @title Table with pagination
 */
@Component({
  selector: 'app-tabella-cer',
  templateUrl: './tabella-cer.component.html',
  styleUrls: ['./tabella-cer.component.scss'],
})
export class TabellaCERComponent implements AfterViewInit 
  , OnChanges 
 {
  @Input() risultatiFiltrati: GetListaCER[] | null = null;

  readonly displayedColumns: string[] = [
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
    if (!this.risultatiFiltrati) {
      this.getTabellaCER();
    }
  }

  getRuolo(): string {
    let ruolo = this.login.currentUser?.ruolo;
    // console.log(ruolo);
    return ruolo!;
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['risultatiFiltrati'] && this.risultatiFiltrati) {
      this.dataSource.data = this.risultatiFiltrati;

      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
      }
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getTabellaCER(): void {
    this.login.getTabellaCER().subscribe({
      next: (res) => {
        this.dataSource.data = res
      },
      error: (error) => {

      }
      
    })
  }
 }
