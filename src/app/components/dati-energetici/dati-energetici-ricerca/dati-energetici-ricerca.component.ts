import { Component, ViewChild, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { DatiEnergeticiService } from '../../services/dati-energetici.service';
import { MatTableDataSource } from '@angular/material/table';
import { DatiEnergetici } from 'src/app/core/interfaces/dati-energetici.model';
import { MatDialog } from '@angular/material/dialog';
import { ConfermaDialogComponent } from '../dialog/dialog.component';
@Component({
  selector: 'app-dati-energetici-ricerca',
  templateUrl: './dati-energetici-ricerca.component.html',
  styleUrls: ['./dati-energetici-ricerca.component.scss'],
})
export class DatiEnergeticiRicercaComponent {
  constructor(
    private datiEnergeticiService: DatiEnergeticiService,
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
    this.datiEnergeticiService.getDati({}).subscribe({
      next: (risposta: DatiEnergetici[]) => {
        let datiFiltrati = risposta;

        if (this.filtro.anno) {
          datiFiltrati = datiFiltrati.filter((item) =>
            item.anno?.toString().includes(this.filtro.anno),
          );
        }

        if (this.filtro.statoScheda) {
          datiFiltrati = datiFiltrati.filter((item) =>
            item.flgCancellazione
              ?.toLowerCase()
              .includes(this.filtro.statoScheda.toLowerCase()),
          );
        }

        this.dati = datiFiltrati;
        this.dataSource.data = [...this.dati];
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

  eliminaDatiLogicamente(element: DatiEnergetici) {
    if (!element.idDati) return;

    const dialogRef = this.dialog.open(ConfermaDialogComponent, {
      width: '400px',
      data: { anno: element.anno },
    });

    dialogRef.afterClosed().subscribe((confermato: boolean) => {
      if (confermato) {
        this.datiEnergeticiService
          .deleteDatiEnergetici(element.idDati!)
          .subscribe(() => {
            this.caricaDati();

            if (
              this.mostraForm &&
              this.recordSelezionato?.idDati === element.idDati
            ) {
              this.mostraForm = false;
            }
          });
      }
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
