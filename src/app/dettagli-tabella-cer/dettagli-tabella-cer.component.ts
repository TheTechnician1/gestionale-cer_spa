import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { LoginService } from '../core/services/login.service';
import {
  ConfigurazioneCabina,
  DatiEnergetici,
  GetListaCER,
  ImpiantoCER,
} from '../core/interfaces/user.model';
import { ImpiantoService } from '../core/services/impianto.service';
import { ConfermaPasswordDialogService } from '../core/services/conferma-password-dialog.service';
import { CerService } from '../core/services/cer.service';
import { ConfigurazioneCabinaService } from '../core/services/configurazione-cabina.service';
import { NotificheService } from '../core/services/notifiche.service';
import { DatiEnergeticiService } from '../core/services/dati-energetici.service';

@Component({
  selector: 'app-dettagli-tabella-cer',
  templateUrl: './dettagli-tabella-cer.component.html',
  styleUrls: ['./dettagli-tabella-cer.component.scss'],
})
export class DettagliTabellaCerComponent implements OnInit {
  cer?: GetListaCER;
  configurazioni: ConfigurazioneCabina[] = [];
  impianti: ImpiantoCER[] = [];
  datiEnergetici: DatiEnergetici[] = [];
  impiantoSelezionato?: ImpiantoCER;
  configurazioneSelezionata?: ConfigurazioneCabina;
  dettaglioDisattivata = false;
  displayedColumnsConfigurazioni: string[] = [
    'codiceCabina',
    'annoAttivazione',
    'impianti',
    'datiEnergetici',
    'azioni',
  ];
  displayedColumnsImpianti: string[] = [
    'codiceCabina',
    'tipologia',
    'dataEsercizio',
    'comune',
    'azioni',
  ];
  @ViewChild('dettaglioConfigurazioneDialog')
  dettaglioConfigurazioneDialog?: TemplateRef<unknown>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private login: LoginService,
    private dialog: MatDialog,
    private cerService: CerService,
    private impiantoService: ImpiantoService,
    private configurazioneService: ConfigurazioneCabinaService,
    private datiEnergeticiService: DatiEnergeticiService,
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
      const configurazioneId = Number(this.route.snapshot.queryParamMap.get('configurazioneId'));

      if (!cerId) {
        return;
      }

      this.dettaglioDisattivata = this.router.url.startsWith('/cer/disattivate/');

      if (this.dettaglioDisattivata) {
        const cerDaNavigazione = history.state?.cer as GetListaCER | undefined;

        if (cerDaNavigazione?.idCer === cerId) {
          this.cer = cerDaNavigazione;
          this.configurazioni = [];
          this.impianti = [];
          this.datiEnergetici = [];
        }

        return;
      }

      if (impiantoId) {
        this.caricaDettaglioDaImpianto(
          impiantoId,
          cerId,
          configurazioneId
        );
        return;
      }

      this.login.visualizzaCer(cerId).subscribe({
        next: (cer) => {
          this.cer = cer;
          this.caricaDatiEnergetici(cer);
          this.caricaConfigurazioni(cer, impiantoId, configurazioneId);
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

  datiEnergeticiConfigurazione(configurazione: ConfigurazioneCabina): DatiEnergetici[] {
    const datiConfigurazione = configurazione.datiEnergetici?.length
      ? configurazione.datiEnergetici
      : this.datiEnergetici;

    return this.datiEnergeticiService.datiConfigurazione(
      this.idConfigurazione(configurazione),
      datiConfigurazione,
      this.cer?.idCer ?? null
    );
  }

  impiantiConfigurazioneSelezionata(): ImpiantoCER[] {
    return this.configurazioneSelezionata
      ? this.impiantiConfigurazione(this.configurazioneSelezionata)
      : [];
  }

  private caricaConfigurazioni(
    cer: GetListaCER,
    impiantoId: number,
    configurazioneIdDaAprire: number
  ): void {
    this.configurazioneService.ricerca({ idCer: cer.idCer ?? null }).subscribe({
      next: (configurazioni) => {
        const configurazioniCer = this.filtraConfigurazioniCer(configurazioni, cer.idCer ?? null);

        this.configurazioneService.arricchisciConDettaglio(configurazioniCer).subscribe({
          next: (configurazioniDettaglio) => {
            this.configurazioni = this.filtraConfigurazioniCer(
              configurazioniDettaglio,
              cer.idCer ?? null
            ).filter(
              (configurazione) =>
                !this.configurazioneService.configurazioneDisattiva(configurazione)
            );
            this.apriConfigurazioneDaQuery(configurazioneIdDaAprire);
            this.caricaImpianti(cer, impiantoId);
          },
          error: () => {
            this.configurazioni = configurazioniCer.filter(
              (configurazione) =>
                !this.configurazioneService.configurazioneDisattiva(configurazione)
            );
            this.apriConfigurazioneDaQuery(configurazioneIdDaAprire);
            this.caricaImpianti(cer, impiantoId);
          },
        });
      },
      error: () => {
        this.configurazioni = [];
        this.caricaImpianti(cer, impiantoId);
      },
    });
  }

  private caricaImpianti(cer: GetListaCER, impiantoId: number): void {
    const idImpianti = this.idImpiantiDaConfigurazioni(impiantoId);

    if (idImpianti.length === 0) {
      this.impianti = [];
      return;
    }

    forkJoin(
      idImpianti.map((id) =>
        this.caricaImpiantoConConfigurazione(id).pipe(
          catchError(() => of(null))
        )
      )
    ).subscribe({
      next: (impianti) => {
        this.impianti = this.filtraImpiantiCer(
          impianti.filter((impianto): impianto is ImpiantoCER => !!impianto),
          cer
        );
        this.impiantoSelezionato = this.impianti.find(
          (impianto) => impianto.idImpianto === impiantoId
        );
      },
      error: () => {
        this.impianti = [];
      },
    });
  }

  private caricaDettaglioDaImpianto(
    impiantoId: number,
    cerIdFallback: number,
    configurazioneIdDaAprire: number
  ): void {
    this.impiantoService.visualizza(impiantoId).pipe(
      switchMap((impianto) => {
        const idConfigurazione = this.impiantoService.idConfigurazioneImpianto(impianto);

        if (!idConfigurazione) {
          return this.login.visualizzaCer(cerIdFallback).pipe(
            map((cer) => ({ cer, impianto, configurazioneId: configurazioneIdDaAprire }))
          );
        }

        return this.configurazioneService.visualizza(idConfigurazione).pipe(
          switchMap((configurazione) => {
            const idCer = configurazione.idCer ?? configurazione.cer?.idCer ?? cerIdFallback;

            return this.login.visualizzaCer(idCer).pipe(
              map((cer) => ({
                cer,
                impianto: {
                  ...impianto,
                  idConfigurazione,
                  configurazione,
                },
                configurazioneId: configurazioneIdDaAprire,
              }))
            );
          })
        );
      })
    ).subscribe({
      next: ({ cer, impianto, configurazioneId }) => {
        this.cer = cer;
        this.impiantoSelezionato = impianto;
        this.caricaDatiEnergetici(cer);
        this.caricaConfigurazioni(cer, impiantoId, configurazioneId);
      },
      error: () => {
        this.login.visualizzaCer(cerIdFallback).subscribe({
          next: (cer) => {
            this.cer = cer;
            this.caricaDatiEnergetici(cer);
            this.caricaConfigurazioni(cer, impiantoId, configurazioneIdDaAprire);
          },
        });
      },
    });
  }

  private caricaDatiEnergetici(cer: GetListaCER): void {
    this.datiEnergeticiService.ricerca({ partitaIva: cer.partitaIVA }).subscribe({
      next: (datiEnergetici) => {
        this.datiEnergetici = this.datiEnergeticiService
          .filtraAttivi(datiEnergetici)
          .filter((dati) => dati.idCer === cer.idCer);
      },
      error: () => {
        this.datiEnergetici = [];
      },
    });
  }

  private filtraConfigurazioniCer(
    configurazioni: ConfigurazioneCabina[],
    idCer: number | null
  ): ConfigurazioneCabina[] {
    if (!idCer) {
      return configurazioni;
    }

    return configurazioni.filter(
      (configurazione) =>
        configurazione.idCer === idCer || configurazione.cer?.idCer === idCer
    );
  }

  private filtraImpiantiCer(impianti: ImpiantoCER[], cer: GetListaCER): ImpiantoCER[] {
    const idConfigurazioni = new Set(
      this.configurazioni
        .map((configurazione) => this.idConfigurazione(configurazione))
        .filter((id): id is number => !!id)
    );

    return impianti.filter((impianto) => {
      const idConfigurazione = this.impiantoService.idConfigurazioneImpianto(impianto);
      const stessaConfigurazione = !!idConfigurazione && idConfigurazioni.has(idConfigurazione);
      const stessaPartitaIva = impianto.partitaIva === cer.partitaIVA;

      return stessaConfigurazione || stessaPartitaIva;
    });
  }

  private idImpiantiDaConfigurazioni(impiantoId: number): number[] {
    const idImpianti = this.configurazioni.flatMap((configurazione) =>
      (configurazione.impianti ?? [])
        .map((impianto) => impianto.idImpianto)
        .filter((id): id is number => !!id)
    );

    if (impiantoId) {
      idImpianti.push(impiantoId);
    }

    return Array.from(new Set(idImpianti));
  }

  private caricaImpiantoConConfigurazione(
    idImpianto: number
  ): Observable<ImpiantoCER | null> {
    return this.impiantoService.visualizza(idImpianto).pipe(
      switchMap((impianto) => {
        const idConfigurazione = this.impiantoService.idConfigurazioneImpianto(impianto);

        if (!idConfigurazione) {
          return of(impianto);
        }

        return this.configurazioneService.visualizza(idConfigurazione, false).pipe(
          map((configurazione) => ({
            ...impianto,
            idConfigurazione,
            configurazione,
          })),
          catchError(() => of(impianto))
        );
      })
    );
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  private apriConfigurazioneDaQuery(configurazioneId: number): void {
    if (!configurazioneId || !this.dettaglioConfigurazioneDialog) {
      return;
    }

    const configurazione = this.configurazioni.find(
      (item) => this.idConfigurazione(item) === configurazioneId
    );

    if (!configurazione) {
      return;
    }

    setTimeout(() =>
      this.apriDettaglioConfigurazione(
        configurazione,
        this.dettaglioConfigurazioneDialog as TemplateRef<unknown>
      )
    );
  }
}
