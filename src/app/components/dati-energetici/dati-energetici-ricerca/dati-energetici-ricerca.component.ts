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
    // Force backend pagination properties explicitly to uncover hidden constraints
    const searchParams = {
      page: 0,
      size: 100, // Request a massive block size to rule out page clipping
    };

    this.datiEnergeticiService.getDati(searchParams).subscribe({
      next: (risposta: DatiEnergetici[]) => {
        let datiFiltrati = risposta;

        // Apply local filtering cleanly if fields contain input entries
        if (this.filtro.anno) {
          datiFiltrati = datiFiltrati.filter((item) =>
            item.anno?.toString().includes(this.filtro.anno),
          );
        }

        if (this.filtro.statoScheda) {
          const userFiltro = this.filtro.statoScheda.toLowerCase();
          datiFiltrati = datiFiltrati.filter((item) => {
            const backendState = (item as any).statoScheda || '';
            const normalizedState = backendState.toLowerCase();
            if (normalizedState === userFiltro) return true;
            if (userFiltro.includes('attiv') && normalizedState === 'n')
              return true;
            return normalizedState.includes(userFiltro);
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
}
