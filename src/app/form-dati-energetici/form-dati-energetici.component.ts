import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DatiEnergeticiService } from '../core/services/dati-energetici.service';
import { NotificheService } from '../core/services/notifiche.service';
import { ConfigurazioneCabina, GetListaCER } from '../core/interfaces/user.model';
import { CerService } from '../core/services/cer.service';
import { ConfigurazioneCabinaService } from '../core/services/configurazione-cabina.service';

@Component({
  selector: 'app-form-dati-energetici',
  templateUrl: './form-dati-energetici.component.html',
  styleUrls: ['./form-dati-energetici.component.scss'],
})
export class FormDatiEnergeticiComponent implements OnInit {
  formDatiEnergetici: FormGroup;
  idDati: number | null = null;
  salvataggioInCorso = false;
  caricamento = false;
  cerDisponibili: GetListaCER[] = [];
  configurazioniDisponibili: ConfigurazioneCabina[] = [];

  readonly statiScheda = ['Active', 'Disabled'];

  constructor(
    private datiEnergeticiService: DatiEnergeticiService,
    private cerService: CerService,
    private configurazioneService: ConfigurazioneCabinaService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private notificheService: NotificheService
  ) {
    this.formDatiEnergetici = this.datiEnergeticiService.creaFormDatiEnergetici();
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.idDati = id || null;
    this.configuraCalcoloAutomaticoCo2();
    this.caricaCerDisponibili();
    this.caricaConfigurazioniDisponibili();

    if (!this.idDati) {
      return;
    }

    this.caricamento = true;
    this.datiEnergeticiService.visualizza(this.idDati).subscribe({
      next: (dati) => {
        this.datiEnergeticiService.popolaForm(this.formDatiEnergetici, dati);
        this.caricaConfigurazioniDisponibili(dati.idCer);
        this.caricamento = false;
      },
      error: (errore) => {
        this.caricamento = false;
        this.mostraMessaggio(errore?.error || 'Scheda energetica non trovata.');
        this.router.navigateByUrl('/dati-energetici');
      },
    });
  }

  get modifica(): boolean {
    return !!this.idDati;
  }

  get titolo(): string {
    return this.modifica ? 'Modifica dati energetici' : 'Nuovi dati energetici annuali';
  }

  inviaModulo(): void {
    if (this.formDatiEnergetici.get('calcoloCo2Automatico')?.value) {
      this.aggiornaRiduzioneCo2();
    }

    if (this.formDatiEnergetici.invalid) {
      this.formDatiEnergetici.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.');
      return;
    }

    if (!this.modifica && !this.datiEnergeticiService.puoInserire()) {
      this.mostraMessaggio('Non hai i permessi per inserire dati energetici.');
      return;
    }

    if (this.modifica && !this.datiEnergeticiService.puoModificare()) {
      this.mostraMessaggio('Non hai i permessi per modificare dati energetici.');
      return;
    }

    this.salvataggioInCorso = true;
    const payload = this.datiEnergeticiService.normalizzaSalvataggio(this.formDatiEnergetici);
    const richiesta = this.modifica
      ? this.datiEnergeticiService.modifica(payload)
      : this.datiEnergeticiService.inserisci(payload);

    richiesta.subscribe({
      next: (risposta) => {
        this.salvataggioInCorso = false;
        this.notificheService.notificaAdmin(
          this.modifica ? 'Dati energetici modificati' : 'Dati energetici inseriti',
          `${this.modifica ? 'Modificata' : 'Inserita'} scheda energetica ${payload.anno} per configurazione ${payload.idConfigurazione}.`
        );
        this.mostraMessaggio(risposta || 'Operazione completata con successo.');
        this.router.navigateByUrl('/dati-energetici');
      },
      error: (errore) => {
        this.salvataggioInCorso = false;
        this.mostraMessaggio(errore?.error || 'Errore durante il salvataggio dei dati energetici.');
      },
    });
  }

  campo(nome: string): FormControl {
    return this.formDatiEnergetici.get(nome) as FormControl;
  }

  configurazioniFiltrate(): ConfigurazioneCabina[] {
    const idCer = Number(this.campo('idCer').value);

    if (!idCer) {
      return this.configurazioniDisponibili;
    }

    return this.configurazioniDisponibili.filter(
      (configurazione) =>
        configurazione.idCer === idCer || configurazione.cer?.idCer === idCer
    );
  }

  codiceCabinaConfigurazione(configurazione: ConfigurazioneCabina): string {
    return this.configurazioneService.codiceCabina(configurazione);
  }

  idConfigurazione(configurazione: ConfigurazioneCabina): number | null {
    return this.configurazioneService.idConfigurazione(configurazione);
  }

  aggiornaCerSelezionata(idCer: number): void {
    this.formDatiEnergetici.patchValue({
      idCer,
      idConfigurazione: null,
      codiceCabina: '',
    });
    this.caricaConfigurazioniDisponibili(idCer);
  }

  aggiornaConfigurazioneSelezionata(idConfigurazione: number): void {
    const configurazione = this.configurazioniDisponibili.find(
      (item) => this.idConfigurazione(item) === idConfigurazione
    );

    if (!configurazione) {
      return;
    }

    this.formDatiEnergetici.patchValue({
      idConfigurazione,
      idCer: configurazione.idCer ?? configurazione.cer?.idCer ?? this.campo('idCer').value,
      codiceCabina: this.codiceCabinaConfigurazione(configurazione),
    });
  }

  aggiornaRiduzioneCo2(): void {
    this.formDatiEnergetici.patchValue({
      ridEmCo2: this.datiEnergeticiService.calcolaRiduzioneCo2(this.formDatiEnergetici),
    });
  }

  private configuraCalcoloAutomaticoCo2(): void {
    this.formDatiEnergetici.get('calcoloCo2Automatico')?.valueChanges.subscribe((automatico) => {
      const riduzione = this.formDatiEnergetici.get('ridEmCo2');

      if (automatico) {
        this.aggiornaRiduzioneCo2();
        riduzione?.disable({ emitEvent: false });
      } else {
        riduzione?.enable({ emitEvent: false });
      }
    });

    this.formDatiEnergetici.get('geteProdotta')?.valueChanges.subscribe(() => {
      if (this.formDatiEnergetici.get('calcoloCo2Automatico')?.value) {
        this.aggiornaRiduzioneCo2();
      }
    });

    this.formDatiEnergetici.get('fattoreEmissioneCo2')?.valueChanges.subscribe(() => {
      if (this.formDatiEnergetici.get('calcoloCo2Automatico')?.value) {
        this.aggiornaRiduzioneCo2();
      }
    });
  }

  private caricaCerDisponibili(): void {
    this.cerService.ricercaCer().subscribe({
      next: (cer) => {
        this.cerDisponibili = cer.filter((elemento) => !!elemento.idCer);
      },
      error: () => {
        this.cerDisponibili = [];
      },
    });
  }

  private caricaConfigurazioniDisponibili(idCer?: number): void {
    this.configurazioneService.ricerca({ idCer: idCer ?? null }).subscribe({
      next: (configurazioni) => {
        this.configurazioneService.arricchisciConDettaglio(configurazioni).subscribe({
          next: (dettagli) => {
            this.configurazioniDisponibili = this.filtraConfigurazioniAttive(dettagli);
          },
          error: () => {
            this.configurazioniDisponibili = this.filtraConfigurazioniAttive(configurazioni);
          },
        });
      },
      error: () => {
        this.configurazioniDisponibili = [];
      },
    });
  }

  private filtraConfigurazioniAttive(
    configurazioni: ConfigurazioneCabina[]
  ): ConfigurazioneCabina[] {
    return configurazioni.filter(
      (configurazione) =>
        !!this.idConfigurazione(configurazione) &&
        !this.configurazioneService.configurazioneDisattiva(configurazione)
    );
  }

  private mostraMessaggio(messaggio: string): void {
    this.snackBar.open(messaggio, 'Chiudi', {
      duration: 4500,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
