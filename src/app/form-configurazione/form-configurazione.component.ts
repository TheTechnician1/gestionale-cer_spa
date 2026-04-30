import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigurazioneCabinaService } from '../core/services/configurazione-cabina.service';
import { CerService } from '../core/services/cer.service';
import { NotificheService } from '../core/services/notifiche.service';
import { GetListaCER } from '../core/interfaces/user.model';

@Component({
  selector: 'app-form-configurazione',
  templateUrl: './form-configurazione.component.html',
  styleUrls: ['./form-configurazione.component.scss'],
})
export class FormConfigurazioneComponent implements OnInit {
  formConfigurazione: FormGroup;
  idConfig: number | null = null;
  salvataggioInCorso = false;
  caricamento = false;
  cerDisponibili: GetListaCER[] = [];

  constructor(
    private configurazioneService: ConfigurazioneCabinaService,
    private cerService: CerService,
    private route: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private notificheService: NotificheService
  ) {
    this.formConfigurazione = this.configurazioneService.creaFormConfigurazione();
  }

  ngOnInit(): void {
    this.caricaCerDisponibili();

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.idConfig = id || null;
    if (this.idConfig) {
      this.formConfigurazione.patchValue({ idConfig: this.idConfig });
    }

    const idCer = Number(this.route.snapshot.queryParamMap.get('idCer'));
    if (!this.idConfig && idCer > 0) {
      this.formConfigurazione.patchValue({ idCer });
    }

    if (!this.idConfig) {
      return;
    }

    this.caricamento = true;
    this.configurazioneService.visualizza(this.idConfig).subscribe({
      next: (configurazione) => {
        this.configurazioneService.popolaForm(this.formConfigurazione, configurazione);
        this.caricamento = false;
      },
      error: (errore) => {
        this.caricamento = false;
        this.mostraMessaggio(errore?.error || 'Configurazione non trovata.');
        this.router.navigateByUrl('/configurazioni');
      },
    });
  }

  get modifica(): boolean {
    return !!this.idConfig;
  }

  get titolo(): string {
    return this.modifica ? 'Modifica configurazione' : 'Nuova configurazione';
  }

  inviaModulo(): void {
    if (this.formConfigurazione.invalid) {
      this.formConfigurazione.markAllAsTouched();
      this.mostraMessaggio('Correggi i campi evidenziati prima di salvare.');
      return;
    }

    if (!this.modifica && !this.configurazioneService.puoInserire()) {
      this.mostraMessaggio('Non hai i permessi per inserire una configurazione.');
      return;
    }

    if (this.modifica && !this.configurazioneService.puoModificare()) {
      this.mostraMessaggio('Non hai i permessi per modificare una configurazione.');
      return;
    }

    this.verificaCerESalva();
  }

  campo(nome: string): FormControl {
    return this.formConfigurazione.get(nome) as FormControl;
  }

  nomeCer(idCer: number | null | undefined): string {
    return this.cerDisponibili.find((cer) => cer.idCer === idCer)?.ragioneSociale || '';
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

  private verificaCerESalva(): void {
    const idCer = Number(this.campo('idCer').value);
    this.salvataggioInCorso = true;

    this.cerService.visualizzaCer(idCer).subscribe({
      next: () => this.salva(),
      error: (errore) => {
        this.salvataggioInCorso = false;
        this.campo('idCer').setErrors({ cerNonTrovata: true });
        this.mostraMessaggio(errore?.error || 'CER di riferimento non trovata o non valida.');
      },
    });
  }

  private salva(): void {
    const payload = this.configurazioneService.normalizzaSalvataggio(
      this.formConfigurazione
    );
    const richiesta = this.modifica
      ? this.configurazioneService.modifica(payload)
      : this.configurazioneService.inserisci(payload);

    richiesta.subscribe({
      next: (risposta) => {
        this.salvataggioInCorso = false;
        this.notificheService.notificaAdmin(
          this.modifica ? 'Configurazione modificata' : 'Configurazione inserita',
          `${this.modifica ? 'Modificata' : 'Inserita'} configurazione ${payload.idConfig || payload.codiceCabina}.`
        );
        this.mostraMessaggio(risposta || 'Operazione completata con successo.');
        this.router.navigateByUrl('/configurazioni');
      },
      error: (errore) => {
        this.salvataggioInCorso = false;
        this.mostraMessaggio(
          errore?.error || 'Errore durante il salvataggio della configurazione.'
        );
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
