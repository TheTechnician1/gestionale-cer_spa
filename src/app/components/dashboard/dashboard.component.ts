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
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { UtenteService } from 'src/app/core/services/utente.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, AfterViewInit {
  summaryData: any = {};
  impiantiStato: any[] = [];
  impiantiTipologia: any[] = [];
  filtriCorrenti: any = {};
  impiantiGradientStyle: string = 'conic-gradient(#cbd5e1 0% 100%)';
  tipologiaGradientStyle: string = 'conic-gradient(#cbd5e1 0% 100%)';
  opzioniRegioni: string[] = [];
  opzioniProvinceFiltrate: string[] = [];
  opzioniComuniFiltrati: string[] = [];

  constructor(
    private dashboardService: DashboardService,
    private _liveAnnouncer: LiveAnnouncer,
    private router: Router,
    private dialog: MatDialog,
    private utenteService: UtenteService,
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
  dataSource = new MatTableDataSource<any>([]);
  listaFiltrata: any[] = [];
  isFiltering = false;

  summary: any = null;
  topCer: any[] = [];
  alert: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

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

  ngOnInit() {
    this.loadCERS();
    this.caricaDashboard();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadCERS() {
    this.dashboardService.getDati(this.filtro).subscribe({
      next: (cerList) => {
        this.cer = (cerList || []).map((item: any) => ({
          ...item,
          ragSociale: item.ragioneSociale || item.ragSociale || '',
          codFisc: item.codiceFiscale || item.codFisc || '',
          pIva: item.partitaIva || item.pIva || '',
          comune:
            item.comuneLegale?.descrizione ||
            item.comuneLegal?.descrizione ||
            item.comune ||
            '',
          provincia: item.provinciaLegale?.descrizione || item.provincia || '',
          regione: item.regioneLegale?.descrizione || item.regione || '',
        }));

        this.dataSource.data = [...this.cer];
        this.listaFiltrata = [...this.cer];

        const regSet = new Set<string>(
          this.cer.map((c) => c.regione).filter(Boolean),
        );
        this.opzioniRegioni = Array.from(regSet).sort();

        this.aggiornaElenchiGeografici();
      },
      error: (error) => {
        console.error('Error loading registries', error);
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
    }).subscribe({
      next: (res) => {
        this.summary = res.summary;
        this.impiantiStato = res.impiantiStato;
        this.impiantiTipologia = res.impiantiTipologia;

        const totalStato = this.impiantiStato.reduce(
          (acc, item) => acc + item.quantita,
          0,
        );
        if (totalStato > 0) {
          let currentAngle = 0;
          const slices = this.impiantiStato.map((item) => {
            const percentage = (item.quantita / totalStato) * 100;
            const color = item.stato === 'Attivo' ? '#107c41' : '#f2c811';
            const start = currentAngle;
            currentAngle += percentage;
            return `${color} ${start}% ${currentAngle}%`;
          });
          this.impiantiGradientStyle = `conic-gradient(${slices.join(', ')})`;
        }

        const totalTipo = this.impiantiTipologia.reduce(
          (acc, item) => acc + item.valore,
          0,
        );
        if (totalTipo > 0) {
          let currentAngle = 0;
          const slices = this.impiantiTipologia.map((item) => {
            const percentage = (item.valore / totalTipo) * 100;
            const color =
              item.tipologia === 'Fotovoltaico' ? '#0078d4' : '#2b579a';
            const start = currentAngle;
            currentAngle += percentage;
            return `${color} ${start}% ${currentAngle}%`;
          });
          this.tipologiaGradientStyle = `conic-gradient(${slices.join(', ')})`;
        }
      },
      error: (err) =>
        console.error(
          'Errore durante il caricamento del widget della dashboard:',
          err,
        ),
    });
  }

  applicaFiltri(): void {
    this.caricaDashboard();
    this.loadCERS();
  }

  toggleServerMockMode(): void {
    this.dashboardService.useMock = !this.dashboardService.useMock;
    this.applicaFiltri();
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
            this.applicaFiltri();
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

  get isGuest(): boolean {
    const currentUserState = this.utenteService.currentUser;
    const ruolo =
      currentUserState?.utente?.ruolo || currentUserState?.ruolo || '';
    return ruolo.toUpperCase() === 'GUEST' || ruolo.toUpperCase() === 'OSPITE';
  }

  onRegioneChange(): void {
    this.filtro.provincia = '';
    this.filtro.comune = '';
    this.aggiornaElenchiGeografici();
  }

  onProvinciaChange(): void {
    this.filtro.comune = '';
    this.aggiornaElenchiGeografici();
  }

  aggiornaElenchiGeografici(): void {
    let recordsFiltratiPerRegione = this.cer;
    if (this.filtro.regione) {
      recordsFiltratiPerRegione = this.cer.filter(
        (c) => c.regione === this.filtro.regione,
      );
    }
    const provSet = new Set<string>(
      recordsFiltratiPerRegione.map((c) => c.provincia).filter(Boolean),
    );
    this.opzioniProvinceFiltrate = Array.from(provSet).sort();

    let recordsFiltratiPerProvincia = recordsFiltratiPerRegione;
    if (this.filtro.provincia) {
      recordsFiltratiPerProvincia = recordsFiltratiPerRegione.filter(
        (c) => c.provincia === this.filtro.provincia,
      );
    }
    const comSet = new Set<string>(
      recordsFiltratiPerProvincia.map((c) => c.comune).filter(Boolean),
    );
    this.opzioniComuniFiltrati = Array.from(comSet).sort();
  }

  filtraGridLocale(): void {
    this.isFiltering = true;

    const rSocialeLower = this.filtro.ragSociale?.toLowerCase().trim();
    const cFiscLower = this.filtro.codFisc?.toLowerCase().trim();
    const pIvaLower = this.filtro.pIva?.toLowerCase().trim();

    this.listaFiltrata = this.cer.filter((item) => {
      if (
        rSocialeLower &&
        !item.ragSociale?.toLowerCase().includes(rSocialeLower)
      )
        return false;
      if (cFiscLower && !item.codFisc?.toLowerCase().includes(cFiscLower))
        return false;
      if (pIvaLower && !item.pIva?.toLowerCase().includes(pIvaLower))
        return false;
      if (this.filtro.regione && item.regione !== this.filtro.regione)
        return false;
      if (this.filtro.provincia && item.provincia !== this.filtro.provincia)
        return false;
      if (this.filtro.comune && item.comune !== this.filtro.comune)
        return false;
      return true;
    });

    this.dataSource.data = this.listaFiltrata;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
