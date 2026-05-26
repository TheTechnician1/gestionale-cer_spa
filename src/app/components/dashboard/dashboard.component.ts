import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { DashboardService } from '../services/dashboard.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { ImpiantoService } from '../services/impianto.service';
import { DatiEnergeticiService } from '../services/dati-energetici.service';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  summaryData: any = {};
  impiantiStato: any[] = [];
  impiantiTipologia: any[] = [];
  filtriCorrenti: any = {};

  constructor(
    private dashboardService: DashboardService,
    private _liveAnnouncer: LiveAnnouncer,
    private impinatoService: ImpiantoService,
    private datiEnergeticiService: DatiEnergeticiService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  @ViewChild('deleteConfirmDialog') deleteConfirmDialog!: TemplateRef<any>;

  cerToDelete: any = null;

  tableCER: string[] = [
    'ragSociale',
    'codFisc',
    'pIva',
    'comune',
    'provincia',
    'regione',
    'azioni',
  ];

  cer: any[] = [];

  dataSource = new MatTableDataSource(this.cer);
  sortedData: any[] | undefined;

  anniDisponibili: number[] = [];

  tableColumnsTopCer: string[] = [
    'ragSociale',
    'energiaCondivisa',
    'incentivi',
  ];
  tableColumnsAlert: string[] = ['tipo', 'descrizione'];

  dataSourceTopCer = new MatTableDataSource<any>([]);
  dataSourceAlert = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('paginatorTopCer') paginatorTopCer!: MatPaginator;
  @ViewChild('sortTopCer') sortTopCer!: MatSort;

  filtro = {
    ragSociale: '',
    codFisc: '',
    pIva: '',
    comune: '',
    provincia: '',
    regione: '',
  };

  filtroDashboard: any = {
    anno: new Date().getFullYear(),
    regione: null,
    provincia: null,
    comune: null,
    tipologia: null,
    statoImpianto: null,
    idCer: null,
  };

  listaFiltrata = [...this.cer];
  isFiltering = false;

  summary: any = null;
  impiantiPerStato: any[] = [];
  impiantiPerTipologia: any[] = [];
  andamentoEnergetico: any[] = [];
  topCer: any[] = [];
  alert: any[] = [];

  ngOnInit() {
    this.loadCERS();
    this.caricaDashboard();
    this.loadAnalytics();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.dataSourceTopCer.paginator = this.paginatorTopCer;
    this.dataSourceTopCer.sort = this.sortTopCer;
  }

  loadCERS() {
    this.dashboardService.getDati(this.filtro).subscribe({
      next: (cer) => {
        this.cer = cer;
        this.dataSource.data = [...this.cer];
        this.listaFiltrata = [...this.cer];
      },
      error: (error) => {
        console.error('Login error', error);
      },
    });
  }

  filtraCER() {
    this.isFiltering = true;
    this.loadCERS();
  }

  resetFiltro() {
    this.isFiltering = false;
    this.filtro = {
      ragSociale: '',
      codFisc: '',
      pIva: '',
      comune: '',
      provincia: '',
      regione: '',
    };
    this.listaFiltrata = [...this.cer];
    this.loadCERS();
  }

  sortData(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  caricaDashboard(): void {
    forkJoin({
      summary: this.dashboardService.getSummary(this.filtroDashboard),
      impiantiStato: this.dashboardService.getImpiantiPerStato(
        this.filtroDashboard,
      ),
      impiantiTipologia: this.dashboardService.getImpiantiPerTipologia(
        this.filtroDashboard,
      ),
      andamento: this.dashboardService.getAndamentoEnergetico(
        this.filtroDashboard,
      ),
      topCer: this.dashboardService.getTopCer(this.filtroDashboard),
      alerts: this.dashboardService.getAlert(this.filtroDashboard),
    }).subscribe({
      next: (res) => {
        console.log(
          'Tutti i dati della dashboard sono stati caricati con successo!',
          res,
        );
      },
      error: (err) => {
        console.error('Errore caricamento dashboard:', err);
      },
    });
  }

  applicaFiltri(): void {
    this.caricaDashboard();
  }

  resetFiltriDashboard(): void {
    this.filtroDashboard = {
      anno: new Date().getFullYear(),
      regione: null,
      provincia: null,
      comune: null,
      tipologia: null,
      statoImpianto: null,
      idCer: null,
    };
    this.caricaDashboard();
  }

  navigaImpianti(statoImpianto?: string): void {
    if (statoImpianto) {
      this.router.navigate(['/impianto'], { queryParams: { statoImpianto } });
    } else {
      this.router.navigate(['/impianto']);
    }
  }

  toggleServerMockMode(): void {
    this.dashboardService.useMock = !this.dashboardService.useMock;

    this.loadCERS();
    this.caricaDashboard();
  }

  get isMockActive(): boolean {
    return this.dashboardService.useMock;
  }

  eliminaCerLogicamente(cerItem: any): void {
    this.cerToDelete = cerItem;

    const dialogRef = this.dialog.open(this.deleteConfirmDialog, {
      width: '440px',
      disableClose: false,
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed && this.cerToDelete) {
        const payloadCancellazione = {
          idCer: this.cerToDelete.idCer,
          emailUtenteLoggato: 'utente.test@comunita.it',
        };

        this.dashboardService.disattivaCer(payloadCancellazione).subscribe({
          next: (responseMessage) => {
            console.log('Backend response:', responseMessage);
            this.loadCERS();
            this.caricaDashboard();
            this.cerToDelete = null;
          },
          error: (err) => {
            console.error('Failed logical deletion step:', err);
            this.cerToDelete = null;
          },
        });
      } else {
        this.cerToDelete = null;
      }
    });
  }

  loadAnalytics(): void {
    this.dashboardService.getSummary(this.filtriCorrenti).subscribe((data) => {
      this.summaryData = data;
    });

    this.dashboardService
      .getImpiantiPerStato(this.filtriCorrenti)
      .subscribe((data) => {
        this.impiantiStato = data;
      });

    this.dashboardService
      .getImpiantiPerTipologia(this.filtriCorrenti)
      .subscribe((data) => {
        this.impiantiTipologia = data;
      });
  }
}
