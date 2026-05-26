import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatiEnergetici } from 'src/app/core/interfaces/dati-energetici.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfermaDialogComponent } from '../dialog/dialog.component';
import { UtenteService } from 'src/app/core/services/utente.service';
import { ToastService } from 'src/app/core/services/toast.service';

@Component({
  selector: 'app-dati-energetici-ricerca',
  templateUrl: './dati-energetici-ricerca.component.html',
  styleUrls: ['./dati-energetici-ricerca.component.scss'],
})
export class DatiEnergeticiRicercaComponent {
  constructor(
    private datiEnergeticiService: DatiEnergeticiService,
    private toast: ToastService,
    private utenteService: UtenteService,
    private dialog: MatDialog,
  ) {}

  tableDati: string[] = [
    'anno',
    'energiaPrelevata',
    'energiaProdotta',
    'energiaImmessa',
    'energiaCondivisa',
    'ridEmCo2',
    'azioni',
  ];

  dati: any[] = [];

  dataSource = new MatTableDataSource(this.dati);
  listaFiltrata: any[] = [];
  //sortedData: any[] | undefined;

  filtro = {
    anno: '',
    statoScheda: '',
    idCer: '',
    idConfigurazione: '',
  };

  mostraForm: boolean = false;
  visualizzazioneSolaLettura: boolean = false;
  recordSelezionato!: DatiEnergetici;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit() {
    this.caricaDati();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  // caricaDati() {
  //   this.datiEnergeticiService.getDati(this.filtro).subscribe({
  //     next: (risposta: DatiEnergetici[]) => {
  //       this.dati = risposta;
  //       this.dataSource.data = [...this.dati];
  //     },
  //     //error: (error) => { console.error("Login error", error); }
  //   });
  // }

  caricaDati() {
    const searchParams = {
      page: 0,
      size: 100,
    };

    this.datiEnergeticiService.getDati(searchParams).subscribe({
      next: (risposta: DatiEnergetici[] | any[]) => {
        let datiFiltrati = [...risposta];

        if (!this.filtro.statoScheda || this.filtro.statoScheda.trim() === '') {
          datiFiltrati = datiFiltrati.filter((item) => {
            const flag = item.flgCancellazione || item.flgCancellato || 'N';
            const stato = item.statoScheda || '';

            return (
              flag.toUpperCase().trim() !== 'S' &&
              !stato.toUpperCase().includes('CANC')
            );
          });
        }

        if (this.filtro.anno && this.filtro.anno.trim() !== '') {
          const targetAnno = this.filtro.anno.toString().trim();
          datiFiltrati = datiFiltrati.filter((item) => {
            const valAnno = item.anno || item.annoRiferimento || '';
            return valAnno.toString().trim().includes(targetAnno);
          });
        }

        if (this.filtro.statoScheda && this.filtro.statoScheda.trim() !== '') {
          const userFiltro = this.filtro.statoScheda.toLowerCase().trim();
          datiFiltrati = datiFiltrati.filter((item) => {
            const backendState =
              item.flgCancellazione || item.statoScheda || 'N';
            const normalizedState = backendState.toLowerCase().trim();

            if (normalizedState === userFiltro) return true;
            if (userFiltro.includes('attiv') && normalizedState === 'n')
              return true;
            if (userFiltro.includes('canc') && normalizedState === 's')
              return true;
            return normalizedState.includes(userFiltro);
          });
        }

        if (this.filtro.idCer) {
          const targetCer = this.filtro.idCer.toString().trim();
          datiFiltrati = datiFiltrati.filter((item) => {
            const valCer = item.idCer || item.idDatiCer || '';
            return valCer.toString().trim().includes(targetCer);
          });
        }

        if (this.filtro.idConfigurazione) {
          const targetConfig = this.filtro.idConfigurazione.toString().trim();
          datiFiltrati = datiFiltrati.filter((item) => {
            const valConfig = item.idConfigurazione || item.idConfig || '';
            return valConfig.toString().trim().includes(targetConfig);
          });
        }

        this.dati = datiFiltrati;
        this.dataSource.data = this.dati;

        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
        }
      },
      error: (err) => {
        console.error('Errore griglia dati energetici:', err);
      },
    });
  }

  resetFiltri(): void {
    this.filtro = {
      anno: '',
      statoScheda: '',
      idCer: '',
      idConfigurazione: '',
    };
    this.caricaDati();
  }

  apriDettaglio(element: DatiEnergetici) {
    this.recordSelezionato = { ...element };
    this.visualizzazioneSolaLettura = true;
    this.mostraForm = true;
  }

  apriModifica(element: DatiEnergetici) {
    this.recordSelezionato = { ...element };
    this.visualizzazioneSolaLettura = false;
    this.mostraForm = true;
  }

  chiudiForm() {
    this.mostraForm = false;
    this.caricaDati();
  }

  eliminaDatiLogicamente(element: any): void {
    const dialogRef = this.dialog.open(ConfermaDialogComponent, {
      width: '350px',
      data: {
        titolo: 'Conferma Cancellazione',
        messaggio: `Sei sicuro di voler eliminare il record per l'anno ${element.anno}?`,
      },
    });

    dialogRef.afterClosed().subscribe((confermato: boolean) => {
      if (!confermato) {
        return;
      }

      const currentUserState = this.utenteService.currentUser;
      const emailLoggato =
        currentUserState?.utente?.mail || currentUserState?.mail || '';

      if (!emailLoggato) {
        this.toast.error(
          'Impossibile procedere: Email utente loggato non trovata.',
        );
        return;
      }

      this.datiEnergeticiService
        .deleteDatiEnergetici(element.idDati!, emailLoggato)
        .subscribe({
          next: () => {
            this.toast.success('Record disattivato con successo!');
            this.caricaDati();
          },
          error: (err) => {
            console.error(err);
            this.toast.error('Errore durante la cancellazione del record');
          },
        });
    });
  }

  apriNuovo() {
    this.recordSelezionato = {
      idDati: undefined,
      anno: '',
      eProdotta: 0,
      ePrelevata: 0,
      eImmessa: 0,
      eCondivisa: 0,
      eAutoCons: 0,
      statoScheda: 'ATTIVO',
      flgCancellazione: 'N',
    } as unknown as DatiEnergetici;

    this.visualizzazioneSolaLettura = false;
    this.mostraForm = true;
  }

  get isMockMode(): boolean {
    return this.datiEnergeticiService.USE_MOCK_DATA;
  }

  toggleMockMode(): void {
    this.datiEnergeticiService.USE_MOCK_DATA =
      !this.datiEnergeticiService.USE_MOCK_DATA;
    this.caricaDati();
  }

  get isGuest(): boolean {
    const currentUserState = this.utenteService.currentUser;
    const ruolo =
      currentUserState?.utente?.ruolo || currentUserState?.ruolo || '';
    return ruolo.toUpperCase() === 'GUEST' || ruolo.toUpperCase() === 'OSPITE';
  }
}
