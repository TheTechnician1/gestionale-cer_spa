import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../core/services/login.service';
import {
  ConfigurazioneCabina,
  GetListaCER,
  ImpiantoCER,
} from '../core/interfaces/user.model';
import { ImpiantoService } from '../core/services/impianto.service';
import { ConfermaPasswordDialogService } from '../core/services/conferma-password-dialog.service';
import { CerService } from '../core/services/cer.service';
import { ConfigurazioneCabinaService } from '../core/services/configurazione-cabina.service';
import { NotificheService } from '../core/services/notifiche.service';

@Component({
  selector: 'app-dettagli-tabella-cer',
  templateUrl: './dettagli-tabella-cer.component.html',
  styleUrls: ['./dettagli-tabella-cer.component.scss'],
})
export class DettagliTabellaCerComponent implements OnInit {
  cer?: GetListaCER;
  configurazioni: ConfigurazioneCabina[] = [];
  impianti: ImpiantoCER[] = [];
  impiantoSelezionato?: ImpiantoCER;
  configurazioneSelezionata?: ConfigurazioneCabina;
  displayedColumnsConfigurazioni: string[] = [
    'idConfig',
    'codiceCabina',
    'annoAttivazione',
    'impianti',
    'azioni',
  ];
  displayedColumnsImpianti: string[] = [
    'codiceCabina',
    'tipologia',
    'dataEsercizio',
    'comune',
    'azioni',
  ];

  constructor(
    private route: ActivatedRoute,
    private login: LoginService,
    private dialog: MatDialog,
    private cerService: CerService,
    private impiantoService: ImpiantoService,
    private configurazioneService: ConfigurazioneCabinaService,
    private confermaPasswordDialog: ConfermaPasswordDialogService,
    private snackBar: MatSnackBar,
    private notificheService: NotificheService
  ) {}

  isAdmin(): boolean {
    return this.login.isGranted() === 'ADMIN';
  }

  statoCer(): string {
    return this.cer ? this.cerService.statoCer(this.cer) : 'Active';
  }

  cerDisattiva(): boolean {
    return this.cer ? this.cerService.cerDisattiva(this.cer) : false;
  }

  puoInserireImpianto(): boolean {
    return this.impiantoService.puoInserire();
  }

  puoInserireConfigurazione(): boolean {
    return this.configurazioneService.puoInserire();
  }

  puoModificareConfigurazione(): boolean {
    return this.configurazioneService.puoModificare();
  }

  puoCancellareConfigurazione(): boolean {
    return this.configurazioneService.puoCancellare();
  }

  puoModificareImpianto(): boolean {
    return this.impiantoService.puoModificare();
  }

  puoCancellareImpianto(): boolean {
    return this.impiantoService.puoCancellare();
  }

  cancellaImpianto(impianto: ImpiantoCER): void {
    if (!impianto.idImpianto || !this.puoCancellareImpianto()) {
      return;
    }

    this.confermaPasswordDialog
      .richiediPassword(
        'Conferma cancellazione impianto',
        'Confermi l eliminazione logica dell impianto? Inserisci la password per procedere.'
      )
      .subscribe((password) => {
        if (!password) {
          return;
        }

        if (!this.impiantoService.passwordSessioneValida(password)) {
          this.mostraMessaggio('Password non corretta.');
          return;
        }

        this.impiantoService.cancella(impianto.idImpianto!).subscribe({
          next: (risposta) => {
            this.impianti = this.impianti.filter(
              (elemento) => elemento.idImpianto !== impianto.idImpianto
            );
            this.mostraMessaggio(risposta || 'Elemento disattivato correttamente.');
          },
          error: (errore) => {
            this.mostraMessaggio(
              errore?.error || 'Errore durante la cancellazione logica dell impianto.'
            );
          },
        });
      });
  }

  cancellaConfigurazione(configurazione: ConfigurazioneCabina): void {
    const idConfig = this.idConfigurazione(configurazione);

    if (!idConfig || !this.puoCancellareConfigurazione()) {
      return;
    }

    if (this.impiantiConfigurazione(configurazione).length > 0) {
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
            this.configurazioni = this.configurazioni.filter(
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

  apriDettaglioConfigurazione(
    configurazione: ConfigurazioneCabina,
    dettaglioConfigurazioneDialog: TemplateRef<unknown>
  ): void {
    const idConfig = this.idConfigurazione(configurazione);
    this.configurazioneSelezionata = configurazione;

    if (!idConfig) {
      this.dialog.open(dettaglioConfigurazioneDialog, {
        width: '760px',
        maxWidth: '95vw',
      });
      return;
    }

    this.configurazioneService.visualizza(idConfig).subscribe({
      next: (dettaglio) => {
        this.configurazioneSelezionata = {
          ...dettaglio,
          impianti: dettaglio.impianti?.length
            ? dettaglio.impianti
            : this.impiantiConfigurazione(configurazione),
        };
        this.dialog.open(dettaglioConfigurazioneDialog, {
          width: '760px',
          maxWidth: '95vw',
        });
      },
      error: () => {
        this.dialog.open(dettaglioConfigurazioneDialog, {
          width: '760px',
          maxWidth: '95vw',
        });
      },
    });
  }

  apriDettaglioImpianto(
    impianto: ImpiantoCER,
    dettaglioImpiantoDialog: TemplateRef<unknown>
  ): void {
    this.impiantoSelezionato = impianto;
    this.dialog.open(dettaglioImpiantoDialog, {
      width: '720px',
      maxWidth: '95vw',
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const cerId = Number(params.get('id'));
      const impiantoId = Number(params.get('impiantoId'));

      if (!cerId) {
        return;
      }

      this.login.visualizzaCer(cerId).subscribe({
        next: (cer) => {
          this.cer = cer;
          this.caricaConfigurazioni(cer);
          this.caricaImpianti(cer, impiantoId);
        },
      });
    });
  }

  comuneImpianto(impianto: ImpiantoCER): string {
    return this.impiantoService.comuneImpianto(impianto);
  }

  provinciaImpianto(impianto: ImpiantoCER): string {
    return this.impiantoService.provinciaImpianto(impianto);
  }

  sitoInstallazione(impianto: ImpiantoCER): string {
    return this.impiantoService.sitoInstallazione(impianto);
  }

  idConfigurazione(configurazione: ConfigurazioneCabina): number | null {
    return this.configurazioneService.idConfigurazione(configurazione);
  }

  statoConfigurazione(configurazione: ConfigurazioneCabina): string {
    return this.configurazioneService.stato(configurazione);
  }

  codiceCabinaConfigurazione(configurazione: ConfigurazioneCabina): string {
    return this.configurazioneService.codiceCabina(configurazione);
  }

  impiantiConfigurazione(configurazione: ConfigurazioneCabina): ImpiantoCER[] {
    return this.impiantoService.impiantiConfigurazione(
      this.idConfigurazione(configurazione),
      this.impianti,
      configurazione.impianti ?? []
    );
  }

  impiantiConfigurazioneSelezionata(): ImpiantoCER[] {
    return this.configurazioneSelezionata
      ? this.impiantiConfigurazione(this.configurazioneSelezionata)
      : [];
  }

  private caricaConfigurazioni(cer: GetListaCER): void {
    this.configurazioneService.ricerca({ idCer: cer.idCer ?? null }).subscribe({
      next: (configurazioni) => {
        this.configurazioneService.arricchisciConDettaglio(configurazioni).subscribe({
          next: (configurazioniDettaglio) => {
            this.configurazioni = configurazioniDettaglio.filter(
              (configurazione) =>
                !this.configurazioneService.configurazioneDisattiva(configurazione)
            );
          },
          error: () => {
            this.configurazioni = configurazioni.filter(
              (configurazione) =>
                !this.configurazioneService.configurazioneDisattiva(configurazione)
            );
          },
        });
      },
      error: () => {
        this.configurazioni = [];
      },
    });
  }

  private caricaImpianti(cer: GetListaCER, impiantoId: number): void {
    this.impiantoService.ricerca({
      partitaIva: cer.partitaIVA,
      regione: cer.regioneLegale,
      provincia: cer.provinciaSedeLegale,
      comune: cer.comuneSedeLegale,
    }).subscribe({
      next: (impianti) => {
        this.impianti = impianti;
        this.impiantoSelezionato = impianti.find(
          (impianto) => impianto.idImpianto === impiantoId
        );
      },
      error: () => {
        this.impianti = [];
      },
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
