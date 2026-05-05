import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DatiEnergetici } from '../core/interfaces/user.model';
import { catchError, forkJoin, of } from 'rxjs';
import { CerService } from '../core/services/cer.service';
import { ConfigurazioneCabinaService } from '../core/services/configurazione-cabina.service';
import { ConfermaPasswordDialogService } from '../core/services/conferma-password-dialog.service';
import { DatiEnergeticiService } from '../core/services/dati-energetici.service';
import { NotificheService } from '../core/services/notifiche.service';

@Component({
  selector: 'app-ricerca-dati-energetici',
  templateUrl: './ricerca-dati-energetici.component.html',
  styleUrls: ['./ricerca-dati-energetici.component.scss'],
})
export class RicercaDatiEnergeticiComponent implements OnInit, AfterViewInit {
  formRicerca: FormGroup;
  formModifica: FormGroup;
  dataSource = new MatTableDataSource<DatiEnergetici>();
  datiSelezionati?: DatiEnergetici;
  datiInModifica?: DatiEnergetici;
  caricamento = false;
  ricercaEseguita = false;

  readonly statiScheda = ['Active', 'Disabled'];
  readonly nomiCer = new Map<number, string>();
  readonly codiciCabina = new Map<number, string>();
  readonly displayedColumns = [
    'idDati',
    'cer',
    'configurazione',
    'anno',
    'prodotta',
    'condivisa',
    'riduzioneCo2',
    'stato',
    'azioni',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private datiEnergeticiService: DatiEnergeticiService,
    private cerService: CerService,
    private configurazioneService: ConfigurazioneCabinaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private confermaPasswordDialog: ConfermaPasswordDialogService,
    private notificheService: NotificheService
  ) {
    this.formRicerca = this.datiEnergeticiService.creaFormRicerca();
    this.formModifica = this.datiEnergeticiService.creaFormDatiEnergetici();
    Object.values(this.formModifica.controls).forEach((control) => {
      control.clearValidators();
      control.updateValueAndValidity({ emitEvent: false });
    });
  }

  ngOnInit(): void {
    this.cerca();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cerca(): void {
    const payload = this.datiEnergeticiService.normalizzaRicerca(this.formRicerca);
    this.caricamento = true;
    this.ricercaEseguita = false;

    this.datiEnergeticiService.ricerca(payload).subscribe({
      next: (risultati) => {
        this.dataSource.data = this.datiEnergeticiService.filtraAttivi(risultati);
        this.caricaRiferimenti(this.dataSource.data);
        this.dataSource.paginator?.firstPage();
        this.caricamento = false;
        this.ricercaEseguita = true;
      },
      error: (errore) => {
        this.dataSource.data = [];
        this.caricamento = false;
        this.ricercaEseguita = true;
        this.mostraMessaggio(errore?.error || 'Errore durante la ricerca dei dati energetici.');
      },
    });
  }

  resetFiltri(): void {
    this.formRicerca.reset({
      daAnno: '',
      getaAnno: '',
      partitaIva: '',
      codiceCabina: '',
      stato: '',
    });
    this.cerca();
  }

  apriDettaglio(dati: DatiEnergetici, template: TemplateRef<unknown>): void {
    this.datiSelezionati = dati;
    this.dialog.open(template, {
      width: '820px',
      maxWidth: '95vw',
    });
  }

  cancella(dati: DatiEnergetici): void {
    const idDati = this.datiEnergeticiService.idDati(dati);

    if (!idDati || !this.puoCancellare()) {
      return;
    }

    this.confermaPasswordDialog
      .richiediPassword(
        'Conferma cancellazione dati energetici',
        'Confermi la disattivazione della scheda energetica? Inserisci la password per procedere.'
      )
      .subscribe((password) => {
        if (!password) {
          return;
        }

        if (!this.datiEnergeticiService.passwordSessioneValida(password)) {
          this.mostraMessaggio('Password non corretta.');
          return;
        }

        this.datiEnergeticiService.cancella(idDati).subscribe({
          next: (risposta) => {
            this.dataSource.data = this.dataSource.data.filter(
              (elemento) => this.datiEnergeticiService.idDati(elemento) !== idDati
            );
            this.notificheService.notificaAdmin(
              'Dati energetici cancellati',
              `Disattivata scheda energetica ${idDati}.`
            );
            this.mostraMessaggio(risposta || 'Scheda energetica disattivata correttamente.');
          },
          error: (errore) => {
            this.mostraMessaggio(
              errore?.error || 'Errore durante la cancellazione della scheda energetica.'
            );
          },
        });
      });
  }

  apriModifica(dati: DatiEnergetici, template: TemplateRef<unknown>): void {
    this.datiInModifica = dati;
    this.datiEnergeticiService.popolaForm(this.formModifica, dati);
    this.dialog.open(template, { width: '980px', maxWidth: '95vw' });
  }

  salvaModifica(): void {
    if (this.formModifica.invalid) {
      this.formModifica.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.');
      return;
    }

    const payload = this.datiEnergeticiService.normalizzaSalvataggio(this.formModifica);
    this.datiEnergeticiService.modifica(payload).subscribe({
      next: (risposta) => {
        this.dataSource.data = this.dataSource.data.map((dati) =>
          dati.idDati === payload.idDati ? { ...dati, ...payload } : dati
        );
        this.dialog.closeAll();
        this.notificheService.notificaAdmin(
          'Dati energetici modificati',
          `Modificata scheda energetica ${payload.idDati}.`
        );
        this.mostraMessaggio(risposta || 'Scheda energetica modificata correttamente.');
      },
      error: (errore) => {
        this.mostraMessaggio(errore?.error || 'Errore durante la modifica dei dati energetici.');
      },
    });
  }

  puoInserire(): boolean {
    return this.datiEnergeticiService.puoInserire();
  }

  puoModificare(): boolean {
    return this.datiEnergeticiService.puoModificare();
  }

  puoCancellare(): boolean {
    return this.datiEnergeticiService.puoCancellare();
  }

  statoDati(dati: DatiEnergetici): string {
    return this.datiEnergeticiService.statoDati(dati);
  }

  ragioneSocialeCer(dati: DatiEnergetici): string {
    return this.nomiCer.get(dati.idCer) || String(dati.idCer || '-');
  }

  codiceCabinaConfigurazione(dati: DatiEnergetici): string {
    return (
      dati.codiceCabina ||
      this.codiciCabina.get(dati.idConfigurazione) ||
      String(dati.idConfigurazione || '-')
    );
  }

  private caricaRiferimenti(datiEnergetici: DatiEnergetici[]): void {
    const idCer = Array.from(new Set(datiEnergetici.map((dati) => dati.idCer).filter(Boolean)));
    const idConfigurazioni = Array.from(
      new Set(datiEnergetici.map((dati) => dati.idConfigurazione).filter(Boolean))
    );

    idCer.forEach((id) => {
      if (!this.nomiCer.has(id)) {
        this.cerService.visualizzaCer(id, false).pipe(catchError(() => of(null))).subscribe((cer) => {
          if (cer?.ragioneSociale) {
            this.nomiCer.set(id, cer.ragioneSociale);
          }
        });
      }
    });

    if (idConfigurazioni.length === 0) {
      return;
    }

    forkJoin(
      idConfigurazioni.map((id) =>
        this.configurazioneService.visualizza(id, false).pipe(catchError(() => of(null)))
      )
    ).subscribe((configurazioni) => {
      configurazioni.forEach((configurazione) => {
        if (!configurazione) {
          return;
        }

        const id = this.configurazioneService.idConfigurazione(configurazione);
        const codice = this.configurazioneService.codiceCabina(configurazione);
        if (id && codice) {
          this.codiciCabina.set(id, codice);
        }
      });
    });
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

}
