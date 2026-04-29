import { AfterViewInit, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigurazioneCabina, ImpiantoCER } from '../core/interfaces/user.model';
import { ConfigurazioneCabinaService } from '../core/services/configurazione-cabina.service';
import { ConfermaPasswordDialogService } from '../core/services/conferma-password-dialog.service';
import { NotificheService } from '../core/services/notifiche.service';

@Component({
  selector: 'app-ricerca-configurazioni',
  templateUrl: './ricerca-configurazioni.component.html',
  styleUrls: ['./ricerca-configurazioni.component.scss'],
})
export class RicercaConfigurazioniComponent implements OnInit, AfterViewInit {
  formRicerca: FormGroup;
  formModifica: FormGroup;
  dataSource = new MatTableDataSource<ConfigurazioneCabina>();
  configurazioneSelezionata?: ConfigurazioneCabina;
  configurazioneInModifica?: ConfigurazioneCabina;
  caricamento = false;
  ricercaEseguita = false;

  readonly displayedColumns = [
    'idConfig',
    'idCer',
    'codiceCabina',
    'annoAttivazione',
    'stato',
    'azioni',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private configurazioneService: ConfigurazioneCabinaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private confermaPasswordDialog: ConfermaPasswordDialogService,
    private notificheService: NotificheService
  ) {
    this.formRicerca = this.configurazioneService.creaFormRicerca();
    this.formModifica = this.configurazioneService.creaFormConfigurazione();
  }

  ngOnInit(): void {
    this.cerca();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cerca(): void {
    const payload = this.configurazioneService.normalizzaRicerca(this.formRicerca);

    this.caricamento = true;
    this.ricercaEseguita = false;

    this.configurazioneService.ricerca(payload).subscribe({
      next: (risultati) => {
        this.configurazioneService.arricchisciConDettaglio(risultati).subscribe({
          next: (configurazioni) => {
            this.dataSource.data = configurazioni.filter(
              (configurazione) =>
                !this.configurazioneService.configurazioneDisattiva(configurazione)
            );
            this.dataSource.paginator?.firstPage();
            this.caricamento = false;
            this.ricercaEseguita = true;
          },
          error: () => {
            this.dataSource.data = risultati.filter(
              (configurazione) =>
                !this.configurazioneService.configurazioneDisattiva(configurazione)
            );
            this.dataSource.paginator?.firstPage();
            this.caricamento = false;
            this.ricercaEseguita = true;
          },
        });
      },
      error: (errore) => {
        this.dataSource.data = [];
        this.caricamento = false;
        this.ricercaEseguita = true;
        this.mostraMessaggio(
          errore?.error || 'Errore durante la ricerca delle configurazioni.'
        );
      },
    });
  }

  resetFiltri(): void {
    this.formRicerca.reset({
      idConfig: null,
      idCer: null,
      codiceCabina: '',
      annoAttivazione: null,
    });
    this.cerca();
  }

  apriDettaglio(
    configurazione: ConfigurazioneCabina,
    template: TemplateRef<unknown>
  ): void {
    const idConfig = this.idConfigurazione(configurazione);
    this.configurazioneSelezionata = configurazione;

    if (!idConfig) {
      this.dialog.open(template, { width: '820px', maxWidth: '95vw' });
      return;
    }

    this.configurazioneService.visualizza(idConfig).subscribe({
      next: (dettaglio) => {
        this.configurazioneSelezionata = dettaglio;
        this.dialog.open(template, { width: '820px', maxWidth: '95vw' });
      },
      error: () => {
        this.dialog.open(template, { width: '820px', maxWidth: '95vw' });
      },
    });
  }

  cancella(configurazione: ConfigurazioneCabina): void {
    const idConfig = this.idConfigurazione(configurazione);

    if (!idConfig || !this.puoCancellare()) {
      return;
    }

    if ((configurazione.impianti?.length ?? 0) > 0) {
      this.mostraMessaggio(
        'La configurazione ha impianti associati. Gestisci prima gli impianti collegati.'
      );
      return;
    }

    this.confermaPasswordDialog
      .richiediPassword(
        'Conferma cancellazione configurazione',
        'Confermi la disattivazione della configurazione? Inserisci la password per procedere.'
      )
      .subscribe((password) => {
        if (!password) {
          return;
        }

        if (!this.configurazioneService.passwordSessioneValida(password)) {
          this.mostraMessaggio('Password non corretta.');
          return;
        }

        this.configurazioneService.cancella(idConfig).subscribe({
          next: (risposta) => {
            this.dataSource.data = this.dataSource.data.filter(
              (elemento) => this.idConfigurazione(elemento) !== idConfig
            );
            this.notificheService.notificaAdmin(
              'Configurazione cancellata',
              `Disattivata configurazione ${idConfig}.`
            );
            this.mostraMessaggio(risposta || 'Configurazione disattivata correttamente.');
          },
          error: (errore) => {
            this.mostraMessaggio(
              errore?.error ||
                'Errore durante la cancellazione logica della configurazione.'
            );
          },
        });
      });
  }

  apriModifica(configurazione: ConfigurazioneCabina, template: TemplateRef<unknown>): void {
    this.configurazioneInModifica = configurazione;
    this.configurazioneService.popolaForm(this.formModifica, configurazione);
    this.dialog.open(template, { width: '760px', maxWidth: '95vw' });
  }

  salvaModifica(): void {
    if (this.formModifica.invalid) {
      this.formModifica.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.');
      return;
    }

    const payload = this.configurazioneService.normalizzaSalvataggio(this.formModifica);
    this.configurazioneService.modifica(payload).subscribe({
      next: (risposta) => {
        const aggiornata = {
          ...this.configurazioneInModifica,
          ...payload,
        } as ConfigurazioneCabina;

        this.dataSource.data = this.dataSource.data.map((configurazione) =>
          this.idConfigurazione(configurazione) === payload.idConfig ? aggiornata : configurazione
        );
        this.dialog.closeAll();
        this.notificheService.notificaAdmin(
          'Configurazione modificata',
          `Modificata configurazione ${payload.idConfig}.`
        );
        this.mostraMessaggio(risposta || 'Configurazione modificata correttamente.');
      },
      error: (errore) => {
        this.mostraMessaggio(errore?.error || 'Errore durante la modifica della configurazione.');
      },
    });
  }

  puoInserire(): boolean {
    return this.configurazioneService.puoInserire();
  }

  puoModificare(): boolean {
    return this.configurazioneService.puoModificare();
  }

  puoCancellare(): boolean {
    return this.configurazioneService.puoCancellare();
  }

  idConfigurazione(configurazione: ConfigurazioneCabina): number | null {
    return this.configurazioneService.idConfigurazione(configurazione);
  }

  idCerConfigurazione(configurazione: ConfigurazioneCabina): number | null {
    return configurazione.idCer ?? configurazione.cer?.idCer ?? null;
  }

  stato(configurazione: ConfigurazioneCabina): string {
    return this.configurazioneService.stato(configurazione);
  }

  codiceCabina(configurazione: ConfigurazioneCabina): string {
    return this.configurazioneService.codiceCabina(configurazione);
  }

  impianti(configurazione: ConfigurazioneCabina): ImpiantoCER[] {
    return configurazione.impianti ?? [];
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
